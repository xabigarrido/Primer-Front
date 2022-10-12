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
            marginBottom: 3,
            borderWidth: 0.5,
          }}
        >
          <View
            style={{
              borderWidth: 0.5,
              borderRadius: 15,
              padding: 5,
              backgroundColor: "white",
              marginBottom: 5,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {moment(caja.fecha).format("D")} de{" "}
              {moment(caja.fecha).format("MMMM")} del{" "}
              {moment(caja.fecha).format("YYYY")}{" "}
            </Text>
            <Text style={{ fontSize: 18 }}>
              Hora inicio: {moment(caja.fecha).format("H:mm:ss")}
            </Text>
            <Text style={{ fontSize: 18 }}>
              Hora cierre: {moment(caja.fechaCerrada).format("H:mm:ss")}
            </Text>
          </View>
          <View
            style={{
              borderWidth: 0.5,
              borderRadius: 15,
              padding: 5,
              backgroundColor: "white",
            }}
          >
            <Text style={{ fontSize: 18 }}>Abierta: {caja.abiertaPor}</Text>
            <Text style={{ fontSize: 18 }}>Cerrada: {caja.cerradaPor}</Text>
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