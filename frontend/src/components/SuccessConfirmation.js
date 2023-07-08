import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import { useRoute, useNavigation } from '@react-navigation/native'
import { useEffect } from 'react'
import { Icon, Button } from '@rneui/themed'
import Constants from 'expo-constants'

const SuccessConfirmation = () => {
  const navigation = useNavigation()
  const route = useRoute()

  const libraryId = route.params.libraryId
  console.log('Library created:', libraryId)

  function deleteLibrary() {
    // const endpointUrl = 'http://localhost:8000/' + userId + '/library/' + libraryId
    const endpointUrl = Constants.expoConfig.extra.apiUrl + userId + '/library/' + libraryId
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
      <Text style={styles.successText}>Linksammlung erfolgreich erstellt!</Text>
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

export default SuccessConfirmation
