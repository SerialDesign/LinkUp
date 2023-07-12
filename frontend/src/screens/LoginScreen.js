import React from 'react'
import { View, StyleSheet, KeyboardAvoidingView, Alert, Dimensions } from 'react-native'
import { Button, Text, Input, Image, Switch } from '@rneui/base'
import { useNavigation } from '@react-navigation/native'
import { useColorScheme } from 'nativewind'
import { StatusBar } from 'expo-status-bar'
import globalStyles from '../../assets/styles/globalStyles'

export default function LoginScreen() {
  const [userId, onChangeUser] = React.useState('')
  const loginLibRef = React.useRef()
  const { colorScheme, toggleColorScheme } = useColorScheme()
  const screenWidth = Dimensions.get('window').width

  React.useEffect(() => {
    setTimeout(() => {
      loginLibRef.current?.focus()
    }, 0)
  }, [])

  const navigation = useNavigation()

  const login = () => {
    if (userId.trim() === '') {
      Alert.alert('Fehler', 'Bitte einen Benutzernamen eingeben')
    } else {
      navigation.navigate('Homescreen', {
        userId
      })
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.content}>
        {/* <Text style={styles.title}>Willkommen!</Text> */}
        <Image
          source={require('../../assets/images/LinkUP_Logo.png')}
          style={{ ...styles.logo, width: screenWidth }}
          resizeMode="contain"
        />
        <Input
          style={globalStyles.primaryInput}
          onChangeText={onChangeUser}
          value={userId === '' ? null : userId}
          placeholder="Benutzernamen eingeben"
          focused={true}
          ref={loginLibRef}
          onSubmitEditing={login}
        />
        <Button buttonStyle={[globalStyles.primaryButton, globalStyles.width100]} onPress={login}>
          Linksammlungen anzeigen
        </Button>
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
    alignItems: 'center',
    paddingHorizontal: 16
  },
  // title: {
  //   fontSize: 30,
  //   fontWeight: 'bold',
  //   textAlign: 'center',
  //   marginBottom: 50
  // },
  logo: {
    height: 145,
    marginBottom: 20
  }
})
