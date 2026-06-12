"""Localization polling — fetches card names from Spire Codex API."""

import json
import logging
import os

import requests
from config import Config

logger = logging.getLogger(__name__)

API_BASE = "https://spire-codex.com/api/cards"


def poll_localizations(app):
    """Poll all languages from Spire Codex API, update LocalizedName table."""
    from models import db, LocalizedName, Card

    languages = Config.POLL_LANGUAGES

    with app.app_context():
        all_names = {}
        success_count = 0

        for lang in languages:
            url = f"{API_BASE}?lang={lang}"
            try:
                resp = requests.get(url, timeout=30)
                if resp.status_code != 200:
                    logger.warning(f"[{lang}] HTTP {resp.status_code}, skipping")
                    continue

                data = resp.json()
                titles = {c["id"]: c["name"] for c in data}
                all_names[lang] = titles

                for cid, cname in titles.items():
                    card = db.session.get(Card, cid)
                    if card:
                        existing = LocalizedName.query.filter_by(
                            lang=lang, card_id=cid
                        ).first()
                        if existing:
                            existing.name = cname
                        else:
                            ln = LocalizedName(lang=lang, card_id=cid, name=cname)
                            db.session.add(ln)

                db.session.commit()
                success_count += 1
                logger.info(f"[{lang}] {len(titles)} names updated")

            except requests.RequestException as e:
                logger.error(f"[{lang}] Request failed: {e}")
            except json.JSONDecodeError as e:
                logger.error(f"[{lang}] JSON parse error: {e}")

        if all_names:
            _save_latest_poll(all_names)

        logger.info(f"Polled {success_count}/{len(languages)} languages")


def _save_latest_poll(all_names):
    """Save the latest poll result to disk for next day's seed."""
    import config as cfg
    data_dir = os.path.join(os.path.dirname(cfg.Config.__module__), "data")
    os.makedirs(data_dir, exist_ok=True)
    path = os.path.join(data_dir, "latest_localization.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(all_names, f, ensure_ascii=False, indent=2)
