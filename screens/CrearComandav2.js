import "react-native-gesture-handler";
import "react-native-get-random-values";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { useRef, useState, useEffect } from "react";
import { API, getProducts, addComanda, getMesa, URL } from "../api";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@react-native-material/core";
import { ScrollView } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import BotellaImg from "../assets/botella.png";
import CopaImg from "../assets/copa2.jpg";
import { useSelector } from "react-redux";
import moment from "moment/moment";
export default function App({ navigation, route }) {
  const user = useSelector((state) => state.userStore);
  const [isOpen, setIsOpen] = useState(false);
  const [listProducts, setlistProducts] = useState([]);
  const [listBotellas, setListBotellas] = useState([]);
  const [listRefrescos, setlistRefrescos] = useState([]);
  const [listBebibasBotella, setListBebibasBotella] = useState([]);
  const [comanda, setComanda] = useState([]);
  const [botella, setBotella] = useState(null);
  const [precioComanda, setPrecioComanda] = useState(0);
  const [pickCopa, setPickCopa] = useState(null);
  const [pickBotella, setPickBotella] = useState(null);
  const [mesa, setMesa] = useState({});
  const [tokens, setTokens] = useState([]);

  // inicio notis

  const getTokens = async () => {
    const data = await fetch(`${API}/notification/tokens`);
    const res = await data.json();
    setTokens(res);
  };
  useEffect(() => {
    getTokens();
  }, []);

  const enviarNotificacion = async (idMesa, numMesa) => {
    console.log(idMesa, numMesa)
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
          data: { idMesa },
          title: "La piconera",
          body: `Comanda nueva mesa ${numMesa}`,
        }),
      });
    }
  };
  // Fin noti

  const loadProducts = async () => {
    const data = await getProducts();
    setlistProducts(data);
  };
  const loadMesa = async () => {
    const data = await getMesa(route.params.idMesa);
    setMesa(data[0]);
    console.log(data);
  };
  useEffect(() => {
    loadProducts();
    if (route) {
      console.log(route.params);
      loadMesa();
    }
  }, []);

  const bottomSheetModalRef = useRef(null);
  const snapPoints = ["45%", "75%", "100%"];

  const agregarBotella = (botella, refrescos) => {
    bottomSheetModalRef.current.close();
    let listRefrescos = [];
    refrescos.forEach((refresco) => listRefrescos.push(refresco.imagen));
    const newComandaBotella = {
      idComanda: uuidv4(),
      referencia: "Botella",
      producto: botella.nombre,
      imagenPrincipal: botella.imagen,
      listRefrescos,
      precio: botella.precio,
      pagadaIndiComanda: false,
    };
    setComanda([...comanda, newComandaBotella]);
    setPrecioComanda(precioComanda + botella.precio);
  };
  const agregarComandaBackend = () => {
    if (comanda.length > 0) {
      const newComanda = {
        idMesa: route.params.idMesa,
        datosMesa: "Ninguno",
        tipo: "Ninguno",
        contenido: comanda,
        precioComanda,
        fecha: moment(),
        atendidoPor: user.nombre,
        pagada: false,
        idCaja: "Cerrada",
      };
      enviarNotificacion(route.params.idMesa, mesa.numeroMesa)
      setComanda([]);
      setPrecioComanda(0);
      addComanda(newComanda);
      navigation.navigate("EstadoMesaScreen", { id: route.params.idMesa });
    } else {
      Alert.alert("Comanda vacia");
    }
  };
  const agregarCopa = (copa, refresco) => {
    bottomSheetModalRef.current.close();
    const newComandaCopa = {
      idComanda: uuidv4(),
      referencia: "Copa",
      producto: copa.nombre,
      imagenPrincipal: copa.imagen,
      listRefrescos: [refresco.imagen],
      precio: 10,
      pagadaIndiComanda: false,
    };
    setComanda([...comanda, newComandaCopa]);
    setPrecioComanda(precioComanda + newComandaCopa.precio);
  };

  const handleBotella = (botella) => {
    setBotella(botella);
    const arrayRefrescos = listProducts.filter(
      (element) => element.categoriaMin == "refresco"
    );
    setlistRefrescos(arrayRefrescos);
  };
  const handleListBebidas = (refresco) => {
    if (listBebibasBotella.length < 12) {
      const newRefresco = {
        ...refresco,
        idDelete: uuidv4(),
      };
      setListBebibasBotella([...listBebibasBotella, newRefresco]);
    }
  };

  function handlePresentModal() {
    bottomSheetModalRef.current?.present();
    setTimeout(() => {
      setIsOpen(true);
    }, 100);
    const arrayBotellas = listProducts.filter(
      (element) => element.categoriaMin == "botella"
    );
    setListBotellas(arrayBotellas);
  }

  const handleModalBotella = () => {
    setPickBotella(true);
    handlePresentModal();
  };
  const changePickCopa = () => {
    setPickCopa(true);
    handlePresentModal();
  };

  const deleteBebida = (id) => {
    const newArray = listBebibasBotella.filter(
      (element) => element.idDelete !== id
    );
    setListBebibasBotella(newArray);
  };

  const handleDismiss = () => {
    setIsOpen(false);
    setBotella(null);
    setPickBotella(null);
    setPickCopa(null);
    setListBebibasBotella([]);
  };
  const deleteIdComanda = (id, precio) => {
    const newArray = comanda.filter((comanda) => comanda.idComanda != id);
    setComanda(newArray);
    setPrecioComanda(precioComanda - precio);
  };
  return (
    <BottomSheetModalProvider>
      <ScrollView
        style={{
          backgroundColor: "black",
        }}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        <View
          style={[
            styles.container,
            { backgroundColor: isOpen ? "black" : "black" },
          ]}
        >
          <View
            style={{
              width: "95%",
              minHeight: 150,
              backgroundColor: "white",
              borderRadius: 15,
              padding: 10,
            }}
          >
            <Text
              style={{ fontSize: 22, fontWeight: "bold", color: "#56636F" }}
            >
              Mesa {mesa.numeroMesa}
            </Text>
            <View
              style={{
                width: "100%",
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: "gray",
                marginVertical: 10,
              }}
            />
            {comanda.length == 0 ? (
              <>
                <Text>La comanda esta vacia</Text>
              </>
            ) : (
              comanda.map((comanda, index) => (
                <View
                  key={index}
                  style={{
                    borderWidth: 0.5,
                    width: "100%",
                    borderRadius: 10,
                    borderColor: "gray",
                    backgroundColor: "#F1F1F1",
                    padding: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    marginVertical: 5,
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <View style={{ width: 57 }}>
                      <Image
                        source={{
                          uri: `${URL}${comanda.imagenPrincipal}`,
                        }}
                        style={{ width: "100%", height: 90 }}
                      />
                    </View>
                    <View
                      style={{ justifyContent: "space-between", width: "85%" }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          paddingHorizontal: 5,
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{
                            borderColor:
                              comanda.referencia == "Botella" ? "red" : "green",
                            borderWidth: 1,
                            borderRadius: 15,
                            padding: 5,
                            backgroundColor:
                              comanda.referencia == "Botella" ? "red" : "green",
                            marginRight: 5,
                            marginBottom: 5,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 18,
                              fontWeight: "bold",
                              color: "white",
                            }}
                          >
                            {comanda.referencia}
                          </Text>
                        </View>
                        <View
                          style={{
                            borderColor: "gray",
                            borderWidth: 1,
                            borderRadius: 15,
                            padding: 5,
                            backgroundColor: "white",
                            marginRight: 5,
                            marginBottom: 5,
                          }}
                        >
                          <Text style={{ fontSize: 18 }}>
                            {comanda.producto}
                          </Text>
                        </View>
                      </View>
                      <View style={{ flexWrap: "wrap", flexDirection: "row" }}>
                        {comanda.listRefrescos.map((refresco, index) => (
                          <Image
                            key={index}
                            source={{
                              uri: `${URL}${refresco}`,
                            }}
                            style={{
                              width: 30,
                              height: 30,
                              marginHorizontal: 2,
                            }}
                          />
                        ))}
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-end",
                          alignItems: "center",
                          marginTop: 5,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() =>
                            deleteIdComanda(comanda.idComanda, comanda.precio)
                          }
                        >
                          <View
                            style={{
                              borderWidth: 0.3,
                              borderColor: "red",
                              padding: 10,
                              backgroundColor: "#F7F7F7",
                              borderRadius: 15,
                              marginHorizontal: 5,
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Text>Eliminar</Text>
                            <MaterialIcons
                              name="delete"
                              size={24}
                              color="#DC0000"
                            />
                          </View>
                        </TouchableOpacity>

                        <View
                          style={{
                            borderWidth: 0.3,
                            padding: 10,
                            backgroundColor: "#F7F7F7",
                            borderRadius: 15,
                          }}
                        >
                          <Text
                            style={{
                              textAlign: "right",
                              fontSize: 18,
                              fontWeight: "bold",
                              color: "#434343",
                            }}
                          >
                            {comanda.precio}€
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ))
            )}
            <Text
              style={{
                textAlign: "right",
                fontSize: 22,
                marginVertical: 20,
                fontWeight: "bold",
              }}
            >
              Total: {precioComanda}€
            </Text>
            <Button
              title="Ordenar comanda"
              onPress={() => agregarComandaBackend(comanda)}
              style={{ backgroundColor: comanda.length > 0 ? "green" : "gray" }}
            />
          </View>
          <View
            style={{
              width: "95%",
              backgroundColor: "white",
              borderRadius: 15,
              padding: 10,
              marginVertical: 15,
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            <View style={{ width: 80 }}>
              <TouchableOpacity onPress={() => handleModalBotella()}>
                <Image source={BotellaImg} style={{ width: 80, height: 80 }} />
                <Text style={{ textAlign: "center" }}>Botella</Text>
              </TouchableOpacity>
            </View>
            <View style={{ width: 80 }}>
              <TouchableOpacity onPress={() => changePickCopa()}>
                <Image source={CopaImg} style={{ width: 80, height: 80 }} />
                <Text style={{ textAlign: "center" }}>Copa</Text>
              </TouchableOpacity>
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
            onDismiss={() => handleDismiss()}
          >
            <View style={styles.contentContainer}>
              {pickBotella != null ? (
                <>
                  <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                    Seleccionar {botella == null ? "Botella" : "Refresco"}:{" "}
                  </Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {botella === null
                      ? listBotellas.map((botella, index) => (
                          <View key={index} style={{ marginHorizontal: 10 }}>
                            <TouchableOpacity
                              onPress={() => handleBotella(botella)}
                            >
                              <Image
                                source={{
                                  uri: `${URL}${botella.imagen}`,
                                }}
                                style={{ width: 50, height: 50 }}
                              />
                              <Text style={{ textAlign: "center" }}>
                                {botella.precio}€
                              </Text>
                            </TouchableOpacity>
                          </View>
                        ))
                      : listRefrescos.map((refresco, index) => (
                          <View key={index} style={{ marginHorizontal: 5 }}>
                            <TouchableOpacity
                              onPress={() => handleListBebidas(refresco)}
                            >
                              <Image
                                source={{
                                  uri: `${URL}${refresco.imagen}`,
                                }}
                                style={{ width: 50, height: 50 }}
                              />
                            </TouchableOpacity>
                          </View>
                        ))}
                  </View>
                  <View
                    style={{
                      width: "100%",
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: "gray",
                      marginVertical: 20,
                    }}
                  />
                  {botella && (
                    <>
                      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                        Refrescos: {listBebibasBotella.length}/12
                      </Text>
                      <Text>(Pulsa para eliminar)</Text>
                      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                        {listBebibasBotella.map((bebida, index) => (
                          <View key={index} style={{ margin: 5 }}>
                            <TouchableOpacity
                              onPress={() => deleteBebida(bebida.idDelete)}
                            >
                              <Image
                                source={{
                                  uri: `${URL}${bebida.imagen}`,
                                }}
                                style={{ width: 35, height: 35 }}
                              />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                      <View>
                        <Button
                          title="Agregar botella"
                          onPress={() =>
                            agregarBotella(botella, listBebibasBotella)
                          }
                          style={{
                            backgroundColor:
                              listBebibasBotella.length < 12 ? "gray" : "green",
                          }}
                        />
                      </View>
                    </>
                  )}
                </>
              ) : (
                <></>
              )}
              {pickCopa != null ? (
                <>
                  <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                    Seleccionar {botella == null ? "Botella" : "Refresco"}:{" "}
                  </Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {botella === null
                      ? listBotellas.map((botella, index) => (
                          <View
                            key={index}
                            style={{
                              marginHorizontal: 10,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <TouchableOpacity
                              onPress={() => handleBotella(botella)}
                            >
                              <Image
                                source={{
                                  uri: `${URL}${botella.imagen}`,
                                }}
                                style={{ width: 50, height: 50 }}
                              />
                              <Text style={{ textAlign: "center" }}>
                                {botella.nombre}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        ))
                      : listRefrescos.map((refresco, index) => (
                          <View key={index} style={{ marginHorizontal: 5 }}>
                            <TouchableOpacity
                              onPress={() => agregarCopa(botella, refresco)}
                            >
                              <Image
                                source={{
                                  uri: `${URL}${refresco.imagen}`,
                                }}
                                style={{ width: 50, height: 50 }}
                              />
                            </TouchableOpacity>
                          </View>
                        ))}
                  </View>
                  <View
                    style={{
                      width: "100%",
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: "gray",
                      marginVertical: 20,
                    }}
                  />
                </>
              ) : (
                <></>
              )}
            </View>
          </BottomSheetModal>
        </View>
      </ScrollView>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "gray",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  title: {
    fontWeight: "900",
    letterSpacing: 0.5,
    fontSize: 16,
  },
  subtitle: {
    color: "#101318",
    fontSize: 14,
    fontWeight: "bold",
  },
  description: {
    color: "#56636F",
    fontSize: 13,
    fontWeight: "normal",
    width: "100%",
  },
});
