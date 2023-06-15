import { NavigationContainer, useRoute, useFocusEffect } from '@react-navigation/native'
import { React, useState, useEffect, useCallback } from 'react'
import { Dropdown } from 'react-native-element-dropdown'
import AntDesign from '@expo/vector-icons/AntDesign'
import { checkIfUserIdHasValue } from '../helper'
import * as Font from 'expo-font'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  ImageBackground
} from 'react-native'
import { Button, Input, FAB, SearchBar } from '@rneui/themed'

const Homescreen = ({ navigation }) => {
  const route = useRoute()

  // Libraries loading... (over userID)
  const [value, setValue] = useState(null)
  const [libraries, setLibraries] = useState([])
  const [search, setSearch] = useState('')

  const userId = route.params.userId
  checkIfUserIdHasValue(userId)

  const getAllLibraries = () => {
    console.log('Getting all libraries for user: ', userId)
    console.log('user: ', userId)
    const endpointUrl = 'http://localhost:8000/' + userId + '/libraries'
    console.log('endpoint: ', endpointUrl)

    fetch(endpointUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log('API response: ', data)
        const libraries = data.map((library) => {
          return {
            libraryId: library.libraryId,
            libraryName: library.libraryName,
            libraryDesc: library.libraryDesc
          }
        })

        setLibraries(libraries)
      })
  }

  // Font loading..
  const [fontLoaded, setFontLoaded] = useState(false)

  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        'Rubik-Black': require('../../assets/fonts/Rubik/Rubik-Black.ttf')
      })

      setFontLoaded(true)
    }

    loadFont()

    // needed to refresh the library list after creating a new library (without calling the endpoint endlessly)
    const unsubscribeFocus = navigation.addListener('focus', () => {
      getAllLibraries()
    })

    // Cleanup function
    return () => {
      unsubscribeFocus()
    }
  }, [navigation])

  if (!fontLoaded) {
    return <Text>Loading...</Text>
  }

  // search filter tryout
  const filteredLibraries = libraries.filter((library) => {
    return (
      library.libraryName.toLowerCase().includes(search.toLowerCase()) ||
      library.libraryDesc.toLowerCase().includes(search.toLowerCase())
    )
  })

  // Render Libraries
  const renderLibraryBoxes = () => {
    return filteredLibraries.map((library, index) => (
      //return libraries.map((library, index) => (
      <TouchableOpacity
        key={index}
        // Todo: with color of library ->  style={[styles.collectionBox, { backgroundColor: collection.color }]}
        style={[styles.collectionBox, { backgroundColor: '#C0E5C6' }]}
        onPress={() => handleCollectionPress(library.libraryId)}
      >
        <Text style={styles.collectionTitle}>{library.libraryName}</Text>
        <Text style={styles.collectionDesc}>{library.libraryDesc}</Text>
      </TouchableOpacity>
    ))
  }

  const libraryCollection = []

  const addToCollection = (library) => {
    libraryCollection.push(library)
    console.log('library ' + library.libraryName + ' pushed.. desc:' + library.libraryDesc)
  }

  const handleCollectionPress = (libraryId) => {
    // Handle collection press event here
    console.log(`Pressed ${libraryId}`)
    navigation.navigate('Library', { userId, libraryId })
  }

  const updateSearch = (search) => {
    console.log('🚀 ~ file: Homescreen.js:107 ~ updateSearch ~ search:', search)
    setSearch(search)

    // Add your filtering logic here
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
          onPress={() => navigation.navigate('CreateLibrary', { userId })}
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
      <FAB title="+" color="#13C66A" style={styles.floatingButton} />
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
