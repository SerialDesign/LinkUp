import { ScrollView, Clipboard, SafeAreaView } from 'react-native'
import { Header, Text, Input } from '@rneui/themed'
import { Dropdown } from 'react-native-element-dropdown'
import { StyleSheet } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign'
import { Button } from '@rneui/base'
import React, { useEffect, useState } from 'react'
import { Route, useRoute } from '@react-navigation/native'
// import Clipboard from '@react-native-clipboard/clipboard'

export default function AddLink() {
  // useEffect(() => {
  //   const fetchClipboardText = async () => {
  //     const clipboardText = await Clipboard.getString()
  //     setUrlText(clipboardText)
  //   }

  //   fetchClipboardText()
  // }, [])

  const route = useRoute()
  const userId = route.params.userID

  const [value, setValue] = useState(null)
  const [libraries, setLibraries] = useState([])
  const URLInputRef = React.useRef()
  const [URLInput, setURLInput] = useState('')

  const saveLinkToLibrary = () => {
    console.log('Saving link to Library ')
    // const endpointUrl = 'http://localhost:8000/library/8a4a10c8-6feb-42fb-b432-a24486475496/links/add'
    const endpointUrl = 'http://localhost:8000/' + userId + '/library/' + value + '/links/add'
    console.log('🚀 ~ file: AddLink.js:109 ~ saveLinkToLibrary ~ endpointUrl:', endpointUrl)
    //http://localhost:8000/userId/library/id1234/links/add"

    // TODO: Validation URL, ansonsten Meldung ausgegben, dass keine URL..

    const payload = {
      links: [
        {
          url: 'https://www.google.com',
          description: 'Google'
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
  }

  const fetchCopiedText = async () => {
    const text = await Clipboard.getString()
    console.log('🚀 ~ file: AddLink.js:28 ~ fetchCopiedText ~ text:', text)
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
    <SafeAreaView>
      <Header>URL</Header>
      {/* <Input placeholder="URL" ref={URLInput} /> */}
      <Input
        style={{ borderWidth: 1, borderColor: 'gray', padding: 10 }}
        value={URLInput}
        ref={URLInputRef}
        // onChangeText={(text) => setURLInput(text)}
        placeholder="URL"
      />
      <Input placeholder="Beschreibung" />
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
        value={value}
        onChange={(item) => {
          setValue(item.value)
        }}
        renderLeftIcon={() => (
          <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
        )}
      />
      <Button onPress={saveLinkToLibrary}>Link hinzufügen</Button>
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
  }
})
