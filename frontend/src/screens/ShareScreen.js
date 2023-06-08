import { View, Image, Text, StyleSheet } from 'react-native'

const ShareScreen = () => {
  return (
    <View style={styles.container}>
      {/* Passing Param over App.js not possible? <Text style={styles.title}>Linksammlung {libraryName} teilen</Text> */}
      <Image
        source={require('../../assets/images/QR-Code-Mockup.png')}
        resizeMode="contain"
        style={styles.image}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    flex: 1,
    alignSelf: 'stretch',
    width: undefined,
    height: undefined
  }
})

export default ShareScreen
