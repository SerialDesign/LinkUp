import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import LoginScreen from './screens/LoginScreen'

const BottomNavigator = createBottomTabNavigator()

// Homescreen for BootomNavigation (Footer)
const FooterNav = () => {
  return (
    <View style={{ flex: 1 }}>
      <BottomNavigator.Navigator screenOptions={{ headerShown: false }}>
        <BottomNavigator.Screen
          name="LoginScreen"
          options={{ title: 'LoginScreen' }}
          component={LoginScreen}
        />
      </BottomNavigator.Navigator>
    </View>
  )
}

export default FooterNav
