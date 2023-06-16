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

export default function CreateLibrary({ navigation }) {
  const route = useRoute()
  const [_name, _setName] = useState('')
  const [libraryName, setLibraryName] = useState('')
  const [libraryDesc, setLibraryDesc] = useState('')
  const [_libraryLabels, setLibraryLabels] = useState('')

  //Todo: unimportant.. userID in CreateLibrary, user in Homescreen - vereinheitlichen
  const userId = route.params.userId
  console.log('user: ', userId)
  checkIfUserIdHasValue(userId)

  const createLibraryHandler = () => {
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

  return (
    <View>
      <View>
        <Input
          placeholder="Name der Bibliothek"
          onChangeText={setLibraryName}
          clearButtonMode="while-editing"
          style={globalStyles.primaryInput}
        />
        <Input
          placeholder="Beschreibung"
          onChangeText={setLibraryDesc}
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
          onPress={() => navigation.navigate('QRCodeScanner')}
        ></Button>
      </View>
    </View>
  )
}
