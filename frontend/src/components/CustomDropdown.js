import React, { useState } from 'react'
import { View } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'

const CustomDropdown = ({ colors }) => {
  const [selectedColor, setSelectedColor] = useState(null)

  const dropdownItems = colors.map((color, index) => ({
    label: `Color ${index + 1}`,
    value: color
  }))

  return (
    <View>
      <Dropdown
        label="Select a color"
        data={dropdownItems}
        value={selectedColor}
        onChangeText={(value) => setSelectedColor(value)}
      />
    </View>
  )
}

export default CustomDropdown
