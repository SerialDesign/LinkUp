import { View, StyleSheet, Image } from 'react-native'
import { Button, Icon } from '@rneui/themed'
import { Input } from '@rneui/base'
import { useState } from 'react'
import 'react-native-get-random-values'
import { useRoute } from '@react-navigation/native'
import { checkIfUserIdHasValue } from '../helper'
import Constants from 'expo-constants'
import globalStyles from '../../assets/styles/globalStyles'
import { getRandomColor } from '../helper'
import { useEffect } from 'react'

export default function EditLibrary({ navigation }) {
  const route = useRoute()
  const [_name, _setName] = useState('')
  const [libraryName, setLibraryName] = useState('')
  const [libraryDesc, setLibraryDesc] = useState('')
  const [_libraryLabels, setLibraryLabels] = useState('')

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
        // Navigate back or show a success message
      } else {
        console.error('Error updating library:', response.statusText)
      }
    } catch (error) {
      console.error('Error updating library:', error)
    }
  }

  return (
    <View>
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
        ></Button>
      </View>
    </View>
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
  }
})
