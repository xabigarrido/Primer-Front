// import "react-native-gesture-handler";

// import React, { useCallback, useMemo, useRef, useEffect } from "react";
// import { View, Text, StyleSheet, Button } from "react-native";
// import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
// import { GestureHandlerRootView } from "react-native-gesture-handler";

// const App = () => {
//   // ref
//   const bottomSheetModalRef = useRef(null);
//   useEffect(() => {
//     bottomSheetModalRef.current?.present();
//   }, [bottomSheetModalRef]);

//   // variables
//   const snapPoints = useMemo(() => ["25%", "50%"], []);

//   // callbacks
//   const handlePresentModalPress = useCallback(() => {
//     bottomSheetModalRef.current?.snapToIndex(0);
//   }, []);
//   const handleSheetChanges = useCallback((index: number) => {
//     // console.log("handleSheetChanges", index);
//   }, []);

//   // renders
//   return (
//     <View style={styles.container}>
//       <Button onPress={handlePresentModalPress} title="Present Modal" color="black" />
//       <BottomSheetModal ref={bottomSheetModalRef} index={-1} snapPoints={snapPoints} onChange={handleSheetChanges} enableDismissOnClose={false}>
//         <View style={styles.contentContainer}>
//           <Text>Awesome 🎉</Text>
//         </View>
//       </BottomSheetModal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 24,
//     justifyContent: "center",
//     backgroundColor: "grey",
//   },
//   contentContainer: {
//     flex: 1,
//     alignItems: "center",
//   },
// });

// export default () => {
//   return (
//     <BottomSheetModalProvider>
//       <GestureHandlerRootView style={{ flex: 1 }}>
//         <App />
//       </GestureHandlerRootView>
//     </BottomSheetModalProvider>
//   );
// };

import {
  NativeViewGestureHandler,
  ScrollView,
} from "react-native-gesture-handler";
import "react-native-get-random-values";
import { View, Text, ImageBackground, StyleSheet, Image } from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  TouchableOpacity,
} from "@gorhom/bottom-sheet";
import React, { useRef, useState, useEffect } from "react";

import fondo from "../assets/fondoScreen.jpg";
import BotonHome from "../components/BotonHome";
import Toast from "react-native-toast-message";
import moment from "moment";
import empleadosImg from "../assets/empleados.png";
import ajustesTools from "../assets/tools.png";

import { Button } from "@react-native-material/core";
import { getEmpleados, URL } from "../api";
const GestionEmpresaScreen = ({ navigation }) => {
  const bottomSheetModalRef = useRef(null);
  const [empleados, setEmpleados] = useState([]);
  const snapPoints = ["80%", "100%"];
  function handlePresentModal() {
    return bottomSheetModalRef.current?.snapToIndex(0);
  }
  useEffect(() => {
    bottomSheetModalRef.current?.present();
  }, [bottomSheetModalRef]);
  const loadEmpleados = async () => {
    const data = await getEmpleados();
    setEmpleados(data);
  };
  useEffect(() => {
    loadEmpleados();
    return () => {};
  }, []);

  const calcular = () => {
    const timeEntrada = moment.unix("1665507165");
    const timeSalida = moment.unix("1665507378");
    console.log(moment(timeEntrada).format("MMMM Do YYYY, h:mm:ss a"));
    console.log(moment().diff(timeEntrada, "h") + " horas");
    console.log(timeSalida.diff(timeEntrada, "m") + " minutos");
  };
  return (
    <BottomSheetModalProvider>
      <ImageBackground
        source={fondo}
        resizeMode="cover"
        style={{ flex: 1, justifyContent: "center" }}
      >
        <BotonHome>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
            }}
          >
            <View
              style={{
                width: "95%",
                backgroundColor: "#F6F6F6",
                alignItems: "center",
                paddingVertical: 15,
                borderRadius: 15,
              }}
            >
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("GestionEmpleadosScreen")}
                  style={{marginRight: 10}}
                >
                  <View
                    style={{
                      borderWidth: 0.3,
                      padding: 6,
                      alignItems: "center",
                      borderRadius: 15,
                      backgroundColor: "white",
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
                    <Image
                      source={empleadosImg}
                      style={{ width: 50, height: 70, borderRadius: 30 }}
                    />
                    <Text style={{ textAlign: "center" }}>Gestion </Text>
                    <Text style={{ textAlign: "center" }}>Empleados </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePresentModal}>
                  <View
                    style={{
                      borderWidth: 0.3,
                      padding: 6,
                      alignItems: "center",
                      borderRadius: 15,
                      backgroundColor: "white",
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
                    <Image
                      source={ajustesTools}
                      style={{ width: 50, height: 70, borderRadius: 30 }}
                    />
                    <Text style={{ textAlign: "center" }}>Ajustes </Text>
                    <Text style={{ textAlign: "center" }}>La Piconera </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </BotonHome>
      </ImageBackground>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={-1}
        snapPoints={snapPoints}
        enableDismissOnClose={false}
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
        <View style={style.contentContainer}>
          <View style={style.containerModal}>
            <ScrollView>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {empleados.map((empleado, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      navigation.navigate("TikadasEmpleadoById", {
                        idEmpleado: empleado._id,
                      })
                    }
                  >
                    <View
                      style={{
                        margin: 3,
                        borderRadius: 15,
                        borderWidth: 0.5,
                        padding: 10,
                        alignItems: "center",
                        backgroundColor:
                          empleado.tikado == true ? "#9DCA92" : "white",
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
                      <Image
                        source={{ uri: `${URL}${empleado.foto}`}}
                        style={{
                          height: 60,
                          width: 60,
                          borderRadius: 50,
                          borderWidth: 0.3,
                        }}
                      />
                      <Text>{empleado.nombre}</Text>
                      <Text>{empleado.apellidos}</Text>
                      {empleado.tikado == true && (
                        <>
                          <View
                            style={{
                              height: 15,
                              width: 15,
                              backgroundColor: "#F90000",
                              borderRadius: 20,
                            }}
                          ></View>
                          <Text style={{ fontWeight: "bold", fontSize: 10 }}>
                            TRABAJANDO
                          </Text>
                        </>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};
const style = StyleSheet.create({
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
});
export default GestionEmpresaScreen;
