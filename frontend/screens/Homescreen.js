import { useRoute } from '@react-navigation/native'
import { React, useState, useEffect } from 'react'
import * as Font from 'expo-font'
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native'
import LinkLibraryBox from './components/LinkLibraryBox'
import { Button } from '@rneui/themed'
import CreateLibrary from './CreateLibrary'

const Homescreen = () => {
  const route = useRoute()

  const [fontLoaded, setFontLoaded] = useState(false)

  // Font loading..
  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        'Rubik-Black': require('../assets/fonts/Rubik/Rubik-Black.ttf')
      })

      setFontLoaded(true)
    }

    loadFont()
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
    <ScrollView
    // contentContainerStyle={{
    //   justifyContent: 'center',
    //   alignItems: 'center'
    // }}
    >
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
      <View style={styles.container}>{renderLinkCollections()}</View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5'
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
  }
})

export default Homescreen
