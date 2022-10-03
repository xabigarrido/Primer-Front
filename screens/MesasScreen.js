import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Button } from "@react-native-material/core";
import React, { useRef, useState, useEffect } from "react";
import MesaImg from "../assets/mesas.png";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { addMesa, getMesas } from "../api";
const MesasScreen = ({navigation}) => {
  const bottomSheetModalRef = useRef(null);
  const [numero, setNumero] = useState(null);
  const [mesas, setMesas] = useState([]);
  const snapPoints = ["25%", "75%"];
  function handlePresentModal() {
    bottomSheetModalRef.current?.present();
  }
  const handleCrearMesa = () => {
    if (numero == null) {
      Alert.alert("Debes poner un numero");
    } else {
      bottomSheetModalRef.current?.close();
      addMesa(numero);
      loadMesas();
    }
  };

  const loadMesas = async () => {
    const data = await getMesas();
    setMesas(data);
  };

  useEffect(() => {
    loadMesas();
  }, [numero]);
  return (
    <BottomSheetModalProvider>
      <ScrollView
        style={{
          backgroundColor: "black",
        }}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        <View style={style.containerGeneral}>
          <View style={style.containerButton}>
            <Button
              title="Nueva Mesa"
              style={{ backgroundColor: "green" }}
              onPress={handlePresentModal}
            />
          </View>
          <View style={style.containerMesas}>
            {mesas.map((mesa, index) => (
              <TouchableOpacity key={index} onPress={()=>navigation.navigate('EstadoMesaScreen', {id: mesa._id})}>
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
          </View>
        </View>
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
      </ScrollView>
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
  containerGeneral: { flex: 1, padding: 5, alignItems: "center" },
  containerMesas: {
    backgroundColor: "#E5E5E5",
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    zIndex: 0,
  },
  styleImg: { width: 65, height: 65, margin: 5 },
  containerMesa: {
    position: "relative",
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
export default MesasScreen;
