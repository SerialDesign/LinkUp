import { View, StyleSheet, Image, Alert, ScrollView, Modal, Text } from 'react-native'
import { Button, Icon } from '@rneui/themed'
import { Input } from '@rneui/base'
import { useState, useEffect } from 'react'
import 'react-native-get-random-values'
import { useRoute } from '@react-navigation/native'
import { checkIfUserIdHasValue } from '../helper'
import Constants from 'expo-constants'
import globalStyles from '../../assets/styles/globalStyles'
import { validateLibrary } from '../helper'

export default function EditLibrary({ navigation }) {
  const route = useRoute()
  const [_name, _setName] = useState('')
  const [libraryName, setLibraryName] = useState('')
  const [libraryDesc, setLibraryDesc] = useState('')
  const [_libraryLabels, setLibraryLabels] = useState('')
  const [modalVisible, setModalVisible] = useState(false)

  //Todo: unimportant.. userID in CreateLibrary, user in Homescreen - vereinheitlichen
  const userId = route.params.userId
  const libraryId = route.params.libraryId
  console.log('user (in CreateLibrary): ', userId)
  checkIfUserIdHasValue(userId)

  // Fetch library data from the API
  const fetchLibraryData = async () => {
    const endpointUrl = Constants.expoConfig.extra.apiUrl + `${userId}/library/${libraryId}`
    console.log('Endpoint', endpointUrl)

    try {
      const response = await fetch(
        Constants.expoConfig.extra.apiUrl + `${userId}/library/${libraryId}`
      )
      const text = await response.text()
      const libraryData = text ? JSON.parse(text) : {}
      // console.log('🚀 ~ file: CreateLibrary.js:35 ~ fetchLibraryData ~ libraryData:', libraryData)

      // Update state variables with fetched data
      setLibraryName(libraryData.libraryName)
      setLibraryDesc(libraryData.libraryDesc)
    } catch (error) {
      console.error('Error fetching library data:', error)
    }
  }

  // Call the fetchLibraryData function when the component mounts
  useEffect(() => {
    fetchLibraryData()
  }, [])

  const saveLibrary = async () => {
    console.log('Saving Library:', libraryName)
    const endpointUrl = Constants.expoConfig.extra.apiUrl + userId + '/library/' + libraryId
    console.log('Endpoint', endpointUrl)

    // validate the library data before calling the API
    const { isValid, errors } = validateLibrary(libraryName, libraryDesc)

    if (!isValid) {
      const errorMessage = errors.join('\n')
      return Alert.alert('Sorry', errorMessage)
    }

    try {
      const response = await fetch(endpointUrl, {
        method: 'PUT', // or 'PATCH' if your API supports it
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          libraryName: libraryName,
          libraryDesc: libraryDesc
        })
      })

      if (response.ok) {
        const responseBody = await response.json()
        console.log('Library updated successfully')
        // Navigate back to the library screen
        navigation.navigate('Library', { userId, libraryId })
      } else {
        console.error('Error updating library:', response.statusText)
      }
    } catch (error) {
      console.error('Error updating library:', error)
    }
  }

  const deleteLibrary = async () => {
    const endpointUrl = Constants.expoConfig.extra.apiUrl + userId + '/library/' + libraryId

    try {
      const response = await fetch(endpointUrl, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setModalVisible(false)
        navigation.navigate('Homescreen', { userId }) // Navigate back to the homescreen
      } else {
        console.error('Error deleting library:', response.statusText)
        try {
          const responseBody = await response.json() // Only try to parse the response body as JSON if the response was not OK
          console.error('Response body:', responseBody)
        } catch (error) {
          console.warn('Unable to parse response body as JSON:', error)
        }
      }
    } catch (error) {
      console.error('Error deleting library:', error)
    }
  }

  return (
    <ScrollView>
      <View>
        <View style={globalStyles.inputContainer}>
          <Input
            placeholder="Name der Linksammlung"
            onChangeText={setLibraryName}
            value={libraryName}
            clearButtonMode="while-editing"
            style={globalStyles.primaryInput}
          />
          <Input
            placeholder="Beschreibung (optional)"
            onChangeText={setLibraryDesc}
            value={libraryDesc}
            clearButtonMode="while-editing"
            style={globalStyles.inputDescription}
          />

          {/* Todo: implement Labels or delete
        <Input
          placeholder="#Labels"
          onChangeText={setLibraryLabels}
          clearButtonMode="while-editing"
          style={globalStyles.inputDescription}
        /> */}
        </View>
        <Image
          source={require('../../assets/images/addLink_withoutShadow.png')}
          style={styles.bookmarksIllustration}
          resizeMode="contain"
        />
        <Button
          title="Änderung speichern"
          radius={'sm'}
          type="solid"
          buttonStyle={globalStyles.primaryButton}
          containerStyle={{ marginHorizontal: 30, marginVertical: 20 }}
          titleStyle={{
            marginHorizontal: 20,
            fontWeight: 'bold'
          }}
          onPress={saveLibrary}
        >
          Bibliothek speichern
          <Icon name="save" color="white" />
        </Button>

        {/* Scan QR-Code: https://chat.forefront.ai/share/l9xzxkwceh1jz7zn (FF) or https://www.perplexity.ai/search/6e4f54ad-f54c-4335-835e-9e50d48c4efc?s=c (PP) */}
        {/* Old delete button - without modal in between
         <Button
          title="Linksammlung löschen"
          radius={'sm'}
          type="solid"
          buttonStyle={globalStyles.deleteButton}
          containerStyle={{ marginHorizontal: 30, marginVertical: 20 }}
          titleStyle={{
            marginHorizontal: 20,
            fontWeight: 'bold'
          }}
          onPress={() => navigation.navigate('DeleteConfirmation', { userId, libraryId })}
        ></Button> */}
        <Button
          radius={'sm'}
          type="solid"
          buttonStyle={globalStyles.deleteButton}
          containerStyle={{ marginHorizontal: 30, marginVertical: 20 }}
          titleStyle={{
            marginHorizontal: 20,
            fontWeight: 'bold'
          }}
          onPress={() => setModalVisible(true)}
        >
          Linksammlung löschen
          <Icon name="delete" color="white" />
        </Button>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible)
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Bist du sicher dass du diese Linksammlung löschen möchtest?
              </Text>
              <View style={styles.modalButtonContainer}>
                <Button
                  onPress={deleteLibrary}
                  titleStyle={styles.modalButtonText}
                  style={styles.modalButton}
                  buttonStyle={[globalStyles.deleteButton]}
                  title="Linksammlung löschen!"
                />
                <Button
                  onPress={() => setModalVisible(!modalVisible)}
                  titleStyle={styles.modalButtonText}
                  buttonStyle={globalStyles.cancelButton}
                  style={styles.modalButton}
                  title="Abbrechen"
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 50,
    marginHorizontal: 30,
    marginVertical: 20
  },

  bookmarksIllustration: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    marginTop: 10
  },
  // modal styles
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },

  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden'
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center'
  },
  modalButtonContainer: {
    flexDirection: 'row',
    height: 70
  },
  modalButton: {
    flex: 1,
    margin: 10
  }
})
