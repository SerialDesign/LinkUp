import { View, StyleSheet } from 'react-native'
import { Button, Icon } from '@rneui/themed'
import { Input } from '@rneui/base'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import 'react-native-get-random-values'
import { useRoute } from '@react-navigation/native'

export default function CreateLibrary({ navigation }) {
  const route = useRoute()
  const [_name, _setName] = useState('')
  const [libraryName, setLibraryName] = useState('')
  const [_libraryDesc, setLibraryDesc] = useState('')
  const [_libraryLabels, setLibraryLabels] = useState('')

  //Todo: unimportant.. userID in CreateLibrary, user in Homescreen - vereinheitlichen
  const user = route.params.userID
  console.log('user: ', user)

  const createLibraryHandler = () => {
    const endpointUrl = 'http://localhost:8000/' + user + '/library/create'
    console.log('endpoint: ', endpointUrl)

    // const endpointUrl = 'http://localhost:8000/user/library/create'
    const payload = {
      // userId: 'user12345',
      userId: user,
      libraryName: libraryName,
      libraryDesc: _libraryDesc
    }

    fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    navigation.navigate('Homescreen', { user })
  }

  return (
    <View>
      <View>
        <Input
          placeholder="Name der Bibliothek"
          onChangeText={setLibraryName}
          clearButtonMode="while-editing"
        />
        <Input
          placeholder="Beschreibung"
          onChangeText={setLibraryDesc}
          clearButtonMode="while-editing"
        />
        <Input
          placeholder="#Labels"
          onChangeText={setLibraryLabels}
          clearButtonMode="while-editing"
        />

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
      </View>
    </View>
  )

  const styles = StyleSheet.create({
    root: {
      backgroundColor: '#f12'
    }
  })
}
