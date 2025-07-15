from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)
model = joblib.load('fraud_model.pkl')

# @app.route('/predict', methods=['POST'])
# def predict():
#     data = request.json
#     features = data.get('features')  # Expecting a list of 28 floats

#     if not features or len(features) != 28:
#         return jsonify({'error': 'Invalid input! Expected 28 numerical features.'}), 400

#     prediction = model.predict([features])[0]
#     return jsonify({'fraud': bool(prediction)})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        features = data.get('features')

        if not features or len(features) != 29:
            return jsonify({'error': 'Expected 29 features'}), 400

        print("Received features:", features)  # Debug line
        prediction = model.predict([features])[0]
        return jsonify({'fraud': bool(prediction)})

    except Exception as e:
        print("ERROR:", e)  # Print error in terminal
        return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    app.run(port=5000, debug=True)
