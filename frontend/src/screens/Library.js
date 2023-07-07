import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Share } from 'react-native'
import React, { useEffect, useState } from 'react'
import { checkIfUserIdHasValue } from '../helper'
import { Button, Icon } from '@rneui/themed'
import Constants from 'expo-constants'
import globalStyles from '../../assets/styles/globalStyles'
// import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useIsFocused } from '@react-navigation/native'
import { SearchBar } from '@rneui/themed'

const Library = ({ navigation, route }) => {
  const [library, setLibrary] = useState(null)
  const userId = route.params.userId
  const libraryId = route.params.libraryId
  const [search, setSearch] = useState('')

  checkIfUserIdHasValue(userId)

  const updateSearch = (search) => {
    setSearch(search)
  }

  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFocused) {
      const endpointUrl = Constants.expoConfig.extra.apiUrl + `${userId}/library/${libraryId}`

      fetch(endpointUrl)
        .then((response) => response.json())
        .then((data) => {
          setLibrary(data)
        })
        .catch((error) => {
          console.error(error)
          // Handle error scenario
        })
    }
  }, [isFocused])

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
    })
      .then(() => {
        // Remove the link from the library.links array
        const updatedLinks = library.links.filter((link) => link.linkId !== linkId)

        // Update the state with the new links array
        setLibrary({
          ...library,
          links: updatedLinks
        })
      })
      .catch((error) => {
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

  const filteredLinks = library.links.filter((link) =>
    link.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <View style={styles.container}>
      {/* // Library info & icon section */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <View style={{ width: 'auto' }}>
          <Text style={styles.title}>{library.libraryName}</Text>
          <Text style={styles.description}>{library.libraryDesc}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 15 }}>
          {/* Todo: implement delete functionality on separate screen, code below only for testing purposes (to test faster..) 
          <TouchableOpacity
            onPress={() => navigation.navigate('DeleteConfirmation', { userId, libraryId })}
          >
            <Icon name="edit" type="material" size={25} />
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() => navigation.navigate('EditLibrary', { userId, libraryId })}
          >
            <Icon name="edit" type="material" size={25} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('ShareScreen', { userId, libraryId })}
          >
            <Icon name="share" type="material" size={25} color="#4D13C6" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <SearchBar
        placeholder="Suche nach Links..."
        onChangeText={updateSearch}
        value={search}
        containerStyle={{
          width: '100%',
          backgroundColor: 'white',
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          paddingHorizontal: 0
        }}
        inputContainerStyle={{
          backgroundColor: '#F5F5F5',
          borderRadius: 8
        }}
        inputStyle={{
          color: 'black'
        }}
      />

      {/* // Links section */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={styles.sectionTitle}>Links:</Text>
        <Text style={styles.linkCount}>Anzahl Links: {filteredLinks.length}</Text>
      </View>

      {filteredLinks.length > 0 ? (
        <FlatList
          data={filteredLinks}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            // before search..
            // {library.links.length > 0 ? (
            //   <FlatList
            //     data={library.links}
            //     keyExtractor={(item, index) => index.toString()}
            //     renderItem={({ item }) => (

            // Implemeent swipe to delete?
            // <Swipeable renderRightActions={(progress) => renderRightActions(item, progress)}> -->  npx expo install react-native-gesture-handler@~2.9.0

            <TouchableOpacity
              style={styles.linkContainer}
              onPress={() => handleLinkPress(item.url)}
              activeOpacity={0.7}
            >
              <TouchableOpacity>
                <Text style={styles.link}>{item.description}</Text>
                <Text style={styles.link}>({item.url})</Text>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => handleDeleteLink(item.linkId)}>
                  <Icon name="delete" type="material" size={20} color="#bb0000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleShare(item.url, item.description)}>
                  <Icon name="share" type="material" size={20} color="#4D13C6" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            // </Swipeable>
          )}
        />
      ) : (
        // before search..
        // : (
        //   <Text style={styles.noLinksText}>Diese Linksammlung enthält keine Links.</Text>
        // )}
        <View style={{ flex: 1 }}>
          <Text style={styles.noLinksText}>Keine Links gefunden.</Text>
        </View>
      )}
      <Button
        title="Link hinzufügen"
        icon={globalStyles.addLinkButton}
        iconContainerStyle={{ marginRight: 10 }}
        titleStyle={{ fontWeight: '700' }}
        buttonStyle={globalStyles.primaryButton}
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
    justifyContent: 'flex-start', // Align children to the start instead of center
    alignItems: 'stretch', // Stretch children to fill the width
    backgroundColor: '#FFFFFF'
  },
  linkContainer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5', // light grey color
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch' // Allow this component to stretch full width
  },
  linkCount: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginLeft: 10
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  description: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'left'
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

  link: {
    fontSize: 16
  },
  noLinksText: {
    fontSize: 16,
    fontStyle: 'italic'
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
