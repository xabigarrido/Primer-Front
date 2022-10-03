import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Button,
  Platform,
  ImageBackground,
  StyleSheet,
} from "react-native";
import fondo from "../assets/fondoScreen.jpg";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import React, { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";

// Ajustes notification

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

//Fin

import mesas from "../assets/mesasScreen.png";
import comanda from "../assets/comanda.png";
import ubicacion from "../assets/ubicacion.jpg";
import agregar from "../assets/agregar.jpg";
import fotoDefault from "../assets/unnamed.jpg";
import salir from "../assets/salir.jpg";
import { addToken } from "../api";

const HomeScreen = ({ navigation }) => {
  const user = useSelector((state) => state.userStore);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const idMesa = response.notification.request.content.data.idMesa
        navigation.navigate('EstadoMesaScreen', {id: idMesa})
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    const newExpoToken = {
      idEmpleado: user._id,
      nombreEmpleado: user.nombre,
      rango: user.rango,
      token: expoPushToken,
      contenido: "vacio",
      enviadoPor: "vacio",
      habilitado: true,
    };
    addToken(newExpoToken);
  }, [expoPushToken]);

  const removeAsync = async () => {
    await AsyncStorage.removeItem("LoginUser");
    console.log("paso");
    navigation.navigate("LoginScreen");
  };

  return (
    <ImageBackground
      source={fondo}
      resizeMode="cover"
      style={{ flex: 1, justifyContent: "center" }}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          height: "100%",
          width: "100%",
          justifyContent: "space-around",
        }}
      >
        <View style={styles.containerBotones}>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => navigation.navigate("PickMesaScreen")}
            >
              <View style={styles.ventanaBoton}>
                <Image
                  source={comanda}
                  style={{ width: 80, height: 80, borderRadius: 30 }}
                />
                <View style={styles.ventanaTextBotones}>
                  <Text style={styles.textBoton}>Nueva Comanda</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("MesasScreen")}
            >
              <View style={styles.ventanaBoton}>
                <Image
                  source={mesas}
                  style={{ width: 80, height: 80, borderRadius: 30 }}
                />
                <View style={styles.ventanaTextBotones}>
                  <Text style={styles.textBoton}>Mesas</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("PruebasScreen")}
            >
              <View style={styles.ventanaBoton}>
                <Image
                  source={agregar}
                  style={{ width: 80, height: 80, borderRadius: 30 }}
                />
                <View style={styles.ventanaTextBotones}>
                  <Text style={styles.textBoton}>Agregar Producto</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => navigation.navigate("TikadaScreen")}
            >
              <View style={styles.ventanaBoton}>
                <Image
                  source={ubicacion}
                  style={{ width: 80, height: 80, borderRadius: 30 }}
                />
                <View style={styles.ventanaTextBotones}>
                  <Text style={styles.textBoton}>Tikar</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removeAsync()}>
              <View style={styles.ventanaBoton}>
                <Image
                  source={salir}
                  style={{ width: 80, height: 80, borderRadius: 30 }}
                />
                <View style={styles.ventanaTextBotones}>
                  <Text style={styles.textBoton}>Salir</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            width: "90%",
            backgroundColor: "#FFFFFF90",
            borderWidth: 1,
            borderColor: "white",
            borderRadius: 25,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,

            elevation: 5,
          }}
        >
          <View
            style={{
              padding: 10,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={fotoDefault}
              style={{
                height: 100,
                width: 100,
                borderRadius: 50,
                borderWidth: 0.3,
              }}
            />
            <View style={{ alignContent: "center", padding: 10 }}>
              <View style={styles.burbuja}>
                <Text
                  style={{ color: "white", textAlign: "center", fontSize: 18 }}
                >
                  {user.nombre} {user.apellidos}
                </Text>
              </View>

              <View
                style={{ ...styles.burbuja, width: "40%", marginVertical: 3 }}
              >
                <Text style={{ color: "white", textAlign: "center" }}>
                  {user.rango.charAt(0).toUpperCase() + user.rango.slice(1)}
                </Text>
              </View>

              {user.tikado == false ? (
                <View
                  style={{
                    backgroundColor: "red",
                    padding: 5,
                    width: 100,
                    alignItems: "center",
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ color: "white" }}>No has tikado</Text>
                </View>
              ) : (
                <View
                  style={{
                    backgroundColor: "green",
                    padding: 5,
                    width: 100,
                    alignItems: "center",
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ color: "white" }}>Has tikado</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("PickMesaScreen")}
          >
            <View style={{ alignItems: "center", padding: 5 }}>
              <Image
                source={comanda}
                style={{ width: 80, height: 80, borderRadius: 30 }}
              />
              <Text style={{ color: "white", fontWeight: "500" }}>
                Nueva Comanda
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("MesasScreen")}>
            <View style={{ alignItems: "center", padding: 5 }}>
              <Image
                source={mesas}
                style={{ width: 80, height: 80, borderRadius: 30 }}
              />
              <Text style={{ color: "white" }}>Mesas</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "column", justifyContent: "center" }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("TikadaScreen");
            }}
          >
            <View style={{ alignItems: "center", padding: 5 }}>
              <Image
                source={ubicacion}
                style={{ width: 80, height: 80, borderRadius: 30 }}
              />
              <Text style={{ color: "white" }}>Tikar</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={removeAsync}>
            <View style={{ alignItems: "center" }}>
              <Image
                source={salir}
                style={{ width: 80, height: 80, borderRadius: 30 }}
              />
              <Text style={{ color: "white" }}>Salir</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Button
          title="Pruebas"
          onPress={() => navigation.navigate("PruebasScreen")}
        /> */}
      </View>
    </ImageBackground>
  );
};
async function schedulePushNotification() {
  console.log("send");
  await Notifications.scheduleNotificationAsync({
    content: {
      to: "ExponentPushToken[_GdR2jC6bNUO_ctYAKGJx7]",
      title: "Piconera",
      body: "Comanda nueva",
      data: { data: "goes here" },
    },
    trigger: { seconds: 1 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  // Inicio funciones notificaciones
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    // console.log('El token: '+token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}
const styles = StyleSheet.create({
  textBoton: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    padding: 2,
  },
  burbuja: {
    backgroundColor: "#00000090",
    padding: 6,
    borderRadius: 10,
  },
  containerBotones: {
    justifyContent: "center",
    marginTop: "10%",
    width: "97%",
    backgroundColor: "#FFFFFF90",
    borderRadius: 5,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 4,
    paddingVertical: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  ventanaBoton: {
    paddingHorizontal: 3,
    alignItems: "center",
  },
  ventanaTextBotones: {
    backgroundColor: "#3B3B3B80",
    padding: 2,
    width: 100,
    textAlign: "center",
    borderRadius: 20,
    alignItems: "center",
  },
});
// Fin funciones notification
export default HomeScreen;
