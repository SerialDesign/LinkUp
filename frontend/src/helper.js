import { Alert } from 'react-native'

export function checkIfUserIdHasValue(user) {
  // 👇️ Check if user undefined or null
  if (user === undefined || user === null) {
    Alert.alert(
      'Sorry. Ein Fehler (UserID nicht bekannt) ist aufgetreten. Bitte kontaktiere Cyrill Wyrsch'
    )
  }
}
