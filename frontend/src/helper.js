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

// Get a random color for the library card background
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

// Check if a library is valid
export const validateLibrary = (libraryName, libraryDesc) => {
  const errors = []

  if (libraryName.length > 23) {
    errors.push('Der Name der Linksammlung darf nicht mehr als 23 Zeichen enthalten.')
  }

  if (libraryDesc.length > 200) {
    errors.push('Die Beschreibung der Linksammlung darf nicht mehr als 200 Zeichen enthalten.')
  }

  const isValid = errors.length === 0

  return { isValid, errors }
}

// Check if an URL is valid
export const isValidURL = (url) => {
  const regex =
    /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i
  if (!regex.test(url.toLowerCase())) {
    Alert.alert('Sorry!', 'Bitte eine gültige URL eingeben')
    return false
  }
  if (!url.toLowerCase().startsWith('https://')) {
    Alert.alert('Sorry!', 'Die URL muss mit https:// beginnen')
    return false
  }
  return true
}
