import { StyleSheet } from 'react-native'

const globalStyles = StyleSheet.create({
  primaryInput: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 20,
    marginTop: 10,
    backgroundColor: '#EEF0F7'
  },
  inputDescription: {
    borderWidth: 0.5,
    borderColor: 'gray',
    padding: 20,
    marginTop: 10
  },

  primaryButton: {
    backgroundColor: '#13C66A',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 10
  },

  qrCodeButton: {
    backgroundColor: '#4D13C6',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 10
  },

  buttonCenterLayouting: {
    width: 300,
    marginHorizontal: 50,
    marginVertical: 10,
    justifyContent: 'center',
    alignSelf: 'center'
  },

  addLinkButton: {
    name: 'link',
    type: 'material',
    size: 25,
    color: 'white'
  }
})

export default globalStyles
