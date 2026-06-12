"""Game logic for Spiredle Wordle."""

import json
import random
from datetime import datetime, timezone
from models import db, Card, DailyChallenge, GuessRecord


def get_today_date():
    """Return today's date string in UTC."""
    return datetime.now(timezone.utc).strftime("%Y-%m-%d")


def get_card_by_id_or_name(query, lang="eng"):
    """Find a card by its ID or localized name."""
    # Try exact ID match first
    card = Card.query.filter_by(id=query.upper()).first()
    if card:
        return card

    # Try name match (case-insensitive)
    card = Card.query.filter(db.func.lower(Card.name) == query.lower()).first()
    if card:
        return card

    # Try localized name match
    from models import LocalizedName
    localized = LocalizedName.query.filter(
        LocalizedName.lang == lang,
        db.func.lower(LocalizedName.name) == query.lower()
    ).first()
    if localized:
        return db.session.get(Card, localized.card_id)

    return None


def get_or_create_daily_challenge(mode="daily", date=None):
    """Get today's daily challenge, create if not exists."""
    if date is None:
        date = get_today_date()

    challenge = DailyChallenge.query.filter_by(date=date, mode=mode).first()
    if challenge:
        return challenge

    # Pick a random card
    total = Card.query.count()
    if total == 0:
        return None
    offset = random.randint(0, total - 1)
    card = Card.query.offset(offset).first()

    challenge = DailyChallenge(date=date, card_id=card.id, mode=mode)
    db.session.add(challenge)
    db.session.commit()
    return challenge


def _build_feedback(card_id, guess_card, lang="eng"):
    """Build evaluation feedback dict without DB storage. Used by both daily and random modes."""
    from models import Card as CardModel, LocalizedName

    answer = db.session.get(CardModel, card_id)
    if not answer:
        return None, {"error": "Answer card not found"}

    is_correct = guess_card.id == card_id

    # Build localized name map
    localized = LocalizedName.query.filter_by(lang=lang).all()
    name_map = {ln.card_id: ln.name for ln in localized}
    eng = LocalizedName.query.filter_by(lang="eng").all()
    for ln in eng:
        if ln.card_id not in name_map:
            name_map[ln.card_id] = ln.name
    names = {lang: name_map}

    feedback = {
        "is_correct": is_correct,
        "guess": guess_card.to_dict(lang, names),
        "evaluations": {
            "name": _eval_name(guess_card, answer),
            "rarity": _eval_rarity(guess_card, answer),
            "type": _eval_type(guess_card, answer),
            "cost": _eval_cost(guess_card, answer),
            "color": _eval_color(guess_card, answer),
            "keywords": _eval_keywords(guess_card, answer),
        }
    }

    if is_correct:
        feedback["answer"] = answer.to_dict(lang, names)

    return answer, feedback


def evaluate_guess(card_id, guess_card, guess_order, session_id, date=None, lang="eng"):
    """Evaluate a guess against the answer card. Returns feedback dict."""
    from models import LocalizedName
    import json

    if date is None:
        date = get_today_date()

    answer, feedback = _build_feedback(card_id, guess_card, lang)
    if feedback.get("error"):
        return feedback

    # Save guess record with evaluations
    record = GuessRecord(
        session_id=session_id,
        date=date,
        card_id=guess_card.id,
        guess_order=guess_order,
        is_correct=feedback["is_correct"],
        evaluations=json.dumps(feedback["evaluations"]),
    )
    db.session.add(record)
    db.session.commit()

    return feedback


def get_random_card():
    """Return a random card from the database."""
    total = Card.query.count()
    if total == 0:
        return None
    offset = random.randint(0, total - 1)
    return Card.query.offset(offset).first()


def _eval_name(guess, answer):
    """Name: exact match = green, else gray."""
    if guess.id == answer.id:
        return "correct"
    return "absent"


def _eval_rarity(guess, answer):
    """Rarity: exact match = green, else gray."""
    if guess.rarity == answer.rarity:
        return "correct"
    return "absent"


def _eval_type(guess, answer):
    """Type: exact match = green, else gray."""
    if guess.type == answer.type:
        return "correct"
    return "absent"


def _eval_cost(guess, answer):
    """
    Cost evaluation:
    - If both cost AND star_cost match → green
    - If just cost matches (or is_x_cost both true) → yellow
    - Otherwise → gray
    """
    # Handle X cost
    if guess.is_x_cost and answer.is_x_cost:
        if guess.star_cost == answer.star_cost:
            return "correct"
        return "yellow"

    # Handle star cost (is_x_star_cost or plain star_cost)
    has_star = (guess.star_cost is not None) or (answer.star_cost is not None)
    if has_star:
        cost_match = guess.cost == answer.cost
        star_match = guess.star_cost == answer.star_cost
        if cost_match and star_match:
            return "correct"
        if cost_match:
            return "yellow"
        return "absent"

    # One is X cost, other is not
    if guess.is_x_cost != answer.is_x_cost:
        return "absent"

    # Normal cost
        cost_match = guess.cost == answer.cost
        star_match = guess.star_cost == answer.star_cost
        if cost_match and star_match:
            return "correct"
        if cost_match:
            return "yellow"
        return "absent"

    # Normal cost
    if guess.cost == answer.cost:
        return "correct"
    return "absent"


def _eval_color(guess, answer):
    """Color: exact match = green, else gray."""
    if guess.color == answer.color:
        return "correct"
    return "absent"


def _eval_keywords(guess, answer):
    """
    Keywords evaluation:
    - All guess keywords match answer keywords (same set) → green
    - At least one keyword overlaps → yellow
    - No overlap → gray
    """
    guess_kw = set(guess.get_keywords())
    answer_kw = set(answer.get_keywords())

    if not guess_kw and not answer_kw:
        return "correct"
    if not guess_kw or not answer_kw:
        return "absent"

    if guess_kw == answer_kw:
        return "correct"
    if guess_kw & answer_kw:
        return "yellow"
    return "absent"


def get_guess_history(session_id, date=None, lang="eng"):
    """Get all guesses for a session on a given date, with evaluations."""
    import json
    from models import LocalizedName
    if date is None:
        date = get_today_date()

    records = GuessRecord.query.filter_by(
        session_id=session_id, date=date
    ).order_by(GuessRecord.guess_order).all()

    from models import Card
    # Build localized names map
    localized = LocalizedName.query.filter_by(lang=lang).all()
    name_map = {ln.card_id: ln.name for ln in localized}
    # Fallback to English
    eng = LocalizedName.query.filter_by(lang="eng").all()
    for ln in eng:
        if ln.card_id not in name_map:
            name_map[ln.card_id] = ln.name

    results = []
    for r in records:
        card = db.session.get(Card, r.card_id)
        if card:
            entry = card.to_dict(lang, {lang: name_map})
            if r.evaluations:
                try:
                    entry["evaluations"] = json.loads(r.evaluations)
                except (json.JSONDecodeError, TypeError):
                    pass
            results.append(entry)
    return results


def can_guess(session_id, date=None):
    """Check if the player can still guess today."""
    if date is None:
        date = get_today_date()

    from config import Config
    count = GuessRecord.query.filter_by(
        session_id=session_id, date=date
    ).count()
    return count < Config.MAX_GUESSES


def all_cards_dict():
    """Return all cards as a simple dict for autocomplete."""
    cards = Card.query.all()
    return [{"id": c.id, "name": c.name} for c in cards]
