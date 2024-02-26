
// TODO

// modify imports
// make MinimizeButton

// how to make category scores automatically decrease by a certain amount each day
// how to generate different colors for each list item
// how to not have View elements nested five layers T_T


import React, {useEffect, useState} from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../../components/Background'
// import Button from '../../components/Button'
import BackButton from '../../components/BackButton'
import Header from '../../components/Header'
// import TextInput from '../../components/TextInput'
// import Toast from '../../components/Toast'
// import PlainText from '../../components/PlainText'
// import { theme } from '../../core/theme'
import ProgressBar from '../../components/ProgressBar'
import {theme} from "../../core/theme";


export default function CategoriesPage({navigation}) {

    // TODO : query data
    const dietScore = 25
    const meditationScore = 50
    const exerciseScore = 75
    const numDietTasks = 1
    const numMeditationTasks = 2
    const numExerciseTasks = 3



    //

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
    }, []);

    return (
        <Background color={theme.colors.darkGreenGradient}>
            <BackButton goBack={() => navigation.goBack()}/>
            <Header props={welcomeMessage} />
            <Header props={"Your health overview:"}/>

            <TouchableOpacity style={styles.categoryOverview} onPress={() => navigation.navigate('DietPage')}>
                    <View style={styles.categoryLeft}>
                        <View style={styles.categoryOverview}>
                            {/*<Image*/}
                            {/*    style={styles.categoryIcon}*/}
                            {/*    source={{*/}
                            {/*        // TODO : find such image*/}
                            {/*        uri : ''*/}
                            {/*    }}*/}
                            {/*/>*/}
                            <Text style={styles.catText}>Diet</Text>
                        </View>
                        <ProgressBar step={dietScore} numberOfSteps={100} />
                    </View>
                    <View style={styles.categoryRight}>
                        <Text style={styles.catText}>suggestions</Text>
                        <Text style={styles.catText}>{numDietTasks}</Text>
                    </View>
            </TouchableOpacity>


            <TouchableOpacity style={styles.categoryOverview} onPress={() => navigation.navigate('MeditationPage')}>
                    <View style={styles.categoryLeft}>
                        <View style={styles.categoryOverview}>
                            {/*<Image*/}
                            {/*    style={styles.categoryIcon}*/}
                            {/*    source={{*/}
                            {/*        // TODO : find such image*/}
                            {/*        uri : ''*/}
                            {/*    }}*/}
                            {/*/>*/}
                            <Text style={styles.catText}>Meditation</Text>
                        </View>
                        <ProgressBar step={meditationScore} numberOfSteps={100} />
                    </View>
                    <View style={styles.categoryRight}>
                        <Text style={styles.catText}>suggestions</Text>
                        <Text style={styles.catText}>{numMeditationTasks}</Text>
                    </View>
            </TouchableOpacity>


            <TouchableOpacity style={styles.categoryOverview} onPress={() => navigation.navigate('ExercisePage')}>
                    <View style={styles.categoryLeft}>
                        <View style={styles.categoryOverview}>
                            {/*<Image*/}
                            {/*    style={styles.categoryIcon}*/}
                            {/*    source={{*/}
                            {/*        // TODO : find such image*/}
                            {/*        uri : ''*/}
                            {/*    }}*/}
                            {/*/>*/}
                            <Text style={styles.catText}>Exercise</Text>
                        </View>
                        <ProgressBar step={exerciseScore} numberOfSteps={100} />
                    </View>
                    <View style={styles.categoryRight}>
                        <Text style={styles.catText}>suggestions</Text>
                        <Text style={styles.catText}>{numExerciseTasks}</Text>
                    </View>
            </TouchableOpacity>

        </Background>
    )

}

const styles = StyleSheet.create({
    categoryOverview: {
        flexDirection: 'row',
        width: '100%',
        height: '25%'
    },
    categoryLeft: {
        flexDirection: 'column',
        width: '25%',
    },
    categoryRight: {
        flexDirection: 'column',
        width: '100%',
    },
    categoryIcon: {
        width: '50',
        height: '50'
    },
    catText: {
        width: '100%',
        color: 'white',
        fontSize: 20,
        textAlign: 'center'
    }
});
