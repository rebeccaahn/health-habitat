
import React, {useEffect, useState} from 'react'
import {StyleSheet, View, TouchableOpacity, Image} from 'react-native'
import { Text } from 'react-native-paper'
import Button from '../../components/Button'
import Background from '../../components/Background'
import BackButton from '../../components/BackButton'
import Header from '../../components/Header'
import ProgressBar from '../../components/ProgressBar'
import {theme} from "../../core/theme";

import {getDietScore, getDietTask, getExerciseScore, getMeditationScore} from "../../api/get-user-data";
import {auth} from "../../../App";
import * as getUserData from "../../api/get-user-data";
// import env from "../../api/env.json" assert { type: 'json' };
import env from "../../api/env.json";
import * as recommend from "../../api/task-recommendation";
import {incrementDietScore} from "../../api/score-categories";


export default function DietPage({navigation}) {

    const [recipeUrl, setRecipeUrl] = useState('')
    const [dietScore, setDietScore] = useState(0)

    const handleDietCompletion = () => {
        console.log('Diet Task Completed')
        // incrementDietScore()
        const userDoc = getUserData.getUserDocument(auth.currentUser.email);
        userDoc.then(
            function(value) {
                setDietScore(getDietScore(value))
                // let recipeId = getDietTask(value)
                // fetch(`https://api.spoonacular.com/recipes/${recipeId}/card?apiKey=${env.diet_API_key}`)
                //     .then((response) => response.json())
                //     .then((responseJson) => {
                //         setRecipeUrl(responseJson["url"]);
                //     })
                fetch(`https://api.spoonacular.com/recipes/4632/card?apiKey=${env.diet_API_key}`)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        setRecipeUrl(responseJson["url"]);
                    })
            }
        );
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

        const userDoc = getUserData.getUserDocument(auth.currentUser.email);
        userDoc.then(
            function(value) {
                setDietScore(getDietScore(value))
                // let recipeId = getDietTask(value)
                // fetch(`https://api.spoonacular.com/recipes/${recipeId}/card?apiKey=${env.diet_API_key}`)
                //     .then((response) => response.json())
                //     .then((responseJson) => {
                //         setRecipeUrl(responseJson["url"]);
                //     })
                fetch(`https://api.spoonacular.com/recipes/4632/card?apiKey=${env.diet_API_key}`)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        setRecipeUrl(responseJson["url"]);
                    })
            }
        );
    }, []);

    return (
        <Background color={theme.colors.blueGradient}>
            <BackButton goBack={() => navigation.goBack()}/>
            <Header props={welcomeMessage}/>
            <Header props={'Your diet details:'}/>
            <View style={styles.categoryOverview}>
                <ProgressBar step={dietScore} numberOfSteps={100}/>
            </View>

            <Image
                style={styles.recipeCard}
                source={{uri: recipeUrl}}
            />

            <Button
                mode="contained"
                onPress={handleDietCompletion}
                style={{ marginTop: 24 }}
            >
                completed!
            </Button>
        </Background>
    )

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
        fontSize: 20,
        alignItems: 'flex-end',
        textAlign: 'center',
        width: '100%'
    },
    recipeCard: {
        width: '60%',
        height: '60%'
    }
});
