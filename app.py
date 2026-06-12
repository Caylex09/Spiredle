"""
spiredle-wordle — Slay the Spire 2 Wordle Game
==============================================
A daily card-guessing game inspired by Wordle,
using Slay the Spire 2 card data and localization.
"""

import json
import logging
import os
from datetime import datetime, timezone

from apscheduler.schedulers.background import BackgroundScheduler
from flask import Flask, jsonify, render_template, request, session

from config import Config
from models import db, Card, LocalizedName, DailyChallenge
from game import (
    all_cards_dict,
    can_guess,
    evaluate_guess,
    get_card_by_id_or_name,
    get_or_create_daily_challenge,
    get_guess_history,
    get_random_card,
    get_today_date,
    _build_feedback,
)
from localization import poll_localizations

# ---------------------------------------------------------------------------
# App Factory
# ---------------------------------------------------------------------------

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)

    with app.app_context():
        db.create_all()

    # Scheduler for hourly localization polling
    scheduler = BackgroundScheduler()
    scheduler.add_job(
        func=lambda: poll_localizations(app),
        trigger="interval",
        hours=Config.POLL_INTERVAL_HOURS,
        id="poll_localizations",
        name="Poll localization data",
        next_run_time=None,  # start after first request
    )
    scheduler.start()

    # -----------------------------------------------------------------------
    # Routes
    # -----------------------------------------------------------------------

    @app.route("/")
    def index():
        return render_template("index.html", lang=request.args.get("lang", "eng"))

    @app.route("/api/init")
    def api_init():
        """Return initial game state: today's challenge, guesses, hints."""
        lang = request.args.get("lang", "eng")
        date = get_today_date()
        sid = _get_session_id()

        challenge = get_or_create_daily_challenge("daily", date)
        if not challenge:
            return jsonify({"error": "No cards loaded"}), 500

        guesses = get_guess_history(sid, date, lang)
        remaining = Config.MAX_GUESSES - len(guesses)
        won = any(g.get("id") == challenge.card_id for g in guesses)

        card_names = _get_card_names(lang)

        return jsonify({
            "date": date,
            "maxGuesses": Config.MAX_GUESSES,
            "challenge": {
                "card_id": challenge.card_id,
                "card_name": card_names.get(challenge.card_id, ""),
            } if won else None,
            "guesses": guesses,
            "remaining": remaining,
            "won": won,
            "gameOver": won or remaining <= 0,
            "cardCount": len(card_names),
            "lang": lang,
        })

    @app.route("/api/guess", methods=["POST"])
    def api_guess():
        """Submit a guess for today's challenge."""
        data = request.get_json()
        query = data.get("query", "").strip()
        lang = data.get("lang", "eng")
        date = get_today_date()
        sid = _get_session_id()

        challenge = get_or_create_daily_challenge("daily", date)
        if not challenge:
            return jsonify({"error": "No cards loaded"}), 500

        if not can_guess(sid, date):
            return jsonify({"error": "No guesses remaining"}), 400

        card = get_card_by_id_or_name(query, lang)
        if not card:
            return jsonify({"error": "Card not found", "query": query}), 404

        guesses = get_guess_history(sid, date)
        guess_order = len(guesses) + 1

        result = evaluate_guess(challenge.card_id, card, guess_order, sid, date, lang)
        return jsonify(result)

    @app.route("/api/cards")
    def api_cards():
        """Return all cards for autocomplete (localized if available)."""
        lang = request.args.get("lang", "eng")
        names = _get_card_names(lang)
        cards = Card.query.all()
        return jsonify([
            {"id": c.id, "name": names.get(c.id, c.name), "image_url": c.image_url}
            for c in cards
        ])

    @app.route("/api/card/<card_id>")
    def api_card(card_id):
        """Return a single card's details."""
        card = db.session.get(Card, card_id.upper())
        if not card:
            return jsonify({"error": "Card not found"}), 404
        lang = request.args.get("lang", "eng")
        names = _get_card_names(lang)
        return jsonify(card.to_dict(lang, {lang: names}))

    @app.route("/api/stats/<date>")
    def api_stats(date):
        """Return guess distribution for a given date."""
        from models import GuessRecord
        records = GuessRecord.query.filter_by(date=date).all()
        total = len(records)
        won = sum(1 for r in records if r.is_correct)
        dist = {}
        for r in records:
            dist[r.guess_order] = dist.get(r.guess_order, 0) + 1
        return jsonify({"date": date, "total": total, "won": won, "distribution": dist})

    @app.route("/api/date")
    def api_date():
        """Return current UTC date."""
        return jsonify({"date": get_today_date(), "utcOffset": 0})

    @app.route("/api/today")
    def api_today():
        """Return today's challenge card (always, regardless of win/loss)."""
        lang = request.args.get("lang", "eng")
        date = get_today_date()
        challenge = get_or_create_daily_challenge("daily", date)
        if not challenge:
            return jsonify({"error": "No challenge"}), 500
        card_names = _get_card_names(lang)
        card = challenge.card
        return jsonify(card.to_dict(lang, {lang: card_names}))

    @app.route("/api/random")
    def api_random():
        """Return a random card (no session state — frontend handles storage)."""
        lang = request.args.get("lang", "eng")
        card = get_random_card()
        if not card:
            return jsonify({"error": "No cards loaded"}), 500
        card_names = _get_card_names(lang)
        return jsonify({
            "maxGuesses": Config.MAX_GUESSES,
            "card": card.to_dict(lang, {lang: card_names}),
        })

    @app.route("/api/daily/dates")
    def api_daily_dates():
        """Return all dates that have daily challenges."""
        from models import DailyChallenge
        challenges = DailyChallenge.query.order_by(DailyChallenge.date.desc()).all()
        lang = request.args.get("lang", "eng")
        names = _get_card_names(lang)
        return jsonify([
            {"date": c.date, "card_id": c.card_id, "card_name": names.get(c.card_id, c.card.name)}
            for c in challenges
        ])

    @app.route("/api/daily/<date>")
    def api_daily_by_date(date):
        """Return a specific day's challenge card (for past challenges replay)."""
        lang = request.args.get("lang", "eng")
        from models import DailyChallenge
        challenge = DailyChallenge.query.filter_by(date=date).first()
        if not challenge:
            return jsonify({"error": "No challenge for this date"}), 404
        card_names = _get_card_names(lang)
        return jsonify(challenge.card.to_dict(lang, {lang: card_names}))

    @app.route("/api/localization")
    def api_localization():
        """Return localization data from local files (rarity, type, color, keywords)."""
        lang = request.args.get("lang", "eng")

        # Map API language codes to folder names
        folder_map = {"dsu": "deu"}
        folder = folder_map.get(lang, lang)
        loc_dir = os.path.join(os.path.dirname(__file__), "localization", folder)

        result = {"rarity": {}, "type": {}, "color": {}, "keywords": {}}

        # Read gameplay_ui.json (rarity + type translations)
        gp_path = os.path.join(loc_dir, "gameplay_ui.json")
        if os.path.exists(gp_path):
            with open(gp_path, "r", encoding="utf-8") as f:
                gp = json.load(f)
            for k, v in gp.items():
                if k.startswith("CARD_RARITY."):
                    result["rarity"][k.replace("CARD_RARITY.", "")] = v
                elif k.startswith("CARD_TYPE."):
                    result["type"][k.replace("CARD_TYPE.", "")] = v

        # Read characters.json (color → character name)
        char_path = os.path.join(loc_dir, "characters.json")
        if os.path.exists(char_path):
            with open(char_path, "r", encoding="utf-8") as f:
                chars = json.load(f)
            for k, v in chars.items():
                if k.endswith(".title"):
                    color_key = k.replace(".title", "").lower()
                    name = v
                    if name.startswith("The "):
                        name = name[4:]
                    result["color"][color_key] = name

        # Extra color entries not in characters.json
        extra_color_defaults = {"colorless": "Colorless", "curse": "Curse", "status": "Status", "event": "Event", "quest": "Quest", "token": "Token"}
        for ck in extra_color_defaults:
            if ck not in result["color"]:
                # Try CARD_RARITY for curse/status/event/quest/token
                rarity_key = ck.upper()
                if rarity_key in result["rarity"]:
                    result["color"][ck] = result["rarity"][rarity_key]
                else:
                    result["color"][ck] = extra_color_defaults[ck]
        # Read card_library.json to improve "colorless" name
        lib_path = os.path.join(loc_dir, "card_library.json")
        if os.path.exists(lib_path):
            with open(lib_path, "r", encoding="utf-8") as f:
                lib = json.load(f)
            tip = lib.get("POOL_COLORLESS_TIP", "")
            if tip:
                # Strip trailing punctuation and "card"/"cards" / "牌" suffix
                import re
                name = re.sub(r"[。.!！\s]*$", "", tip)
                name = re.sub(r"\s*(cards?|牌)$", "", name, flags=re.IGNORECASE).strip()
                if name:
                    result["color"]["colorless"] = name

        # Read card_keywords.json (keyword titles)
        kw_path = os.path.join(loc_dir, "card_keywords.json")
        if os.path.exists(kw_path):
            with open(kw_path, "r", encoding="utf-8") as f:
                kws = json.load(f)
            for k, v in kws.items():
                if k.endswith(".title"):
                    result["keywords"][k.replace(".title", "")] = v

        return jsonify(result)

    @app.route("/api/poll_now", methods=["POST"])
    def api_poll_now():
        """Manually trigger localization polling."""
        poll_localizations(app)
        return jsonify({"status": "ok"})

    # -----------------------------------------------------------------------
    # Helpers
    # -----------------------------------------------------------------------

    def _get_session_id():
        if "sid" not in session:
            import uuid
            session["sid"] = str(uuid.uuid4())
        return session["sid"]

    def _get_card_names(lang):
        """Return {card_id: localized_name} for a language."""
        names = {}
        localized = LocalizedName.query.filter_by(lang=lang).all()
        if localized:
            names = {ln.card_id: ln.name for ln in localized}
        # Fallback to English for missing entries
        eng = LocalizedName.query.filter_by(lang="eng").all()
        for ln in eng:
            if ln.card_id not in names:
                names[ln.card_id] = ln.name
        # Ultimate fallback: Card table
        if not names:
            for c in Card.query.all():
                names[c.id] = c.name
        return names

    def _ensure_cards_loaded():
        """Load cards from JSON if DB is empty."""
        if Card.query.count() > 0:
            return
        data_path = os.path.join(os.path.dirname(__file__), "cards_data.json")
        if not os.path.exists(data_path):
            logging.warning("cards_data.json not found, skipping seed")
            return
        with open(data_path, "r", encoding="utf-8") as f:
            cards = json.load(f)
        for cid, cdata in cards.items():
            card = Card(
                id=cid,
                name=cdata.get("name", cid),
                rarity=cdata.get("rarity", "Common"),
                type=cdata.get("type", "Skill"),
                cost=cdata.get("cost"),
                is_x_cost=cdata.get("is_x_cost", False),
                is_x_star_cost=cdata.get("is_x_star_cost", False),
                star_cost=cdata.get("star_cost"),
                color=cdata.get("color", "Colorless"),
                keywords_key=json.dumps(cdata["keywords"]) if cdata.get("keywords") else None,
                image_url=cdata.get("image_url"),
            )
            db.session.add(card)
        db.session.commit()
        logging.info(f"Loaded {len(cards)} cards into database")

    def _ensure_localized_names_loaded():
        """Pre-populate localizations from data/localized_names.json if DB is empty."""
        if LocalizedName.query.count() > 0:
            return
        loc_path = os.path.join(os.path.dirname(__file__), "data", "localized_names.json")
        if not os.path.exists(loc_path):
            logging.warning("localized_names.json not found, skipping")
            return
        with open(loc_path, "r", encoding="utf-8") as f:
            all_names = json.load(f)
        count = 0
        for lang, names in all_names.items():
            for cid, cname in names.items():
                if db.session.get(Card, cid):
                    existing = LocalizedName.query.filter_by(
                        lang=lang, card_id=cid
                    ).first()
                    if not existing:
                        ln = LocalizedName(lang=lang, card_id=cid, name=cname)
                        db.session.add(ln)
                        count += 1
        db.session.commit()
        logging.info(f"Loaded {count} localized names from {loc_path}")

    # Load data (call after function definitions)
    with app.app_context():
        _ensure_cards_loaded()
        _ensure_localized_names_loaded()

    return app


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    app = create_app()
    logging.basicConfig(level=logging.INFO)
    app.run(debug=True, host="0.0.0.0", port=5000)
