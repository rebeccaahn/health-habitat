import React from 'react'
import { StyleSheet, KeyboardAvoidingView } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { theme } from '../core/theme'

export default function Background({ color, children }) {
  return (
        <KeyboardAvoidingView style={styles.background}>
          <LinearGradient colors={color} style={styles.container} behavior="padding">
            {children}
          </LinearGradient>
        </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
      background: {
        height: '100%',
        width: '100%',
      },
      container: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: theme.colors.surface,
        flex: 1,
        justifyContent: 'center',
        padding: 35,
        width: '100%'
      }
})