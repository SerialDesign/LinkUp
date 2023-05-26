import { ScrollView } from 'react-native'
import { Header, Text, Input } from '@rneui/themed'
import { Dropdown } from 'react-native-element-dropdown'
import { StyleSheet } from 'react-native'
import { useEffect, useState } from 'react'
import AntDesign from '@expo/vector-icons/AntDesign'
import { Button } from '@rneui/base'

export default function AddLink() {
  const [value, setValue] = useState(null)
  const [libraries, setLibraries] = useState([])

  const getAllLibraries = () => {
    const endpointUrl = 'http://localhost:8000/user12345/libraries'

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
    <ScrollView>
      <Header>URL</Header>
      <Input placeholder="URL" />
      <Input placeholder="Beschreibung" />
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={libraries.length > 0 ? libraries : [{ label: 'No libraries found', value: null }]}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select item"
        searchPlaceholder="Search..."
        value={value}
        onChange={(item) => {
          setValue(item.value)
        }}
        renderLeftIcon={() => (
          <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
        )}
      />
      <Button onPress={saveLinkToLibrary}>Link hinzufügen</Button>
    </ScrollView>
  )
}

const saveLinkToLibrary = () => {
  const endpointUrl = 'http://localhost:8000/library/8a4a10c8-6feb-42fb-b432-a24486475496/links/add'
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
