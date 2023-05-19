import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import WelcomeScreen from './screens/components/templates/WelcomeScreen'
import Header from './screens/components/Header'
import CreateLibrary from './screens/CreateLibrary'
import AddLink from './screens/AddLink'
import LoginScreen from './screens/LoginScreen'
import { useState } from 'react'
import Homescreen from './screens/Homescreen'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#11aa11'
          },
          headerTintColor: '#fff'
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        {/* name = Aufruf in LoginScreen, nun abgeändert in Homescreen und mit options Title vergeben, damit code einheitlich in English
         <Stack.Screen name="Linksammlungen" component={Homescreen} /> */}
        <Stack.Screen
          name="Homescreen"
          options={{ title: 'Linksammlungen' }}
          component={Homescreen}
        />
      </Stack.Navigator>
    </NavigationContainer>

    // <SafeAreaProvider>
    //   <View
    //     style={{
    //       flex: 1,
    //       backgroundColor: 'white'
    //     }}
    //   >
    //     <Header />
    //     {/* <CreateLibrary /> */}
    //     {/* <AddLink /> */}
    //     {/* <LoginScreen /> */}
    //     <HomeScreenius />
    //   </View>
    //   {/* <View style={{ backgroundColor: "#495E57" }}><Header /></View> */}
    // </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
