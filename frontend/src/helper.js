import { Alert } from 'react-native'
import { Text } from '@rneui/base'

export function checkIfUserIdHasValue(user) {
  // 👇️ Check if user undefined or null
  if (user === undefined || user === null) {
    Alert.alert(
      'Sorry. Ein Fehler (UserID nicht bekannt) ist aufgetreten. Bitte kontaktiere Cyrill Wyrsch'
    )
  }
}

export function getRandomColor() {
  const colors = [
    '#FAFAA0',
    '#CFECFE',
    '#C0E5C6',
    '#EFE0FF',
    '#FEE7EF',
    '#F0F3E0',
    '#DAF7A6'
    // '#011627' too dark..
  ]

  return colors[Math.floor(Math.random() * colors.length)]
}

// hack for making bold text in Text component
export const B = (props) => <Text style={{ fontWeight: 'bold' }}>{props.children}</Text>
