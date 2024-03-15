
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
import { saveCarbs } from '../../api/apple/appleHealthApi'


export default function DietPage({navigation}) {

    const [recipeUrl, setRecipeUrl] = useState('')
    const [dietScore, setDietScore] = useState(0)
    const [recipeDescription, setRecipeDescription] = useState('')
    const [recipeLink, setRecipeLink] = useState('')

    const handleDietCompletion = async () => {
        console.log('Diet Task Completed')

        const userDoc = await getUserData.getUserDocument(auth.currentUser.email);

        let value = userDoc

        let recipeId = await userDoc.get("dietTask")[0]
        fetch(`https://api.spoonacular.com/recipes/${recipeId}/nutritionWidget.json?apiKey=${env.diet_API_key}`)
            .then((response) => response.json())
            .then(async (responseJson) => {
                let calorieCount = responseJson["nutrients"][0]["amount"]
                await saveCarbs(calorieCount)
            })

        let result = await incrementDietScore()

        // let dietScoreToSet = await getDietScore(userDoc);
        let dietScoreToSet = userDoc.get("dietScore");
        // setDietScore(getDietScore(value))
        setDietScore(dietScoreToSet);
        // let recipeId = await getDietTask(userDoc)[0]
        
        fetch(`https://api.spoonacular.com/recipes/${recipeId}/card?apiKey=${env.diet_API_key}`)
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

                fetch(`https://api.spoonacular.com/recipes/${recipeId}/nutritionWidget.json?apiKey=${env.diet_API_key}`)
                    .then((response) => response.json())
                    .then(async (responseJson) => {
                        let calorieCount = responseJson["nutrients"][0]["amount"]
                        await saveCarbs(calorieCount)
                    })

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

    useEffect(() => {
        async function wrapperFunc() {
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

                // fetch(`https://api.spoonacular.com/recipes/${recipeId}/nutritionWidget.json?apiKey=${env.diet_API_key}`)
                //     .then((response) => response.json())
                //     .then(async (responseJson) => {
                //         let calorieCount = responseJson["nutrients"][0]["amount"]
                //         await saveCarbs(calorieCount)
                //     })

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
            <Header props={'Diet Details'}/>
            <View style={styles.categoryOverview}>
                <ProgressBar step={dietScore} numberOfSteps={100} color={theme.colors.darkGreenGradient}/>
            </View>

            <Image
                source={recipeUrl ? { uri: recipeUrl } : { uri: 'https://c.pxhere.com/photos/57/f4/croissant_breakfast_eggs_tomato_lettuce_food_morning_meal-683757.jpg' }}
                style={[styles.recipeCard, theme.shadow]}
            />

            <Text
                style={styles.recipeText}
                onPress={() => Linking.openURL(recipeLink)}
            >
                {recipeDescription}
            </Text>

            <Button
                mode="contained"
                onPress={handleDietCompletion}
                style={{ marginTop: 24 }}
            >
                COMPLETED
            </Button>

            <Text style={styles.creditText}>
                Credits to spoonacular API for recipes!
            </Text>
        </Background>
    )

}

const styles = StyleSheet.create({
    categoryOverview: {
        flexDirection: 'row',
        width: '100%',
        marginVertical: 5
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
        width: '90%',
        height: '45%',
        borderRadius: 15,
    },
    recipeText: {
        color: theme.lgText.color,
        fontSize: theme.lgText.fontSize,
        fontWeight: 'bold',
        letterSpacing: theme.lgText.letterSpacing,
        marginTop: 15
    },
    creditText: {
        color: theme.smText.color,
        fontSize: theme.smText.fontSize,
        letterSpacing: theme.smText.letterSpacing,
        marginTop: 10
    }
});
