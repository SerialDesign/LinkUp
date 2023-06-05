import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Homescreen from '../screens/Homescreen'
import CreateLibrary from '../screens/CreateLibrary'

const Tab = createBottomTabNavigator()

const Tabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Homescreen} />
      <Tab.Screen name="CreateLibrary" component={CreateLibrary} />
    </Tab.Navigator>
  )
}

export default Tabs
