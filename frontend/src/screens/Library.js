import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import { checkIfUserIdHasValue } from '../helper'
import { Button, Icon } from '@rneui/themed'

const Library = ({ navigation, route }) => {
  const [library, setLibrary] = useState(null)
  const userId = route.params.userId

  checkIfUserIdHasValue(userId)

  const getAllLinksOfLibrary = () => {
    const libraryId = route.params.libraryId
    const endpointUrl = 'http://localhost:8000/' + userId + '/library/' + libraryId
    console.log('Endpoint', endpointUrl)

    fetch(endpointUrl)
      .then((response) => response.json())
      .then((data) => {
        const libraryData = {
          libraryId: data.libraryId,
          libraryName: data.libraryName,
          libraryDesc: data.libraryDesc,
          links: data.links
        }

        setLibrary(libraryData)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  useEffect(() => {
    getAllLinksOfLibrary()
  }, [])

  const handleLinkPress = (link) => {
    Linking.openURL(link)
  }

  const handleDeleteLink = (linkId) => {
    console.log('Deleting link:', linkId)

    const endpointUrl = `http://localhost:8000/${userId}/library/${library.libraryId}/links/delete`
    console.log('🚀 ~ file: Library.js:48 ~ handleDeleteLink ~ endpointUrl:', endpointUrl)

    fetch(endpointUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        linkId: linkId
      })
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle successful deletion
        // You can update the library state or perform any other actions here
      })
      .catch((error) => {
        console.error(error)
        // Handle error scenario
      })
  }

  if (!library) {
    return null // Return null or a loading indicator while data is being fetched
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{library.libraryName}</Text>
      <Text style={styles.description}>{library.libraryDesc}</Text>
      <Text style={styles.id}>Library ID: {library.libraryId}</Text>

      <Text style={styles.sectionTitle}>Links:</Text>
      {library.links.length > 0 ? (
        <FlatList
          data={library.links}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleLinkPress(item.url)}
              style={styles.linkContainer}
              activeOpacity={0.7}
            >
              <Text style={styles.link}>{item.description}</Text>
              <TouchableOpacity onPress={() => handleDeleteLink(item.linkId)}>
                <Icon name="delete" type="material" size={20} color="red" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noLinksText}>Diese Linksammlung enthält keine Links</Text>
      )}
      <Button
        title="Link hinzufügen"
        icon={{
          name: 'link',
          type: 'material',
          size: 25,
          color: 'white'
        }}
        iconContainerStyle={{ marginRight: 10 }}
        titleStyle={{ fontWeight: '700' }}
        buttonStyle={styles.primaryButton}
        containerStyle={styles.buttonCenterLayouting}
        onPress={() => navigation.navigate('AddLink', { userId })}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  description: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center'
  },
  id: {
    fontSize: 16,
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10
  },
  linkContainer: {
    width: '70%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginLeft: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e3e3e3',
    borderRadius: 8,
    marginBottom: 10
  },
  link: {
    fontSize: 16
  },
  noLinksText: {
    fontSize: 16,
    fontStyle: 'italic'
  },
  // TODO: alle primaryButton + buttonCenterLayouting in master.css verlagern und neu verlinken auf CreateLibrary, AddLink + Library.. IMPORTANT: be carefull with width of buttonCenterLayouting, 300 on AddLink
  primaryButton: {
    backgroundColor: '#13C66A',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 30
  },
  buttonCenterLayouting: {
    width: 200,
    marginHorizontal: 50,
    marginVertical: 10,
    justifyContent: 'center',
    alignSelf: 'center'
  }
})

export default Library
