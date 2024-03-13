
import React, {useEffect, useState} from 'react'
import {StyleSheet, View, TouchableOpacity, FlatList} from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../../components/Background'
import BackButton from '../../components/BackButton'
import Header from '../../components/Header'
import ProgressBar from '../../components/ProgressBar'
import * as appleHealthApi from '../../api/apple/appleHealthApi'
import { recommendExerciseTask } from '../../api/task-recommendation'
import { getUserDocument, getExerciseTask } from '../../api/get-user-data'
import { getLocation } from '../../api/apple/appleLocationApi'
import {theme} from "../../core/theme";
import { API_URL } from '../../core/config'


export default function ExercisePage({navigation}) {
    // TODO : update user database and remove onclick functionality
    const handleExerciseCompletion = async (exerciseId) => {
        setWelcomeMessage(wMessages[0])
    }


    // TODO : query data
    const exerciseScore = 75

    // TODO : query data
    const exerciseData = [
        {id: 0, name: 'exercise1', description: 'do smth'},
        {id: 1, name: 'exercise2', description: 'do more smth'},
    ]

    const getExerciseTask = async () => {
        const weather = getLocation();
        appleHealthApi.initHealthApi();
        const actualWeight = appleHealthApi.getWeight();
        const age = appleHealthApi.getAge();
        const gender = appleHealthApi.getSex();

        // TODO: get dream weight from user database (in kg)
        const dreamWeight = 80;

        // get exercise intensity level from the exercise ml model
        const response = await fetch(API_URL + '/exercise_rec', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                'weather_condition': weather,
                'actual_weight': actualWeight,
                'dream_weight': dreamWeight,
                'age': age,
                'gender': gender
            }
        });

        // convert response to an integer
        const intensityLevel = parseInt(response);

        // recommend the user a task
        const task = recommendExerciseTask(intensityLevel);
        return task;
    }

    const wMessages = ["Good Morning", "Good Afternoon", "Good Evening", "Good Night"]
    const [welcomeMessage, setWelcomeMessage] = useState('')

    useEffect(() => {
        const curHour = new Date().getHours()
        if (curHour < 12) {
            setWelcomeMessage(wMessages[0])
        } else if (curHour < 17) {
            setWelcomeMessage(wMessages[1])
        } else if (curHour < 20) {
            setWelcomeMessage(wMessages[2])
        } else {
            setWelcomeMessage(wMessages[3])
        }
    }, []);

    useEffect(() => {

    }, []);

    return (
        <Background color={theme.colors.tealGradient}>
            <BackButton goBack={() => navigation.goBack()}/>
            <Header props={welcomeMessage}/>
            <Header props={'Your exercise details:'}/>
            <View style={styles.categoryOverview}>
                {/*<Image*/}
                {/*    style={styles.categoryIcon}*/}
                {/*    source={{*/}
                {/*        // TODO : find such image*/}
                {/*        uri: ''*/}
                {/*    }}*/}
                {/*/>*/}
                <ProgressBar step={exerciseScore} numberOfSteps={100}/>
            </View>
            <FlatList style={{width: '100%'}}
                data={exerciseData}
                renderItem={({item}) => (
                    <View style={styles.listItem}>
                        <View styles={styles.itemText}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemDescription}>{item.description}</Text>
                        </View>
                        <TouchableOpacity styles={{width: '25%'}} onPress={() => handleExerciseCompletion(item.id)}>
                            <Text style={styles.completedButton}>{"completed!"}</Text>
                        </TouchableOpacity>
                    </View>
                )}
                keyExtractor={item => item.id}
            />
        </Background>
    );
}

const styles = StyleSheet.create({
    categoryOverview: {
        flexDirection: 'row',
        width: '75%'
    },
    categoryIcon: {
        width: '50',
        height: '50'
    },
    listItem: {
        alignSelf: 'center',
        borderColor: theme.colors.blue,
        borderRadius: 10,
        borderWidth: 2,
        height: '100%',
        marginBottom: 20,
        width: '100%',
        flexDirection: 'row',
    },
    itemText: {
        flexDirection: 'column',
        width: '100%'
    },
    itemName: {
        color: 'white',
        fontSize: 25,
        textAlign: 'center',
        width: '100%'
    },
    itemDescription: {
        color: "white",
        fontSize : 20,
        padding: 10,
        marginVertical: 10,
        marginHorizontal: 10,
        // flexDirection: 'column',
        width: '100%'
    },
    completedButton: {
        color: "white",
        fontSize : 20,
        alignItems: 'flex-end',
        textAlign: 'center',
        width: '100%',
    }
});
