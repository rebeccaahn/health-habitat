
import React, {useEffect, useState} from 'react'
import {StyleSheet, View, TouchableOpacity, FlatList} from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../../components/Background'
import BackButton from '../../components/BackButton'
import Header from '../../components/Header'
import ProgressBar from '../../components/ProgressBar'
import {theme} from "../../core/theme";


export default function MeditationPage({navigation}) {


    // TODO : update user database and remove onclick functionality
    const handleMeditationCompletion = async (recipeId) => {
        setWelcomeMessage(wMessages[0])
    }

    // TODO : query data
    const meditationScore = 75

    // TODO : query data
    const meditationData = [
        {id: 0, name: 'meditation1', description: 'do smth'},
        {id: 1, name: 'meditation2', description: 'eat eat'},
        {id: 2, anme: 'meditation3', description: 'listen to this!'}
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
        <Background color={theme.colors.brownGradient}>
            <BackButton goBack={() => navigation.goBack()}/>
            <Header props={welcomeMessage} />
            <View style={styles.categoryOverview}>
                {/*<Image*/}
                {/*    style={styles.categoryIcon}*/}
                {/*    source={{*/}
                {/*        // TODO : find such image*/}
                {/*        uri : ''*/}
                {/*    }}*/}
                {/*/>*/}
                <ProgressBar step={meditationScore} numberOfSteps={100} />
            </View>
            <FlatList
                data={meditationData}
                renderItem={({meditationItem}) => (
                    <View style={styles.listItem}>
                        <View>
                            <Text>{meditationItem.name}</Text>
                            <Text>{meditationItem.description}</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleMeditationCompletion(recipeItem.id)}>
                            <Text style={styles.completedButton}>{"completed!"}</Text>
                        </TouchableOpacity>
                    </View>
                )}
                keyExtractor={meditationItem => meditationItem.id}
            />
        </Background>
    )
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
