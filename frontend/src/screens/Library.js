import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Share } from 'react-native'
import React, { useEffect, useState } from 'react'
import { checkIfUserIdHasValue } from '../helper'
import { Button, Icon } from '@rneui/themed'
import Constants from 'expo-constants'
import globalStyles from '../../assets/styles/globalStyles'
// import Swipeable from 'react-native-gesture-handler/Swipeable';

const Library = ({ navigation, route }) => {
  const [library, setLibrary] = useState(null)
  const userId = route.params.userId
  const libraryId = route.params.libraryId

  checkIfUserIdHasValue(userId)

  const getAllLinksOfLibrary = () => {
    // const endpointUrl = 'http://localhost:8000/' + userId + '/library/' + libraryId
    const endpointUrl = Constants.expoConfig.extra.apiUrl + userId + '/library/' + libraryId
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

  const renderRightActions = (item, progress) => {
    return (
      <RectButton onPress={() => handleDeleteLink(item.linkId)} style={styles.deleteButton}>
        <Icon name="delete" type="material" size={20} color="white" />
      </RectButton>
    )
  }

  const handleLinkPress = (link) => {
    Linking.openURL(link)
  }

  const handleDeleteLink = (linkId) => {
    console.log('Deleting link:', linkId)

    // const endpointUrl = `http://localhost:8000/${userId}/library/${library.libraryId}/links/delete`
    const endpointUrl =
      Constants.expoConfig.extra.apiUrl + `${userId}/library/${library.libraryId}/links/delete`
    console.log('🚀 ~ file: Library.js:48 ~ handleDeleteLink ~ endpointUrl:', endpointUrl)

    fetch(endpointUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        linkId: linkId
      })
    }).catch((error) => {
      console.error(error)
      // Handle error scenario
    })
  }

  if (!library) {
    return null // Return null or a loading indicator while data is being fetched
  }

  const handleShare = async (url, description) => {
    try {
      const result = await Share.share({
        message: `${description}\n${url}`,
        url: url
      })

      if (result.action === Share.sharedAction) {
        console.log('Shared successfully')
      } else {
        console.log('Share dismissed')
      }
    } catch (error) {
      console.error('Share error:', error)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{library.libraryName}</Text>
      <Text style={styles.description}>{library.libraryDesc}</Text>
      {/* <Text style={styles.id}>Library ID: {library.libraryId}</Text> */}
      <TouchableOpacity
        onPress={() => navigation.navigate('DeleteConfirmation', { userId, libraryId })}
      >
        <Icon name="delete" type="material" size={25} color="red" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ShareScreen', { userId, libraryId })}>
        <Icon name="share" type="material" size={25} color="black" />
      </TouchableOpacity>
      {/* // Links section */}
      <Text style={styles.sectionTitle}>Links:</Text>
      {library.links.length > 0 ? (
        <FlatList
          data={library.links}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            // Implemeent swipe to delete?
            // <Swipeable renderRightActions={(progress) => renderRightActions(item, progress)}> -->  npx expo install react-native-gesture-handler@~2.9.0
            <TouchableOpacity
              onPress={() => handleLinkPress(item.url)}
              style={styles.linkContainer}
              activeOpacity={0.7}
            >
              <Text style={styles.link}>{item.description}</Text>
              {/* <Text style={styles.link}>({item.url})</Text> */}
              <TouchableOpacity onPress={() => handleDeleteLink(item.linkId)}>
                <Icon name="delete" type="material" size={20} color="red" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleShare(item.url, item.description)}>
                <Icon name="share" type="material" size={20} color="blue" />
              </TouchableOpacity>
            </TouchableOpacity>
            // </Swipeable>
          )}
        />
      ) : (
        <Text style={styles.noLinksText}>Diese Linksammlung enthält keine Links.</Text>
      )}
      <Button
        title="Link hinzufügen"
        icon={globalStyles.addLinkButton}
        iconContainerStyle={{ marginRight: 10 }}
        titleStyle={{ fontWeight: '700' }}
        buttonStyle={styles.primaryButton}
        containerStyle={styles.buttonCenterLayouting}
        onPress={() => navigation.navigate('AddLink', { userId, libraryId })}
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
