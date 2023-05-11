import { ScrollView } from 'react-native'
import { Button, Icon, Text } from '@rneui/themed'

export default function HomeScreen() {
  return (
    <ScrollView>
      <Text>Deine Bibliotheken</Text>

      <Icon
        color="#0CC"
        containerStyle={{}}
        disabledStyle={{}}
        iconProps={{}}
        iconStyle={{}}
        name="star"
        onLongPress={() => console.log('onLongPress()')}
        onPress={() => console.log('onPress()')}
        size={40}
        type="font-awesome"
      />
      <Button>Link / Sammlung hinzufügen</Button>
    </ScrollView>
  )
}
