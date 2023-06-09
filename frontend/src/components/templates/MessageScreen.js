import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native'
import LinkLibraryBox from '../LinkLibraryBox'

const MessageScreen = () => {
  const route = useRoute()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Linksammlungen von {route.params.user}</Text>
      <LinkLibraryBox></LinkLibraryBox>
    </View>
  )
}

export default MessageScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'green',
    marginTop: 50
  }
})
