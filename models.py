from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Match(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    start_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    end_time = db.Column(db.DateTime)
    player1_total_time = db.Column(db.Integer, nullable=False, default=0)  # in seconds
    player2_total_time = db.Column(db.Integer, nullable=False, default=0)  # in seconds
    winner = db.Column(db.Integer)  # 1 or 2 for player number
    turn_duration = db.Column(db.Integer, nullable=False)  # preset time in seconds
