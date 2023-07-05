import { View, StyleSheet } from 'react-native'
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
  const userId = route.params.userId
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
    // console.log(
    // '🚀 ~ file: CreateLibrary.js:74 ~ createLibraryHandlerScannedQRCode ~ links:',
    // links
    // )

    console.log('CREATING LIB from scanned QR-Code: ', Constants.expoConfig.extra.apiUrl)
    const endpointUrl = Constants.expoConfig.extra.apiUrl + userId + '/library/create'
    console.log('endpoint: ', endpointUrl)

    const payload = {
      userId: userId,
      libraryName: libraryName,
      libraryDesc: libraryDesc,
      libraryColor: getRandomColor()
    }

    fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

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

    // Parse the response text as JSON
    // const createdLibrary = JSON.parse(responseText)
    // const createdLibraryId = createdLibrary.libraryId

    const libraryIdRegex = /ID: (\w+-\w+-\w+-\w+-\w+)/
    const match = responseText.match(libraryIdRegex)
    const createdLibraryId = match ? match[1] : null

    console.log('Created library ID:', createdLibraryId)

    // const createdLibrary = await response.json()
    // const createdLibraryId = createdLibrary.libraryId
    // console.log(
    // '🚀 ~ file: CreateLibrary.js:111 ~ createLibraryHandlerScannedQRCode ~ createdLibraryId:',
    // createdLibraryId
    // )

    // adding Links to newly created Library
    const addLinksToLibrary = async (link) => {
      console.log('---------------- Adding link to library:  ', link)

      const addLinksEndpointUrl =
        Constants.expoConfig.extra.apiUrl + `${userId}/library/${createdLibraryId}/links/add`
      // check if wrong with scannedUserId... -->
      //Constants.expoConfig.extra.apiUrl + `${scannedUserId}/library/${createdLibraryId}/links/add`

      // console.log(
      // '🚀 ~ file: CreateLibrary.js:133 ~ addLinksToLibrary ~ addLinksEndpointUrl:',
      // addLinksEndpointUrl
      // )

      console.log('Adding link to library: ', link)

      const addLinksPayload = {
        links: [link]
      }

      // console.log(
      // '🚀 ~ file: CreateLibrary.js:141 ~ addLinksToLibrary ~ addLinksPayload:',
      // addLinksPayload
      // )

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

    navigation.navigate('Homescreen', { userId })
  }

  const createLibraryHandler = () => {
    if (qrCodeScannedData !== undefined) {
      // console.log(
      // '🚀 ~ file: CreateLibrary.js:87 ~ createLibraryHandler ~ qrCodeScannedData:',
      // qrCodeScannedData
      // )
      createLibraryHandlerScannedQRCode()
    } else {
      // TODO Use this variable to talk to the backend everywhere where you use the API instead of hardcoding the URL as a string
      console.log('CREATING LIB + CONFIG: ', Constants.expoConfig.extra.apiUrl)
      // const endpointUrl = 'http://localhost:8000/' + userId + '/library/create'
      const endpointUrl = Constants.expoConfig.extra.apiUrl + userId + '/library/create'
      console.log('endpoint: ', endpointUrl)
      // const endpointUrl = 'http://localhost:8000/user/library/create'

      const payload = {
        userId: userId,
        libraryName: libraryName,
        libraryDesc: libraryDesc,
        libraryColor: getRandomColor()
      }

      fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      navigation.navigate('Homescreen', { userId })
    }
  }

  return (
    <View>
      <View>
        <Input
          placeholder="Name der Bibliothek"
          onChangeText={setLibraryName}
          value={libraryName}
          clearButtonMode="while-editing"
          style={globalStyles.primaryInput}
        />
        <Input
          placeholder="Beschreibung"
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

        <Button
          title=""
          radius={'sm'}
          type="solid"
          buttonStyle={{ backgroundColor: 'rgba(127, 220, 103, 1)' }}
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
          buttonStyle={{ backgroundColor: 'rgba(127, 11, 103, 1)' }}
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
