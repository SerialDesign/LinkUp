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
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Library from './src/screens/Library'
import FooterNav from './src/FooterNav'
import ClipboardTest from './src/components/templates/ClipboardTest'
import { TouchableOpacity, Image } from 'react-native'
import ShareScreen from './src/screens/ShareScreen'
import DeleteConfirmation from './src/components/DeleteConfirmation'
import QRCodeScanner from './src/screens/QRCodeScanner'
import EditLibrary from './src/screens/EditLibrary'
import EditLink from './src/screens/EditLink'
import SuccssConfirmation from './src/components/SuccessConfirmation'

// created my own theme to change background color of all screens to white
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white'
  }
}

const Stack = createNativeStackNavigator()
const BottomNavigator = createBottomTabNavigator()

export default function App() {
  return (
    <NavigationContainer theme={MyTheme}>
      {/*  // Cleanup code: check Book s. 252 */}
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#333'
            // backgroundColor: '#11aa11'
          },
          headerTintColor: '#fff',
          headerBackTitleVisible: false
        }}
        // initialRouteName="FooterNav"
      >
        {/* Todo: try to bring FooterNav to Homescreen / delete here later.. maybe initialRouteName needed */}
        {/* <Stack.Screen name="FooterNav" options={{ title: 'Login' }} component={FooterNav} /> */}

        <Stack.Screen name="Login" options={{ title: 'Login' }} component={LoginScreen} />
        {/* name = Aufruf in LoginScreen, nun abgeändert in Homescreen und mit options Title vergeben, damit code einheitlich in English
         <Stack.Screen name="Linksammlungen" component={Homescreen} /> */}

        {/* Homescreen */}
        <Stack.Screen
          name="Homescreen"
          options={{ title: 'Linksammlungen' }}
          component={Homescreen}
        />

        {/* Create Library */}
        <Stack.Screen
          name="CreateLibrary"
          options={{
            headerStyle: {
              backgroundColor: '#59B9F5'
            },
            title: 'Linksammlungen erstellen'
          }}
          component={CreateLibrary}
        />

        {/* Edit Library */}
        <Stack.Screen
          name="EditLibrary"
          options={{
            headerStyle: {
              backgroundColor: '#59B9F5'
            },
            title: 'Linksammlungen editieren'
          }}
          component={EditLibrary}
        />

        {/* Library Detail Screen */}
        <Stack.Screen
          options={({ navigation }) => ({
            title: '',
            title: 'Linksammlung',
            headerStyle: {
              backgroundColor: '#CFECFE'
              // backgroundColor: '#59B9F5'
            },
            headerTintColor: 'black'
          })}
          name="Library"
          component={Library}
        />

        {/* QRCodeScanner */}
        <Stack.Screen
          name="QRCodeScanner"
          options={{
            headerStyle: {
              backgroundColor: '#4D13C6'
            },
            title: 'QR-Code Scanner'
          }}
          component={QRCodeScanner}
        />

        {/* Share Screen */}
        <Stack.Screen
          name="ShareScreen"
          options={{
            title: 'Linksammlung teilen',
            headerStyle: {
              backgroundColor: '#4D13C6'
            }
          }}
          component={ShareScreen}
        />

        {/* Add Link Screen*/}
        <Stack.Screen
          name="AddLink"
          options={{
            title: 'Link hinzufügen',
            headerStyle: {
              backgroundColor: '#13C66A'
            }
          }}
          component={AddLink}
        />

        {/* Edit Link Screen*/}
        <Stack.Screen
          name="EditLink"
          options={{
            title: 'Link editieren',
            headerStyle: {
              backgroundColor: '#13C66A'
            }
          }}
          component={EditLink}
        />

        {/* Additional Screens / Confirmation etc. */}
        <Stack.Screen
          name="DeleteConfirmation"
          options={{
            title: 'Löschung erfolgreich',
            headerStyle: {
              backgroundColor: 'red'
            }
          }}
          component={DeleteConfirmation}
        />

        <Stack.Screen
          name="SuccessConfirmation"
          options={{
            title: 'Linksammlung erstellt',
            headerStyle: {
              backgroundColor: '#59B9F5'
            }
          }}
          component={SuccssConfirmation}
        />

        {/* Clipboard Test.. */}
        <Stack.Screen
          name="ClipboardTest"
          options={{
            title: 'ClipboardTest'
          }}
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
