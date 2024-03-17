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
        async function wrapperFunc() {
        const userDoc = await getUserDocument(auth.currentUser.email);
        if (userDoc == undefined) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'QuestionnaireScreen' }],
          })
          // throw Error("User must complete questionnaire");
          return;
        }
        console.log('value', userDoc.data());
        // user has completed questionnaire
        navigation.reset({
          index: 0,
          routes: [{ name: 'TerrariumScreen' }],
        })
      }
      wrapperFunc()
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