from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class Card(db.Model):
    """Card definitions — static data updated daily via polling."""
    __tablename__ = "cards"

    id = db.Column(db.String(64), primary_key=True)          # e.g. "STRIKE_RED"
    name = db.Column(db.String(128), nullable=False)          # English display name
    rarity = db.Column(db.String(32), nullable=False)         # Common, Uncommon, Rare, Basic, etc.
    type = db.Column(db.String(32), nullable=False)           # Attack, Skill, Power, Status, Curse
    cost = db.Column(db.Integer, nullable=True)               # 0, 1, 2, 3, or None for X-cost
    is_x_cost = db.Column(db.Boolean, default=False)          # True if cost is X
    is_x_star_cost = db.Column(db.Boolean, default=False)     # True if has star cost component
    star_cost = db.Column(db.Integer, nullable=True)          # Star (辉星) cost value
    color = db.Column(db.String(32), nullable=False)          # Red, Green, Blue, Purple, Colorless, etc.
    keywords_key = db.Column(db.Text, nullable=True)          # JSON list of keyword keys, e.g. '["strike","attack"]'
    image_url = db.Column(db.String(256), nullable=True)      # Card image URL

    def get_keywords(self):
        import json
        if not self.keywords_key:
            return []
        try:
            return json.loads(self.keywords_key)
        except (json.JSONDecodeError, TypeError):
            return []

    def display_cost(self):
        """Return display string for cost."""
        if self.is_x_cost:
            return "X"
        # Star cost: show as "a / b" or "a / X" for variable star cost
        if self.star_cost is not None:
            base = self.cost if self.cost is not None else 0
            return f"{base} / {self.star_cost}"
        if self.is_x_star_cost:
            base = self.cost if self.cost is not None else 0
            return f"{base} / X"
        return str(self.cost) if self.cost is not None else "?"

    def to_dict(self, lang="eng", names=None):
        """Serialize card for API responses."""
        d = {
            "id": self.id,
            "name": self.name,
            "rarity": self.rarity,
            "type": self.type,
            "cost": self.cost,
            "is_x_cost": self.is_x_cost,
            "is_x_star_cost": self.is_x_star_cost,
            "star_cost": self.star_cost,
            "display_cost": self.display_cost(),
            "color": self.color,
            "keywords": self.get_keywords(),
            "image_url": self.image_url,
        }
        if names and lang in names and self.id in names[lang]:
            d["local_name"] = names[lang][self.id]
        return d


class DailyChallenge(db.Model):
    """Daily challenge data."""
    __tablename__ = "daily_challenges"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    date = db.Column(db.String(10), nullable=False, unique=True)  # "2026-06-11"
    card_id = db.Column(db.String(64), db.ForeignKey("cards.id"), nullable=False)
    mode = db.Column(db.String(16), default="daily")  # "daily" or "random"

    card = db.relationship("Card")


class GuessRecord(db.Model):
    """Player guess records."""
    __tablename__ = "guess_records"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    session_id = db.Column(db.String(64), nullable=False)
    date = db.Column(db.String(10), nullable=False)
    card_id = db.Column(db.String(64), db.ForeignKey("cards.id"), nullable=False)
    guess_order = db.Column(db.Integer, nullable=False)
    is_correct = db.Column(db.Boolean, default=False)
    evaluations = db.Column(db.Text, nullable=True)  # JSON string of evaluation results
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class LocalizedName(db.Model):
    """Localized card names for each language."""
    __tablename__ = "localized_names"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    lang = db.Column(db.String(8), nullable=False)
    card_id = db.Column(db.String(64), db.ForeignKey("cards.id"), nullable=False)
    name = db.Column(db.String(256), nullable=False)

    __table_args__ = (db.UniqueConstraint("lang", "card_id"),)

    card = db.relationship("Card")
