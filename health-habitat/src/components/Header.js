import React from 'react'
import { StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import { theme } from '../core/theme'

export default function Header({ style, props }) {
  return <Text style={[style, styles.header]}>{props}</Text>
}

const styles = StyleSheet.create({
  header: {
    color: theme.lgText.color,
    fontSize: 40,
    fontWeight: 'bold',
    letterSpacing: theme.lgText.letterSpacing,
    paddingVertical: 12
  }
})