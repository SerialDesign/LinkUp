import React from 'react'
import { ScrollView, Text, StyleSheet, TextInput } from 'react-native'
import { Button } from '@rneui/base'
import { Alert } from 'react-native'

export default function LoginScreen() {
  const [user, onChangeUser] = React.useState('Username')
  const [password, onChangeNumber] = React.useState('')

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Welcome to LinkUp</Text>
      <Text style={styles.regularText}>Login to continue </Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeUser}
        value={user}
        placeholder="username"
        // keyboardType="numeric"
      />
      {/* <TextInput
        style={styles.input}
        onChangeText={onChangeNumber}
        value={password}
        placeholder="useless password"
        secureTextEntry="true"
      /> */}
      <Button onPress={login}>Login</Button>
    </ScrollView>
  )
}

const login = () => {
  Alert.alert('logging in as user.. ', user)
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
