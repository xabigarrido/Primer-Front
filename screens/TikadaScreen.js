// // import React in our code
// import React from 'react';

// // import all the components we are going to use
// import {
//   SafeAreaView,
//   StyleSheet,
//   View,
//   Text,
//   TouchableHighlight,
// } from 'react-native';

// /*
//  * 1. getDistance, Calculates the distance between
//  *    two geo coordinates.
//  * 2. getPreciseDistance, Calculates the distance between
//  *    two geo coordinates. This method is more accurate then
//  *    getDistance, especially for long distances but it is
//  *    also slower. It is using the Vincenty inverse formula
//  *    for ellipsoids.
//  */
// import {getDistance, getPreciseDistance} from 'geolib';

// const App = () => {
//   const calculateDistance = () => {
//     var dis = getDistance(
//       {latitude: 37.3864921415095, longitude: -6.008581200430466},
//       {latitude: 37.3792876194074, longitude:-6.000270583243217},
//     );
//     alert(
//       `Distance\n\n${dis} Meter\nOR\n${dis / 1000} KM`
//     );
//   };

//   const calculatePreciseDistance = () => {
//     var pdis = getPreciseDistance(
//       {latitude: 37.3864921415095, longitude: -6.008581200430466},
//       {latitude: 37.3792876194074, longitude:-6.000270583243217},
//     );
//     alert(
//       `Precise Distance\n\n${pdis} Meter\nOR\n${pdis / 1000} KM`
//     );
//   };

//   return (
//     <SafeAreaView style={{flex: 1}}>
//       <View style={styles.container}>
//         <View style={styles.container}>
//           <Text style={styles.header}>
//             Example to Calculate Distance Between Two Locations
//           </Text>
//           <Text style={styles.textStyle}>
//             Distance between
//             {'\n'}
//             India(20.0504188, 64.4139099)
//             and
//             UK (51.528308, -0.3817765)
//           </Text>
//           <TouchableHighlight
//             style={styles.buttonStyle}
//             onPress={calculateDistance}>
//             <Text>Get Distance</Text>
//           </TouchableHighlight>
//           <Text style={styles.textStyle}>
//             Precise Distance between
//             {'\n'}
//             India(20.0504188, 64.4139099)
//             and
//             UK (51.528308, -0.3817765)
//           </Text>
//           <TouchableHighlight
//             style={styles.buttonStyle}
//             onPress={calculatePreciseDistance}>
//             <Text>
//               Get Precise Distance
//             </Text>
//           </TouchableHighlight>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//     padding: 10,
//     justifyContent: 'center',
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: '600',
//     color: 'black',
//     textAlign: 'center',
//     paddingVertical: 20,
//   },
//   textStyle: {
//     marginTop: 30,
//     fontSize: 16,
//     textAlign: 'center',
//     color: 'black',
//     paddingVertical: 20,
//   },
//   buttonStyle: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: 50,
//     backgroundColor: '#dddddd',
//     margin: 10,
//   },
// });

// export default App;
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
import BotonHome from "../components/BotonHome";
import Toast from "react-native-toast-message";
import { getPreciseDistance } from "geolib";

export default function App({ navigation }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [metros, setMetros] = useState(0);
  const [fecha, setFecha] = useState();
  useEffect(() => {
    const interval = setInterval(() => {
      setFecha(moment().format("DD/MM/YYYY, HH:mm:ss"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const user = useSelector((state) => state.userStore);
  const dispatch = useDispatch();
  const handleTikado = () => {
    console.log(metros);
    if (metros < 1500) {
      if (user.tikado == false) {
        dispatch(changeInfo(!user.tikado));
        changeInfoUser(user._id, !user.tikado);
        const newTikada = {
          idEmpleado: user._id,
          estado: "abierta",
          entrada: moment().unix(),
          entradaHumana: moment().format("DD/MM/YYYY, HH:mm:ss"),
          entradaLongitude: location.coords.longitude,
          entradaLatitude: location.coords.latitude,
          mes: moment().format("MMMM"),
          año: moment().format("YYYY"),
          comentario: "Ninguno",
        };
        entradaTikada(newTikada);
        Toast.show({
          type: "success",
          text1: "Entrada Registrada",
          visibilityTime: 1800,
        });
        navigation.navigate("TabScreen");
      } else {
        Alert.alert("No puedes tikar la entrada si ya has tikado");
      }
    } else {
      Alert.alert(
        "Debes estar a menos de 150 metros de La Piconera para poder tikar la entrada"
      );
    }
  };

  const handleSalida = () => {
    if (metros < 1500) {
      if (user.tikado == true) {
        dispatch(changeInfo(!user.tikado));
        changeInfoUser(user._id, !user.tikado);
        const newSalida = {
          salidaHumana: moment().format("DD/MM/YYYY, HH:mm:ss"),
          salida: moment().unix(),
        };
        salidaTikada(user._id, newSalida);
        Toast.show({
          type: "success",
          text1: "Salida Registrada",
          visibilityTime: 1800,
        });
        navigation.navigate("TabScreen");
      } else {
        Alert.alert("No puedes tikar la salida si no has tikado la entrada");
      }
    } else {
      Alert.alert(
        "Debes estar a menos de 150 metros de La Piconera para poder tikar la salida"
      );
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
  }, []);

  useEffect(() => {
    if (location && location.coords) {
      setMetros(
        getPreciseDistance(
          {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          { latitude: 37.3792876194074, longitude: -6.000270583243217 }
        )
      );
    }

    return () => {};
  }, [location]);

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
              mapType="hybrid"
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
            <View
              style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
            >
              <BotonHome />
            </View>
          </>
        )}
      </View>
    </ImageBackground>
  );
}
