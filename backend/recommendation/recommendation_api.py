from pathlib import Path
from flask import Flask, jsonify, request
from flask_restful import Resource, Api
from med_rec_model import MeditationRecommender
from exer_rec_model import ExerciseClassifier
import json

meditation_model = None
exercise_model = None

recommendationApp = Flask(__name__)
recommendationApi = Api(recommendationApp)

class MeditationRec(Resource):
    def post(self):
        try:
            print("-"*80)
            print("POST to /meditation_rec")
            data = request.get_json()
            weather_condition = data['weather_condition']
            temperature = data['temperature']
            heart_rate = data['heart_rate']
            time_of_day = data['time_of_day']
            print(
                f"""Incoming:
                Weather Condition: {weather_condition}
                Temperature      : {temperature}
                Heart Rate       : {heart_rate}
                Time Of Day      : {time_of_day}"""
            )

            prediction = meditation_model.predict_genre(weather_condition, temperature, heart_rate, time_of_day)
            print(f"Outgoing: {prediction}")
            print("-"*80)
        except (KeyError, ValueError) as exc:
            print(exc)
            return jsonify({'genre': 'Invalid input'})

        return jsonify({'genre': prediction})


class MeditationLocation(Resource):
    def post(self):
        try:
            data = request.get_json()
            weather_condition = data['weather_condition']
            temperature = data['temperature']
            time_of_day = data['time_of_day']

            location = meditation_model.choose_location(weather_condition, temperature, time_of_day)
        except (KeyError, ValueError) as exc:
            print(exc)
            return jsonify({'location': 'Invalid input'})

        return jsonify({'location': location})


class MeditationSongPick(Resource):
    def post(self):
        try:
            data = request.get_json()
            songs = json.loads(data['songs'])
            heart_rate = data['heart_rate']

            song = meditation_model.choose_song_by_duration(songs, heart_rate)
        except (KeyError, ValueError) as exc:
            print(exc)
            return jsonify({'song_name': 'Invalid input'})

        return jsonify({'song_name': song})
    
class ExerciseRec(Resource):
    def post(self):
        try:
            data = request.get_json()
            dream_weight = data['dream_weight']
            actual_weight = data['actual_weight']
            age = data['age']
            gender = data['gender']
            weather_condition = data['weather_condition']

            prediction = exercise_model.predict_category(dream_weight, actual_weight, age, gender, weather_condition)
        except (KeyError, ValueError) as exc:
            print(exc)
            return jsonify({'category': 'Invalid input'})

        return jsonify({'category': prediction})
    
class ExerciseLocation(Resource):
    def post(self):
        try:
            data = request.get_json()
            weather_condition = data['weather_condition']
            temperature = data['temperature']
            time_of_day = data['time_of_day']

            location = exercise_model.choose_location(weather_condition, temperature, time_of_day)
        except (KeyError, ValueError) as exc:
            print(exc)
            return jsonify({'location': 'Invalid input'})

        return jsonify({'location': location})
    

recommendationApi.add_resource(MeditationRec, '/meditation_rec')
recommendationApi.add_resource(MeditationLocation, '/meditation_location')
recommendationApi.add_resource(MeditationSongPick, '/meditation_song_pick')
recommendationApi.add_resource(ExerciseRec, '/exercise_rec')
recommendationApi.add_resource(ExerciseLocation, '/exercise_location')


if __name__ == '__main__':
    meditation_model = MeditationRecommender(Path("meditation_data.csv"))
    exercise_model = ExerciseClassifier(Path("exercise_dataset.csv"))
    exercise_model.train_model()
    recommendationApp.run(debug = False, port=8000)
