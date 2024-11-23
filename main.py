from flask import Flask, render_template, jsonify, request
from flask_migrate import Migrate
from models import db, Match
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
migrate = Migrate(app, db)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/matches', methods=['GET'])
def get_matches():
    matches = Match.query.order_by(Match.start_time.desc()).limit(10).all()
    return render_template('matches.html', matches=matches)

@app.route('/api/matches', methods=['POST'])
def create_match():
    data = request.json
    match = Match(
        player1_total_time=data['player1_total_time'],
        player2_total_time=data['player2_total_time'],
        winner=data['winner'],
        turn_duration=data['turn_duration'],
        end_time=datetime.utcnow()
    )
    db.session.add(match)
    db.session.commit()
    return jsonify({'status': 'success'})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000)
