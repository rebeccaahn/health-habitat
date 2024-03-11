
import React, {useEffect, useState} from 'react'
import {StyleSheet, View, TouchableOpacity} from 'react-native'
import { Text } from 'react-native-paper'
import Button from '../../components/Button'
import Background from '../../components/Background'
import BackButton from '../../components/BackButton'
import Header from '../../components/Header'
import ProgressBar from '../../components/ProgressBar'
import {theme} from "../../core/theme";
import * as getUserData from "../../api/get-user-data";
import {auth} from "../../../App";
import {getMeditationScore, getMeditationTask} from "../../api/get-user-data";
import {incrementMeditationScore} from "../../api/score-categories";


export default function MeditationPage({navigation}) {

    const [meditationScore, setMeditationScore] = useState(0)
    const [currentMeditation, setCurrentMeditation] = useState('')

    const handleMeditationCompletion = () => {
        console.log('Meditation Task Completed')
        incrementMeditationScore()
        const userDoc = getUserData.getUserDocument(auth.currentUser.email);
        userDoc.then(
            function (value){
                setMeditationScore(getMeditationScore(value))
                setCurrentMeditation(getMeditationTask(value))
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
            function (value){
                setMeditationScore(getMeditationScore(value))
                setCurrentMeditation(getMeditationTask(value))
            }
        );
    }, []);

    return (
        <Background color={theme.colors.tealGradient}>
            <BackButton goBack={() => navigation.goBack()}/>
            <Header props={welcomeMessage}/>
            <Header props={'Your meditation details:'}/>
            <View style={styles.categoryOverview}>
                <ProgressBar step={meditationScore} numberOfSteps={100}/>
            </View>

            <Text>{currentMeditation}</Text>

            <Button
                mode="contained"
                onPress={handleMeditationCompletion}
                style={{ marginTop: 24 }}
            >
                completed!
            </Button>

            <Text>
                Credits to Last.fm API for song track information!
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
