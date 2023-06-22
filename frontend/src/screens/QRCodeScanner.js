import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, Button } from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { useRoute } from '@react-navigation/native'

export default function QRCodeScanner({ navigation }) {
  const route = useRoute()
  const [hasPermission, setHasPermission] = useState(null)
  const [scanned, setScanned] = useState(false)

  console.log('route.params:', route.params)
  const userId = route.params.userId
  console.log('userId:', userId)
  console.log('🚀 ~ file: QRCodeScanner.js:12 ~ QRCodeScanner ~ userId:', userId)

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      setHasPermission(status === 'granted')
    }

    getBarCodeScannerPermissions()
  }, [])

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true)
    alert(`Barcode vom Typ ${type} und Daten [${data}] wurden gescannt!`)
    // navigate to create library screen and pass data to import library
    navigation.navigate('CreateLibrary', { data, userId })
  }

  if (hasPermission === null) {
    return <Text>Zugriff auf Kamere erlauben</Text>
  }
  if (hasPermission === false) {
    return <Text>Kein Zugriff auf die Kamera</Text>
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button title={'Tippe hier um erneut zu scannen'} onPress={() => setScanned(false)} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  }
})
