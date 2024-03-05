
import React, {useEffect, useState} from 'react'
import {StyleSheet, View, TouchableOpacity} from 'react-native'
import { Text } from 'react-native-paper'
import Button from '../../components/Button'
import Background from '../../components/Background'
import BackButton from '../../components/BackButton'
import Header from '../../components/Header'
import ProgressBar from '../../components/ProgressBar'
import {theme} from "../../core/theme";


// TODO : import getDietScore(), updateDietScore(), getDietTask(), markDietTaskComplete()
// from ../../api/score-categories.js

// TODO : make environmental variable for recipe API key

export default function DietPage({navigation}) {


    // TODO : update database category score + dietTask, reload page
    const handleDietCompletion = () => {

    }

    // TODO : getDietScore()
    const dietScore = 25

    // TODO : call recipe API to retrieve recipe card using query from getDietTask()


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
        <Background color={theme.colors.blueGradient}>
            <BackButton goBack={() => navigation.goBack()}/>
            <Header props={welcomeMessage}/>
            <Header props={'Your diet details:'}/>
            <View style={styles.categoryOverview}>
                <ProgressBar step={dietScore} numberOfSteps={100}/>
            </View>



            <Button
                mode="contained"
                onPress={handleDietCompletion()}
                style={{ marginTop: 24 }}
            >
                completed!
            </Button>

            {/*<FlatList style={{width: '100%'}}*/}
            {/*          data={dietData}*/}
            {/*          renderItem={({item}) => (*/}
            {/*              <View style={styles.listItem}>*/}
            {/*                  <View styles={styles.itemText}>*/}
            {/*                      <Text style={styles.itemName}>{item.name}</Text>*/}
            {/*                      <Text style={styles.itemDescription}>{item.description}</Text>*/}
            {/*                  </View>*/}
            {/*                  <TouchableOpacity styles={{width: '25%'}} onPress={() => handleDietCompletion(item.id)}>*/}
            {/*                      <Text style={styles.completedButton}>{"completed!"}</Text>*/}
            {/*                  </TouchableOpacity>*/}
            {/*              </View>*/}
            {/*          )}*/}
            {/*          keyExtractor={item => item.id}*/}
            {/*/>*/}
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
