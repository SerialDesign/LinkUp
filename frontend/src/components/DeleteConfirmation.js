import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import { useRoute, useNavigation } from '@react-navigation/native'
import { useEffect } from 'react'
import { Icon, Button } from '@rneui/themed'

const DeleteConfirmation = () => {
  const navigation = useNavigation()
  const route = useRoute()

  //call endpoint to delete library
  const userId = route.params.userId
  const libraryId = route.params.libraryId
  console.log('Library to delete:', libraryId)

  useEffect(() => {
    deleteLibrary()
  }, [])

  function deleteLibrary() {
    const endpointUrl = 'http://localhost:8000/' + userId + '/library/' + libraryId
    console.log('Endpoint', endpointUrl)

    fetch(endpointUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        libraryId: libraryId
      })
    })
      .then((data) => {
        // Handle successful deletion
        // You can update the library state or perform any other actions here
        console.log('🚀 ~ file: DeleteConfirmation.js:95 ~ .then ~ data', data.json())
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <View style={styles.container}>
      {/* <Icon name="check-circle" type="font-awesome" size={100} color="#13C66A" /> */}
      <Image
        source={require('../../assets/images/deletion_confirmation.png')}
        style={styles.bookmarksIllustration}
      />
      <Text style={styles.successText}>Linksammlung erfolgreich gelöscht!</Text>
      <Text style={{ alignSelf: 'center' }}>Also your Binance Account is gone now. :)</Text>
      <Button
        buttonStyle={styles.greenButton}
        onPress={() => navigation.navigate('Homescreen', { userId })}
      >
        Zurück
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },

  successText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 20,
    alignSelf: 'center'
  },

  bookmarksIllustration: {
    width: 350,
    height: 350,
    alignSelf: 'center'
  },

  greenButton: {
    backgroundColor: '#13C66A',
    borderColor: 'transparent',
    borderRadius: 30,
    margin: 50
  }
})

export default DeleteConfirmation
