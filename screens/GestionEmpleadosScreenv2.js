import { View, Text, ImageBackground, StyleSheet } from "react-native";
import React, { useRef, useState, useEffect, Suspense } from "react";
import { SWRConfig } from "swr";
import fondo from "../assets/fondoScreen.jpg";
import BotonHome from "../components/BotonHome";
import Toast from "react-native-toast-message";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { Button } from "@react-native-material/core";
import useSWR from "swr";
import { API } from "../api";
import ListEmpleado from "../components/ListEmpleado";
import ListEmpleadoFinal from './ListEmpleadosFinal'

const GestionEmpleadosScreenv2 = () => {
  const bottomSheetModalRef = useRef(null);
  const snapPoints = ["25%", "55%"];
  function handlePresentModal() {
    return bottomSheetModalRef.current?.snapToIndex(0);
  }
  useEffect(() => {
    bottomSheetModalRef.current?.present();
    // console.log('pipi')
  }, [bottomSheetModalRef]);
  return (
    <BottomSheetModalProvider>
      <ImageBackground
        source={fondo}
        resizeMode="cover"
        style={{ flex: 1, justifyContent: "center" }}
      >
        <BotonHome>
          <SWRConfig
            value={{
              refreshInterval: 0,
              fetcher: (...args) => fetch(...args).then((res) => res.json()),
              suspense: true,
            }}
          >
            <Suspense fallback={<Text style={styles.title}>Loading</Text>}>
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
                  <ListEmpleadoFinal />
                  {/* <ListEmpleado /> */}
                  {/* <Button title="Press" onPress={handlePresentModal} /> */}
                </View>
              </View>
            </Suspense>
          </SWRConfig>
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
const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 70,
    textAlign: "center",
    marginBottom: 30,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF7E9",
  },
});

export default GestionEmpleadosScreenv2;
