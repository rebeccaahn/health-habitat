import React from 'react'
import { StyleSheet, KeyboardAvoidingView } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { theme } from '../core/theme'

export default function Background({ children }) {
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      {children}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
      container: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: theme.colors.surface,
        flex: 1,
        justifyContent: 'center',
        padding: 30,
        width: '100%'
      }
})