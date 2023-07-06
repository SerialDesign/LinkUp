import React, { useState, useEffect, useCallback } from 'react'
import { useRoute } from '@react-navigation/native'
import { useFocusEffect } from '@react-navigation/native'
import { checkIfUserIdHasValue } from '../helper'
import * as Font from 'expo-font'
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, ImageBackground } from 'react-native'
import { Button, Input, FAB, SearchBar } from '@rneui/themed'
import Constants from 'expo-constants'
import { Icon } from '@rneui/base'

const Homescreen = ({ navigation }) => {
  const route = useRoute()

  const [value, setValue] = useState(null)
  const [libraries, setLibraries] = useState([])
  const [search, setSearch] = useState('')

  const userId = route.params.userId
  checkIfUserIdHasValue(userId)

  const getAllLibraries = async () => {
    console.log('Getting all libraries for user: ', userId)
    console.log('user: ', userId)
    const endpointUrl = Constants.expoConfig.extra.apiUrl + userId + '/libraries'
    console.log('endpoint: ', endpointUrl)

    const response = await fetch(endpointUrl)
    const data = await response.json()

    const libraries = data.map((library) => ({
      libraryId: library.libraryId,
      libraryName: library.libraryName,
      libraryDesc: library.libraryDesc,
      libraryColor: library.libraryColor,
      favorited: library.favorited ? library.favorited : false
    }))

    setLibraries(libraries)
  }

  const fetchLibraries = useCallback(() => {
    getAllLibraries()
  }, [])

  useFocusEffect(fetchLibraries)

  const [fontLoaded, setFontLoaded] = useState(false)

  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        'Rubik-Black': require('../../assets/fonts/Rubik/Rubik-Black.ttf')
      })

      setFontLoaded(true)
    }

    loadFont()
  }, [])

  if (!fontLoaded) {
    return <Text>Loading...</Text>
  }

  const filteredLibraries = libraries.filter((library) => {
    return (
      library.libraryName.toLowerCase().includes(search.toLowerCase()) ||
      library.libraryDesc.toLowerCase().includes(search.toLowerCase()) ||
      library.favorited
    )
  })

  const renderLibraryBoxes = () => {
    return filteredLibraries.map((library, index) => (
      <TouchableOpacity
        key={index}
        style={[
          styles.collectionBox,
          { backgroundColor: library.libraryColor ? library.libraryColor : '#C0E5C6' }
        ]}
        onPress={() => handleCollectionPress(library.libraryId)}
      >
        <Text style={styles.collectionTitle}>{library.libraryName}</Text>
        <Text style={styles.collectionDesc}>{library.libraryDesc}</Text>
        <TouchableOpacity onPress={() => favorizeLibrary(library.libraryId)}>
          {library.favorited ? (
            <Icon name="star" type="material" size={20} color="yellow" />
          ) : (
            <Icon name="star" type="material" size={20} color="grey" />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    ))
  }

  const handleCollectionPress = (libraryId) => {
    console.log(`Pressed ${libraryId}`)
    navigation.navigate('Library', { userId, libraryId })
  }

  const updateSearch = (search) => {
    console.log('🚀 ~ file: Homescreen.js:107 ~ updateSearch ~ search:', search)
    setSearch(search)
  }

  const updateLibraryFavorited = (libraryId, favorited) => {
    setLibraries((prevLibraries) =>
      prevLibraries.map((library) =>
        library.libraryId === libraryId ? { ...library, favorited } : library
      )
    )
  }

  const favorizeLibrary = (libraryId) => {
    // call endpoint /:userId/library/:libraryId

    const getLibraryEndpoint = Constants.expoConfig.extra.apiUrl + userId + '/library/' + libraryId
    let libraryIsFavorited = false

    fetch(getLibraryEndpoint)
      .then((response) => response.json())
      .then((data) => {
        if (data.favorited) {
          libraryIsFavorited = true
          console.log('The library is favorited')
        } else {
          libraryIsFavorited = false
          console.log('The library is not favorited')
        }
      })
      .catch((error) => console.error(error))
      .finally(() => {
        const favEndpoint =
          Constants.expoConfig.extra.apiUrl + userId + '/library/' + libraryId + '/favorite'

        console.log('endpoint: ', favEndpoint)

        // favorite library if it is not favorited already..
        if (libraryIsFavorited == false) {
          // call the endpoint
          console.log('favorize library')
          fetch(favEndpoint, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              libraryId: libraryId
            })
          })
            .then((data) => {
              // Handle successful deletion
              // You can update the library state or perform any other actions here
            })
            .catch((error) => {
              console.error(error)
            })
        } else {
          console.log('unfavorize library')
          fetch(favEndpoint, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              libraryId: libraryId
            })
          })
            .then((data) => {
              // Handle successful deletion
              // You can update the library state or perform any other actions here
            })
            .catch((error) => {
              console.error(error)
            })
        }

        // Update the library's favorited status in the state
        updateLibraryFavorited(libraryId, !libraryIsFavorited)
      })
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <SearchBar placeholder="Suche..." onChangeText={updateSearch} value={search} />
      <Text style={styles.title}>Linksammlungen von {userId}</Text>
      <View style={styles.buttonsContainer}>
        <Button
          title="Bibliothek hinzufügen"
          icon={{
            name: 'add-to-photos',
            type: 'material',
            size: 25,
            color: 'white'
          }}
          iconContainerStyle={{ marginRight: 10 }}
          titleStyle={{ fontWeight: '700' }}
          buttonStyle={styles.libraryColor}
          containerStyle={styles.buttonCenterLayouting}
          onPress={() =>
            navigation.navigate('CreateLibrary', { userId, refreshLibraries: fetchLibraries })
          }
        />
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
      <View style={styles.container}>{renderLibraryBoxes()}</View>
      <ImageBackground
        source={require('../../assets/images/master_of_bookmarks.png')}
        style={styles.bookmarksIllustration}
        resizeMode="contain"
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: '#FFFFFF'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  collectionBox: {
    width: 300,
    height: 150,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    elevation: 5
  },
  collectionTitle: {
    fontFamily: 'Rubik-Black',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000'
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#525F7F',
    marginTop: 30,
    marginLeft: 20
  },
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#13C66A',
    position: 'absolute',
    bottom: 70,
    right: 30
  },
  bookmarksIllustration: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginTop: 100
  },
  libraryColor: {
    backgroundColor: '#59B9F5',
    borderRadius: 10
    // borderWidth: 2,
    // borderColor: '#3A8BCB'
  },
  primaryButton: {
    backgroundColor: '#13C66A',
    // borderColor: '#0F9A57',
    // borderWidth: 2,
    borderRadius: 30
  },
  buttonCenterLayouting: {
    width: 200, //300
    marginHorizontal: 50,
    marginVertical: 10,
    justifyContent: 'center',
    alignSelf: 'center'
  }
  // buttons side by side
  // buttonsContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-around',
  //   alignItems: 'center',
  //   marginVertical: 10
  // }
})

export default Homescreen
