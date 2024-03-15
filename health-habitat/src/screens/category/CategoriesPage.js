
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Icon, IconButton, Text } from 'react-native-paper'
import Background from '../../components/Background'
import BackButton from '../../components/BackButton'
import { Button as PaperButton } from 'react-native-paper';
import Header from '../../components/Header'
import ProgressBar from '../../components/ProgressBar'
import { theme } from "../../core/theme";
import * as getUserData from "../../api/get-user-data";
import { auth } from "../../core/config";
import * as recommend from "../../api/task-recommendation";
import { decrementDietScore, decrementMeditationScore, decrementExerciseScore } from "../../api/score-categories";
import { useFocusEffect } from '@react-navigation/native';


export default function CategoriesPage({ navigation }) {
    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                const userDoc = await getUserData.getUserDocument(auth.currentUser.email);
                let dietScore = await userDoc.get("dietScore");
                setDietScore(dietScore);
                let newMeditationScore = await userDoc.get("meditationScore");
                setMeditationScore(newMeditationScore);
                let exerciseStore = await userDoc.get("exerciseScore");
                setExerciseScore(exerciseStore)
            };

            fetchData(); // Immediately invoke the async function

            return () => {
            // Cleanup function (optional)
            console.log('Cleanup function');
            };
        }, [])
    );

    const day = 1000 * 60 * 60 * 24;    // milliseconds to day
    const [dietScore, setDietScore] = useState(32)
    const [exerciseScore, setExerciseScore] = useState(50)
    const [meditationScore, setMeditationScore] = useState(50)

    useEffect(() => {
        async function wrapperFunc() {
        const userDoc = await getUserData.getUserDocument(auth.currentUser.email);
        // dont await this as it causes .then to not work
        let value = userDoc;

        console.log("USER DOC", userDoc);
        // User doc is stll undefined here, this means that getuserrdata.getuserdocument is not working

        
        console.log("User document:", value);
        // let dietScore = await getUserData.getDietScore(value);
        let dietScore = await value.get("dietScore");
        setDietScore(dietScore);
        // let newMeditationScore = await getUserData.getMeditationScore(value);
        let newMeditationScore = await value.get("meditationScore");
        setMeditationScore(newMeditationScore);
        // let newExerciseScore = await getUserData.getExerciseScore(value);
        let newExerciseScore = await value.get("exerciseScore");
        setExerciseScore(newExerciseScore);

        // let dietTask = await getUserData.getDietTask(value)
        let dietTask = await userDoc.get("dietTask");
        let meditationTask = await userDoc.get("meditationTask");
        let exerciseTask = await userDoc.get("exerciseTask")

        if (dietTask == null) {
            await recommend.recommendDietTask();
        }
        else {
            const timestamp = await userDoc.get("dietTask");
            if (new Date().getUTCDay() !== new Date(timestamp[1] * 1000).getUTCDay()) {
                await decrementDietScore();
                await recommend.recommendDietTask();
            }
        }

        if (meditationTask == null) {
            console.log("TASK NULL")
            await recommend.recommendMeditationTask();
            let meditationTask = await userDoc.get("meditationTask");
            console.log("NEW GEN TASK", meditationTask)
        }
        else {
            const timestamp = await userDoc.get("meditationTask");
            if (new Date().getUTCDay() !== new Date(timestamp[1] * 1000).getUTCDay()) {
                await decrementMeditationScore();
                await recommend.recommendMeditationTask();
            }
        }

        if (exerciseTask == null ){
            console.log("NULLLLLLL")
            await recommend.recommendExerciseTask();
        }
        else {
            const timestamp = await userDoc.get("exerciseTask");
            if (new Date().getUTCDay() !== new Date(timestamp[1] * 1000).getUTCDay()) {
                await decrementExerciseScore();
                await recommend.recommendExerciseTask();
            }
        }
        
        // else {
        //     // const timestamp = await getUserData.getDietTask(value);
        //     const timestamp = await userDoc.get("dietTask");
        //     console.log(timestamp[1]);

        //     if (new Date().getUTCDay() !== new Date(timestamp[1] * 1000).getUTCDay()) {
        //         await decrementDietScore();
        //         await decrementMeditationScore();
        //         // await decrementExerciseScore();
        //         await recommend.recommendDietTask();
        //         await recommend.recommendMeditationTask();
        //         // await recommend.recommendExerciseTask();
        //     }
        // }
    }
    wrapperFunc()
    }, []);

    return (
        <Background color={theme.colors.tealGradient}>
            <BackButton goBack={() => navigation.goBack()} />
            <Header props={"Overview"} />

            <TouchableOpacity 
                style={[styles.dietCategory, theme.shadow]}
                onPress={() => navigation.navigate('DietPage')}
                activeOpacity={.7}
            >
                <View style={styles.categoryLeft}>
                    <IconButton icon="food-apple-outline" iconColor="white" size={60} />
                </View> 
                <View style={styles.categoryRight}>
                    <Text style={styles.catText}>Diet</Text>
                    <View style={styles.progressView}>
                        <ProgressBar step={parseInt(dietScore)} numberOfSteps={100} color={theme.colors.darkGreenGradient}/>
                    </View>
                </View>
            </TouchableOpacity>


            <TouchableOpacity 
                style={[styles.meditationCategory, theme.shadow]}
                onPress={() => navigation.navigate('MeditationPage')}
                activeOpacity={.7}
            >
                <View style={styles.categoryLeft}>
                    <IconButton icon="heart-outline" iconColor="white" size={60} />
                </View> 
                <View style={styles.categoryRight}>
                    <Text style={styles.catText}>Meditation</Text>
                    <View style={styles.progressView}>
                        <ProgressBar step={parseInt(meditationScore)} numberOfSteps={100} color={theme.colors.blueGradient}/>
                    </View>
                </View>
            </TouchableOpacity>


            <TouchableOpacity 
                style={[styles.exerciseCategory, theme.shadow]}
                onPress={() => navigation.navigate('ExercisePage')}
                activeOpacity={.7}
            >
                <View style={styles.categoryLeft}>
                    <IconButton icon="run" iconColor="white" size={60} />
                </View> 
                <View style={styles.categoryRight}>
                    <Text style={styles.catText}>Exercise</Text>
                    <View style={styles.progressView}>
                        <ProgressBar step={parseInt(exerciseScore)} numberOfSteps={100} color={theme.colors.orangeGradient}/>
                    </View>
                </View>
            </TouchableOpacity>

        </Background>
    )

}

const styles = StyleSheet.create({
    dietCategory: {
        backgroundColor: theme.colors.darkGreen,
        flexDirection: 'row',
        width: '100%',
        height: '20%',
        marginVertical: 20,
        borderRadius: 15,
        padding: 15
    },
    meditationCategory: {
        backgroundColor: theme.colors.darkBlue,
        flexDirection: 'row',
        width: '100%',
        height: '20%',
        marginVertical: 20,
        borderRadius: 15,
        padding: 15
    },
    exerciseCategory: {
        backgroundColor: theme.colors.darkBrown,
        flexDirection: 'row',
        width: '100%',
        height: '20%',
        marginVertical: 20,
        borderRadius: 15,
        padding: 15
    },
    categoryOverview: {
        flexDirection: 'row',
        width: '100%',
        height: '100%'
    },
    categoryLeft: {
        flexDirection: 'column',
        width: '25%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    progressView: {
        flexDirection: 'column',
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    categoryRight: {
        flexDirection: 'column',
        width: '75%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    catText: {
        width: '100%',
        color: 'white',
        fontSize: 23,
        fontWeight: 'bold',
        letterSpacing: 2,
        textAlign: 'center',
        margin: 15
    }
});
