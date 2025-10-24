from flask import Flask, request, jsonify
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)

@app.route('/classify', methods=['POST'])
def classify():
    data = request.json or {}
    text = data.get('text','').lower()
    # Simple heuristic rules for MVP
    score = 0.0
    label = 'human'
    explanation = []

    if len(text) < 5:
        score = 0.9
        label = 'bot'
        explanation.append('too_short')
    if 'http://' in text or 'https://' in text:
        score = max(score, 0.85)
        label = 'bot'
        explanation.append('contains_link')
    if text.count('!') > 4:
        score = max(score, 0.8)
        label = 'bot'
        explanation.append('spam_exclaim')

    # default safe
    return jsonify({
        'score': float(score),
        'label': label,
        'explanation': ','.join(explanation)
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
