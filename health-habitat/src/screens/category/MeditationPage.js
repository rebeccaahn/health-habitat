
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
    const handleMeditationCompletion = async (meditationId) => {
        setWelcomeMessage(wMessages[0])
    }

    // TODO : query data
    const meditationScore = 75

    // TODO : query data
    const meditationData = [
        {id: 0, name: 'meditation1', description: 'listen to smth'},
        {id: 1, name: 'exercise2', description: 'do more listening'},
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
            <Header props={'Your meditation details:'}/>
            <View style={styles.categoryOverview}>
                {/*<Image*/}
                {/*    style={styles.categoryIcon}*/}
                {/*    source={{*/}
                {/*        // TODO : find such image*/}
                {/*        uri: ''*/}
                {/*    }}*/}
                {/*/>*/}
                <ProgressBar step={meditationScore} numberOfSteps={100}/>
            </View>
            <FlatList style={{width: '100%'}}
                      data={meditationData}
                      renderItem={({item}) => (
                          <View style={styles.listItem}>
                              <View styles={styles.itemText}>
                                  <Text style={styles.itemName}>{item.name}</Text>
                                  <Text style={styles.itemDescription}>{item.description}</Text>
                              </View>
                              <TouchableOpacity styles={{width: '25%'}} onPress={() => handleMeditationCompletion(item.id)}>
                                  <Text style={styles.completedButton}>{"completed!"}</Text>
                              </TouchableOpacity>
                          </View>
                      )}
                      keyExtractor={item => item.id}
            />
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
