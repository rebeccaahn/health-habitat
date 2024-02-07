import React from 'react'
import { ActivityIndicator } from 'react-native'
import firebase from 'firebase/app'
import { auth } from '../../../App'
import Background from '../../components/Background'
import { theme } from '../../core/theme'

export default function AuthLoadingScreen({ navigation }) {
  auth.onAuthStateChanged((user) => {
    if (user) {
      // User is logged in
      navigation.reset({
        index: 0,
        routes: [{ name: 'TerrariumScreen' }],
      })
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