import os
from datetime import datetime
from flask import Flask, render_template, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

class Match(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    player1_total_time = db.Column(db.Integer, nullable=False)
    player2_total_time = db.Column(db.Integer, nullable=False)
    winner = db.Column(db.Integer, nullable=False)
    time_preset = db.Column(db.Integer, nullable=False)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/matches')
def match_history():
    matches = Match.query.order_by(Match.date.desc()).all()
    return render_template('matches.html', matches=matches)

@app.route('/api/matches', methods=['POST'])
def save_match():
    data = request.json
    match = Match(
        player1_total_time=data['player1_total'],
        player2_total_time=data['player2_total'],
        winner=data['winner'],
        time_preset=data['time_preset']
    )
    db.session.add(match)
    db.session.commit()
    return jsonify({'success': True})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000)
