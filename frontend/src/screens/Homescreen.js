import React, { useState, useEffect, useCallback } from 'react'
import { useRoute } from '@react-navigation/native'
import { useFocusEffect } from '@react-navigation/native'
import { checkIfUserIdHasValue } from '../helper'
import * as Font from 'expo-font'
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, ImageBackground } from 'react-native'
import { Button, Input, FAB, SearchBar } from '@rneui/themed'
import Constants from 'expo-constants'
import { Icon } from '@rneui/base'
import { B } from '../helper'

const Homescreen = ({ navigation }) => {
  const route = useRoute()

  const [value, setValue] = useState(null)
  const [libraries, setLibraries] = useState([])
  const [search, setSearch] = useState('')
  const [showFavorited, setShowFavorited] = useState(false)

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
      (!showFavorited || library.favorited) &&
      (library.libraryName.toLowerCase().includes(search.toLowerCase()) ||
        library.libraryDesc.toLowerCase().includes(search.toLowerCase()) ||
        library.favorited)
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
            <View style={[styles.starIconContainer, styles.starContainerActive]}>
              <Icon name="star" type="material" size={20} color="yellow" />
            </View>
          ) : (
            <View style={styles.starIconContainer}>
              <Icon name="star" type="material" size={20} color="grey" />
            </View>
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

  const toggleFavoritedFilter = () => {
    setShowFavorited(!showFavorited)
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
      <SearchBar
        placeholder="Suche..."
        onChangeText={updateSearch}
        value={search}
        backgroundColor="white"
        inputStyle={{ backgroundColor: 'white' }}
        inputContainerStyle={{ backgroundColor: 'white' }}
      />
      <View style={styles.buttonsContainer}>
        <Button
          // title="Bibliothek hinzufügen"
          title="Linksammlung hinzufügen"
          icon={{
            name: 'add-to-photos',
            type: 'material',
            size: 18,
            color: 'white'
          }}
          iconContainerStyle={{ marginRight: 10 }}
          titleStyle={{ fontWeight: '700', textAlign: 'left' }}
          buttonStyle={[styles.libraryColor, styles.buttonStyle]}
          containerStyle={styles.buttonCenterLayouting}
          onPress={() =>
            navigation.navigate('CreateLibrary', { userId, refreshLibraries: fetchLibraries })
          }
        />
        <Button
          icon={{
            name: 'link',
            type: 'material',
            size: 25,
            color: 'white'
          }}
          iconContainerStyle={{ marginRight: 10 }}
          titleStyle={{ fontWeight: '700' }}
          buttonStyle={[styles.linkColor, styles.buttonStyle]}
          containerStyle={styles.buttonCenterLayouting}
          onPress={() => navigation.navigate('AddLink', { userId })}
        >
          <Text style={{ fontWeight: '700', fontSize: 18, textAlign: 'left', color: 'white' }}>
            Link{'\n'}hinzufügen
          </Text>
        </Button>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
        <Text style={styles.title}>Linksammlungen von {userId}</Text>
        <TouchableOpacity onPress={toggleFavoritedFilter} style={styles.starButton}>
          <View style={[styles.starContainer, showFavorited && styles.starContainerActive]}>
            <Icon
              name="star"
              type="material"
              size={30}
              color={showFavorited ? 'yellow' : 'lightgrey'}
            />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>{renderLibraryBoxes()}</View>
      <ImageBackground
        source={require('../../assets/images/master_of_bookmarks.png')}
        style={styles.bookmarksIllustration}
        resizeMode="contain"
      />
      {libraries.length == 0 && filteredLibraries.length == 0 && !showFavorited && (
        <>
          <Text style={styles.hint}>
            Du hast noch keine Linksammlung. {'\n'} {'\n'} Erfasse deine Erste indem du auf den
            blauen Button '<B>Linksammlung hinzufügen</B>' klickst.
          </Text>
        </>
      )}

      {/* // TODO: wieder einbauen? Anzeige von Icon? */}
      {/* {filteredLibraries.length == 0 && !showFavorited && (
        <>
          <Text style={styles.hint}>
            Du hast noch keine Linksammlung, erfasse deine Erste indem du auf den blauen Button
            Linksammlung hinzufügen klickst.
          </Text>
          <ImageBackground
            source={require('../../assets/images/master_of_bookmarks.png')}
            style={styles.bookmarksIllustration}
            resizeMode="contain"
          />
        </>
      )} */}
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
    borderColor: '#eee',
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    // alignItems: 'center',
    margin: 10,
    elevation: 5
  },
  collectionTitle: {
    fontFamily: 'Rubik-Black',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'left',
    marginLeft: 20,
    marginBottom: 10
  },
  collectionDesc: {
    textAlign: 'left',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    color: '#525F7F'
  },
  title: {
    flex: 0.8,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#525F7F',
    marginTop: 30,
    marginLeft: 20,
    marginBottom: 20
  },
  hint: {
    fontSize: 18,
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20
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
    marginTop: 50
  },
  libraryColor: {
    backgroundColor: '#59B9F5',
    borderRadius: 10
    // borderWidth: 2,
    // borderColor: '#3A8BCB'
  },
  linkColor: {
    backgroundColor: '#13C66A',
    // borderColor: '#0F9A57',
    // borderWidth: 2,
    borderRadius: 10
  },
  buttonCenterLayouting: {
    width: 200, //300
    marginHorizontal: 50,
    marginVertical: 10,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  // buttons side by side
  // buttonsContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-around',
  //   alignItems: 'center',
  //   marginVertical: 10
  // }
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 10
  },

  buttonStyle: {
    width: 175,
    height: 80,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderStyle: 'solid',
    borderColor: '#000000',
    borderWidth: 1,
    marginLeft: 12
  },

  starIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'lightgrey',
    marginLeft: 130
  },

  starIcon: {
    borderWidth: 1,
    borderColor: 'lightgrey'
  },

  starButton: {
    flex: 0.2,
    marginLeft: 10
  },

  starContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'lightgrey',
    fontSize: 18
  },

  starContainerActive: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700'
  }
})

export default Homescreen
