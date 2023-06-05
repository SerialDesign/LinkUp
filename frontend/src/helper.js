import { Alert } from 'react-native'

export function checkIfUserIdHasValue(user) {
  // 👇️ Check if user undefined or null
  if (user === undefined || user === null) {
    Alert.alert('Sorry. Ein Fehler ist aufgetreten. Bitte kontaktiere Cyrill Wyrsch')
  }
}
