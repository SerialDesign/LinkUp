import { Alert } from 'react-native'

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
    '#FEFFE0',
    '#CFECFE',
    '#C0E5C6',
    '#EFE0FF',
    '#FEE7EF',
    '#FEFFE0',
    '#DAF7A6'
    // '#011627'
  ]

  return colors[Math.floor(Math.random() * colors.length)]
}
