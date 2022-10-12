import { View, Text, ImageBackground, StyleSheet } from "react-native";
import React, { useRef, useState, useEffect } from "react";

import fondo from "../assets/fondoScreen.jpg";
import BotonHome from "../components/BotonHome";
import Toast from "react-native-toast-message";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { Button } from "@react-native-material/core";
const ListaCajasFinales = () => {
  const bottomSheetModalRef = useRef(null);
  const snapPoints = ["25%", "55%"];
  function handlePresentModal() {
    bottomSheetModalRef.current?.present();
  }
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
              <Text>xxxx</Text>
              <Button title="Press" onPress={handlePresentModal} />
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
export default ListaCajasFinales;
