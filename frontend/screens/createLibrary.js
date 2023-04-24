import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { Button, Icon } from "@rneui/themed";
import { Input } from "@rneui/base";
import { Alert } from "react-native";
import { useState } from "react";
import Header from "./Header";

export default function CreateLibrary() {
  const [name, setName] = useState("");
  const [libraryName, setLibraryName] = useState("");
  const [libraryDesc, setLibraryDesc] = useState("");
  const [libraryLabels, setLibraryLabels] = useState("");

  const validateForm = function () {
    Alert.alert();
  };

  const createLibrary = () => {
    const endpointUrl = "http://localhost:8000/library/create";
    const payload = {
      userId: "user12345",
      libraryId: "example123456",
      libraryName: libraryName,
      links: [
        {
          url: "url",
          description: "desc",
        },
        {
          url: "url",
          description: "desc",
        },
        {
          url: "url",
          description: "desc",
        },
      ],
    };

    console.log(JSON.stringify(payload));

    fetch(endpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).catch((error) => {
      console.error(error);
    });
  };

  return (
    <View>
      <View>
        <Input
          placeholder="Name der Bibliothek"
          onChangeText={setLibraryName}
          // errorStyle={{ color: "red" }}
          // errorMessage="Pflichtfeld"
        />
        <Input placeholder="Beschreibung" onChangeText={setLibraryDesc} />
        <Input placeholder="#Labels" onChangeText={setLibraryLabels} />

        <Button
          title=""
          radius={"sm"}
          type="solid"
          buttonStyle={{ backgroundColor: "rgba(127, 220, 103, 1)" }}
          containerStyle={{ marginHorizontal: 30, marginVertical: 20 }}
          titleStyle={{
            marginHorizontal: 20,
            fontWeight: "bold",
          }}
          onPress={
            createLibrary
            // Alert.alert(name);
            // console.warn(
            //   "Bibliothekname: " + libraryName + ", ",
            //   "Beschreibung: " + libraryDesc + ", ",
            //   "Labels: " + libraryLabels
            // );
          }
          //validatefForm()
        >
          Bibliothek speichern
          <Icon name="save" color="white" />
        </Button>
      </View>
    </View>
  );
}

// class CreateLibrary extends React.Component {
//   constructor() {
//     super();
//     this.state = {
//       name: "",
//       desc: "",
//       labels: "",
//     };
//   }

//   render() {
//     return <View></View>;
//   }
// }
