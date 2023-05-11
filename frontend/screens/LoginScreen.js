import React from 'react'
import { ScrollView, Text, StyleSheet, TextInput } from 'react-native'
import { Button } from '@rneui/base'
import { Alert } from 'react-native'

export default function LoginScreen() {
  const [user, onChangeUser] = React.useState('')

  const login = () => {
    Alert.alert('Logging in as user.. ', user)
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Welcome to LinkUp</Text>
      <Text style={styles.regularText}>Login to continue </Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeUser}
        value={user === '' ? null : user}
        placeholder="username"
      />
      <Button onPress={login}>Login</Button>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerText: {
    padding: 40,
    fontSize: 30,
    color: '#EDEFEE',
    textAlign: 'center'
  },
  regularText: {
    fontSize: 24,
    padding: 20,
    marginVertical: 8,
    color: '#EDEFEE',
    textAlign: 'center'
  },

  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: 'white'
  }
})
