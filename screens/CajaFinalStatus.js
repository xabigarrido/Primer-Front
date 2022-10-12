import {
  View,
  Text,
  ImageBackground,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import fondo from "../assets/fondoScreen.jpg";
import BotonHome from "../components/BotonHome";
import Toast from "react-native-toast-message";
import { isCajaOpen, URL } from "../api";
import { FlashList } from "@shopify/flash-list";
import { ScrollView } from "react-native-gesture-handler";
import { Button } from "@react-native-material/core";

import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
const CajaFinalStatus = ({ route }) => {
  const bottomSheetModalRef = useRef(null);
  const [cajaActual, setCajaActual] = useState([]);
  const [copasVendidasPiconera, setCopasVendidasPiconera] = useState([]);
  const [botellasVendidasPiconera, setBotellasVendidasPiconera] = useState([]);
  const [refrescosVendidosPiconera, setRefrescosVendidosPiconera] = useState([])
  function handlePresentModal() {
    console.log("first");
    bottomSheetModalRef.current?.present();
  }
  const snapPoints = ["90%"];

  const loadCaja = async () => {
    const data = await isCajaOpen();
    setCajaActual(data[0]);
    let arrayProductos = [];
    let arrayBotellas = [];
    let arrayCopas = [];

    let arrayRefrescos = [];
    const foundRefrescosTotal = data[0].comandas.map((elementComanda) =>
    {
      console.log(elementComanda)
      for(let i = 0; i < elementComanda.multiplicador; i++){
        elementComanda.listRefrescos.map((element) =>
        {
          // console.log(element)
          arrayRefrescos.push(element)
  
        }
        )
      }
    }
    );
    let arrayRefrescosFinal = []
    const resultado3 = {};
    arrayRefrescos.forEach((el) => (resultado3[el] = resultado3[el] + 1 || 1));
    const newArray3 = Object.entries(resultado3);
    const result3 = newArray3.forEach((el) => {
      // console.log("El producto: " + el[0] + " se repite: " + el[1]);
      arrayRefrescosFinal.push(el[0]+"/"+el[1])
    });
    setRefrescosVendidosPiconera(arrayRefrescosFinal)







    const foundReferenciasTotal = data[0].comandas.map((element) => {
      arrayProductos.push(element.producto);
      if (element.referencia == "Botella") {
        arrayBotellas.push(element);
      }
      if (element.referencia == "Copa") {
        arrayCopas.push(element);
      }
    });
    const arrayProductosUnicos = [...new Set(arrayProductos)];
    let newArrayBotellasVendidas = [];
    for (let i = 0; i < arrayProductosUnicos.length; i++) {
      arrayBotellas.map((element) => {
        if (
          element.referencia == "Botella" &&
          element.producto == arrayProductosUnicos[i]
        ) {
          newArrayBotellasVendidas.push(
            `Botella/${element.producto}/${element.imagenPrincipal}`
          );
        }
      });
    }
    let newArrayCopasVendidas = [];
    for (let i = 0; i < arrayProductosUnicos.length; i++) {
      arrayCopas.map((element) => {
        if (
          element.referencia == "Copa" &&
          element.producto == arrayProductosUnicos[i]
        ) {
          // console.log("😜" + element.multiplicador);
          for (let i = 0; i < element.multiplicador; i++) {
            newArrayCopasVendidas.push(
              `Copa/${element.producto}/${element.imagenPrincipal}`
            );
          }
        }
      });
    }

    const resultado = {};
    newArrayCopasVendidas.forEach(
      (el) => (resultado[el] = resultado[el] + 1 || 1)
    );
    const newArray = Object.entries(resultado);
    let arrayFinalCopasVendidas = [];
    const result = newArray.forEach((el) => {
      arrayFinalCopasVendidas.push(el[0] + "/" + el[1]);
    });

    const resultadoBotellas = {};
    newArrayBotellasVendidas.forEach(
      (el) => (resultadoBotellas[el] = resultadoBotellas[el] + 1 || 1)
    );
    const newArray2 = Object.entries(resultadoBotellas);
    let arrayFinalBotellasVendidas = [];
    const result2 = newArray2.forEach((el) => {
      // console.log("El producto: " + el[0] + " se repite: " + el[1]);
      arrayFinalBotellasVendidas.push(el[0] + "/" + el[1]);
    });
    setCopasVendidasPiconera(arrayFinalCopasVendidas);
    setBotellasVendidasPiconera(arrayFinalBotellasVendidas);
  };

  useEffect(() => {
    loadCaja();
    return () => {
      loadCaja();
    };
  }, []);

  const renderComandas = (item) => {
    return (
      <View
        style={{
          width: "100%",
          marginBottom: 8,
          borderWidth: 0.5,
          padding: 10,
          borderRadius: 15,
          backgroundColor: "white",
          height: 150,
        }}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
          }}
        >
          <View
            style={{
              width: "20%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={{
                uri: `${URL}${item.imagenPrincipal}`,
              }}
              style={{ width: "100%", height: "100%" }}
            />
          </View>
          <View style={{ width: "80%" }}>
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  backgroundColor: "white",
                  borderWidth: 0.5,
                  borderRadius: 10,
                  marginRight: 2,
                  backgroundColor: item.referencia == "Copa" ? "green" : "red",
                }}
              >
                <Text style={{ color: "white" }}>{item.referencia}</Text>
              </View>
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  backgroundColor: "white",
                  borderWidth: 0.5,
                  borderRadius: 10,
                  marginRight: 2,
                }}
              >
                <Text>{item.producto}</Text>
              </View>
              {item.referencia == "Copa" && (
                <View
                  style={{
                    backgroundColor: "red",
                    paddingHorizontal: 15,
                    paddingVertical: 5,
                    borderRadius: 15,
                  }}
                >
                  <Text
                    style={{ color: "white", fontWeight: "bold", fontSize: 18 }}
                  >
                    x{item.multiplicador}
                  </Text>
                </View>
              )}
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {item.listRefrescos.map((element, index) => (
                <Image
                  key={index}
                  source={{
                    uri: `${URL}${element}`,
                  }}
                  style={{ width: 35, height: 35 }}
                />
              ))}
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <View
                style={{
                  backgroundColor: "#292929",
                  width: 90,
                  paddingVertical: 5,
                  borderRadius: 10,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 20, fontWeight: "600" }}
                >
                  {item.precio} €
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
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
              <View
                style={{
                  width: "80%",
                  alignItems: "center",
                  borderWidth: 0.5,
                  borderRadius: 15,
                  backgroundColor: "white",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 32, fontWeight: "bold" }}>
                  Caja Actual:
                </Text>
                <Text style={{ fontSize: 24 }}>{cajaActual.dineroCaja} €</Text>
                <Button onPress={handlePresentModal} title="Ver ventas" />
                {/* <TouchableOpacity onPress={handlePresentModal}>
                  <View
                    style={{
                      backgroundColor: "#FFD35C90",
                      padding: 5,
                      width: 150,
                      height: 40,
                      borderRadius: 15,
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: 0.4,
                    }}
                  >
                    <Text style={{ fontWeight: "bold" }}>VER VENTAS</Text>
                  </View>
                </TouchableOpacity> */}
              </View>
              <View
                style={{ width: "100%", height: "85%", paddingHorizontal: 5 }}
              >
                <FlashList
                  data={cajaActual.comandas}
                  keyExtractor={(item) => item.idComanda}
                  renderItem={({ item }) => renderComandas(item)}
                  estimatedItemSize={100000000}
                />
              </View>
            </View>
          </View>
        </BotonHome>
      </ImageBackground>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
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
        // onDismiss={() => setNumero(null)}
      >
        <ScrollView>
          <View style={style.contentContainer}>
            <View style={style.containerModal}>
              <View
                style={{
                  backgroundColor: "#2D2D2D",
                  width: "60%",
                  paddingVertical: 5,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 10,
                  marginBottom: 3,
                }}
              >
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 28 }}
                >
                  COPAS
                </Text>
              </View>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {copasVendidasPiconera.map((element, index) => {
                  // console.log(element);
                  const separar = element.split("/");
                  return (
                    <View
                      key={index}
                      style={{
                        backgroundColor: "white",
                        borderWidth: 0.5,
                        width: 95,
                        marginLeft: 3,
                        borderRadius: 15,
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 10,
                      }}
                    >
                      <View>
                        <Image
                          source={{
                            uri: `${URL}${separar[2]}`,
                          }}
                          style={{ width: 60, height: 80 }}
                        />
                        <View
                          style={{
                            backgroundColor: "#2D2D2D",
                            borderRadius: 10,
                            paddingVertical: 5,
                            paddingHorizontal: 2,
                            marginTop: 1,
                          }}
                        >
                          <Text style={{ color: "white", textAlign: "center" }}>
                            {separar[1]}
                          </Text>
                        </View>
                        <View
                          style={{
                            backgroundColor: "#FFDD81",
                            borderRadius: 10,
                            paddingVertical: 5,
                            paddingHorizontal: 2,
                            marginTop: 3,
                          }}
                        >
                          <Text
                            style={{ textAlign: "center", fontWeight: "bold" }}
                          >
                            {separar[3]}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
              <View
                style={{
                  backgroundColor: "#2D2D2D",
                  width: "60%",
                  paddingVertical: 5,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 10,
                  marginBottom: 3,
                }}
              >
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 28 }}
                >
                  BOTELLAS
                </Text>
              </View>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {botellasVendidasPiconera.map((element, index) => {
                  // console.log(element);
                  const separar = element.split("/");
                  return (
                    <View
                      key={index}
                      style={{
                        backgroundColor: "white",
                        borderWidth: 0.5,
                        width: 95,
                        marginLeft: 3,
                        borderRadius: 15,
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 10,
                      }}
                    >
                      <View>
                        <Image
                          source={{
                            uri: `${URL}${separar[2]}`,
                          }}
                          style={{ width: 60, height: 80 }}
                        />
                        <View
                          style={{
                            backgroundColor: "#2D2D2D",
                            borderRadius: 10,
                            paddingVertical: 5,
                            paddingHorizontal: 2,
                            marginTop: 1,
                          }}
                        >
                          <Text style={{ color: "white", textAlign: "center" }}>
                            {separar[1]}
                          </Text>
                        </View>
                        <View
                          style={{
                            backgroundColor: "#FFDD81",
                            borderRadius: 10,
                            paddingVertical: 5,
                            paddingHorizontal: 2,
                            marginTop: 3,
                          }}
                        >
                          <Text
                            style={{ textAlign: "center", fontWeight: "bold" }}
                          >
                            {separar[3]}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
              <View
                style={{
                  backgroundColor: "#2D2D2D",
                  width: "60%",
                  paddingVertical: 5,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 10,
                  marginBottom: 3,
                }}
              >
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 28 }}
                >
                  REFRESCOS
                </Text>
              </View>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {refrescosVendidosPiconera.map((element, index) => {
                  // console.log(element);
                  const separar = element.split("/");
                  return (
                    <View
                      key={index}
                      style={{
                        backgroundColor: "white",
                        borderWidth: 0.5,
                        width: 95,
                        marginLeft: 3,
                        borderRadius: 15,
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 10,
                      }}
                    >
                      <View>
                        <Image
                          source={{
                            uri: `${URL}${separar[0]}`,
                          }}
                          style={{ width: 80, height: 80 }}
                        />
                        <View
                          style={{
                            backgroundColor: "#2D2D2D",
                            borderRadius: 10,
                            paddingVertical: 5,
                            paddingHorizontal: 2,
                            marginTop: 1,
                          }}
                        >
                          <Text style={{ color: "white", textAlign: "center" }}>
                            {separar[1]}
                          </Text>
                        </View>

                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        </ScrollView>
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
export default CajaFinalStatus;
