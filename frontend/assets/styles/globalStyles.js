import { StyleSheet } from 'react-native'

const globalStyles = StyleSheet.create({
  width100: {
    width: '100%'
  },
  inputContainer: {
    marginTop: 50,
    marginHorizontal: 30,
    marginVertical: 20
  },
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
  // TODO: alle primaryButton + buttonCenterLayouting in master.css verlagern und neu verlinken auf CreateLibrary, AddLink + Library.. IMPORTANT: be carefull with width of buttonCenterLayouting, 300 on AddLink
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

  deleteButton: {
    backgroundColor: '#FF0000',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 10
  },

  cancelButton: {
    backgroundColor: '#000',
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
