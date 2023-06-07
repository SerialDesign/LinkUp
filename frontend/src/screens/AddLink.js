import { ScrollView, Clipboard, SafeAreaView, Image, StyleSheet } from 'react-native'
import { Header, Text, Input } from '@rneui/themed'
import { Dropdown } from 'react-native-element-dropdown'
import AntDesign from '@expo/vector-icons/AntDesign'
import { Button } from '@rneui/base'
import React, { useEffect, useState } from 'react'
import { Route, useRoute } from '@react-navigation/native'
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

  // TODO: rename value variable an test again if it works correctly
  const [libraryId, setLibraryId] = useState(null)
  const [libraries, setLibraries] = useState([])
  const URLInputRef = React.useRef()
  const [URLInput, setURLInput] = useState('')
  const [URLDesc, setURLDesc] = useState('')

  const saveLinkToLibrary = () => {
    console.log('Saving link to Library ')
    // const endpointUrl = 'http://localhost:8000/library/8a4a10c8-6feb-42fb-b432-a24486475496/links/add'
    const endpointUrl = 'http://localhost:8000/' + userId + '/library/' + libraryId + '/links/add'
    console.log('🚀 ~ file: AddLink.js:109 ~ saveLinkToLibrary ~ endpointUrl:', endpointUrl)
    //http://localhost:8000/userId/library/id1234/links/add"

    // TODO: Validation URL, ansonsten Meldung ausgegben, dass keine URL..
    // TODO: If https:// is missing. add it

    const payload = {
      links: [
        {
          url: URLInput,
          description: URLDesc
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
    const endpointUrl = 'http://localhost:8000/' + userId + '/libraries'

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
      <Header placement="left" containerStyle={{ backgroundColor: '#13C66A' }} />
      {/* <Input placeholder="URL" ref={URLInput} /> */}
      <Input
        style={{
          borderWidth: 1,
          borderColor: 'gray',
          padding: 20,
          marginTop: 10,
          backgroundColor: '#EEF0F7'
        }}
        value={URLInput}
        onChangeText={(text) => setURLInput(text)}
        ref={URLInputRef}
        // onChangeText={(text) => setURLInput(text)}
        placeholder="URL"
      />
      <Input
        placeholder="Beschreibung"
        style={{
          borderWidth: 0.5,
          borderColor: 'gray',
          padding: 20,
          marginTop: 10
        }}
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
      <Image
        source={require('../../assets/images/addLink_withoutShadow.png')}
        style={styles.bookmarksIllustration}
        resizeMode="contain"
      />
      <Button
        iconContainerStyle={{ marginRight: 10 }}
        titleStyle={{ fontWeight: '700' }}
        buttonStyle={styles.primaryButton}
        containerStyle={styles.buttonCenterLayouting}
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
  },
  primaryButton: {
    backgroundColor: '#13C66A',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 30
  },
  buttonCenterLayouting: {
    width: 300,
    marginHorizontal: 50,
    marginVertical: 10,
    justifyContent: 'center',
    alignSelf: 'center'
  }
})
