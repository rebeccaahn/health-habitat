from pathlib import Path
from typing import List
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
import random


class ExerciseClassifier:
    """
    Builds a Decision Tree Classifier model based off of training data input through CSV file
    """

    """Maps for encoding data"""
    group_map = {'abs': 0, 'arms': 1, 'back': 2, 'calves': 3, 'cardio': 4, 'chest': 5, 'legs': 6, 'shoulders': 7}
    group_reverse_map = {v: k for k, v in group_map.items()}
    heart_rate_map = {'low': 0, 'moderate': 1, 'high': 2}
    

    def __init__(self, training_data_path: Path):
        """
        Reccomendation model using a Decision Tree Classifier

        Imports training data from a CSV file and encodes it for model training

        Parameters:
            training_data_path (Path): Path to the CSV file containing the training data
        """
        self._training_data = self._extract_training_data(training_data_path)
        self._encode_training_data()
        self._model = None

    def _extract_training_data(self, training_data_path: Path) -> List[List[str | int]]:
        """
        Extract the training data from the CSV file

        Parameters:
            training_data_path (Path): Path to the CSV file containing the training data

        Returns:
            List[List[str | int]]: The training data
        """
        # Read the CSV file
        training_data = pd.read_csv(training_data_path)

        # Convert the data to a list of lists
        training_data = training_data.values.tolist()

        return training_data
    
    def _encode_training_data(self):
        """
        Encodes training data into integers for model training

        Utalizes condition_map, time_of_day_map, and genre_map to encode the data
        """
        training_data = [[float(self.group_map[data[0].lower()]), float(self.heart_rate_map[data[1].lower()]), 
                          float(data[2]), float(data[3])]
                          for data in self._training_data]

        self._training_data = training_data
    
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
        columns = ["Muscle Group","Heart Rate", "Steps", "Calories" ]
        df_train = pd.DataFrame(self._training_data, columns=columns)

        # Assign x to input data
        x_train = df_train[['Heart Rate', 'Steps', 'Calories']]
        # Assign y to output data
        y_train = df_train['Muscle Group']
        print(df_train)

        # Create and train Decision Tree Classifier model
        self._model = DecisionTreeClassifier()
        self._model.fit(x_train, y_train)
    
    def predict_category(self, steps: int, calories: int | float, heart_rate: int | float) -> str:
        """
        Predict the category of exercise to do based on the given parameters

        Parameters:
            steps (int): The number of steps taken
            calories (int, float): The number of calories burned
            heart_rate (fint, loat): The current heart rate

        Returns:
            str: The category of exercise to do
        """
        if self._model is None:
            # Training should be done before predicting
            self.train_model()
        
        # Create a new user dataframe
        new_user = pd.DataFrame([[heart_rate, steps, calories]], columns=['Heart Rate', 'Steps', 'Calories', ])
        # Predict the category
        category = self._model.predict(new_user)

        return self.group_reverse_map[int(category[0])]
    
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

        if weather_condition in ["thunderstorm", "snow", "tornado", "mist", "haze", "fog", "drizzle", "rain", "squall", "smoke", "dust", "sand", "ash"]:
            return "home (inside)"
        elif weather_condition in ["clear", "clouds"]:
            """park, backyard"""
            if time_of_day in ["morning", "afternoon"]:
                if temperature >= 70 and temperature <= 90:
                    return random.choice(["park", "backyard"])

        return "home (inside)"

if __name__ == '__main__':
    exercise_model = ExerciseClassifier("exercise_data.csv")
    exercise_model.train_model()
    print(exercise_model.predict_category(100, 100, 100)) # Output: 'Cardio'