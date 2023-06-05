import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import WelcomeScreen from './src/components/templates/WelcomeScreen'
import Header from './src/components/Header'
import CreateLibrary from './src/screens/CreateLibrary'
import AddLink from './src/screens/AddLink'
import LoginScreen from './src/screens/LoginScreen'
import { useState } from 'react'
import Homescreen from './src/screens/Homescreen'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Library from './src/screens/Library'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import FooterNav from './src/FooterNav'
import ClipboardTest from './src/components/templates/ClipboardTest'

const Stack = createNativeStackNavigator()
const BottomNavigator = createBottomTabNavigator()

export default function App() {
  return (
    <NavigationContainer>
      {/*  // Cleanup code: check Book s. 252 */}
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#11aa11'
          },
          headerTintColor: '#fff'
        }}
        // initialRouteName="FooterNav"
      >
        {/* Todo: try to bring FooterNav to Homescreen / delete here later.. maybe initialRouteName needed */}
        <Stack.Screen name="FooterNav" options={{ title: 'Login' }} component={FooterNav} />

        <Stack.Screen name="Login" options={{ title: 'Login' }} component={LoginScreen} />
        {/* name = Aufruf in LoginScreen, nun abgeändert in Homescreen und mit options Title vergeben, damit code einheitlich in English
         <Stack.Screen name="Linksammlungen" component={Homescreen} /> */}
        <Stack.Screen
          name="Homescreen"
          options={{ title: 'Linksammlungen' }}
          component={Homescreen}
        />
        <Stack.Screen
          name="CreateLibrary"
          options={{ title: 'Linksammlungen erstellen' }}
          component={CreateLibrary}
        />
        <Stack.Screen
          options={{
            headerStyle: {
              backgroundColor: '#CFECFE'
            },
            headerTintColor: 'black'
          }}
          name="Library"
          component={Library}
        />

        <Stack.Screen name="AddLink" options={{ title: 'Link hinzufügen' }} component={AddLink} />
        <Stack.Screen
          name="ClipboardTest"
          options={{ title: 'ClipboardTest' }}
          component={ClipboardTest}
        />
      </Stack.Navigator>
    </NavigationContainer>

    // Todo: check if user is logged in --> show Bottom Tab Navigator (or show on Homescreen, but then independent = true.. not best practice
    // -> https://stackoverflow.com/questions/73751503/how-can-i-navigate-from-login-screen-to-a-bottomtab-screen )
    // -> https://reactnavigation.org/docs/auth-flow/
    // -> https://www.youtube.com/watch?v=yyGS0adZdsU

    // <NavigationContainer>
    // <Tabs />
    // </NavigationContainer>

    // OLD
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
