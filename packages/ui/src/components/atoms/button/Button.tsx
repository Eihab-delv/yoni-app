import React from 'react'
import { TouchableOpacity, Text } from 'react-native-web'

export interface ButtonProps {
  text: string
  onPress: () => void
}

export function Button(props: ButtonProps) {
  return (
    <TouchableOpacity
      onClick={props.onPress}
      style={{
        borderRadius: 40,
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderColor: 'black',
        borderWidth: 0.5
      }}
    >
      <Text>{props.text}</Text>
    </TouchableOpacity>
  )
}
