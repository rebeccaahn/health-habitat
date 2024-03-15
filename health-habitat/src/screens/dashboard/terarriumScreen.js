import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Background from '../../components/Background'
// import Logo from '../../components/Logo'
import Header from '../../components/Header'
import Paragraph from '../../components/PlainText'
import Button from '../../components/Button'
import TerrariumImage from '../../components/TerrariumImage'
import ProgressBar from '../../components/ProgressBar'
import PlainText from '../../components/PlainText'
import { IconButton } from 'react-native-paper';
import { theme } from '../../core/theme'
import CategoriesPage from "../category/CategoriesPage";
import { logoutUser } from '../../api/auth-api';
import * as getUserData from "../../api/get-user-data";
import { auth } from "../../core/config";
import { useFocusEffect } from '@react-navigation/native'

const headings = ["Good Morning", "Good Afternoon", "Good Evening", "Good Night"];
const terrariumStates = ["Critical", "Warning", "Thriving", "Best"];
const terrariumDescriptions = {
    "Critical": "Your terrarium is in critical condition.\nPlease take action immediately.",
    "Warning": "Your terrarium needs some love.\nPlease take action soon.",
    "Healthy": "Your terrarium is thriving.\nKeep up the good work.",
    "Thriving": "Your terrarium is at its best.\nKeep up the good work."
}

export default function TerrariumScreen({navigation}) {

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                const userDoc = await getUserData.getUserDocument(auth.currentUser.email);
                let dietS = await userDoc.get("dietScore")
                let exerciseS = await userDoc.get("exerciseScore")
                let meditationS = await userDoc.get("meditationScore")
                let overallScore = (dietS + exerciseS + meditationS) / 3
                setScore(overallScore)
            };

            fetchData(); // Immediately invoke the async function

            return () => {
            // Cleanup function (optional)
            console.log('Cleanup function');
            };
        }, [])
    );
    
    const [terrariumState, setTerrariumState] = useState('');
    const [timeOfDay, setTimeOfDay] = useState('');
    const [backgroundColor, setBackgroundColor] = useState([]);
    const [buttonColor, setButtonColor] = useState('');

    const [score, setScore] = useState(0)

    useEffect(() => {
        async function wrapperFunc() {
        const userDoc = await getUserData.getUserDocument(auth.currentUser.email);

        let dietS = await userDoc.get("dietScore")
        let exerciseS = await userDoc.get("exerciseScore")
        let meditationS = await userDoc.get("meditationScore")

        let overallScore = (dietS + exerciseS + meditationS) / 3
        console.log(overallScore);
        setScore(overallScore)

        // Set the time of day
        const date = new Date();
        const hours = date.getHours();
        if (hours < 12) {
            setTimeOfDay(headings[0]);
            setBackgroundColor(theme.colors.brownGradient);
            setButtonColor(theme.colors.darkBrown)
        } else if (hours >= 12 && hours < 17) {
            setTimeOfDay(headings[1]);
            setBackgroundColor(theme.colors.tealGradient);
            setButtonColor(theme.colors.darkTeal)
        } else if (hours >= 17 && hours < 20) {
            setTimeOfDay(headings[2]);
            setBackgroundColor(theme.colors.blueGradient);
            setButtonColor(theme.colors.darkBlue)
        } else {
            setTimeOfDay(headings[3]);
            setBackgroundColor(theme.colors.darkBlueGradient);
            setButtonColor(theme.colors.darkestBlue)
        }

        // Set the terrarium state based on the score
        if (score < 25) {
            setTerrariumState(terrariumStates[0]);
        } else if (score < 50) {
            setTerrariumState(terrariumStates[1]);
        } else if (score < 75) {
            setTerrariumState(terrariumStates[2]);
        } else {
            setTerrariumState(terrariumStates[3]);
        }
    }
    wrapperFunc();
    }, []);
    return (
        <Background color={backgroundColor}>
            {/* <Logo /> */}
            <Header props={timeOfDay} />
            <Text style={[theme.lgText, { textAlign: 'center' }]}>{terrariumDescriptions[terrariumState]}</Text>
            <TerrariumImage state={terrariumState} />
            {/* <ProgressBar terrariumScore={score} /> */}
            <Text style={{color:'white', paddingBottom: 10, fontSize: 20, letterSpacing: 2}}>Health Score:</Text>
            <ProgressBar step={parseInt(score)} numberOfSteps={100} color={theme.colors.blueGradient} />
            <IconButton
                icon="plus"
                iconColor="white"
                containerColor={ buttonColor }
                mode="contained"
                size={45}
                onPress={() => navigation.navigate(CategoriesPage)}
                style={[ theme.shadow, { position: 'absolute', bottom: 50, elevation: 2} ]}
            />
            <IconButton
                icon="cog"
                iconColor="white"
                containerColor={ buttonColor }
                mode="contained"
                size={25}
                onPress={logoutUser}
                style={[ theme.shadow, { position: 'absolute', right: 20, bottom: 50, elevation: 2} ]}
            />
        </Background>
    )
}