import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Background from '../../components/Background'
// import Logo from '../../components/Logo'
import Header from '../../components/Header'
import Paragraph from '../../components/Paragraph'
import Button from '../../components/Button'
import TerrariumImage from '../../components/TerrariumImage'
import ProgressBar from '../../components/ProgressBar'
import { logoutUser } from '../../api/auth-api'
import { theme } from '../../core/theme'

const headings = ["Good Morning", "Good Afternoon", "Good Evening", "Good Night"];
const terrariumStates = ["Critical", "Warning", "Thriving", "Best"];
const terrariumDescriptions = {
    "Critical": "Your terrarium is in critical condition.\nPlease take action immediately.",
    "Warning": "Your terrarium needs some love.\nPlease take action soon.",
    "Healthy": "Your terrarium is thriving.\nKeep up the good work.",
    "Thriving": "Your terrarium is at its best.\nKeep up the good work."
}

export default function TerrariumScreen() {
    const score = 25;
    const [terrariumState, setTerrariumState] = useState('');
    const [timeOfDay, setTimeOfDay] = useState('');
    useEffect(() => {
        // Set the time of day
        const date = new Date();
        const hours = date.getHours();
        var timeOfDay = "";
        if (hours < 12) {
            timeOfDay = headings[0];
        } else if (hours >= 12 && hours < 17) {
            timeOfDay = headings[1];
        } else if (hours >= 17 && hours < 20) {
            timeOfDay = headings[2];
        } else {
            timeOfDay = headings[3];
        }
        setTimeOfDay(timeOfDay);

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
    }, []);
    return (
        <Background color={theme.colors.darkGreenGradient}>
            {/* <Logo /> */}
            <Header props={timeOfDay} />
            <Text style={{textAlign: 'center'}}>{terrariumDescriptions[terrariumState]}</Text>
            <TerrariumImage state={terrariumState} />
            {/* <ProgressBar terrariumScore={score} /> */}
            <ProgressBar step={50} numberOfSteps={100} />
            <Button mode="outlined" onPress={logoutUser}>
                Logout
            </Button>
        </Background>
    )
}