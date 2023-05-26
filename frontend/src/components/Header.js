import * as React from 'react'
import { View, Text } from 'react-native'

export default function Header() {
  const getCurrentDate = () => {
    var day = new Date().getDate()
    var month = new Date().getMonth() + 1
    var year = new Date().getFullYear()

    return day + '.' + month + '.' + year //format: d.m.y;
  }

  return (
    <View style={{ flex: 0.3, backgroundColor: '#F4CE14' }}>
      <Text style={{ paddingTop: 10 }}></Text>
      <Text
        style={{
          paddingLeft: 60,
          paddingTop: 50,
          paddingBottom: 10,
          fontSize: 30,
          color: 'black'
        }}
        numberOfLines={3}
      >
        <Text style={{ fontWeight: 'bold' }}>Bibliothek hinzufügen</Text>
      </Text>
      <Text style={{ fontWeight: 'bold', paddingLeft: 170, paddingBottom: 100 }}>
        {getCurrentDate()}
      </Text>
    </View>
  )
}
