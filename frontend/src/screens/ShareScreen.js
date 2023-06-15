import { View, Image, Text, StyleSheet } from 'react-native'
import React from 'react'
import QRCode from 'react-native-qrcode-svg'
import { useRoute } from '@react-navigation/native'

const ShareScreen = () => {
  // const libraryId = '12345689'
  const route = useRoute()
  const userId = route.params.userId
  const libraryId = route.params.libraryId
  console.log('🚀 ~ file: ShareScreen.js:8 ~ ShareScreen ~ userId:', userId)
  // const libraryId = 'localhost:8000/:userId/library/:libraryId'
  const qrCodeString = 'http://localhost:8000/' + userId + '/library/' + libraryId
  console.log('🚀 ~ file: ShareScreen.js:14 ~ ShareScreen ~ qrCodeString:', qrCodeString)

  return (
    <View style={styles.container}>
      {/* Passing Param over App.js not possible? <Text style={styles.title}>Linksammlung {libraryName} teilen</Text> */}

      {/* Mockup QR-Code 
      <Image
        source={require('../../assets/images/QR-Code-Mockup.png')}
        resizeMode="contain"
        style={styles.image}
      /> */}
      <Text style={styles.title}>Scanne den QR-Code</Text>
      <QRCode value={qrCodeString} size={250} style={styles.qrcode} />
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
  },
  qrcode: {
    flex: 1,
    alignSelf: 'stretch',
    width: 100,
    height: 100
  }
})

export default ShareScreen
