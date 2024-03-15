import React, { useEffect, useState } from "react";
import { StyleSheet, View, Linking } from "react-native";
import { Text } from "react-native-paper";
import Button from "../../components/Button";
import Background from "../../components/Background";
import BackButton from "../../components/BackButton";
import Header from "../../components/Header";
import ProgressBar from "../../components/ProgressBar";
import { theme } from "../../core/theme";
import { incrementExerciseScore } from "../../api/score-categories";
import * as getUserData from "../../api/get-user-data";
import { auth } from "../../core/config";
import RenderHtml from 'react-native-render-html';

export default function ExercisePage({ navigation }) {
    const [exerciseScore, setExerciseScore] = useState(0);
    const [currentExercise, setCurrentExercise] = useState("");
    const [currentExerciseDescrip, setCurrentExerciseDescrip] = useState("");

    const handleExerciseCompletion = async () => {
        console.log("Exercise Task Completed");
        await incrementExerciseScore();
        const userDoc = await getUserData.getUserDocument(auth.currentUser.email);

        let newExerciseScore = await userDoc.get("exerciseScore");
        setExerciseScore(newExerciseScore);
        let newExerciseTask = await userDoc.get("exerciseTask");
        console.log('Exercise Task:', newExerciseTask);
        setCurrentExercise(newExerciseTask.name)
        setCurrentExerciseDescrip(newExerciseTask.description)
    };

    useEffect(() => {
        async function wrapperFunc() {
            const userDoc = await getUserData.getUserDocument(auth.currentUser.email);
            let exerciseScore = await userDoc.get("exerciseScore");
            setExerciseScore(exerciseScore);
            let exerciseTask = await userDoc.get("exerciseTask");
            setCurrentExercise(exerciseTask.name);
            setCurrentExerciseDescrip(exerciseTask.description);
        }
        wrapperFunc();
    }, []);

    return (
        <Background color={theme.colors.brownGradient}>
            <BackButton goBack={() => navigation.goBack()} />
            <Header props={"Exercise Details"} />
            <View style={styles.categoryOverview}>
                <ProgressBar
                    step={parseInt(exerciseScore)}
                    numberOfSteps={100}
                    color={theme.colors.orangeGradient}
                />
            </View>

            <Text style={styles.exercise}>{currentExercise}</Text>
            <View style={[styles.exerciseDescrip, theme.shadow]}>
                <RenderHtml tagStyles={{ p: { color: '#FFFFFF' }, body: { color: '#FFFFFF' } }} source={{ html: currentExerciseDescrip }} />
            </View>

            <Button
                mode="contained"
                onPress={handleExerciseCompletion}
                style={{ marginTop: 24 }}
            >
                COMPLETED
            </Button>

            <Text style={styles.creditText}>Credits to wger API for exercise sets!</Text>
            <Text style={styles.creditText}>Credits to Akash Joshi for the dataset on <Text
                style={[styles.creditText, {
                    textDecorationLine: "underline"
                }]}
                onPress={() =>
                    Linking.openURL("https://www.kaggle.com/datasets/aakashjoshi123/exercise-and-fitness-metrics-dataset")
                }
            >
                Kaggle!
            </Text></Text>
        </Background>
    );
}

const styles = StyleSheet.create({
    categoryOverview: {
        flexDirection: "row",
        width: "100%",
        marginVertical: 5
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
        width: "100%",
    },
    completedButton: {
        color: "white",
        fontSize: 20,
        alignItems: "flex-end",
        textAlign: "center",
        width: "100%",
    },
    exercise: {
        color: theme.colors.lightBlue,
        fontSize: theme.lgText.fontSize,
        letterSpacing: theme.lgText.letterSpacing,
        width: '100%',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    exerciseDescrip: {
        opacity: .7,
        backgroundColor: 'white',
        borderRadius: 20,
        color: theme.lgText.color,
        fontSize: theme.lgText.fontSize,
        textAlign: 'center',
        marginVertical: 15,
        padding: 15,
        paddingVertical: 25
    },
    creditText: {
        color: theme.smText.color,
        fontSize: theme.smText.fontSize,
        letterSpacing: theme.smText.letterSpacing,
        marginTop: 10
    }
});
