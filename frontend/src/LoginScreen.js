import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Button, Text, Input, Image, Switch } from '@rneui/base'
import { Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useColorScheme } from 'nativewind'
import { StatusBar } from 'expo-status-bar'

export default function LoginScreen() {
  const [user, onChangeUser] = React.useState('')
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
      user
    })
  }

  return (
    <View className="justify-center flex-1 p-5 bg-white dark:bg-black">
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
        value={user === '' ? null : user}
        placeholder="username"
        focused={true}
        ref={loginLibRef}
        onSubmitEditing={login}
      />
      {/* <Button onPress={() => login()}>Login</Button> */}
      <Button
        buttonStyle={{
          backgroundColor: '#13C66A',
          borderColor: 'transparent',
          borderRadius: 30
        }}
        onPress={login}
      >
        Linksammlungen anzeigen
      </Button>
      <Text style={{ marginTop: 100 }} className="text-2xl">
        Darkmode
      </Text>
      <Switch value={colorScheme === 'dark'} onChange={toggleColorScheme} />
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </View>
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
  }
})
