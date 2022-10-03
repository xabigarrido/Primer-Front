import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Modal,
  StyleSheet,
  Pressable,
  Image,
} from "react-native";
import { Button } from "@react-native-material/core";
import React, { useState, useEffect } from "react";
import { getProducts, API, URL } from "../api";
import { current } from "@reduxjs/toolkit";

const CrearComanda = () => {
  const [listProducts, setListProducts] = useState([]);
  const [listBotellas, setListBotellas] = useState([]);
  const [listRefrescos, setListRefrescos] = useState([]);
  const [modalBotella, setModalBotella] = useState(false);
  const [modalRefrescos, setModalRefrescos] = useState(false);
  const [modalRefrescosBotella, setModalRefrescosBotella] = useState(false);
  const [pickBotella, setPickBotella] = useState();
  const [arrayRefrescos, setArrayRefrescos] = useState([]);
  const [manejoRefrescos, setManejoRefrescos] = useState([])
  // Notificacion
  const [tokens, setTokens] = useState([]);

  const getTokens = async () => {
    const data = await fetch(`${API}/notification/tokens`);
    const res = await data.json();
    setTokens(res);
  };
  useEffect(() => {
    getTokens();
  }, []);

  const handleSubmit = async () => {
    let tokensArray = [];
    tokens.forEach((element) => {
      tokensArray.push(element.token);
    });

    for (let i = 0; i < tokensArray.length; i++) {
      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: tokensArray[i],
          data: { extraData: "Some data" },
          title: "La piconera",
          body: "Comanda nueva mesa 1",
        }),
      });
    }
  };
  // Fin noti

  const handleSubmitRefrescoBotella = (refresco) => {
    setArrayRefrescos(current => [...current, refresco])
    console.log(arrayRefrescos);
    const resultado = {};
    arrayRefrescos.forEach((el) => (resultado[el] = resultado[el] + 1 || 1));
    const newArray = Object.entries(resultado)
    const result = newArray.forEach(el => {
      setManejoRefrescos(['El producto: '+el[0]+' se repite: '+el[1]])
    })
  
  };
  const handleProducts = async () => {
    const data = await getProducts();
    setListProducts(data);
  };
  useEffect(() => {
    handleProducts();
  }, []);

  useEffect(() => {
    handleProducts();
    const filterListBotella = listProducts.filter(
      (element) => element.categoriaMin == "botella"
    );
    setListBotellas(filterListBotella);
    const filterListRefrescos = listProducts.filter(
      (element) => element.categoriaMin == "refresco"
    );
    setListRefrescos(filterListRefrescos);
  }, [modalBotella, modalRefrescos]);

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
      style={{ backgroundColor: "black" }}
    >
      <View
        style={{
          backgroundColor: "#CDCDCD",
          width: "99%",
          minHeight: 150,
          borderRadius: 15,
          padding: 15,
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text style={{ fontSize: 30, fontWeight: "bold" }}>
            Mesa:<Text> 1</Text>
          </Text>
        </View>
        <View>
          <Button
            title="Crear comanda"
            style={{ backgroundColor: "#006D29", padding: 10 }}
            onPress={() => handleSubmit()}
          />
        </View>
      </View>
      <View
        style={{
          width: "95%",
          backgroundColor: "#FFB821",
          borderRadius: 15,
          padding: 15,
          marginTop: 15,
          minHeight: 80,
          flexWrap: "wrap",
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          style={{ marginRight: 8 }}
          onPress={() => setModalBotella(true)}
        >
          <View style={{ alignItems: "center" }}>
            <View
              style={{
                backgroundColor: "white",
                width: 50,
                height: 50,
                borderRadius: 20,
                borderWidth: 1.5,
              }}
            ></View>
            <Text style={{ fontWeight: "bold" }}>Botella</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginRight: 8 }}>
          <View style={{ alignItems: "center" }}>
            <View
              style={{
                backgroundColor: "white",
                width: 50,
                height: 50,
                borderRadius: 20,
                borderWidth: 1.5,
              }}
            ></View>
            <Text style={{ fontWeight: "bold" }}>Copa</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginRight: 8 }}
          onPress={() => setModalRefrescos(true)}
        >
          <View style={{ alignItems: "center" }}>
            <View
              style={{
                backgroundColor: "white",
                width: 50,
                height: 50,
                borderRadius: 20,
                borderWidth: 1.5,
              }}
            ></View>
            <Text style={{ fontWeight: "bold" }}>Refresco</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginRight: 8 }}>
          <View style={{ alignItems: "center" }}>
            <View
              style={{
                backgroundColor: "white",
                width: 50,
                height: 50,
                borderRadius: 20,
                borderWidth: 1.5,
              }}
            ></View>
            <Text style={{ fontWeight: "bold" }}>Cachimba</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginRight: 8 }}>
          <View style={{ alignItems: "center" }}>
            <View
              style={{
                backgroundColor: "white",
                width: 50,
                height: 50,
                borderRadius: 20,
                borderWidth: 1.5,
              }}
            ></View>
            <Text style={{ fontWeight: "bold" }}>Vaper</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalBotella}
        onRequestClose={() => {
          setModalBotella(!modalBotella);
        }}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { justifyContent: "space-between" }]}>
            <View style={{ flexDirection: "row" }}>
              {listBotellas.map((botella) => (
                <TouchableOpacity
                  key={botella._id}
                  onPress={() => {
                    setModalBotella(!modalBotella);
                    setModalRefrescosBotella(true);
                    setPickBotella(botella);
                    console.log(botella);
                  }}
                >
                  <View style={{ marginRight: 5, alignItems: "center" }}>
                    <Image
                      source={{
                        uri: `${URL}${botella.imagen}`,
                      }}
                      style={{
                        padding: 10,
                        minWidth: 100,
                        height: 70,
                        borderRadius: 15,
                      }}
                    />
                    <View
                      style={{
                        backgroundColor: "white",
                        padding: 4,
                        borderRadius: 15,
                        marginTop: 5,
                        alignItems: "center",
                        minWidth: 100,
                      }}
                    >
                      <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                        {botella.nombre}
                      </Text>
                      <Text style={{ fontWeight: "bold" }}>
                        {botella.precio} €
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <View>
              <Pressable
                style={[
                  styles.button,
                  styles.buttonClose,
                  { marginBottom: 10 },
                ]}
                onPress={() => setModalBotella(!modalBotella)}
              >
                <Text style={styles.textStyle}>Volver a comanda</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalRefrescos}
        onRequestClose={() => {
          setListRefrescos(!modalRefrescos);
        }}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { justifyContent: "space-between" }]}>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {listRefrescos.map((refresco) => (
                <TouchableOpacity key={refresco._id}>
                  <View style={{ marginVertical: 5 }}>
                    <Image
                      source={{
                        uri: `${URL}${refresco.imagen}`,
                      }}
                      style={{
                        minWidth: 100,
                        height: 70,
                        borderRadius: 15,
                        resizeMode: "contain",
                      }}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <View>
              <Pressable
                style={[
                  styles.button,
                  styles.buttonClose,
                  { marginBottom: 10 },
                ]}
                onPress={() => setModalRefrescos(!modalRefrescos)}
              >
                <Text style={styles.textStyle}>Volver a comanda</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalRefrescosBotella}
        onRequestClose={() => {
          setModalRefrescosBotella(!modalRefrescosBotella);
        }}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { justifyContent: "space-between" }]}>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {listRefrescos.map((refresco) => (
                <TouchableOpacity
                  key={refresco._id}
                  onPress={() => handleSubmitRefrescoBotella(refresco.nombre)}
                >
                  <View style={{ marginVertical: 5 }}>
                    <Image
                      source={{
                        uri: `${URL}${refresco.imagen}`,
                      }}
                      style={{
                        minWidth: 100,
                        height: 70,
                        borderRadius: 15,
                        resizeMode: "contain",
                      }}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <View>
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 5,
                  paddingHorizontal: 5,
                  justifyContent: "center",
                  marginBottom: 10,
                  minHeight: 150,
                }}
              >
                {pickBotella && (
                  <View style={{ flexDirection: "row" }}>
                    <View style={{ alignItems: "center" }}>
                      <Image
                        source={{
                          uri: `${URL}${pickBotella.imagen}`,
                        }}
                        style={{ width: 100, height: 70 }}
                      />
                      <Text>{pickBotella.nombre}</Text>
                    </View>
                    <View>
                      <Text>
                        {
                        manejoRefrescos.map((refresco, index) => (
                          <Text key={index}>{refresco}</Text>
                        ))}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
              <Pressable
                style={[
                  styles.button,
                  styles.buttonClose,
                  { marginBottom: 10 },
                ]}
                onPress={() =>{
                    setModalRefrescosBotella(!modalRefrescosBotella)
                    setArrayRefrescos([])
                }}
              >
                <Text style={styles.textStyle}>Volver a comanda</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    width: "100%",
    height: "80%",
    margin: 20,
    padding: 5,
    backgroundColor: "#8F8F8F",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
export default CrearComanda;
