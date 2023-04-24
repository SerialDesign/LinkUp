import { View } from 'react-native'
import { Button, Icon } from '@rneui/themed'
import { Input } from '@rneui/base'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

export default function CreateLibrary() {
  const [_name, _setName] = useState('')
  const [libraryName, setLibraryName] = useState('')
  const [_libraryDesc, setLibraryDesc] = useState('')
  const [_libraryLabels, setLibraryLabels] = useState('')

  const createLibraryHandler = () => {
    const endpointUrl = 'http://localhost:8000/library/create'
    const payload = {
      userId: 'user12345',
      libraryId: uuidv4(),
      libraryName: libraryName,
      links: [
        {
          url: 'url',
          description: 'desc',
        },
        {
          url: 'url',
          description: 'desc',
        },
        {
          url: 'url',
          description: 'desc',
        },
      ],
    }

    fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  }

  return (
    <View>
      <View>
        <Input
          placeholder='Name der Bibliothek'
          onChangeText={setLibraryName}
        />
        <Input placeholder='Beschreibung' onChangeText={setLibraryDesc} />
        <Input placeholder='#Labels' onChangeText={setLibraryLabels} />

        <Button
          title=''
          radius={'sm'}
          type='solid'
          buttonStyle={{ backgroundColor: 'rgba(127, 220, 103, 1)' }}
          containerStyle={{ marginHorizontal: 30, marginVertical: 20 }}
          titleStyle={{
            marginHorizontal: 20,
            fontWeight: 'bold',
          }}
          onPress={createLibraryHandler}
        >
          Bibliothek speichern
          <Icon name='save' color='white' />
        </Button>
      </View>
    </View>
  )
}
