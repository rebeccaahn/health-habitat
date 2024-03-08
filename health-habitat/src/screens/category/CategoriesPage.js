
import React, {useEffect, useState} from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import {IconButton, Text} from 'react-native-paper'
import Background from '../../components/Background'
import BackButton from '../../components/BackButton'
import Header from '../../components/Header'
import ProgressBar from '../../components/ProgressBar'
import {theme} from "../../core/theme";
import * as getUserData from "../../api/get-user-data";
import {auth} from "../../../App";
import * as recommend from "../../api/task-recommendation";
// import {getDietScore, getExerciseScore, getMeditationScore} from "../../api/get-user-data";


export default function CategoriesPage({navigation}) {

    const day = 1000 * 60 * 60 * 24;    // milliseconds to day

    const wMessages = ["Good Morning", "Good Afternoon", "Good Evening", "Good Night"]
    const [welcomeMessage, setWelcomeMessage] = useState('')

    const [dietScore, setDietScore] = useState(32)
    const [exerciseScore, setExerciseScore] = useState(0)
    const [meditationScore, setMeditationScore] = useState(0)

    useEffect(() => {

        const userDoc = getUserData.getUserDocument(auth.currentUser.email);
        userDoc.then(
            function(value) {
                setDietScore(getUserData.getDietScore(value));
                setMeditationScore(getUserData.getMeditationScore(value));
                setExerciseScore(getUserData.getExerciseScore(value));

                // if (getUserData.getDietTask(value) == null){
                //     let tmp1 = recommend.recommendDietTask();
                //     let tmp2 = recommend.recommendExerciseTask();
                //     let tmp3 = recommend.recommendMeditationTask();
                // }
                // else {
                //     const timestamp = getUserData.getDietTask(value)[1];
                //     console.log(timestamp);
                //     if (new Date().getDay() !== timestamp.getDay()) {
                //         let tmp1 = recommend.recommendDietTask();
                //         let tmp2 = recommend.recommendExerciseTask();
                //         let tmp3 = recommend.recommendMeditationTask();
                //     }
                // }
            }
        );

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

    return (
        <Background color={theme.colors.darkBlueGradient}>
            <BackButton goBack={() => navigation.goBack()}/>
            <Header props={welcomeMessage} />
            <Header props={"Your health overview:"}/>

            <View style={styles.dietCategory}>
                <View style={styles.categoryLeft}>
                    <Text style={styles.catText}>Diet</Text>
                    <View style={styles.progressView}>
                        <ProgressBar step={dietScore} numberOfSteps={100} />
                    </View>
                </View>
                <View style={styles.categoryRight}>
                    <IconButton
                        icon="plus"
                        iconColor="white"
                        containerColor={ theme.colors.darkestGreen }
                        mode="contained"
                        size={45}
                        onPress={() => navigation.navigate('DietPage')}
                        style={[ theme.shadow, { position: 'absolute', bottom: 50, elevation: 2} ]}
                    />
                </View>
            </View>


            <View style={styles.meditationCategory}>
                <View style={styles.categoryLeft}>
                    <Text style={styles.catText}>Meditation</Text>
                    <View style={styles.progressView}>
                        <ProgressBar step={meditationScore} numberOfSteps={100} />
                    </View>
                </View>
                <View style={styles.categoryRight}>
                    <IconButton
                        icon="plus"
                        iconColor="white"
                        containerColor={ theme.colors.darkestBlue }
                        mode="contained"
                        size={45}
                        onPress={() => navigation.navigate('MeditationPage')}
                        style={[ theme.shadow, { position: 'absolute', bottom: 50, elevation: 2} ]}
                    />
                </View>
            </View>


            <View style={styles.exerciseCategory}>
                <View style={styles.categoryLeft}>
                    <Text style={styles.catText}>Exercise</Text>
                    <View style={styles.progressView}>
                        <ProgressBar step={exerciseScore} numberOfSteps={100} />
                    </View>
                </View>
                <View style={styles.categoryRight}>
                    <IconButton
                        icon="plus"
                        iconColor="white"
                        containerColor={ theme.colors.darkTeal }
                        mode="contained"
                        size={45}
                        onPress={() => navigation.navigate('ExercisePage')}
                        style={[ theme.shadow, { position: 'absolute', bottom: 50, elevation: 2} ]}
                    />
                </View>
            </View>

        </Background>
    )

}

const styles = StyleSheet.create({
    dietCategory: {
        backgroundColor: theme.colors.darkGreen,
        flexDirection: 'row',
        width: '100%',
        height: '25%'
    },
    meditationCategory: {
        backgroundColor: theme.colors.darkBlue,
        flexDirection: 'row',
        width: '100%',
        height: '25%'
    },
    exerciseCategory: {
        backgroundColor: theme.colors.darkBrown,
        flexDirection: 'row',
        width: '100%',
        height: '25%'
    },
    categoryOverview: {
        flexDirection: 'row',
        width: '100%',
        height: '100%'
    },
    categoryLeft: {
        flexDirection: 'column',
        width: '75%',
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
        width: '25%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    catText: {
        width: '100%',
        color: 'white',
        fontSize: 20,
        textAlign: 'center'
    }
});
