
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
import { Linking } from 'react-native'
import CategoriesPage from './CategoriesPage'


export default function DietPage({navigation}) {

    const [recipeUrl, setRecipeUrl] = useState('')
    const [dietScore, setDietScore] = useState(0)
    const [recipeDescription, setRecipeDescription] = useState('')
    const [recipeLink, setRecipeLink] = useState('')

    const handleDietCompletion = async () => {
        console.log('Diet Task Completed')
        let result = await incrementDietScore()
        const userDoc = await getUserData.getUserDocument(auth.currentUser.email);

        let value = userDoc

        // let dietScoreToSet = await getDietScore(userDoc);
        let dietScoreToSet = userDoc.get("dietScore");
        // setDietScore(getDietScore(value))
        setDietScore(dietScoreToSet);
        // let recipeId = await getDietTask(userDoc)[0]
        let recipeId = await userDoc.get("dietTask")[0]
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
                setRecipeLink(responseJson["url"])
            })
            .catch(async error => {
                await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${env.diet_API_key}`)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        setRecipeUrl(responseJson["image"]);
                        setRecipeDescription(responseJson['title'])
                        setRecipeLink(responseJson['spoonacularSourceUrl'])
                    })
            });
    }

    const wMessages = ["Good Morning", "Good Afternoon", "Good Evening", "Good Night"]
    const [welcomeMessage, setWelcomeMessage] = useState('')

    useEffect(() => {
        async function wrapperFunc() {
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

        const userDoc = await getUserData.getUserDocument(auth.currentUser.email);
        // need to stop using .then

        let value = userDoc;
        
        // let newDietScore = await getDietScore(value);
        let newDietScore = await userDoc.get("dietScore");
        setDietScore(newDietScore);
        // let recipeId = await getDietTask(value)[0]
        let recipeId = await userDoc.get("dietTask")[0];
        console.log("BEFORE", recipeId)
        await fetch(`https://api.spoonacular.com/recipes/${recipeId}/card?apiKey=${env.diet_API_key}`)
            .then(async (response) => {
                console.log("made it", response);
                let responseJson = await response.json()
                if (response.ok) {
                    console.log("JSON", responseJson)
                    setRecipeUrl(responseJson["url"]);
                    setRecipeDescription('')
                    setRecipeLink(responseJson["url"])
                }
                console.log("JSON", responseJson)
                setRecipeUrl(responseJson["url"]);
                setRecipeDescription('')
                setRecipeLink(responseJson["url"])
                throw new Error('400 Bad Request')
            })
            .then((responseJson) => {
                setRecipeUrl(responseJson["url"]);
                setRecipeDescription('')
                setRecipeLink(responseJson["url"])
            })
            .catch(error => {
                fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${env.diet_API_key}`)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        setRecipeUrl(responseJson["image"]);
                        setRecipeDescription(responseJson['title'])
                        setRecipeLink(responseJson['spoonacularSourceUrl'])
                    })
            });
        }
    wrapperFunc();
    }, []);

    return (
        <Background color={theme.colors.blueGradient}>
            <BackButton goBack={() => navigation.navigate('CategoriesPage')}/>
            <Header props={welcomeMessage}/>
            <Header props={'Your diet details:'}/>
            <View style={styles.categoryOverview}>
                <ProgressBar step={dietScore} numberOfSteps={100} color={theme.colors.darkGreenGradient}/>
            </View>

            <Image
                source={recipeUrl ? { uri: recipeUrl } : { uri: 'https://c.pxhere.com/photos/57/f4/croissant_breakfast_eggs_tomato_lettuce_food_morning_meal-683757.jpg' }}
                style={styles.recipeCard}
            />

            <Text
                onPress={() => Linking.openURL(recipeLink)}
            >
                {recipeDescription}
            </Text>

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
