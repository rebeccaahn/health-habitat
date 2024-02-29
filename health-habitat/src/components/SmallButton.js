import React from 'react'
import { StyleSheet } from 'react-native'
import { Button as PaperButton } from 'react-native-paper'
import { theme } from '../core/theme'

export default function Button({ mode, style, ...props }) {
  return (
    <PaperButton
      style={[
        styles.button,
        mode === 'outlined' && { backgroundColor: theme.colors.darkGreen},
        style, theme.shadow
      ]}
      labelStyle={[styles.text, mode === 'outlined' && { color: theme.colors.primary }]}
      mode={mode}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
      button: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
        borderRadius: 7.5,
        marginVertical: 10,
        width: '100%'
      },
      text: {
        color: theme.smText.color,
        fontWeight: 'bold',
        fontSize: theme.smText.fontSize,
        lineHeight: 26,
        letterSpacing: theme.smText.letterSpacing
      }
})