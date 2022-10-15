import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import fondo from "../assets/fondoScreen.jpg";
import BotonHome from "../components/BotonHome";
import Toast from "react-native-toast-message";
import { getCajasFinales } from "../api";
import { FlashList } from "@shopify/flash-list";
import moment from "moment";
import "moment/locale/es";
moment.locale("es");
const ListaCajasFinales = ({ navigation }) => {
  const [cajasFinales, setCajasFinales] = useState([]);
  const loadCajas = async () => {
    const data = await getCajasFinales();
    setCajasFinales(data);
  };
  useEffect(() => {
    loadCajas();
  }, []);

  const renderCajas = (caja) => {
    // return (<Text>{moment(caja.fecha).format('MMMM DD YYYY, H:mm:ss')}</Text>)
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("CajaFinalStatusId", { _id: caja._id })
        }
      >
        <View
          style={{
            width: "100%",
            borderRadius: 10,
            paddingHorizontal: 15,
            paddingVertical: 5,
            marginBottom: 8,
            borderWidth: 0.5,
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
              borderWidth: 0.5,
              borderRadius: 15,
              padding: 5,
              paddingVertical: 10,
              backgroundColor: "white",
              marginBottom: 5,
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
                backgroundColor: "#2955F7",
                padding: 5,
                borderRadius: 5,
                alignItems: "center",
                paddingVertical: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "white",
                  textTransform: "uppercase",
                }}
              >
                {moment(caja.fecha).format("D")} de{" "}
                {moment(caja.fecha).format("MMMM")}{" "}
                {moment(caja.fecha).format("YYYY")}{" "}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginTop: 5,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  backgroundColor: "#C1C1C120",
                  borderWidth: 0.5,
                  borderRadius: 5,
                  padding: 5,
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
                <Text style={{ fontSize: 26, fontWeight: "bold" }}>
                  {moment(caja.fecha).format("H:mm")}
                </Text>
                <View
                  style={{
                    backgroundColor: "#BBF9A2",
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    borderRadius: 5,
                  }}
                >
                  <Text style={{ fontSize: 22, fontWeight: "500" }}>
                    Iniciada
                  </Text>
                </View>
              </View>
              <View
                style={{
                  alignItems: "center",
                  backgroundColor: "#C1C1C120",
                  borderWidth: 0.5,
                  borderRadius: 5,
                  padding: 5,
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
                <Text style={{ fontSize: 26, fontWeight: "bold" }}>
                  {moment(caja.fechaCerrada).format("H:mm")}
                </Text>
                <View
                  style={{
                    backgroundColor: "#F9A2A6",
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    borderRadius: 5,
                  }}
                >
                  <Text style={{ fontSize: 22, fontWeight: "500" }}>
                    Finalizada
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              borderWidth: 0.5,
              borderRadius: 15,
              padding: 5,
              backgroundColor: "white",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                marginBottom: 3,
                justifyContent: "space-around",
              }}
            >
              <View
                style={{
                  backgroundColor: "#BBF9A2",
                  paddingHorizontal: 10,
                  borderRadius: 10,
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  Abierta
                </Text>
              </View>
              <Text style={{ fontSize: 18, fontWeight: "500" }}>
                {" "}
                {caja.abiertaPor}
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-around" }}
            >
              <View
                style={{
                  backgroundColor: "#F9A2A6",
                  paddingHorizontal: 10,
                  borderRadius: 10,
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  Cerrada
                </Text>
              </View>
              <Text style={{ fontSize: 18, fontWeight: "500" }}>
                {" "}
                {caja.cerradaPor}
              </Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: "#323432",
              width: "100%",
              alignItems: "center",
              borderRadius: 15,
              marginVertical: 10,
              paddingVertical: 10,
            }}
          >
            <Text style={{ fontSize: 22, color: "white", fontWeight: "bold" }}>
              {caja.dineroCaja}€
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
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
              style={{ width: "100%", height: "100%", paddingHorizontal: 10 }}
            >
              <FlashList
                data={cajasFinales}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => renderCajas(item)}
                estimatedItemSize={200}
                ListEmptyComponent={<Text>No hay cajas</Text>}
              />
            </View>
          </View>
        </View>
      </BotonHome>
    </ImageBackground>
  );
};

export default ListaCajasFinales;
