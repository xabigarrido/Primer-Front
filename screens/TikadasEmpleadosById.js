import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TextInput,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";

import fondo from "../assets/fondoScreen.jpg";
import BotonHome from "../components/BotonHome";
import Toast from "react-native-toast-message";
import moment from "moment";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { Button } from "@react-native-material/core";
import { getTikadas, getEmpleado } from "../api";
import { FlashList } from "@shopify/flash-list";

const TikadasEmpleados = ({ route }) => {
  const bottomSheetModalRef = useRef(null);
  const snapPoints = ["25%", "55%"];
  const [tikadas, setTikadas] = useState([]);
  const [sueldo, setSueldo] = useState(0);
  const [sueldoTotal, setSueldoTotal] = useState(0);
  const [empleado, setEmpleado] = useState({});

  function handlePresentModal() {
    bottomSheetModalRef.current?.present();
  }
  const loadTikadas = async () => {
    const dataUser = await getEmpleado(route.params.idEmpleado);
    setEmpleado(dataUser);

    const data = await getTikadas(route.params.idEmpleado);
    setTikadas(data);
    let dineroPagar = 0;
    const algo = data.map((element, index) => {
      // console.log(DineroGanado(element.totalTrabajado, sueldo));

      dineroPagar += Number(DineroGanado(element.totalTrabajado, sueldo));
    });
    setSueldoTotal(financial(dineroPagar));
  };
  useEffect(() => {
    if (route && route.params) {
      loadTikadas();
    }
  }, [sueldo]);
  function financial(x) {
    return Number.parseFloat(x).toFixed(2);
  }
  const DineroGanado = (tiempo, sueldo) => {
    const separar = tiempo.split(":");
    const horasTrabajadas = separar[0];
    const minutosTrabajados = separar[1];
    const minutosTrabajadosEntero = minutosTrabajados / 60;
    const dineroHoras = horasTrabajadas * sueldo;
    const dineroMinutos = minutosTrabajadosEntero * sueldo;
    const dineroTotalGanado = dineroHoras + dineroMinutos;
    return financial(dineroTotalGanado);
  };

  const renderItemList = (tikada, sueldoActual, index) => {
    return (
      <View
        key={index}
        style={{
          borderWidth: 0.3,
          borderRadius: 15,
          padding: 5,
          width: "100%",
          alignItems: "center",
          marginBottom: 5,
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
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#77BD84",
            width: "100%",
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderRadius: 10,
            borderWidth: 0.5,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>Entrada: </Text>
          <Text>{tikada.entradaHumana}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#E7A3A0",
            width: "100%",
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderRadius: 10,
            borderWidth: 0.5,
            marginTop: 2,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>Salida: </Text>
          <Text>{tikada.salidaHumana}</Text>
        </View>
        <View
          style={{
            borderWidth: 0.3,
            borderRadius: 15,
            paddingVertical: 10,
            paddingHorizontal: 16,
            backgroundColor: "#D8D8D850",
            marginTop: 5,
            width: "70%",
          }}
        >
          <View
            style={{
              borderWidth: 0.5,
              backgroundColor: "#A0C9E7",
              borderRadius: 5,
              padding: 5,
              marginBottom: 2,
            }}
          >
            <Text style={{ fontWeight: "bold", textAlign: "center" }}>
              Tiempo trabajado
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                borderWidth: 0.5,
                backgroundColor: "white",
                borderRadius: 5,
                padding: 2,
                width: 50,
                alignItems: "center",
                marginRight: 5,
              }}
            >
              <Text style={{}}> {tikada.horas}</Text>
              <Text style={{ fontWeight: "bold" }}>Horas</Text>
            </View>
            <View
              style={{
                borderWidth: 0.5,
                backgroundColor: "white",
                borderRadius: 5,
                padding: 2,
                width: 70,
                alignItems: "center",
              }}
            >
              <Text style={{}}> {tikada.minutos}</Text>
              <Text style={{ fontWeight: "bold" }}>Minutos</Text>
            </View>
          </View>

          <View
            style={{
              borderWidth: 0.5,
              marginTop: 5,
              borderRadius: 5,
              backgroundColor: "#DE5B5B",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                textAlign: "center",
                color: "white",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              {DineroGanado(tikada.totalTrabajado, sueldoActual)}€
            </Text>
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
                height: "100%",
                backgroundColor: "#F6F6F6",
                alignItems: "center",
                paddingVertical: 15,
                borderRadius: 15,
              }}
            >
              <View
                style={{ width: "95%", height: "95%", alignItems: "center" }}
              >
                <View
                  style={{
                    width: "100%",
                    paddingVertical: 10,
                    borderRadius: 15,
                    borderWidth: 0.5,
                    marginBottom: 3,
                    backgroundColor: "#272727",
                    paddingHorizontal: 5,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        backgroundColor: "white",
                        paddingVertical: 5,
                        borderRadius: 5,
                        paddingHorizontal: 3,
                        marginRight: 4,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 18,
                          color: "black",
                        }}
                      >
                        Sueldo por hora:
                      </Text>
                    </View>
                    <TextInput
                      placeholder="0"
                      style={{
                        backgroundColor: "white",
                        borderWidth: 0.3,
                        width: "20%",
                        borderRadius: 5,
                        paddingHorizontal: 5,
                        paddingVertical: 3,
                        textAlign: "center",
                        fontSize: 22,
                      }}
                      onChangeText={(text) => {
                        setSueldoTotal(0);
                        setSueldo(text);
                      }}
                    />
                  </View>
                  <View
                    style={{
                      backgroundColor: "white",
                      paddingVertical: 5,
                      borderRadius: 5,
                      paddingHorizontal: 3,
                      marginRight: 4,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 18,
                        color: "black",
                      }}
                    >
                      Total:
                    </Text>
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 18,
                        color: "red",
                      }}
                    >
                      {sueldoTotal}€
                    </Text>
                  </View>
                </View>
                <View style={{ width: "100%", height: "90%" }}>
                  <FlashList
                    extraData={sueldo}
                    data={tikadas}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => renderItemList(item, sueldo)}
                    estimatedItemSize={200}
                  />
                </View>
              </View>
            </View>
          </View>
        </BotonHome>
      </ImageBackground>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
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
        <View style={style.contentContainer}>
          <View style={style.containerModal}></View>
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
export default TikadasEmpleados;
