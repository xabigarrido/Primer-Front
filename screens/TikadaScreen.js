import React, { useState, useEffect } from "react";
import {
  Platform,
  Text,
  View,
  StyleSheet,
  Alert,
  ImageBackground,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker, Callout } from "react-native-maps";
import { Button, FAB } from "@react-native-material/core";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { changeInfo } from "../features/userStore";
import { changeInfoUser, entradaTikada, salidaTikada } from "../api";
import fondo from "../assets/fondoScreentikada.jpg";

export default function App({ navigation }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [fecha, setFecha] = useState(null);

  const user = useSelector((state) => state.userStore);
  const dispatch = useDispatch();

  const handleTikado = () => {
    if (user.tikado == false) {
      dispatch(changeInfo(!user.tikado));
      changeInfoUser(user._id, !user.tikado);
      const newTikada = {
        idEmpleado: user._id,
        estado: "abierta",
        entrada: fecha,
        salida: "Ninguna",
        mes: "Septiembre",
        comentario: "Ninguno",
      };
      entradaTikada(newTikada);
      navigation.navigate("TabScreen");
    } else {
      Alert.alert("No puedes tikar la entrada si ya has tikado");
    }
  };

  const handleSalida = () => {
    if (user.tikado == true) {
      dispatch(changeInfo(!user.tikado));
      changeInfoUser(user._id, !user.tikado);
      const newSalida = {
        salida: fecha,
      };
      salidaTikada(user._id, newSalida);
      navigation.navigate("TabScreen");
    } else {
      Alert.alert("No puedes tikar la salida si no has tikado la entrada");
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
    const newDay = moment().format("DD/MM/YYYY HH:mm:ss ");
    setFecha(newDay);
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }
  return (
    <ImageBackground
      source={fondo}
      resizeMode="cover"
      style={{ flex: 1, justifyContent: "center" }}
    >
      <View>
        {location === null ? (
          <View>
            <Text>sss</Text>
          </View>
        ) : (
          <>
            <View
              style={{
                position: "absolute",
                zIndex: 1000,
                backgroundColor: "#00000099",
                height: 150,
                width: "90%",
                top: "5%",
                left: "5%",
                right: 0,
                bottom: 40,
                padding: 10,
                borderRadius: 5,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#ffffff",
                  width: "80%",
                  height: 50,
                  marginVertical: 10,
                  borderRadius: 10,
                  justifyContent: "center",
                }}
              >
                <Text style={{ textAlign: "center", fontSize: 18 }}>
                  {fecha}
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Button
                  onPress={handleTikado}
                  title="Entrada"
                  style={{
                    marginRight: 5,
                    backgroundColor: "green",
                    width: 145,
                    padding: 5,
                  }}
                />
                <Button
                  onPress={handleSalida}
                  title="Salida"
                  style={{ backgroundColor: "red", width: 145, padding: 5 }}
                />
              </View>
            </View>
            <MapView
              region={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              style={{ width: "100%", height: "100%" }}
            >
              <Marker
                key="1"
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="Dia 5"
                description="Hora: 20:00"
              >
                <Callout tooltip={true} />
              </Marker>
            </MapView>
          </>
        )}
      </View>
    </ImageBackground>
  );
}
