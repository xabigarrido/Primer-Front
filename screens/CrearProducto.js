import React, { useState, useEffect, useRef } from "react";
import {
  Image,
  View,
  Platform,
  Text,
  ScrollView,
  Alert,
  ImageBackground,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { TextInput, Button } from "@react-native-material/core";
import { API } from "../api";
import fondo from "../assets/fondoScreen.jpg";

export default function ProductByIdScreen() {
  const [pickCategory, setPickCategory] = useState("Botella");
  const [listImage, setListImage] = useState([]);
  const [nombre, setNombre] = useState();
  const [precio, setPrecio] = useState();

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setListImage([...listImage, result.uri]);
    }
  };

  const sendImg = async (lista) => {
    if (pickCategory == "" || listImage == "" || nombre == "" || precio == "") {
      Alert.alert("Debes rellenar todos los campos");
    } else {
      for (let i = 0; i < lista.length; i++) {
        console.log("agrega imagen al producto");
        let filename = lista[i].split("/").pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : "image";
        let data = new FormData();
        data.append("image", { uri: lista[i], name: filename, type });
        data.append("nombre", nombre);
        data.append("categoria", pickCategory);
        data.append("precio", precio);

        const query = await fetch(`${API}/products/add`, {
          method: "POST",
          body: data,
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log(await query.json());
      }
      setPickCategory("Botella");
      setNombre();
      setPrecio();
      setListImage([]);
    }
  };
  return (
    <ImageBackground
      source={fondo}
      resizeMode="cover"
      style={{ flex: 1, justifyContent: "center" }}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <View style={{ width: "95%", backgroundColor: "#F6F6F6", alignItems: 'center', paddingVertical: 15, borderRadius: 15}}>
          <TextInput
            variant="outlined"
            value={nombre}
            style={{ width: "95%" }}
            placeholder="Nombre Producto"
            onChangeText={(text) => setNombre(text)}
          />
          <TextInput
            variant="outlined"
            value={precio}
            style={{ width: "95%" }}
            placeholder="Precio"
            onChangeText={(text) => setPrecio(text)}
          />

          <Picker
            style={{
              width: "95%",
              backgroundColor: "#EBEBEB",
              marginBottom: 20,
            }}
            selectedValue={pickCategory}
            onValueChange={(itemValue, itemIndex) => setPickCategory(itemValue)}
          >
            <Picker.Item label="Botella" value="Botella" />
            <Picker.Item label="Refresco" value="Refresco" />
            <Picker.Item label="Cerveza" value="Cerveza" />
            <Picker.Item label="Chupito" value="Chupito" />
            <Picker.Item label="Champagne" value="Champagne" />
            <Picker.Item label="Cachimbas" value="Cachimbas" />
            <Picker.Item label="Vapers" value="Vapers" />
          </Picker>
          {listImage.length < 1 && (
            <Button
              title="Imagen del producto"
              style={{ backgroundColor: "red", marginBottom: 10 }}
              onPress={pickImage}
            />
          )}
          {listImage.map((item, index) => (
            <View
              key={index}
              style={{
                width: 150,
                height: 150,
                backgroundColor: "white",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 25,
                marginBottom: 30,
              }}
            >
              <Image
                key={index}
                source={{ uri: item }}
                style={{ width: 120, height: 120 }}
              />
            </View>
          ))}
          <Button
            title="Enviar"
            style={{ backgroundColor: "orange" }}
            onPress={() => sendImg(listImage)}
          />
        </View>
      </View>
    </ImageBackground>
  );
}
