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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Library from './src/screens/Library'
import FooterNav from './src/FooterNav'
import ClipboardTest from './src/components/templates/ClipboardTest'
import { TouchableOpacity, Image } from 'react-native'
import ShareScreen from './src/screens/ShareScreen'
import DeleteConfirmation from './src/components/DeleteConfirmation'
import QRCodeScanner from './src/screens/QRCodeScanner'

const Stack = createNativeStackNavigator()
const BottomNavigator = createBottomTabNavigator()

export default function App() {
  return (
    <NavigationContainer>
      {/*  // Cleanup code: check Book s. 252 */}
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#333'
            // backgroundColor: '#11aa11'
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

        {/* Library Detail Screen */}
        <Stack.Screen
          options={({ navigation }) => ({
            title: 'Bibliothek', //TODO: mit {libraryId} + Back button auf Deutsch setzen?
            headerStyle: {
              backgroundColor: '#CFECFE'
            },
            headerTintColor: 'black',
            headerRight: () => (
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={
                  () => navigation.navigate('ShareScreen')
                  // , { libraryName: 'Library Name cannot be passed here..' }
                }
              >
                <Image source={require('./assets/icon.png')} style={{ width: 24, height: 24 }} />
              </TouchableOpacity>
            )
          })}
          name="Library"
          component={Library}
        />

        {/* Share Screen */}
        <Stack.Screen
          name="ShareScreen"
          options={{
            title: 'Teilen',
            headerStyle: {
              backgroundColor: '#0094EF'
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

        {/* Additional Screens / Confirmation etc. */}
        <Stack.Screen
          name="DeleteConfirmation"
          options={{
            title: 'No Binance anymore',
            headerStyle: {
              backgroundColor: 'red'
            }
          }}
          component={DeleteConfirmation}
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
