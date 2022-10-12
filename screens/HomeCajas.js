import { View, Text, ImageBackground } from "react-native";
import React, { useEffect, useState } from "react";
import BotonHome from "../components/BotonHome";
import fondo from "../assets/fondoScreen.jpg";
import { Button } from "@react-native-material/core";
import { useSelector } from "react-redux";
import { Root, Popup } from 'react-native-popup-confirm-toast'
import {
  getComandas,
  handleAbrirCaja,
  handleCerrarCaja,
  isCajaOpen,
} from "../api";
import Toast from "react-native-toast-message";

const HomeCajas = ({ navigation }) => {
  const [abiertaCaja, setAbiertaCaja] = useState(0);
  const [cajaActual, setCajaActual] = useState([]);
  const [comandas, setComandas] = useState();
  const [sinPagar, setSinPagar] = useState(0)
  const user = useSelector((state) => state.userStore);
  const nombreCompleto = `${user.nombre} ${user.apellidos}`;

  const load = async () => {
    const data = await isCajaOpen();
    if (data && data.length > 0) {
      setAbiertaCaja(data.length);
      setCajaActual(data[0]);
    } else {
      setAbiertaCaja(0);
      setCajaActual(data[0]);
    }
  };
  const loadCaja = async () => {
    const data = await isCajaOpen();
    const comandas = await getComandas();
    let arraySinPagar = [];
    const foundComandasNoPagadas = comandas.map((element) =>
{
  element.contenido.filter(
    (elementContenido) => {
      if(elementContenido.pagadaIndiComanda === false){
        arraySinPagar.push(elementContenido)
      }
    }
  )
  return ;
}
    );
    console.log(arraySinPagar);
    console.log(arraySinPagar.length);
    setSinPagar(arraySinPagar.length)

    setComandas(comandas);
    setCajaActual(data[0]);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    loadCaja();
  }, [abiertaCaja]);

  const abrirCaja = () => {
    setAbiertaCaja(1);
    handleAbrirCaja(nombreCompleto);
    Toast.show({
      type: "success",
      text1: "Caja abierta",
      position: "top",
      visibilityTime: 1800,
    });
    navigation.navigate("TabScreen");
  };

  const cerrarCaja = () => {
    if(sinPagar > 0){
      Popup.show({
        type: 'confirm',
        title: '¡Hay comandas sin cobrar!',
        textBody: '¿Desea cerrar la caja?',
        buttonText: 'Si',
        confirmText: 'No',
        callback: () => {
          setAbiertaCaja(0);
          handleCerrarCaja(nombreCompleto);
          Toast.show({
            type: "error",
            text1: "Caja cerrada",
            position: "top",
            visibilityTime: 1800,
          });
            Popup.hide();
        },
        cancelCallback: () => {
            Popup.hide();
        },
    })
    } else {
      setAbiertaCaja(0);
      handleCerrarCaja(nombreCompleto);
      Toast.show({
        type: "error",
        text1: "Caja cerrada",
        position: "top",
        visibilityTime: 1800,
      });
    }
  };
  return (
    <Root>
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
            {abiertaCaja == 0 && (
              <Button
                title="Abrir caja"
                style={{
                  backgroundColor: "green",
                  width: "50%",
                  marginBottom: 30,
                }}
                onPress={abrirCaja}
              />
            )}

            {abiertaCaja == 1 && (
              <Button
                title="Cerrar caja"
                style={{
                  backgroundColor: "red",
                  width: "50%",
                  marginBottom: 30,
                }}
                onPress={cerrarCaja}
              />
            )}
            {abiertaCaja == 1 && (
              <Button
                title="Ver caja (Actual)"
                onPress={() =>
                  navigation.navigate("CajaFinalStatus", {
                    _id: cajaActual._id,
                  })
                }
                style={{
                  backgroundColor: "blue",
                  width: "50%",
                  marginBottom: 30,
                }}
              />
            )}
            <Button
              title="Ver todas las caja"
              style={{
                backgroundColor: "black",
                width: "80%",
                marginBottom: 30,
              }}
              onPress={() => navigation.navigate("ListaCajasFinales")}
            />
          </View>
        </View>
      </BotonHome>
    </ImageBackground>
    </Root>
  );
};

export default HomeCajas;
