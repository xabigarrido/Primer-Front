import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from "react-native";
import { Button } from "@react-native-material/core";
import React, { useRef, useState, useEffect } from "react";
import MesaImg from "../assets/mesas.png";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { addMesa, getMesas, isCajaOpen } from "../api";
import BotonHome from "../components/BotonHome";
import fondo from "../assets/fondoScreen.jpg";
import { useIsFocused } from "@react-navigation/native";
import { socket } from "../socket";
const MesasScreen = ({ navigation }) => {
  const isFocus = useIsFocused();
  const bottomSheetModalRef = useRef(null);
  const [numero, setNumero] = useState(null);
  const [mesas, setMesas] = useState([]);
  const [openCaja, setOpenCaja] = useState(0);
  const [caja, setCaja] = useState({});
  const snapPoints = ["25%", "55%"];

  function handlePresentModal() {
    bottomSheetModalRef.current?.present();
  }
  const handleCrearMesa = () => {
    if (numero == null) {
      Alert.alert("Debes poner un numero");
    } else {
      socket.emit("cliente:actualizarComandas");
      bottomSheetModalRef.current?.close();
      addMesa(numero);
      loadMesas();
    }
  };
  useEffect(() => {
   const interval = setInterval(()=>{
    loadMesas();
   }, 10000)
  
    return () => {
      clearInterval(interval)
    }
  }, [])
  
  const loadMesas = async () => {
    const open = await isCajaOpen();
    setOpenCaja(open.length);
    setCaja(open[0]);
    const data = await getMesas();
    setMesas(data);
  };
  useEffect(() => {
    socket.on("servidor:actualizarComandas", () => {
      console.log("Actualizando mesas...." + new Date());
      loadMesas();
    });
    return () => {
      socket.off("servidor:actualizarComandas");
    };
  }, []);
  useEffect(() => {
    loadMesas();
  }, [numero, isFocus]);
  return (
    <BottomSheetModalProvider>
      <ImageBackground
        source={fondo}
        resizeMode="cover"
        style={{ flex: 1, justifyContent: "center" }}
      >
        <BotonHome>
          <View style={style.containerGeneral}>
            {openCaja == 1 && (
              <View style={style.containerButton}>
                <Button
                  title="Nueva Mesa"
                  style={{ backgroundColor: "green" }}
                  onPress={handlePresentModal}
                />
              </View>
            )}
            <View style={style.containerMesas}>
              {openCaja == 1 && (
                <>
                  {mesas.map((mesa, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() =>
                        navigation.navigate("EstadoMesaScreen", {
                          id: mesa._id,
                        })
                      }
                    >
                      <View style={style.containerMesa}>
                        <View
                          style={{
                            ...style.containerImg,
                            top: mesa.sinPagarComandas > 0 ? 30 : 0,
                            zIndex: 500,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 22,
                              fontWeight: "900",
                              zIndex: 99999,
                            }}
                          >
                                {mesa.numeroMesa}
                          </Text>
                        </View>
                        {mesa.sinPagarComandas > 0 && (
                          <>
                            <View
                              style={{
                                backgroundColor: "#292929",
                                paddingVertical: 2,
                                paddingHorizontal: 5,
                                zIndex: 999999,
                                borderRadius: 5,
                                top: 105,
                              }}
                            >
                              <Text
                                style={{ color: "white", fontWeight: "bold" }}
                              >
                                Abierta
                              </Text>
                            </View>
                            <View
                              style={{
                                zIndex: 66666666,
                                top: 62,
                                backgroundColor: "red",
                                borderRadius: 15,
                                paddingHorizontal: 8,
                                paddingVertical: 3,
                              }}
                            >
                              <Text
                                style={{ color: "white", fontWeight: "bold" }}
                              >
                                {mesa.sinPagarComandas}
                              </Text>
                            </View>
                          </>
                        )}
                        <Image source={MesaImg} style={style.styleImg} />
                      </View>
                    </TouchableOpacity>
                  ))}
                </>
              )}
              {openCaja == 0 && (
                <View style={{ alignItems: "center" }}>
                  <Text style={{ fontSize: 22, fontWeight: "600" }}>
                    Caja cerrada
                  </Text>
                  <Button
                    title="Gestionar cajas"
                    onPress={() => navigation.navigate("AbrirCaja")}
                  />
                </View>
              )}
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
        onDismiss={() => setNumero(null)}
      >
        <View style={style.contentContainer}>
          <View style={style.containerModal}>
            <TextInput
              style={style.textInput}
              placeholder="Numero mesa"
              keyboardType="numeric"
              onChangeText={(text) => setNumero(text)}
            />
            <Button title="Crear" onPress={() => handleCrearMesa()} />
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
  textInput: {
    padding: 10,
    width: "80%",
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  containerGeneral: {
    flex: 1,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  containerMesas: {
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
    zIndex: 0,
  },
  styleImg: { width: 65, height: 65, margin: 5 },
  containerMesa: {
    marginBottom: 25,
    position: "relative",
    width: 66,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderColor: "gray",
    zIndex: 0,
  },
  containerImg: {
    position: "absolute",
    zIndex: 1000,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    top: 5,
    paddingHorizontal: 5,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
  containerButton: {
    width: "100%",
    backgroundColor: "#E5E5E5",
    padding: 10,
    marginVertical: 5,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
});
export default MesasScreen;
