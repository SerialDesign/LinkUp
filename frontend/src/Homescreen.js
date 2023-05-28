import { NavigationContainer, useRoute } from '@react-navigation/native'
import { React, useState, useEffect } from 'react'
import { Dropdown } from 'react-native-element-dropdown'
import AntDesign from '@expo/vector-icons/AntDesign'
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
import LinkLibraryBox from './components/LinkLibraryBox'
import { Button } from '@rneui/themed'
import CreateLibrary from './CreateLibrary'
import { FAB } from '@rneui/themed'

const Homescreen = () => {
  const route = useRoute()

  // Libraries loading... (over userID)
  const [value, setValue] = useState(null)
  const [libraries, setLibraries] = useState([])

  const getAllLibraries = () => {
    const userID = route.params.user
    console.log('user: ', userID)
    const endpointUrl = 'http://localhost:8000/' + userID + '/libraries'
    console.log('endpoint: ', endpointUrl)

    fetch(endpointUrl)
      .then((response) => response.json())
      .then((data) => {
        const libraries = data.map((library) => {
          return {
            label: library.libraryName,
            value: library.libraryId
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
        'Rubik-Black': require('../assets/fonts/Rubik/Rubik-Black.ttf')
      })

      setFontLoaded(true)
    }

    loadFont()

    getAllLibraries()
  }, [])

  if (!fontLoaded) {
    return <Text>Loading...</Text>
  }

  const linkCollections = [
    { title: 'News', color: '#CFECFE', desc: 'Beschreibung' },
    { title: 'Entertainment', color: '#C0E5C6' },
    { title: 'School', color: '#EFE0FF' },
    { title: 'Technology', color: '#FEFFE0' }
  ]

  const renderLinkCollections = () => {
    return linkCollections.map((collection, index) => (
      <TouchableOpacity
        key={index}
        style={[styles.collectionBox, { backgroundColor: collection.color }]}
        onPress={() => handleCollectionPress(collection.title)}
      >
        <Text style={styles.collectionTitle}>{collection.title}</Text>
        <Text style={styles.collectionDesc}>{collection.desc}</Text>
      </TouchableOpacity>
    ))
  }

  const handleCollectionPress = (title) => {
    // Handle collection press event here
    console.log(`Pressed ${title}`)
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <Text style={styles.title}>Linksammlungen von {route.params.user}</Text>
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
      />

      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={libraries.length > 0 ? libraries : [{ label: 'No libraries found', value: null }]}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Libraries.."
        searchPlaceholder="Suche..."
        value={value}
        onChange={(item) => {
          setValue(item.value)
        }}
        renderLeftIcon={() => (
          <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
        )}
      />
      <View style={styles.container}>{renderLinkCollections()}</View>
      <FAB title="+" color="#13C66A" style={styles.floatingButton} />
      <ImageBackground
        source={require('../assets/images/master_of_bookmarks.png')}
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
