import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import WelcomeScreen from './screens/WelcomeScreen'
import Header from './screens/Header'
import CreateLibrary from './screens/createLibrary'
import AddLink from './screens/AddLink'

export default function App() {
  return (
    <SafeAreaProvider>
      <View
        style={{
          flex: 1,
          backgroundColor: 'white'
        }}
      >
        <Header />
        <CreateLibrary />
        <AddLink />
      </View>
      {/* <View style={{ backgroundColor: "#495E57" }}><Header /></View> */}
    </SafeAreaProvider>
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
