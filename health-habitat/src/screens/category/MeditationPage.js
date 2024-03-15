
import React, {useEffect, useState} from 'react'
import {StyleSheet, View, Linking} from 'react-native'
import { Text } from 'react-native-paper'
import Button from '../../components/Button'
import Background from '../../components/Background'
import BackButton from '../../components/BackButton'
import Header from '../../components/Header'
import ProgressBar from '../../components/ProgressBar'
import {theme} from "../../core/theme";
import * as getUserData from "../../api/get-user-data";
import {auth} from "../../core/config";
import {getMeditationScore, getMeditationTask} from "../../api/get-user-data";
import {incrementMeditationScore} from "../../api/score-categories";
import { getRecommendationLocation } from '../../api/task-recommendation'


export default function MeditationPage({navigation}) {

    const [meditationScore, setMeditationScore] = useState(0)
    const [trackUrl, setTrackUrl] = useState('')
    const [meditationLocation, setMeditationLocation] = useState('')
    const [trackName, setTrackName] = useState('')
    const [trackArtist, setTrackArtist] = useState('')

    const handleMeditationCompletion = async () => {
        console.log('Meditation Task Completed')
        await incrementMeditationScore()
        const userDoc = await getUserData.getUserDocument(auth.currentUser.email);

        let value = userDoc;

        setMeditationScore(await userDoc.get("meditationScore"))
        setTrackUrl(await userDoc.get("meditationTask")[0])
        setMeditationLocation(await getRecommendationLocation())
        setTrackName(await getUserData.getTrackAndArtist(trackUrl)[0])
        setTrackArtist(await getUserData.getTrackAndArtist(trackUrl)[1])
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

        let meditationScore = await userDoc.get("meditationScore");
        console.log("SCORE IS", meditationScore);
        setMeditationScore(meditationScore);
        let meditationTask = await userDoc.get("meditationTask");
        console.log("TASK IS", meditationTask);
        console.log(meditationTask[0]);
        setTrackUrl(meditationTask[0]);
        let location = await getRecommendationLocation()
        setMeditationLocation(location)
        console.log("FINAL URL IS", meditationTask[0])
        let trackInfo = await getUserData.getTrackAndArtist(meditationTask[0])
        setTrackName(trackInfo[0])
        setTrackArtist(trackInfo[1])

        }
        wrapperFunc();
    }, []);

    return (
        <Background color={theme.colors.tealGradient}>
            <BackButton goBack={() => navigation.goBack()}/>
            <Header props={welcomeMessage}/>
            <Header props={'Your meditation details:'}/>
            <View style={styles.categoryOverview}>
                <ProgressBar step={meditationScore} numberOfSteps={100} color={theme.colors.orangeGradient}/>
            </View>

            <Text
                style={{
                    color: "white"
                }}
            >
                {`Let's go meditate in a ${meditationLocation}!\nWhile you are meditating, we recommend listening to the following song:`}
            </Text>
            <Text
                onPress={() => Linking.openURL(trackUrl)}
                style={{
                    color: "white"
                }}
            >
                {`${trackName} by ${trackArtist}`}
            </Text>

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
