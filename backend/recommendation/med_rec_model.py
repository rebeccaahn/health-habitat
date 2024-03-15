"""
Module to recommend meditation music based on weather conditions, time of day, and heart rate
"""
import csv
import random
from pathlib import Path
from typing import List
import pandas as pd
from sklearn.ensemble import RandomForestClassifier


class MeditationRecommender:
    """
    Builds Random Forest model based off of training data input through CSV file

    How To Use:
        model = MeditationRecommender(training_data_path)
        model.train_model()
        genre = model.predict(weather_condition, temperature, heart_rate, time_of_day)
    """

    condition_map = {"thunderstorm": 1, "drizzle": 2, "rain": 3, "snow": 4, "mist": 5,
                     "smoke": 6, "haze": 7, "dust": 8, "fog": 9, "sand": 10, "ash": 11,
                     "squall": 12, "tornado": 13, "clear": 14, "clouds": 15
    }
    """Maps weather conditions to integers for encoding"""

    time_of_day_map = {"morning": 1, "afternoon": 2, "evening": 3, "night": 4}
    """Maps time of day to integers for encoding"""

    genre_map = {"blues": 1, "chill": 2, "classic": 3, "dark ambient": 4,
                 "easy listening": 5, "lo-fi": 6, "piano": 7
    }
    """Maps genre to integers for encoding"""

    reverse_genre_map = {v: k for k, v in genre_map.items()}
    """Maps integers back to genre for decoding"""

    def _extract_training_data(self, training_data_path: Path) -> List[List[str | int]]:
        """
        Extracts training data from CSV file in the format:
            weather condition, temperature, heart rate, time of day, expoected genre

        Parameters:
            training_data_path: Path to the CSV file containing the training data

        Returns:
            List of lists containing imported training data in same order of columns
        """
        lines = []
        with open(training_data_path, "r", encoding="utf-8") as data_csv:
            meditation_reader = csv.reader(data_csv, delimiter=',', quotechar='"',
                                           quoting=csv.QUOTE_MINIMAL)
            for line in meditation_reader:
                if len(line) == 5:
                    lines.append(line)
        return lines

    def _encode_training_data(self):
        """
        Encodes training data into integers for model training

        Utalizes condition_map, time_of_day_map, and genre_map to encode the data
        """
        training_data = [[float(self.condition_map[data[0].lower()]), float(data[1]),
                          float(data[2]), float(self.time_of_day_map[data[3].lower()]),
                          float(self.genre_map[data[4].lower()])]
                          for data in self._training_data]

        self._training_data = training_data

    def __init__(self, training_data_path: Path):
        """
        Reccomendation model using a Random Forest Classifier

        Imports training data from a CSV file and encodes it for model training

        Parameters:
            training_data_path (Path): Path to the CSV file containing the training data
        """
        self._training_data = self._extract_training_data(training_data_path)
        self._encode_training_data()
        self._model = None

    def update_training_data(self, training_data_path: Path):
        """
        Update the training data for the model

        Parameters:
            training_data_path (Path): Path to the new training data
        """
        self.__init__(training_data_path)

    def train_model(self):
        """
        Train the model using the training data
        """
        # Create columns
        columns = ["weather_condition", "temperature", "heart_rate", "time_of_day", "genre"]
        df_train = pd.DataFrame(self._training_data, columns=columns)

        # Assign x to input data
        x_train = df_train[['weather_condition', 'temperature', 'heart_rate', 'time_of_day']]
        # Assign y to output data
        y_train = df_train['genre']

        # Create asd train Random Forest Classifier model
        self._model = RandomForestClassifier(n_estimators=100, random_state=42)
        self._model.fit(x_train, y_train)

    def predict_genre(self, weather_condition: str, temperature: int | float,
                heart_rate: int | float, time_of_day: str) -> str:
        """
        Predict the genre of music to listen to based on the given parameters

        Parameters:
            weather_condition (str): The current weather condition
            temperature (int, float): The current temperature
            heart_rate (fint, loat): The current heart rate
            time_of_day (str): The current time of day

        Returns:
            str: The genre of music to listen to
        """
        if self._model is None:
            # Training should be done before predicting
            self.train_model()

        # Encode the weather and time of day
        _weather_condition = self.condition_map[weather_condition.lower()]
        _time_of_day = self.time_of_day_map[time_of_day.lower()]

        new_input = {
            'weather_condition': float(_weather_condition),
            'temperature': float(temperature),
            'heart_rate': float(heart_rate),
            'time_of_day': float(_time_of_day)
        }

        new_input_features = pd.DataFrame([new_input])

        predicted_genre = self._model.predict(new_input_features)[0]
        return self.reverse_genre_map[predicted_genre]

    @staticmethod
    def choose_location(weather_condition: str, temperature: int | float, time_of_day: str) -> str:
        """
        Chooses a location to meditate based on the given parameters
        Locations: home, library, park, beach, cafe

        Parameters:
            weather_condition (str): The current weather condition
            temperature (int, float): The current temperature
            time_of_day (str): The current time of day

        Returns:
            str: The location to meditate at
        """
        weather_condition = weather_condition.lower()
        time_of_day = time_of_day.lower()
        temperature = float(temperature)

        if weather_condition in ["thunderstorm", "snow", "tornado"]:
            return "home"

        elif weather_condition in ["mist", "haze", "fog", "drizzle", "rain", "squall"]:
            """library, cafe"""
            if time_of_day in ["morning", "afternoon"]:
                return random.choice(["cafe", "home"])
            elif time_of_day in ["evening"]:
                return random.choice(["library", "home"])
            else:
                return "home"

        elif weather_condition in ["smoke", "dust", "sand", "ash"]:
            """library, home"""
            if time_of_day in ["morning", "afternoon", "evening"]:
                return random.choice(["library", "home"])
            else:
                return "home"

        elif weather_condition in ["clear", "clouds"]:
            """park, beach, cafe"""
            if time_of_day in ["morning", "afternoon"]:
                """park, beach, cafe"""
                if temperature >= 70 and temperature <= 90:
                    return random.choice(["park", "beach", "cafe"])
                else:
                    return "cafe"
            else:
                return  random.choice(["cafe", "home"])

        return "home"

    @staticmethod
    def _pick_song_with_valid_duration(songs: list, min: int, max: int) -> str:
        """
        Give [attempts] number of attempts to pick a song with a duration
        within the given range

        Parameters:
            songs (list): List of songs with their durations
                          [[song1 name, duration], [song2 name, duration], ...]
            min (int): Minimum duration of the song
            max (int): Maximum duration of the song

        Returns:
            str: The song name to listen to
        """
        choice = None
        count = 0
        attempts = 20
        while count <= attempts:
            choice = random.choice(songs)
            if min <= int(choice['time']) <= max:
                return choice['url']
            count += 1
        return random.choice(songs)['url']

    def choose_song_by_duration(self, songs: list, heart_rate: int | float):
        """
        Pick a song from a list of songs based on information provided

        Songs should be in format of
        [[song1 name, duration], [song2 name, duration], ...]

        Parameters:
            songs (list): List of songs with their durations
            heart_rate (int, float): The current heart rate

        Returns:
            str: The song name to listen to
        """
        heart_rate = float(heart_rate)

        if heart_rate < 70:
            return self._pick_song_with_valid_duration(songs, 10, 100)
        elif heart_rate >= 70 and heart_rate <= 90:
            return self._pick_song_with_valid_duration(songs, 100, 150)
        else:
            return self._pick_song_with_valid_duration(songs, 150, 1000)


if __name__ == "__main__":
    model = MeditationRecommender(Path("meditation_data.csv"))
    model.train_model()
    while True:
        try:
            condition = input("Enter the weather condition: ")
            temperature = float(input("Enter the temperature: "))
            heart_rate = float(input("Enter the heart rate: "))
            time_of_day = input("Enter the time of day: ")
            print(model.predict(condition, temperature, heart_rate, time_of_day))
        except (KeyError, ValueError):
            print("Invalid input. Please try again.")
