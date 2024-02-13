import React from 'react'
import { StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../../components/Background'
import Button from '../../components/Button'
import Header from '../../components/Header'
import Logo from '../../components/Logo'
import { theme } from '../../core/theme'

export default function StartScreen({ navigation }) {
  return (
    <Background color={theme.colors.darkGreenGradient}>
      <Logo />
        <Header props="Welcome"></Header>
        <Text style={styles.descrip}>Start your wellness journey with Health Habitat</Text>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('LoginScreen')}
      >
        LOGIN
      </Button>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('RegisterScreen')}
      >
        SIGN UP
      </Button>
    </Background>
  )
}

const styles = StyleSheet.create({
  descrip: {
    color: theme.lgText.color,
    fontSize: theme.lgText.fontSize,
    letterSpacing: theme.lgText.letterSpacing,
    lineHeight: 26,
    textAlign: 'center',
    paddingBottom: 125
  }
})