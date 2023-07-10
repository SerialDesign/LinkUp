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
// import Clipboard from '@react-native-clipboard/clipboard'

export default function AddLink({ navigation }) {
  // useEffect(() => {
  //   const fetchClipboardText = async () => {
  //     const clipboardText = await Clipboard.getString()
  //     setUrlText(clipboardText)
  //   }

  //   fetchClipboardText()
  // }, [])

  const route = useRoute()
  const userId = route.params.userId

  const passedLibraryId = route.params.libraryId

  // TODO: rename value variable an test again if it works correctly

  const [libraryId, setLibraryId] = useState(passedLibraryId || null)
  const [libraries, setLibraries] = useState([])
  const URLInputRef = React.useRef()
  const [URLInput, setURLInput] = useState('')
  const [URLDesc, setURLDesc] = useState('')

  const saveLinkToLibrary = () => {
    if (!URLInput) {
      Alert.alert('Sorry!', 'Bitte Felder ausfüllen')
      return
    }

    if (!libraryId) {
      Alert.alert('Sorry!', 'Bitte eine Linksammlung auswählen')
      return
    }

    if (!isValidURL(URLInput)) {
      return
    }

    // check if URL is reachable
    fetchWithTimeout(URLInput)
      .then((response) => {
        if (!response.ok) {
          throw new Error('URL not reachable')
        }
        return response.text()
      })
      .then(() => {
        // URL is reachable, proceed with the save operation
        const endpointUrl =
          Constants.expoConfig.extra.apiUrl + userId + '/library/' + libraryId + '/links/add'

        const payload = {
          links: [
            {
              url: URLInput,
              description: URLDesc || URLInput // if URLDesc is not set, use URLInput
            }
          ]
        }

        fetch(endpointUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
          .then((response) => {
            if (response.ok) {
              navigation.navigate('Library', { libraryId, userId })
            } else {
              throw new Error('Save operation failed')
            }
          })
          .catch((error) => {
            // handle save operation error
            console.error(error)
            Alert.alert(
              'Fehler!',
              'Es gab einen Fehler beim Speichern des Links. Bitte versuchen Sie es später noch einmal.'
            )
          })
      })
      .catch((error) => {
        // handle URL check error
        //console.error(error)
        Alert.alert(
          'URL nicht erreichbar!',
          'Die eingegebene URL ist nicht erreichbar. Bitte überprüfen Sie die URL und versuchen Sie es erneut.'
        )
      })
  }

  const fetchCopiedText = async () => {
    const text = await Clipboard.getString()
    setURLInput(text)
  }

  React.useEffect(() => {
    setTimeout(() => {
      URLInputRef.current?.focus()
      //fetchCopiedText()
    }, 1000)
  }, [])

  const getAllLibraries = () => {
    // const endpointUrl = 'http://localhost:8000/' + userId + '/libraries'
    const endpointUrl = Constants.expoConfig.extra.apiUrl + userId + '/libraries'

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
        onPress={saveLinkToLibrary}
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
