import { View, StyleSheet, Image, Alert } from 'react-native'
import { Button, Icon } from '@rneui/themed'
import { Input } from '@rneui/base'
import { useState } from 'react'
import 'react-native-get-random-values'
import { useRoute } from '@react-navigation/native'
import { checkIfUserIdHasValue } from '../helper'
import Constants from 'expo-constants'
import globalStyles from '../../assets/styles/globalStyles'
import { getRandomColor, validateLibrary } from '../helper'
import { useEffect } from 'react'

export default function CreateLibrary({ navigation }) {
  const route = useRoute()
  const [_name, _setName] = useState('')
  const [libraryName, setLibraryName] = useState('')
  const [libraryDesc, setLibraryDesc] = useState('')
  const [_libraryLabels, setLibraryLabels] = useState('')

  const qrCodeScannedData = route.params.data

  // Split the URL to extract userId and libraryId
  const urlParts = qrCodeScannedData?.split('/') ?? []
  const scannedUserId = urlParts[3]
  const scannedLibraryId = urlParts[5]

  //Todo: unimportant.. userID in CreateLibrary, user in Homescreen - vereinheitlichen
  const { userId, refreshLibraries } = route.params
  console.log('user (in CreateLibrary): ', userId)
  checkIfUserIdHasValue(userId)

  // Fetch library data from the API
  const fetchLibraryData = async () => {
    try {
      const response = await fetch(
        Constants.expoConfig.extra.apiUrl + `${userId}/library/${scannedLibraryId}`
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

  // Call the fetchLibraryData function when the component mounts or when the libraryId changes
  useEffect(() => {
    if (qrCodeScannedData !== undefined) {
      fetchLibraryData()
    }
  }, [qrCodeScannedData, scannedLibraryId])

  const createLibraryHandlerScannedQRCode = async () => {
    console.log('importing library from QR-Code')

    // Fetch all links in the passed library
    const fetchLinks = async () => {
      try {
        const response = await fetch(
          Constants.expoConfig.extra.apiUrl + `${scannedUserId}/library/${scannedLibraryId}/links`
        )
        const links = await response.json()
        return links
      } catch (error) {
        console.error('Error fetching links:', error)
        return []
      }
    }

    // Get the links from the passed library
    const links = await fetchLinks()

    console.log('CREATING LIB from scanned QR-Code: ', Constants.expoConfig.extra.apiUrl)
    const endpointUrl = Constants.expoConfig.extra.apiUrl + userId + '/library/create'
    console.log('endpoint: ', endpointUrl)

    const payload = {
      userId: userId,
      libraryName: libraryName,
      libraryDesc: libraryDesc,
      libraryColor: getRandomColor()
    }

    // validate the library data before calling the API
    const { isValid, errors } = validateLibrary(libraryName, libraryDesc)

    if (!isValid) {
      const errorMessage = errors.join('\n')
      return Alert.alert('Sorry', errorMessage)
    }

    // Fetch the newly created library ID
    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    // Log the response text to debug the issue
    const responseText = await response.text()
    console.log('Response text:', responseText)

    const libraryIdRegex = /ID: (\w+-\w+-\w+-\w+-\w+)/
    const match = responseText.match(libraryIdRegex)
    const createdLibraryId = match ? match[1] : null

    console.log('Created library ID:', createdLibraryId)

    // Adding Links to newly created Library
    const addLinksToLibrary = async (link) => {
      console.log('---------------- Adding link to library:  ', link)

      const addLinksEndpointUrl =
        Constants.expoConfig.extra.apiUrl + `${userId}/library/${createdLibraryId}/links/add`

      console.log('Adding link to library: ', link)

      const addLinksPayload = {
        links: [link]
      }

      await fetch(addLinksEndpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addLinksPayload)
      })
    }

    // Call addLinksToLibrary for each link in links
    for (const link of links) {
      await addLinksToLibrary(link)
    }

    try {
      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        refreshLibraries && refreshLibraries()
      } else {
        throw new Error('Failed to create library')
      }
    } catch (err) {
      console.error(err)
      return
    }

    navigation.navigate('Homescreen', { userId })
  }

  const createLibraryHandler = async () => {
    if (qrCodeScannedData !== undefined) {
      createLibraryHandlerScannedQRCode()
    } else {
      const endpointUrl = Constants.expoConfig.extra.apiUrl + userId + '/library/create'
      const payload = {
        userId: userId,
        libraryName: libraryName,
        libraryDesc: libraryDesc,
        libraryColor: getRandomColor()
      }

      // validate the library data before calling the API
      const { isValid, errors } = validateLibrary(libraryName, libraryDesc)

      if (!isValid) {
        const errorMessage = errors.join('\n')
        return Alert.alert('Sorry', errorMessage)
      }

      // Here we wait for the library creation to complete before navigating back
      try {
        const response = await fetch(endpointUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })

        if (response.ok) {
          refreshLibraries && refreshLibraries()
        } else {
          throw new Error('Failed to create library')
        }
      } catch (err) {
        console.error(err)
        return
      }

      navigation.navigate('Homescreen', { userId })
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
          title=""
          radius={'sm'}
          type="solid"
          buttonStyle={globalStyles.primaryButton}
          containerStyle={{ marginHorizontal: 30, marginVertical: 20 }}
          titleStyle={{
            marginHorizontal: 20,
            fontWeight: 'bold'
          }}
          onPress={createLibraryHandler}
        >
          Bibliothek speichern
          <Icon name="save" color="white" />
        </Button>

        {/* Scan QR-Code: https://chat.forefront.ai/share/l9xzxkwceh1jz7zn (FF) or https://www.perplexity.ai/search/6e4f54ad-f54c-4335-835e-9e50d48c4efc?s=c (PP) */}
        <Button
          title="QR-Code scannen"
          radius={'sm'}
          type="solid"
          buttonStyle={globalStyles.qrCodeButton}
          containerStyle={{ marginHorizontal: 30, marginVertical: 20 }}
          titleStyle={{
            marginHorizontal: 20,
            fontWeight: 'bold'
          }}
          onPress={() => navigation.navigate('QRCodeScanner', { userId })}
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
