import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "spiredle-dev-key")
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL", f"sqlite:///{os.path.join(BASE_DIR, 'instance', 'spiredle.db')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Localization polling
    POLL_INTERVAL_HOURS = 1
    POLL_LANGUAGES = [
        "dsu", "eng", "esp", "fra", "ita",
        "jpn", "kor", "pol", "ptb", "rus",
        "spa", "tha", "tur", "zhs"
    ]

    # Spire Codex API
    API_BASE_URL = "https://spire-codex.com/api/cards"

    # Max guesses per day
    MAX_GUESSES = 7
