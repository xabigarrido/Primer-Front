import { ScrollView } from "react-native-gesture-handler";
import "react-native-get-random-values";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  TouchableOpacity,
} from "@gorhom/bottom-sheet";
import React, { useRef, useState, useEffect } from "react";
import fondoPiconera from "../assets/fondoScreen.jpg";
import fondoAntique from "../assets/fondoScreenAntique.png";
import fondoRosso from "../assets/fondoScreenRosso.png";
import BotonHome from "../components/BotonHome";
import moment from "moment";
import empleadosImg from "../assets/empleados.png";
import ajustesTools from "../assets/tools.png";
import Piconera from "../assets/Logo-Piconera.png";
import Antique from "../assets/Logo-Antique.png";
import Rosso from "../assets/Logo-ROSSO.png";
import { Button } from "@react-native-material/core";
import { getEmpleados, getEmpresa, URL, editEmpresa } from "../api";
import { useSelector } from "react-redux";

const GestionEmpresaScreen = ({ navigation }) => {
  const bottomSheetModalRef = useRef(null);
  const [empleados, setEmpleados] = useState([]);
  const snapPoints = ["80%", "100%"];
  const [pickEmpresa, setPickEmpresa] = useState(null);
  const [empresa, setEmpresa] = useState({});
  const [precioCopa, setPrecioCopa] = useState(0);
  const [rangoTikada, setRangoTikada] = useState(0);
  const [fondoMostrar, setFondoMostrar] = useState(null);
  const user = useSelector((state) => state.userStore);

  const loadEmpresa = async (id) => {
    const data = await getEmpresa(id);
    console.log(data);
    setEmpresa(data);
  };
  useEffect(() => {
    if (pickEmpresa != null) {
      loadEmpresa(pickEmpresa);
      setPrecioCopa(pickEmpresa.precioCopa);
      setRangoTikada(pickEmpresa.rangoTikada);
    }
    return () => {};
  }, [pickEmpresa]);

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
        source={fondoMostrar}
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
                  style={{ marginRight: 10 }}
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
                    <Text style={{ textAlign: "center" }}>Empresas </Text>
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
              {/* <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
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
              </View> */}
              <View style={{ width: "100%" }}>
                {pickEmpresa == null && (
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setPickEmpresa("6350346b5e2286c0a43467c4");
                      }}
                    >
                      <View style={{ alignItems: "center", marginBottom: 10 }}>
                        <Image
                          source={Piconera}
                          style={{
                            borderRadius: 50,
                            height: 120,
                            width: 120,
                            // borderWidth: 0.3,
                          }}
                        />
                        <View
                          style={{
                            backgroundColor: "#323432",
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            borderRadius: 20,
                            marginTop: 1,
                          }}
                        >
                          <Text style={{ fontWeight: "bold", color: "white" }}>
                            La Piconera
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setPickEmpresa("635034a45e2286c0a43467c6");
                      }}
                    >
                      <View style={{ alignItems: "center", marginBottom: 10 }}>
                        <Image
                          source={Antique}
                          style={{
                            borderRadius: 50,
                            height: 120,
                            width: 120,
                            // borderWidth: 0.3,
                          }}
                        />
                        {/* <Text style={{fontWeight: 'bold'}}>La Piconera</Text> */}
                        <View
                          style={{
                            backgroundColor: "#323432",
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            borderRadius: 20,
                            marginTop: 1,
                          }}
                        >
                          <Text style={{ fontWeight: "bold", color: "white" }}>
                            Antique
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setPickEmpresa("635034ab5e2286c0a43467c8");
                      }}
                    >
                      <View style={{ alignItems: "center", marginBottom: 10 }}>
                        <Image
                          source={Rosso}
                          style={{
                            borderRadius: 50,
                            height: 120,
                            width: 120,
                            // borderWidth: 0.3,
                          }}
                        />
                        {/* <Text style={{fontWeight: 'bold'}}>La Piconera</Text> */}
                        <View
                          style={{
                            backgroundColor: "#323432",
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            borderRadius: 20,
                            marginTop: 1,
                          }}
                        >
                          <Text style={{ fontWeight: "bold", color: "white" }}>
                            Rosso
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
                {pickEmpresa !== null && (
                  <View style={{ width: "100%" }}>
                    <Button
                      title="Ver otra empresa"
                      onPress={() => {
                        setPickEmpresa(null);
                      }}
                    />
                    <View
                      style={{
                        backgroundColor: "#323432",
                        width: "98%",
                        alignItems: "center",
                        borderRadius: 15,
                        marginVertical: 10,
                        paddingVertical: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 22,
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        {empresa.nombreEmpresa}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 22 }}>Precio copa</Text>
                    <TextInput
                      placeholder={`${empresa.precioCopa}`}
                      style={{
                        marginTop: 5,
                        borderWidth: 0.5,
                        // width: "100%",
                        padding: 10,
                        borderRadius: 10,
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: 22,
                        marginBottom: 5,
                      }}
                      onChangeText={(text) => setPrecioCopa(text)}
                    />
                    <Text style={{ fontSize: 22 }}>Rango tikada (metros)</Text>
                    <TextInput
                      placeholder={`${empresa.rangoTikada}`}
                      style={{
                        marginTop: 5,
                        borderWidth: 0.5,
                        // width: "100%",
                        padding: 10,
                        borderRadius: 10,
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: 22,
                        marginBottom: 5,
                      }}
                      onChangeText={(text) => setRangoTikada(text)}
                    />
                    <Button
                      title="Editar"
                      style={{ backgroundColor: "red", marginTop: 5 }}
                      onPress={() => {
                        bottomSheetModalRef.current?.dismiss();
                        setPickEmpresa(null);

                        editEmpresa(empresa._id, {
                          ...empresa,
                          precioCopa,
                          rangoTikada,
                        });
                      }}
                    />
                  </View>
                )}
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
