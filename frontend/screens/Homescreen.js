import { useRoute } from '@react-navigation/native'
import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import LinkLibraryBox from './components/LinkLibraryBox'

const Homescreen = () => {
  const route = useRoute()

  const linkCollections = [
    { title: 'News', color: '#FF6347' },
    { title: 'Entertainment', color: '#FFA500' },
    { title: 'Sports', color: '#7FFF00' },
    { title: 'Technology', color: '#00BFFF' }
  ]

  const renderLinkCollections = () => {
    return linkCollections.map((collection, index) => (
      <TouchableOpacity
        key={index}
        style={[styles.collectionBox, { backgroundColor: collection.color }]}
        onPress={() => handleCollectionPress(collection.title)}
      >
        <Text style={styles.collectionTitle}>{collection.title}</Text>
      </TouchableOpacity>
    ))
  }

  const handleCollectionPress = (title) => {
    // Handle collection press event here
    console.log(`Pressed ${title}`)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Linksammlungen von {route.params.user}</Text>
      <View style={styles.container}>{renderLinkCollections()}</View>
    </View>
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'green',
    marginTop: 50
  }
})

export default Homescreen
