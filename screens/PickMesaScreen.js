import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import MesaImg from "../assets/mesas.png";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { isCajaOpen, getMesas } from "../api";
import fondo from "../assets/fondoScreen.jpg";
import BotonHome from "../components/BotonHome";
import { Button } from "@react-native-material/core";

const PickMesasScreen = ({ navigation }) => {
  const [mesas, setMesas] = useState([]);
  const [openCaja, setOpenCaja] = useState(0);
  const loadMesas = async () => {
    const open = await isCajaOpen();
    setOpenCaja(open.length);
    const data = await getMesas();
    setMesas(data);
  };

  useEffect(() => {
    loadMesas();
  }, []);
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
              <View
                style={{
                  backgroundColor: "#E5E5E5",
                  borderRadius: 15,
                  padding: 20,
                  width: "80%",
                  alignItems: "center",
                  marginBottom: 3,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Selecciona mesa para añadir nuevas comandas
                </Text>
              </View>
            )}
            <View style={style.containerMesas}>
              {openCaja == 1 && (
                <>
                  {mesas.map((mesa, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        navigation.navigate("ComandaScreen", {
                          idMesa: mesa._id,
                        });
                      }}
                    >
                      <View style={style.containerMesa}>
                        <View style={style.containerImg}>
                          <Text style={{ fontSize: 22, fontWeight: "900" }}>
                            {mesa.numeroMesa}
                          </Text>
                        </View>
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
    backgroundColor: "#E5E5E5",
    borderRadius: 5,
    paddingVertical: 50,
    paddingHorizontal: 5,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
    zIndex: 0,
  },
  styleImg: { width: 65, height: 65, margin: 5 },
  containerMesa: {
    position: "relative",
    margin: 5,
    width: 66,
    height: 66,
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
    top: -10,
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
export default PickMesasScreen;
