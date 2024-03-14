'''
Module to recommend exercise task based on age, dream weight, actual weight, duration, heart rate, BMI, gender, weather conditions, and weight difference
Based off of model in https://www.kaggle.com/datasets/aakashjoshi123/exercise-and-fitness-metrics-dataset
'''

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import phik
from sklearn.model_selection import train_test_split, cross_val_score, RandomizedSearchCV, GridSearchCV
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import OrdinalEncoder, Normalizer
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import GradientBoostingRegressor
import random
from pathlib import Path
from typing import List, Tuple
class ExerciseClassifier:
    """
    Builds a Decision Tree Classifier model based off of training data input through CSV file
    """
    cat_features = [
            'Exercise', 
            'Gender', 
            'Weather Conditions', 
            'Gain'
    ]

    num_features = [
        'Dream Weight', 
        'Actual Weight', 
        'Age', 
        'Duration', 
        'Heart Rate', 
        'BMI', 
        'Weight Difference'
    ]

    target = 'Exercise Intensity'

    def __init__(self, data_path: Path):
        """
        Reccomendation model using a Decision Tree Classifier

        Imports training data from a CSV file and encodes it for model training

        Parameters:
            data_path (Path): Path to the CSV file containing the training data
        """
        self.state = np.random.RandomState(12345)
        self._data = self._extract_data(data_path)
        self.trainX, self.testX, self.trainY, self.testY = self._split_data(self._data)
        # model based on the best hyperparameters found from https://www.kaggle.com/datasets/aakashjoshi123/exercise-and-fitness-metrics-dataset
        self._model = GradientBoostingRegressor(
            loss='absolute_error',
            max_depth=1,
            max_features='log2',
            min_samples_leaf=2,
            min_samples_split=8,
            n_estimators=50
            )
        
        # pipeline
        numeric_transformer = Pipeline(
            steps=[
                ('imputer', SimpleImputer(strategy='mean')),
                ('normalizer', Normalizer())
            ]
        )

        categorical_transformer = Pipeline(
            steps=[
                ('imputer', SimpleImputer(strategy='constant')),
                ('encoder', OrdinalEncoder(handle_unknown='use_encoded_value', unknown_value=-1))
            ]
        )

        self.preprocessor = ColumnTransformer(
            transformers=[
                ('numeric', numeric_transformer, self.num_features),
                ('categorical', categorical_transformer, self.cat_features)
            ]
        )

    def _gain(self, x):
        if x < 0:
            return 'Gain'
        else: return 'Lose'

    def _extract_data(self, data_path: Path) -> List[List[str | int]]:
        """
        Extract the training data from the CSV file

        Parameters:
            data_path (Path): Path to the CSV file containing the training data

        Returns:
            List[List[str | int]]: The training data
        """
        # Read the CSV file
        data = pd.read_csv(data_path)

        # process the training data
        data.drop('ID', axis=1, inplace=True)
        data['Exercise'] = data['Exercise'].map(lambda x: ''.join([i for i in x if i.isdigit()])) # change exercise column to int
        ints = [
            'Exercise', 
            'Age', 
            'Duration', 
            'Heart Rate', 
            'Exercise Intensity'
        ]

        categories = [
            'Gender', 
            'Weather Conditions'
        ]

        for col in ints:
            data[col] = data[col].astype('int16')

        for col in categories:
            data[col] = data[col].astype('category')

        # add gain column to describe whether the respondent wants to gain some weight or lose it
        data['Weight Difference'] = data['Actual Weight'] - data['Dream Weight']
        data['Gain'] = data['Weight Difference'].apply(self._gain).astype('category')
        data['Weight Difference'] = abs(data['Weight Difference'])

        # Convert the data to a list of lists
        # data = data.values.tolist()

        return data
    
    def _split_data(self, data: List[List[str | int]]) -> Tuple[List[List[str | int]], List[List[str | int]], List[str | int], List[str | int]]:
        """
        Split the data into training and testing data

        Parameters:
            data (List[List[str | int]]): The data to split

        Returns:
            (List[List[str | int]], List[List[str | int]]): The training and testing data
        """
        X_train, X_test, y_train, y_test = train_test_split(
            data[self.cat_features + self.num_features], 
            data[self.target], 
            test_size=0.33, 
            random_state=self.state
            )
        
        return X_train, X_test, y_train, y_test

    def train_model(self):
        """
        Train the model using the training data
        """
        steps = [
            ('preprocess', self.preprocessor),
            ('reg', self._model)
        ]

        pipeline = Pipeline(steps)

        # fit the model
        pipeline.fit(self.trainX, self.trainY)

        self._model = pipeline

    
    def predict_category(self, dream_weight: int, actual_weight: int, age: int, gender: str, weather_condition: str) -> str:
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

        # adjust weather_condition for mode
        if weather_condition in ["thunderstorm", "snow", "tornado", "mist", "haze", "fog", "drizzle", "rain", "squall", "smoke", "dust", "sand", "ash"]:
            weather_condition = 'Rainy'
        elif weather_condition == 'clouds':
            weather_condition = 'Cloudy'
        else:
            weather_condition = 'Sunny'
            
        # Create a new user dataframe
        new_user = pd.DataFrame({
            'Exercise': None,
            'Calories': None,
            'Dream Weight': [dream_weight],
            'Actual Weight': [actual_weight],
            'Age': [age],
            'Gender': [gender],
            'Duration': None,
            'Heart Rate': None,
            'BMI': None,
            'Weather Conditions': [weather_condition],
            'Weight Difference': [actual_weight - dream_weight],
            'Gain': self._gain(actual_weight - dream_weight)
        })

        # Predict the category
        category = self._model.predict(new_user)

        return category[0]
    
    @staticmethod
    def choose_location(weather_condition: str, temperature: int | float, time_of_day: str) -> str:
        """
        Chooses a location to meditate based on the given parameters
        Locations: home (inside), backyard, park, gym

        Parameters:
            weather_condition (str): The current weather condition
            temperature (int, float): The current temperature
            time_of_day (str): The current time of day

        Returns:
            str: The location to exercise at
        """
        # TODO: add gym as a place if user has access to a gym
        if weather_condition in ["thunderstorm", "snow", "tornado", "mist", "haze", "fog", "drizzle", "rain", "squall", "smoke", "dust", "sand", "ash"]:
            return "home (inside)"
        elif weather_condition in ["clear", "clouds"]:
            """park, backyard"""
            if time_of_day in ["morning", "afternoon"]:
                if temperature >= 70 and temperature <= 90:
                    return random.choice(["park", "backyard"])

        return "home (inside)"

if __name__ == '__main__':
    exercise_model = ExerciseClassifier("exercise_dataset.csv")
    exercise_model.train_model()
    print('RESULT')
    print(exercise_model.predict_category(91, 96, 45, 'Male', 'Sunny'))
