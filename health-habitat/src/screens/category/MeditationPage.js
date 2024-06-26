import React, { useEffect, useState } from "react";
import { StyleSheet, View, Linking, Image } from "react-native";
import { Text } from "react-native-paper";
import Button from "../../components/Button";
import Background from "../../components/Background";
import BackButton from "../../components/BackButton";
import Header from "../../components/Header";
import ProgressBar from "../../components/ProgressBar";
import { theme } from "../../core/theme";
import * as getUserData from "../../api/get-user-data";
import { auth } from "../../core/config";
import { incrementMeditationScore } from "../../api/score-categories";
import { getRecommendationLocation } from "../../api/task-recommendation";

export default function MeditationPage({ navigation }) {
    const [meditationScore, setMeditationScore] = useState(0);
    const [trackUrl, setTrackUrl] = useState("");
    const [meditationLocation, setMeditationLocation] = useState("");
    const [trackName, setTrackName] = useState("");
    const [trackArtist, setTrackArtist] = useState("");

    const handleMeditationCompletion = async () => {
        console.log("Meditation Task Completed");
        await incrementMeditationScore();
        const userDoc = await getUserData.getUserDocument(
            auth.currentUser.email
        );

        let meditationScore = await userDoc.get("meditationScore");
        let newTrackUrl = await userDoc.get("meditationTask")[0];
        let meditationLocation = await getRecommendationLocation();
        let trackName = await getUserData.getTrackAndArtist(newTrackUrl)[0];
        let trackArtist = await getUserData.getTrackAndArtist(newTrackUrl)[1];

        setMeditationScore(meditationScore);
        setTrackUrl(newTrackUrl);
        setMeditationLocation(meditationLocation);
        setTrackName(trackName);
        setTrackArtist(trackArtist);
    };

    useEffect(() => {
        async function wrapperFunc() {
            const userDoc = await getUserData.getUserDocument(
                auth.currentUser.email
            );

            let meditationScore = await userDoc.get("meditationScore");
            console.log("SCORE IS", meditationScore);
            setMeditationScore(meditationScore);
            let meditationTask = await userDoc.get("meditationTask");
            console.log("TASK IS", meditationTask);
            console.log(meditationTask[0]);
            setTrackUrl(meditationTask[0]);
            let location = await getRecommendationLocation();
            setMeditationLocation(location);
            console.log("FINAL URL IS", meditationTask[0]);
            let trackInfo = await getUserData.getTrackAndArtist(
                meditationTask[0]
            );
            setTrackName(trackInfo[0]);
            setTrackArtist(trackInfo[1]);
        }
        wrapperFunc();
    }, [trackUrl]);

    return (
        <Background color={theme.colors.tealGradient}>
            <BackButton goBack={() => navigation.goBack()} />
            <Header props={"Meditation Details"} />
            <View style={styles.categoryOverview}>
                <ProgressBar
                    step={parseInt(meditationScore)}
                    numberOfSteps={100}
                    color={theme.colors.blueGradient}
                />
            </View>

            <Text style={styles.meditationText}>
                {`Let's go meditate in a `}
                <Text style={[styles.song, { textDecorationLine: "none" }]}>
                    {meditationLocation}
                </Text>
                {`\nWhile you are meditating, we recommend listening to the following song:`}
            </Text>
            <Text onPress={() => Linking.openURL(trackUrl)} style={styles.song}>
                {`${trackName} by ${trackArtist}`}
            </Text>

            <Button
                mode="contained"
                onPress={handleMeditationCompletion}
                style={{ marginTop: 24 }}
            >
                COMPLETED
            </Button>

            <Text style={styles.creditText}>
                Credits to Last.fm API for song track information!
            </Text>
            <Text style={styles.creditText}>
                Weather data provided by 
                <Text
                    style={{ textDecorationLine: "underline", 
                             color: "white"
                           }}
                    onPress={() =>
                        Linking.openURL("https://openweathermap.org/")
                    }
                >
                    {` OpenWeather!`}
                </Text>
                <Image source={require('../../assets/OpenWeather-Master-LogoRGB.png')} style={styles.openWeatherLogo}/>
            </Text>
        </Background>
    );
}

const styles = StyleSheet.create({
    categoryOverview: {
        flexDirection: "row",
        width: "100%",
        marginVertical: 5,
    },
    categoryIcon: {
        width: "50",
        height: "50",
    },
    listItem: {
        alignSelf: "center",
        borderColor: theme.colors.blue,
        borderRadius: 10,
        borderWidth: 2,
        height: "100%",
        marginBottom: 20,
        width: "100%",
        flexDirection: "row",
    },
    itemText: {
        flexDirection: "column",
        width: "100%",
    },
    itemName: {
        color: "white",
        fontSize: 25,
        textAlign: "center",
        width: "100%",
    },
    itemDescription: {
        color: "white",
        fontSize: 20,
        padding: 10,
        marginVertical: 10,
        marginHorizontal: 10,
        // flexDirection: 'column',
        width: "100%",
    },
    completedButton: {
        color: "white",
        fontSize: 20,
        alignItems: "flex-end",
        textAlign: "center",
        width: "100%",
    },
    meditationText: {
        color: theme.lgText.color,
        fontSize: theme.lgText.fontSize,
        letterSpacing: theme.lgText.letterSpacing,
        width: "100%",
        textAlign: "center",
    },
    song: {
        color: theme.colors.lightBlue,
        fontSize: theme.lgText.fontSize,
        letterSpacing: theme.lgText.letterSpacing,
        width: "100%",
        textAlign: "center",
        textDecorationLine: "underline",
        marginTop: 10,
        fontWeight: "bold",
    },
    creditText: {
        color: theme.smText.color,
        fontSize: theme.smText.fontSize,
        letterSpacing: theme.smText.letterSpacing,
        marginTop: 10,
        textAlign: "center",
        justifyContent: "center",
        alignContent: "center",
        verticalAlign: "center",
        display: 'flex'
    },
    openWeatherLogo:{
        width: 35,
        height: 12.5,
        alignSelf: "center",
    }
});
