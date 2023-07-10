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
import { isValidURL } from '../helper'
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

    //  old validation
    // if (!validator.isURL(URLInput)) {
    //   Alert.alert('Sorry!', 'Bitte eine gültige URL eingeben')
    //   return
    // }

    console.log('Saving link to Library ')
    // const endpointUrl = 'http://localhost:8000/library/8a4a10c8-6feb-42fb-b432-a24486475496/links/add'
    // const endpointUrl = 'http://localhost:8000/' + userId + '/library/' + libraryId + '/links/add'
    const endpointUrl =
      Constants.expoConfig.extra.apiUrl + userId + '/library/' + libraryId + '/links/add'

    console.log('🚀 ~ file: AddLink.js:109 ~ saveLinkToLibrary ~ endpointUrl:', endpointUrl)
    //http://localhost:8000/userId/library/id1234/links/add"

    const payload = {
      links: [
        {
          url: URLInput,
          description: URLDesc || URLInput // if no description is given, use the URL as description
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

    navigation.navigate('Library', { libraryId, userId })
  }

  const fetchCopiedText = async () => {
    const text = await Clipboard.getString()
    setURLInput(text)
  }

  React.useEffect(() => {
    setTimeout(() => {
      URLInputRef.current?.focus()
      fetchCopiedText()
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
          placeholder="URL"
        />
        <Input
          placeholder="Beschreibung (optional)"
          style={globalStyles.inputDescription}
          value={URLDesc}
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
