from pathlib import Path
from flask import Flask, jsonify, request
from flask_restful import Resource, Api
from backend.recommendation.meditation.med_rec_model import MeditationRecommender

meditation_model = None

recommendationApp = Flask(__name__)
recommendationApi = Api(recommendationApp)

class MeditationRec(Resource):
    def get(self):
        try:
            data = request.get_json()
            weather_condition = data['weather_condition']
            temperature = data['temperature']
            heart_rate = data['heart_rate']
            time_of_day = data['time_of_day']

            prediction = meditation_model.predict_genre(weather_condition, temperature, heart_rate, time_of_day)
        except (KeyError, ValueError) as exc:
            print(exc)
            return jsonify({'genre': 'Invalid input'})

        return jsonify({'genre': prediction})


class MeditationLocation(Resource):
    def get(self):
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
    def get(self):
        print("start")
        try:
            data = request.get_json()
            songs = data['songs']
            heart_rate = data['heart_rate']

            song = meditation_model.choose_song_by_duration(songs, heart_rate)
        except (KeyError, ValueError) as exc:
            print(exc)
            return jsonify({'song_name': 'Invalid input'})

        return jsonify({'song_name': song})


recommendationApi.add_resource(MeditationRec, '/meditation_rec')
recommendationApi.add_resource(MeditationLocation, '/meditation_location')
recommendationApi.add_resource(MeditationSongPick, '/meditation_song_pick')


if __name__ == '__main__':
    meditation_model = MeditationRecommender(Path("meditation_data.csv"))
    recommendationApp.run(debug = True, port=8000)
