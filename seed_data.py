"""
Fetch card data from Spire Codex API.
https://spire-codex.com/api/cards?lang=eng
"""

import json
import os
import requests

API_BASE = "https://spire-codex.com/api/cards"


def fetch_cards(lang="eng"):
    """Fetch card data from Spire Codex API."""
    url = f"{API_BASE}?lang={lang}"
    resp = requests.get(url, timeout=30)
    resp.raise_for_status()
    return resp.json()


def parse_card(raw):
    """Convert raw API card data to our internal format."""
    cid = raw["id"]
    cost = raw.get("cost")
    # cost -1 means unplayable (status/curse)
    if cost is not None and cost < 0:
        cost = None

    api_color = raw.get("color", "colorless")

    keywords_key = raw.get("keywords_key") or raw.get("keywords") or None

    return {
        "id": cid,
        "name": raw["name"],
        "rarity": raw.get("rarity_key") or raw.get("rarity", "Common"),
        "type": raw.get("type_key") or raw.get("type", "Skill"),
        "cost": cost,
        "is_x_cost": raw.get("is_x_cost") or False,
        "is_x_star_cost": raw.get("is_x_star_cost") or False,
        "star_cost": raw.get("star_cost"),
        "color": api_color,
        "keywords": keywords_key,
        "image_url": raw.get("image_url_card"),
    }


def fetch_and_save(output_path, lang="eng"):
    """Fetch cards from API and save to JSON file."""
    print(f"Fetching cards (lang={lang})...")
    raw_cards = fetch_cards(lang)
    print(f"  Got {len(raw_cards)} cards")

    cards = {}
    for raw in raw_cards:
        cid = raw["id"]
        cards[cid] = parse_card(raw)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(cards, f, ensure_ascii=False, indent=2)

    print(f"Saved {len(cards)} cards -> {output_path}")
    return cards


def fetch_localizations(data_dir, languages):
    """Fetch localized card names for all languages."""
    os.makedirs(data_dir, exist_ok=True)
    all_names = {}

    for lang in languages:
        try:
            print(f"Fetching localization: {lang}...")
            raw = fetch_cards(lang)
            names = {c["id"]: c["name"] for c in raw}
            all_names[lang] = names
            print(f"  {len(names)} cards")
        except Exception as e:
            print(f"  FAILED: {e}")

    path = os.path.join(data_dir, "localized_names.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(all_names, f, ensure_ascii=False, indent=2)
    print(f"Saved localized names -> {path}")
    return all_names


if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))
    out_path = os.path.join(script_dir, "cards_data.json")
    fetch_and_save(out_path, "eng")

    # Also fetch localized names
    languages = [
        "dsu", "eng", "esp", "fra", "ita",
        "jpn", "kor", "pol", "ptb", "rus",
        "spa", "tha", "tur", "zhs",
    ]
    data_dir = os.path.join(script_dir, "data")
    fetch_localizations(data_dir, languages)
