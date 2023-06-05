import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import { checkIfUserIdHasValue } from '../helper'

const Library = ({ navigation, route }) => {
  const [library, setLibrary] = useState(null)
  const user = route.params.userID

  checkIfUserIdHasValue(user)

  const getAllLinksOfLibrary = () => {
    const libraryId = route.params.libraryId
    const endpointUrl = 'http://localhost:8000/' + user + '/library/' + libraryId
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
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noLinksText}>Diese Linksammlung enthält keine Links</Text>
      )}
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
    backgroundColor: '#e3e3e3',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10
  },
  link: {
    fontSize: 16
  },
  noLinksText: {
    fontSize: 16,
    fontStyle: 'italic'
  }
})

export default Library
