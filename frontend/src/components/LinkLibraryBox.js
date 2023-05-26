import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const LinkLibraryBox = () => {
  return (
    <View style={styles.libraryBox}>
      <Text style={styles.headerText}>Linksammlung123</Text>
      <Text>101 Links..</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  libraryBox: {
    backgroundColor: '#ddd'
  },
  headerText: {
    padding: 40,
    fontSize: 30,
    color: '#11aa11',
    textAlign: 'center'
  }
})

export default LinkLibraryBox
