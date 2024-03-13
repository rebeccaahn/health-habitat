
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
import {auth} from "../../core/config";
import * as getUserData from "../../api/get-user-data";
// import env from "../../api/env.json" assert { type: 'json' };
import env from "../../api/env.json";
import * as recommend from "../../api/task-recommendation";
import {incrementDietScore} from "../../api/score-categories";


export default function DietPage({navigation}) {

    const [recipeUrl, setRecipeUrl] = useState('')
    const [dietScore, setDietScore] = useState(0)
    const [recipeDescription, setRecipeDescription] = useState('')

    const handleDietCompletion = () => {
        console.log('Diet Task Completed')
        incrementDietScore()
        const userDoc = getUserData.getUserDocument(auth.currentUser.email);
        userDoc.then(
            function(value) {
                setDietScore(getDietScore(value))
                let recipeId = getDietTask(value)[0]
                fetch(`https://api.spoonacular.com/recipes/${recipeId}/card?apiKey=${env.diet_API_key}`)
                    .then((response) => {
                        if (response.ok) {
                            response.json()
                        }
                        throw new Error('400 Bad Request')
                    })
                    .then((responseJson) => {
                        setRecipeUrl(responseJson["url"]);
                        setRecipeDescription('')
                    })
                    .catch(error => {
                        fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${env.diet_API_key}`)
                            .then((response) => response.json())
                            .then((responseJson) => {
                                setRecipeUrl(responseJson["image"]);
                                setRecipeDescription(responseJson['summary'])
                            })
                    });
                // fetch(`https://api.spoonacular.com/recipes/4632/card?apiKey=${env.diet_API_key}`)
                //     .then((response) => response.json())
                //     .then((responseJson) => {
                //         setRecipeUrl(responseJson["url"]);
                //     })
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
                let recipeId = getDietTask(value)[0]
                fetch(`https://api.spoonacular.com/recipes/${recipeId}/card?apiKey=${env.diet_API_key}`)
                    .then((response) => {
                        if (response.ok) {
                            response.json()
                        }
                        throw new Error('400 Bad Request')
                    })
                    .then((responseJson) => {
                        setRecipeUrl(responseJson["url"]);
                        setRecipeDescription('')
                    })
                    .catch(error => {
                        fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${env.diet_API_key}`)
                            .then((response) => response.json())
                            .then((responseJson) => {
                                setRecipeUrl(responseJson["image"]);
                                setRecipeDescription(responseJson['summary'])
                            })
                    });
                // fetch(`https://api.spoonacular.com/recipes/4632/card?apiKey=${env.diet_API_key}`)
                //     .then((response) => response.json())
                //     .then((responseJson) => {
                //         setRecipeUrl(responseJson["url"]);
                //     })
            }
        );
    }, []);

    return (
        <Background color={theme.colors.blueGradient}>
            <BackButton goBack={() => navigation.goBack()}/>
            <Header props={welcomeMessage}/>
            <Header props={'Your diet details:'}/>
            <View style={styles.categoryOverview}>
                <ProgressBar step={dietScore} numberOfSteps={100} color={theme.colors.darkGreenGradient}/>
            </View>

            <Image
                style={styles.recipeCard}
                source={{uri: recipeUrl}}
            />

            <Text>{<div dangerouslySetInnerHTML={{__html: recipeDescription}} />}</Text>

            <Button
                mode="contained"
                onPress={handleDietCompletion}
                style={{ marginTop: 24 }}
            >
                completed!
            </Button>

            <Text>
                Credits to spoonacular API for recipes!
            </Text>
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
