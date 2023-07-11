import { Clipboard, SafeAreaView, Image, StyleSheet, View } from 'react-native'
import { Input } from '@rneui/themed'
import { Dropdown } from 'react-native-element-dropdown'
import AntDesign from '@expo/vector-icons/AntDesign'
import { Button, Icon } from '@rneui/base'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import Constants from 'expo-constants'
import globalStyles from '../../assets/styles/globalStyles'
import { Alert } from 'react-native'
import { isValidURL, fetchWithTimeout } from '../helper'

export default function EditLink({ navigation, route }) {
  const { linkData } = route.params

  const [URLInput, setURLInput] = useState(linkData.url)
  const [URLDesc, setURLDesc] = useState(linkData.description)
  //   const [linkId, setLink] = useState(linkData.description)

  const userId = route.params.userId
  const linkId = linkData.linkId
  console.log('🚀 ~ file: EditLink.js:22 ~ EditLink ~ linkId:', linkId)

  const passedLibraryId = route.params.libraryId
  console.log('🚀 ~ file: EditLink.js:25 ~ EditLink ~ passedLibraryId:', passedLibraryId)

  const [libraryId, setLibraryId] = useState(passedLibraryId || null)
  const [libraries, setLibraries] = useState([])
  const URLInputRef = React.useRef()

  useEffect(() => {
    getAllLibraries()
  }, [])

  const updateLink = (updatedLink, userId, libraryId, linkId) => {
    if (!updatedLink.url) {
      Alert.alert('Sorry!', 'Bitte Felder ausfüllen')
      return
    }

    if (!libraryId) {
      Alert.alert('Sorry!', 'Bitte eine Linksammlung auswählen')
      return
    }

    if (!isValidURL(updatedLink.url)) {
      return
    }

    fetchWithTimeout(updatedLink.url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('URL not reachable')
        }
        return response.text()
      })
      .then(() => {
        const endpointUrl =
          Constants.expoConfig.extra.apiUrl +
          userId +
          '/library/' +
          libraryId +
          '/links/' +
          linkId +
          '/edit'

        fetch(endpointUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ link: updatedLink })
        })
          .then((response) => {
            if (response.ok) {
              console.log(`Link with ID: ${linkId} was updated in library with ID: ${libraryId}`)
              navigation.navigate('Library', { libraryId, userId })
            } else {
              throw new Error('Update operation failed')
            }
          })
          .catch((error) => {
            // console.error('Error:', error)
            Alert.alert(
              'Fehler!',
              'Es gab einen Fehler beim Aktualisieren des Links. Bitte versuchen Sie es später noch einmal.'
            )
          })
      })
      .catch((error) => {
        // console.error('Error:', error)
        Alert.alert(
          'URL nicht erreichbar!',
          'Die eingegebene URL ist nicht erreichbar. Bitte überprüfen Sie die URL und versuchen Sie es erneut.'
        )
      })
  }

  const getAllLibraries = () => {
    // const endpointUrl = 'http://localhost:8000/' + userId + '/libraries'
    const endpointUrl = Constants.expoConfig.extra.apiUrl + userId + '/libraries'
    console.log('🚀 ~ file: EditLink.js:109 ~ getAllLibraries ~ endpointUrl:', endpointUrl)

    fetch(endpointUrl)
      .then((response) => response.json())
      .then((data) => {
        const libraries = data.map((library) => {
          return {
            label: library.libraryName,
            value: library.libraryId
          }
        })

        setLibraries(libraries)
      })
  }

  useEffect(() => {
    getAllLibraries()
  }, [])

  const update = () => {
    const updatedLink = {
      url: URLInput,
      description: URLDesc || URLInput // if URLDesc is not set, use URLInput
    }
    updateLink(updatedLink, userId, libraryId, linkId)
  }

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      {/* <Header placement="left" containerStyle={{ backgroundColor: '#13C66A' }} /> */}
      {/* <Input placeholder="URL" ref={URLInput} /> */}
      <View style={globalStyles.inputContainer}>
        <Input
          style={globalStyles.primaryInput}
          value={URLInput}
          onChangeText={(text) => setURLInput(text)}
          ref={URLInputRef}
          // onChangeText={(text) => setURLInput(text)}
          clearButtonMode="while-editing"
          placeholder="URL"
        />
        <Input
          placeholder="Beschreibung (optional)"
          style={globalStyles.inputDescription}
          value={URLDesc}
          clearButtonMode="while-editing"
          onChangeText={(text) => setURLDesc(text)}
        />
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={
            libraries.length > 0
              ? libraries
              : [{ label: 'Keine Linksammlungen gefunden', value: null }]
          }
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Linksammlung auswählen"
          searchPlaceholder="Suche..."
          value={libraryId}
          onChange={(item) => {
            setLibraryId(item.value)
          }}
          renderLeftIcon={() => (
            <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
          )}
        />
      </View>
      {/* <Image
          source={require('../../assets/images/addLink_withoutShadow.png')}
          style={styles.bookmarksIllustration}
          resizeMode="contain"
        /> */}
      <Icon
        name="link"
        type="font-awesome"
        size={100}
        color="#13C66A"
        style={{ marginTop: 50, marginBottom: 50 }}
      />
      <Button
        iconContainerStyle={{ marginRight: 10 }}
        titleStyle={{ fontWeight: '700' }}
        buttonStyle={globalStyles.primaryButton}
        containerStyle={globalStyles.buttonCenterLayouting}
        onPress={update}
      >
        Speichern
      </Button>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 50,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5
  },
  icon: {
    marginRight: 5
  },
  placeholderStyle: {
    fontSize: 16
  },
  selectedTextStyle: {
    fontSize: 16
  },
  iconStyle: {
    width: 20,
    height: 20
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16
  },
  bookmarksIllustration: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    marginTop: 10
  }
})
