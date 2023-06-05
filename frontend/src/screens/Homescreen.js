import { NavigationContainer, useRoute } from '@react-navigation/native'
import { React, useState, useEffect } from 'react'
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
import { Button, Input, FAB } from '@rneui/themed'

const Homescreen = ({ navigation }) => {
  const route = useRoute()

  // Libraries loading... (over userID)
  const [value, setValue] = useState(null)
  const [libraries, setLibraries] = useState([])

  const userID = route.params.userId
  console.log(userID)
  checkIfUserIdHasValue(userID)

  const getAllLibraries = () => {
    console.log('user: ', userID)
    const endpointUrl = 'http://localhost:8000/' + userID + '/libraries'
    console.log('endpoint: ', endpointUrl)

    fetch(endpointUrl)
      .then((response) => response.json())
      .then((data) => {
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

    getAllLibraries()
  }, [])

  if (!fontLoaded) {
    return <Text>Loading...</Text>
  }

  const renderLibraryBoxes = () => {
    libraries.forEach((library) => addToCollection(library))

    return libraries.map((collection, index) => (
      <TouchableOpacity
        key={index}
        // Todo: with color of library ->  style={[styles.collectionBox, { backgroundColor: collection.color }]}
        style={[styles.collectionBox, { backgroundColor: '#C0E5C6' }]}
        onPress={() => handleCollectionPress(collection.libraryId)}
      >
        <Text style={styles.collectionTitle}>{collection.libraryName}</Text>
        <Text style={styles.collectionDesc}>{collection.libraryDesc}</Text>
        {/* // Hidden field for passing unique library ID */}
        {/* <Text style={{ display: 'none' }}>{collection.libraryId}</Text> */}
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
    navigation.navigate('Library', { userID, libraryId })
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <Text style={styles.title}>Linksammlungen von {userID}</Text>
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
        buttonStyle={{
          backgroundColor: '#13C66A',
          borderColor: 'transparent',
          borderWidth: 0,
          borderRadius: 30
        }}
        containerStyle={{
          width: 300,
          marginHorizontal: 50,
          marginVertical: 10,
          justifyContent: 'center',
          alignSelf: 'center'
        }}
        onPress={() => navigation.navigate('CreateLibrary', { userID })}
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
        buttonStyle={{
          backgroundColor: '#13C66A',
          borderColor: 'transparent',
          borderWidth: 0,
          borderRadius: 30,
          justifyContent: 'center'
        }}
        containerStyle={{
          width: 200,
          marginHorizontal: 50,
          marginVertical: 10,
          justifyContent: 'center',
          alignSelf: 'center'
        }}
        onPress={() => navigation.navigate('AddLink', { userID })}
      />
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
  }
})

export default Homescreen
