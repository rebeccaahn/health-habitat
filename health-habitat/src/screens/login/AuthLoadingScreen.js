import React from 'react'
import { ActivityIndicator } from 'react-native'
import Background from '../../components/Background'
import { getUserDocument } from '../../api/get-user-data'
import { theme } from '../../core/theme'
import { auth } from '../../core/config';

export default function AuthLoadingScreen({ navigation }) {
  auth.onAuthStateChanged((user) => {
    console.log('user:', user);
    if (user) {
      // User is logged in
      try {
        getUserDocument(auth.currentUser.email).then((value) => {
          console.log('value', value.data());
          // user has completed questionnaire
          navigation.reset({
            index: 0,
            routes: [{ name: 'TerrariumScreen' }],
          })
        });
      } catch (error) {
        // user has not completed questionnaire yet
        navigation.reset({
          index: 0,
          routes: [{ name: 'QuestionnaireScreen' }],
        })
      }
    } else {
      // User is not logged in
      navigation.reset({
        index: 0,
        routes: [{ name: 'StartScreen' }],
      })
    }
  })

  return (
    <Background color={theme.colors.darkGreenGradient}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </Background>
  )
}