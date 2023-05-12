import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { Button, Text, Input } from '@rneui/base'
import { Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'

export default function LoginScreen() {
  const [user, onChangeUser] = React.useState('')

  const navigation = useNavigation()
  const login = () => {
    // Alert.alert('Logging in as user.. ', user)

    navigation.navigate('Message', {
      user
    })
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Welcome to LinkUp</Text>
      <Text style={styles.regularText}>Login to continue </Text>
      <Input
        style={styles.input}
        onChangeText={onChangeUser}
        value={user === '' ? null : user}
        placeholder="username"
      />
      {/* <Button onPress={() => login()}>Login</Button> */}
      <Button styles={styles.buttonx} onPress={login}>
        Linksammlungen anzeigen
      </Button>
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
    color: '#11aa11',
    textAlign: 'center'
  },
  regularText: {
    fontSize: 24,
    padding: 20,
    marginVertical: 8,
    color: '#11aa11',
    textAlign: 'center'
  },

  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: 'white'
  },

  buttonx: {
    backgroundColor: '#11aa11'
  }
})
