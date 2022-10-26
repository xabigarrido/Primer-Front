import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  Platform,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { Button } from "@react-native-material/core";
import { useSelector, useDispatch } from "react-redux";
import { addInfoUser } from "../features/userStore";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import * as ImagePicker from "expo-image-picker";
import fondoPiconera from "../assets/fondoScreen.jpg";
import fondoAntique from "../assets/fondoScreenAntique.png";
import fondoRosso from "../assets/fondoScreenRosso.png";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import React, { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import mesas from "../assets/mesasScreen.png";
import comanda from "../assets/comanda.png";
import ubicacion from "../assets/ubicacion.jpg";
import agregar from "../assets/addProduct.png";
import calendario from "../assets/calendario.png";
import cajaImg from "../assets/Caja.png";
import salir from "../assets/salir.png";
import ajustes from "../assets/ajustes.png";
import { addToken, URL, API, getEmpleado } from "../api";
import { useIsFocused } from "@react-navigation/native";

// import { socket } from "../socket";

// Ajustes notification

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

//Fin

const HomeScreen = ({ navigation }) => {
  const [listImage, setListImage] = useState([]);
  const dispatch = useDispatch();
  const isFocus = useIsFocused();
  const [asyncData, setAsyncData] = useState(null);
  const [fondoMostrar, setFondoMostrar] = useState(null);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("LoginUser");
      if (value !== null) {
        const res = await fetch(`${API}/empleados/user/${value}`);
        const data = await res.json();
        setAsyncData(data);
        dispatch(addInfoUser(data));
        console.log(data.empresa);
      }
    } catch (e) {
      // error reading value
      console.log(e);
    }
  };
  useEffect(() => {
    if (user.empresa == "6350346b5e2286c0a43467c4") {
      setFondoMostrar(fondoPiconera);
    }
    if (user.empresa == "635034a45e2286c0a43467c6") {
      setFondoMostrar(fondoAntique);
    }
    if (user.empresa == "635034ab5e2286c0a43467c8") {
      setFondoMostrar(fondoRosso);
    }
  }, [isFocus]);
  useEffect(() => {
    getData();
    return () => {
      getData();
    };
  }, [isFocus]);

  const editFotoEmpleado = async (id, lista) => {
    try {
      for (let i = 0; i < lista.length; i++) {
        let filename = lista[i].split("/").pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : "image";
        let data = new FormData();
        data.append("image", { uri: lista[i], name: filename, type });

        const query = await fetch(`${API}/empleados/cambiarFoto/${id}`, {
          method: "PUT",
          body: data,
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setListImage([]);
      const data = await getEmpleado(user._id);
      dispatch(addInfoUser(data));
      return bottomSheetModalRef.current?.dismiss();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          // alert("Sorry, we need camera roll permissions to make this work!");
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
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const bottomSheetModalRef = useRef(null);
  const snapPoints = ["55%", "100%"];
  function handlePresentModal() {
    return bottomSheetModalRef.current?.snapToIndex(0);
  }
  const user = useSelector((state) => state.userStore);

  useEffect(() => {
    bottomSheetModalRef.current?.present();
  }, [bottomSheetModalRef]);

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
        const idMesa = response.notification.request.content.data.idMesa;
        navigation.navigate("EstadoMesaScreen", { id: idMesa });
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
    // console.log("paso");
    navigation.navigate("LoginScreen");
  };

  return (
    <BottomSheetModalProvider>
      <ImageBackground
        source={fondoMostrar}
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
            {user.habilitadoUser == true ? (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <View style={{ flexDirection: "row", marginBottom: 15 }}>
                  {(user.rango == "Administrador" || user.rango == "Encargado") && (
                    <>
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
                            <Text style={styles.textBoton}> Estado Mesas</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </>
                  )}
                  <TouchableOpacity
                    onPress={() => navigation.navigate("CalendarioScreen")}
                  >
                    <View style={styles.ventanaBoton}>
                      <Image
                        source={calendario}
                        style={{ width: 80, height: 80, borderRadius: 1 }}
                      />
                      <View style={styles.ventanaTextBotones}>
                        <Text style={styles.textBoton}>Reservas</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
                {(user.rango == "Administrador" || user.rango == "Encargado") && (
                  <View style={{ flexDirection: "row", marginBottom: 15 }}>
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
                    <TouchableOpacity
                      onPress={() => navigation.navigate("AbrirCaja")}
                    >
                      <View style={styles.ventanaBoton}>
                        <Image
                          source={cajaImg}
                          style={{ width: 80, height: 80, borderRadius: 15 }}
                        />
                        <View style={styles.ventanaTextBotones}>
                          <Text style={styles.textBoton}>Gestion de Caja</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("GestionEmpresaScreen")
                      }
                    >
                      <View style={styles.ventanaBoton}>
                        <Image
                          source={ajustes}
                          style={{ width: 80, height: 80, borderRadius: 30 }}
                        />
                        <View style={styles.ventanaTextBotones}>
                          <Text style={styles.textBoton}>Gestion empresa</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
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
            ) : (
              <>
                <View
                  style={{
                    backgroundColor: "white",
                    paddingHorizontal: 30,
                    paddingVertical: 10,
                    borderRadius: 15,
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                    Cuenta suspendida
                  </Text>
                </View>
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
              </>
            )}
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
            <TouchableOpacity onPress={handlePresentModal}>
              <View
                style={{
                  padding: 10,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={{ uri: `${URL}/${user.foto}` }}
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
                      style={{
                        color: "white",
                        textAlign: "center",
                        fontSize: 18,
                      }}
                    >
                      {user.nombre}
                    </Text>
                    <Text
                      style={{
                        color: "white",
                        textAlign: "center",
                        fontSize: 14,
                      }}
                    >
                      {user.apellidos}
                    </Text>
                  </View>
                  {user.habilitadoUser == true && (
                    <>
                      <View
                        style={{
                          ...styles.burbuja,
                          width: "100%",
                          marginVertical: 3,
                        }}
                      >
                        <Text style={{ color: "white", textAlign: "center" }}>
                          {user.rango.charAt(0).toUpperCase() +
                            user.rango.slice(1)}
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
                    </>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={-1}
        enableDismissOnClose={false}
        snapPoints={snapPoints}
        backgroundStyle={{
          borderRadius: 50,
          backgroundColor: "#F7F7F7",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          elevation: 5,
          zIndex: 0,
        }}
      >
        <View style={styles.contentContainer}>
          <View style={styles.containerModal}>
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
            {listImage.length < 1 && (
              <Button
                title="Cambiar foto perfil"
                style={{ backgroundColor: "red", marginBottom: 10 }}
                onPress={pickImage}
              />
            )}
            <Button
              title="cambiar"
              onPress={() => editFotoEmpleado(user._id, listImage)}
            />
          </View>
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
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
      // alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    // console.log('El token: '+token);
  } else {
    // alert("Must use physical device for Push Notifications");
  }

  return token;
}

const styles = StyleSheet.create({
  containerModal: {
    width: "100%",
    height: "100%",
    padding: 10,
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
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
    marginTop: "10%",
    width: "88%",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#FFFFFF90",
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 20,
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
    justifyContent: "center",
  },
});
// Fin funciones notification
export default HomeScreen;
