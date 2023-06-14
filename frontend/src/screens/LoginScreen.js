import React from 'react'
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native'
import { Button, Text, Input, Image, Switch } from '@rneui/base'
import { useNavigation } from '@react-navigation/native'
import { useColorScheme } from 'nativewind'
import { StatusBar } from 'expo-status-bar'

export default function LoginScreen() {
  const [userId, onChangeUser] = React.useState('')
  const loginLibRef = React.useRef()
  const { colorScheme, toggleColorScheme } = useColorScheme()

  React.useEffect(() => {
    setTimeout(() => {
      loginLibRef.current?.focus()
    }, 0)
  }, [])

  const navigation = useNavigation()
  const login = () => {
    // Alert.alert('Logging in as user.. ', user)
    navigation.navigate('Homescreen', {
      userId
    })
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.content} className="justify-center flex-1 p-5 bg-white dark:bg-black">
        <Image
          source={{
            uri: 'https://www.onlinelogomaker.com/applet_userdata/version2/d/d/36559316/projects/36559316.png'
            //uri: 'https://www.onlinelogomaker.com/logomaker/?project=18555730'
          }}
          style={{
            height: 200
          }}
          resizeMode="stretch"
        />
        {/* <Text style={styles.regularText}>Log dich ein um fortzufahren</Text> */}
        <Input
          style={styles.input}
          onChangeText={onChangeUser}
          value={userId === '' ? null : userId}
          placeholder="username"
          focused={true}
          ref={loginLibRef}
          onSubmitEditing={login}
        />
        {/* <Button onPress={() => login()}>Login</Button> */}
        <Button buttonStyle={styles.greenButton} onPress={login}>
          Linksammlungen anzeigen
        </Button>
        {/* <Text style={{ marginTop: 100 }} className="text-2xl">
          Darkmode
        </Text>
        <Switch value={colorScheme === 'dark'} onChange={toggleColorScheme} />
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} /> */}
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'white'
    // ...other styles you have
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: 'white'
  },
  greenButton: {
    backgroundColor: '#13C66A',
    borderColor: 'transparent',
    borderRadius: 30
  }
})
