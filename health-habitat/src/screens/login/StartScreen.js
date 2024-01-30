import React from 'react'
import Background from '../../components/Background'
import Button from '../../components/Button'
import Header from '../../components/Header'

export default function StartScreen({ navigation }) {
  return (
    <Background>
        <Header>Health Habitat</Header>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('LoginScreen')}
      >
        LOGIN
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('RegisterScreen')}
      >
        SIGN UP
      </Button>
    </Background>
  )
}