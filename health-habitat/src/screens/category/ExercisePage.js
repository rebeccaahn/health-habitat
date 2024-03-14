
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'
import Button from '../../components/Button'
import Background from '../../components/Background'
import BackButton from '../../components/BackButton'
import Header from '../../components/Header'
import ProgressBar from '../../components/ProgressBar'
import * as appleHealthApi from '../../api/apple/appleHealthApi'
import { recommendExerciseTask } from '../../api/task-recommendation'
import { getLocation } from '../../api/apple/appleLocationApi'
import { theme } from "../../core/theme";
import { incrementExerciseScore } from "../../api/score-categories";
import * as getUserData from "../../api/get-user-data";
import { auth } from "../../core/config";
import { getExerciseScore, getExerciseTask } from "../../api/get-user-data";
import { API_URL } from '../../core/config'

export default function ExercisePage({ navigation }) {
    const [exerciseScore, setExerciseScore] = useState(0)
    const [currentExercise, setCurrentExercise] = useState('')

    const getNewExerciseTask = async () => {
        // recommend the user a task
        const task = recommendExerciseTask();
        console.log(task.get('name'))
        setCurrentExercise(task.get('name'));
        return task.get('name');
    }

    const handleExerciseCompletion = () => {
        console.log('Exercise Task Completed')
        incrementExerciseScore()
        const userDoc = getUserData.getUserDocument(auth.currentUser.email);

        // TODO: FIX BUG THAT IS INTRODUCED IN THIS FUNCTION
        userDoc.then(
            async function (value) {
                const newExerciseTask = await getNewExerciseTask();
                return value, newExerciseTask
            }
            .then(
                function (value, newExerciseTask) {
                    setCurrentExercise(getExerciseScore(value));
                    setCurrentExercise(newExerciseTask[1]);
                }
            )
            
        );
    }

    // TODO : query data
    const exerciseData = [
        { id: 0, name: 'exercise1', description: 'do smth' },
        { id: 1, name: 'exercise2', description: 'do more smth' },
    ]


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

        const userDoc = getUserData.getUserDocument(auth.currentUser.email);
        userDoc.then(
            function (value) {
                setExerciseScore(getExerciseScore(value))
                if (getExerciseTask(value) == null) {
                    setCurrentExercise(getNewExerciseTask())
                } else {
                    setCurrentExercise(getExerciseTask(value)[0])
                }
            }
        );
    }, []);

    return (
        <Background color={theme.colors.tealGradient}>
            <BackButton goBack={() => navigation.goBack()} />
            <Header props={welcomeMessage} />
            <Header props={'Your exercise details:'} />
            <View style={styles.categoryOverview}>
                <ProgressBar step={exerciseScore} numberOfSteps={100} color={theme.colors.tealGradient} />
            </View>

            <Text style={{color: 'white'}}>{currentExercise}</Text>

            <Button
                mode="contained"
                onPress={handleExerciseCompletion}
                style={{ marginTop: 24 }}
            >
                completed!
            </Button>

            <Text>
                Credits to wger API for exercise sets!
            </Text>
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
        fontSize: 20,
        padding: 10,
        marginVertical: 10,
        marginHorizontal: 10,
        // flexDirection: 'column',
        width: '100%'
    },
    completedButton: {
        color: "white",
        fontSize: 20,
        alignItems: 'flex-end',
        textAlign: 'center',
        width: '100%',
    }
});
