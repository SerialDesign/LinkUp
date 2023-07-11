import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
  Share,
  Modal
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { checkIfUserIdHasValue } from '../helper'
import { Button, Icon } from '@rneui/themed'
import Constants from 'expo-constants'
import globalStyles from '../../assets/styles/globalStyles'
// import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useIsFocused } from '@react-navigation/native'
import { SearchBar } from '@rneui/themed'
import { B } from '../helper'

const Library = ({ navigation, route }) => {
  const [library, setLibrary] = useState(null)
  const userId = route.params.userId
  const libraryId = route.params.libraryId
  const [search, setSearch] = useState('')
  // modal for delete confirmation
  const [isModalVisible, setModalVisible] = useState(false)
  const [selectedLink, setSelectedLink] = useState({ linkId: null, url: '', description: '' })
  const [initialLinkCount, setInitialLinkCount] = useState(0)

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
        setInitialLinkCount(data.links.length)
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

  const handleLinkPress = async (link) => {
    const supported = await Linking.canOpenURL(link)

    if (supported) {
      Linking.openURL(link)
    } else {
      console.log(`Don't know how to open this URL: ${link}`)
    }
  }

  const handleDeleteLink = (link) => {
    console.log('🚀 ***~ file: Library.js:99 ~ handleDeleteLink ~ link:', link)

    setSelectedLink({ linkId: link.linkId, url: link.url, description: link.description })
    setModalVisible(true)
  }

  const confirmDeleteLink = () => {
    console.log('Deleting link:', selectedLink.linkId)

    const endpointUrl =
      Constants.expoConfig.extra.apiUrl +
      `${userId}/library/${library.libraryId}/links/${selectedLink.linkId}/delete`
    console.log('🚀 ~ file: Library.js:110 ~ handleDeleteLink ~ endpointUrl:', endpointUrl)

    fetch(endpointUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(() => {
        setModalVisible(false)
        getAllLinksOfLibrary() // Refresh the list here
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

  const filteredLinks = library.links
    .filter(
      (link) =>
        link.description.toLowerCase().includes(search.toLowerCase()) ||
        link.url.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.description.localeCompare(b.description))

  return (
    <View style={styles.container}>
      {/* // Library info & icon section */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <View style={{ flex: 0.85 }}>
          <Text style={styles.title}>{library.libraryName}</Text>
          <Text style={styles.description}>{library.libraryDesc}</Text>
        </View>
        <View style={{ flex: 0.15, flexDirection: 'row', alignItems: 'center', marginLeft: 15 }}>
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
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchBarInputContainer}
        inputStyle={styles.searchBarInput}
      />

      {/* // Links section */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={styles.sectionTitle}>Links:</Text>
        <Text style={styles.linkCount}>Anzahl Links: {filteredLinks.length}</Text>
      </View>

      {initialLinkCount > 0 ? (
        filteredLinks.length > 0 ? (
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
                  <B>
                    <Text style={styles.link}>{item.description}</Text>
                  </B>
                  <Text style={styles.link}>{item.url}</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('EditLink', { userId, libraryId, linkData: item })
                    }
                  >
                    <Icon name="edit" type="material" size={25} color="#000" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteLink(item)}>
                    <Icon
                      name="delete"
                      type="material"
                      size={25}
                      color="#bb0000"
                      style={styles.iconButton}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleShare(item.url, item.description)}>
                    <Icon
                      name="share"
                      type="material"
                      size={25}
                      color="#4D13C6"
                      style={styles.iconButton}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>

              // </Swipeable>
            )}
          />
        ) : (
          // if no links found over search show this text
          <View style={{ flex: 1 }}>
            <Text style={styles.noLinksText}>Keine Links gefunden.</Text>
          </View>
        )
      ) : (
        // if there are no links in the library show this text
        <View style={{ flex: 1 }}>
          <Text style={styles.noLinksText}>Diese Linksammlung enthält noch keine Links.</Text>
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

      {/* Modal for delete confirmation */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(!isModalVisible)
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Bist du sicher, dass du den Link <B>{selectedLink?.description}</B> (
              {selectedLink?.url}) löschen willst?
            </Text>
            <View style={styles.modalButtonContainer}>
              <Button
                onPress={confirmDeleteLink}
                title="Link löschen"
                color="#bb0000"
                buttonStyle={globalStyles.deleteButton}
                style={styles.modalButton}
              />
              <Button
                onPress={() => setModalVisible(!isModalVisible)}
                title="Abbrechen"
                color="#000"
                buttonStyle={globalStyles.cancelButton}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10
  },

  searchBarContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    paddingHorizontal: 0
  },
  searchBarInputContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8
  },
  searchBarInput: {
    color: 'black'
  },
  link: {
    fontSize: 16,
    marginTop: 5
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
  },
  iconButton: {
    marginLeft: 10
  },

  // modal styles
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center'
  },

  modalButtonContainer: {
    flexDirection: 'row',
    height: 70
  },
  modalButton: {
    flex: 1,
    margin: 10
  }
})

export default Library
