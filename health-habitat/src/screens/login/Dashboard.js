import React from 'react'
import Background from '../../components/Background'
// import Logo from '../../components/Logo'
import Header from '../../components/Header'
import Paragraph from '../../components/Paragraph'
import Button from '../../components/Button'
import { logoutUser } from '../../api/auth-api'
import { theme } from '../../core/theme'

export default function Dashboard() {
  return (
    <Background color={theme.colors.darkGreenGradient}>
      {/* <Logo /> */}
      <Header>Let’s start</Header>
      <Paragraph>
        Your amazing app starts here. Open you favorite code editor and start
        editing this project.
      </Paragraph>
      <Button mode="outlined" onPress={logoutUser}>
        Logout
      </Button>
    </Background>
  )
}