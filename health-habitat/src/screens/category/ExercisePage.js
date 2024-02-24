
import React, {useEffect, useState} from 'react'
import {StyleSheet, View, TouchableOpacity, FlatList} from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../../components/Background'
import BackButton from '../../components/BackButton'
import Header from '../../components/Header'
import ProgressBar from '../../components/ProgressBar'
import {theme} from "../../core/theme";


export default function ExercisePage({navigation}) {


    // TODO : update user database and remove onclick functionality
    const handleExerciseCompletion = async (recipeId) => {
        setWelcomeMessage(wMessages[0])
    }

    // TODO : query data
    const exerciseScore = 75

    // TODO : query data
    const exerciseData = [
        {id: 0, name: 'exercise1', description: 'do smth'},
        {id: 1, name: 'exercise2', description: 'do more smth'},
    ]



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
        <Background color={theme.colors.tealGradient}>
            <BackButton goBack={() => navigation.goBack()}/>
            <Header props={welcomeMessage}/>
            <View style={styles.categoryOverview}>
                {/*<Image*/}
                {/*    style={styles.categoryIcon}*/}
                {/*    source={{*/}
                {/*        // TODO : find such image*/}
                {/*        uri: ''*/}
                {/*    }}*/}
                {/*/>*/}
                <ProgressBar step={exerciseScore} numberOfSteps={100}/>
            </View>
            <FlatList
                data={exerciseData}
                renderItem={({exerciseItem}) => (
                    <View style={styles.listItem}>
                        <View>
                            <Text>{exerciseItem.name}</Text>
                            <Text>{exerciseItem.description}</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleExerciseCompletion(exerciseItem.id)}>
                            <Text style={styles.completedButton}>{"completed!"}</Text>
                        </TouchableOpacity>
                    </View>
                )}
                keyExtractor={exerciseItem => exerciseItem.id}
            />
        </Background>
    );
}

const styles = StyleSheet.create({
    categoryOverview: {
        flexDirection: 'row'
    },
    categoryIcon: {
        width: '50',
        height: '50'
    },
    listItem: {
        fontSize: 12,
        padding: 10,
        marginVertical: 10,
        marginHorizontal: 10,
        flexDirection: 'row'
    },
    itemDescription: {
        fontSize : 12,
        padding: 10,
        marginVertical: 10,
        marginHorizontal: 10,
        flexDirection: 'column'
    },
    completedButton: {
        fontSize : 12,
        textAlign: 'center'
    }
});
