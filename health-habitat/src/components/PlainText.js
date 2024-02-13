import React from 'react'
import { StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import { theme } from '../core/theme'

export default function PlainText({ style, props }) {
  return <Text style={[style, theme.smText]}>{props}</Text>
}