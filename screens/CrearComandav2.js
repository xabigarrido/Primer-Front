import "react-native-gesture-handler";
import "react-native-get-random-values";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  TouchableOpacity,
} from "@gorhom/bottom-sheet";
import { useRef, useState, useEffect } from "react";
import { API, getProducts, addComanda, getMesa, URL, isCajaOpen, editCopasBotellas } from "../api";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@react-native-material/core";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import BotellaImg from "../assets/botella.png";
import CopaImg from "../assets/copa2.jpg";
import { useSelector } from "react-redux";
import moment from "moment/moment";
import { FlashList } from "@shopify/flash-list";
import Toast from "react-native-toast-message";
import BotonHome from "../components/BotonHome";
import BotonMesa from "../components/BotonMesa";
import { socket } from "../socket";

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
  const [caja, setCaja] = useState({});
  const [datosMesa, setDatosMesa] = useState({ copas: 0, botellas: 0, idUser: user._id });

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
  };
  const loadCaja = async () => {
    const data = await isCajaOpen();
    setCaja(data[0]);
  };
  useEffect(() => {
    loadProducts();
    loadCaja();
    if (route) {
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
      multiplicador: 1,
      precioReal: botella.precio,
    };
    setComanda([newComandaBotella, ...comanda]);
    setPrecioComanda(precioComanda + botella.precio);
    Toast.show({
      type: "error",
      text1: "Botella agregada",
      visibilityTime: 1000,
      topOffset: 0,
    });
    setDatosMesa({ ...datosMesa, botellas: datosMesa.botellas + 1 });
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
        idCaja: caja._id,
      };
      socket.emit("cliente:actualizarComandas");
      socket.emit("cliente:actualizarComandas");
      enviarNotificacion(route.params.idMesa, mesa.numeroMesa);
      setComanda([]);
      setPrecioComanda(0);
      addComanda(newComanda);
      Toast.show({
        type: "success",
        text1: "Comanda agregada",
        // position: "bottom",
        visibilityTime: 1800,
      });
      console.log(datosMesa);
      editCopasBotellas(datosMesa)
      setDatosMesa({...datosMesa, copas: 0, botellas: 0})

      // navigation.navigate("TabScreen");
      // navigation.navigate("EstadoMesaScreen", { id: route.params.idMesa });
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
      multiplicador: 1,
      precioReal: 10,
    };
    setComanda([newComandaCopa, ...comanda]);
    setPrecioComanda(precioComanda + newComandaCopa.precio);
    Toast.show({
      type: "success",
      text1: "Copa agregada",
      visibilityTime: 1000,
      topOffset: 0,
    });
    setDatosMesa({ ...datosMesa, copas: datosMesa.copas + 1 });
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
  const deleteIdComanda = (id, precio, tipo, multiplicador) => {
    if (tipo == "Botella") {
      setDatosMesa({ ...datosMesa, botellas: datosMesa.botellas - 1 });
    }
    if (tipo == "Copa") {
      setDatosMesa({ ...datosMesa, copas: datosMesa.copas - multiplicador });
    }
    const newArray = comanda.filter((comanda) => comanda.idComanda != id);
    setComanda(newArray);
    setPrecioComanda(precioComanda - precio);
    Toast.show({
      type: "error",
      text1: `Producto eliminado`,
      visibilityTime: 1800,
    });
  };

  const multiAdd = (id, precio) => {
    const newArray = comanda.map((element) => {
      if (element.idComanda == id) {
        element.multiplicador += 1;
        element.precio = element.precioReal * element.multiplicador;
        return element;
      }
      return element;
    });
    setComanda(newArray);
    setPrecioComanda(precioComanda + precio);
    setDatosMesa({ ...datosMesa, copas: datosMesa.copas + 1 });
  };

  const multiRestar = (id, precio) => {
    const newArray = comanda.map((element) => {
      if (element.idComanda == id) {
        element.multiplicador -= 1;
        element.precio = element.precioReal * element.multiplicador;
        return element;
      }
      return element;
    });
    setComanda(newArray);
    setPrecioComanda(precioComanda - precio);
    setDatosMesa({ ...datosMesa, copas: datosMesa.copas - 1 });
  };

  const renderItem = (comanda) => {
    return (
      <View
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
          <View style={{ justifyContent: "space-between", width: "85%" }}>
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
                <Text style={{ fontSize: 18 }}>{comanda.producto}</Text>
              </View>
            </View>
            {comanda.referencia == "Copa" && (
              <View style={{ flexDirection: "row" }}>
                {comanda.multiplicador > 1 ? (
                  <TouchableOpacity
                    onPress={() => {
                      multiRestar(comanda.idComanda, comanda.precioReal);
                    }}
                  >
                    <Ionicons name="remove-circle" size={32} color="red" />
                  </TouchableOpacity>
                ) : (
                  <Ionicons name="remove-circle" size={32} color="red" />
                )}
                <View
                  style={{
                    backgroundColor: "white",
                    paddingHorizontal: 10,
                    borderRadius: 5,
                    borderWidth: 0.5,
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 22 }}>x{comanda.multiplicador}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    multiAdd(comanda.idComanda, comanda.precioReal);
                  }}
                >
                  <Ionicons name="add-circle" size={32} color="blue" />
                </TouchableOpacity>
              </View>
            )}
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
                alignItems: "center",
                width: "95%",
                justifyContent: "flex-end",
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  deleteIdComanda(
                    comanda.idComanda,
                    comanda.precio,
                    comanda.referencia,
                    comanda.multiplicador
                  )
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
                  <MaterialIcons name="delete" size={24} color="#DC0000" />
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
    );
  };
  return (
    <BottomSheetModalProvider>
      <View
        style={[
          styles.container,
          {
            backgroundColor: "#666666",
          },
        ]}
      >
        <View
          style={{
            width: "95%",
            height: "80%",
            backgroundColor: "white",
            borderRadius: 15,
            padding: 10,
          }}
        >
          <View>
            <View>
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
                <View style={{ width: "100%", height: "90%" }}>
                  <Text
                    style={{ textAlign: "center", fontSize: 18, color: "gray" }}
                  >
                    La comanda esta vacia,
                  </Text>
                  <Text
                    style={{ textAlign: "center", fontSize: 18, color: "gray" }}
                  >
                    agrega productos desde abajo
                  </Text>
                </View>
              ) : (
                <View style={{ width: "100%", height: "90%" }}>
                  <FlashList
                    data={comanda}
                    keyExtractor={(item) => item.idComanda}
                    renderItem={({ item }) => renderItem(item)}
                    estimatedItemSize={200}
                  />
                  <View>
                    <View
                      style={{
                        borderWidth: 0.5,
                        borderRadius: 15,
                        paddingHorizontal: 5,
                        paddingVertical: 5,
                        marginBottom: 5
                      }}
                    >
                      <Text style={{fontSize: 18, fontWeight: '800'}}>Botellas: {datosMesa.botellas}</Text>
                      <Text style={{fontSize: 18, fontWeight: '800'}}>Copas: {datosMesa.copas}</Text>
                      <Text
                        style={{
                          textAlign: "right",
                          fontSize: 22,
                          marginVertical: 0,
                          fontWeight: "bold",
                        }}
                      >
                        Total: {precioComanda}€
                      </Text>
                    </View>
                    <View>
                      <Button
                        title="Ordenar comanda"
                        onPress={() => agregarComandaBackend(comanda)}
                        style={{
                          backgroundColor:
                            comanda.length > 0 ? "green" : "gray",
                        }}
                      />
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>
          <View style={{ alignItems: "center" }}>
            <View
              style={{
                width: "95%",
                backgroundColor: "white",
                borderRadius: 15,
                padding: 10,
                flexDirection: "row",
                flexWrap: "wrap",
                borderWidth: 0.88,
              }}
            >
              <View style={{ alignItems: "center" }}>
                <TouchableOpacity onPress={() => handleModalBotella()}>
                  <Image
                    source={BotellaImg}
                    style={{ width: 50, height: 50 }}
                  />
                  <Text style={{ textAlign: "center" }}>Botella</Text>
                </TouchableOpacity>
              </View>
              <View style={{ width: 80, alignItems: "center" }}>
                <TouchableOpacity onPress={() => changePickCopa()}>
                  <Image source={CopaImg} style={{ width: 50, height: 50 }} />
                  <Text style={{ textAlign: "center" }}>Copa</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View style={{ position: "absolute", bottom: 0, flexDirection: "row" }}>
          <BotonHome />
          <BotonMesa />
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
                              {botella.nombre}
                            </Text>
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
                              style={{ width: 50, height: 50 }}
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
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    width: "100%",
                  }}
                >
                  {botella === null
                    ? listBotellas.map((botella, index) => (
                        <View
                          key={index}
                          style={{
                            marginLeft: 10,
                            alignItems: "center",
                            width: 65,
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
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "gray",
    alignItems: "center",
    height: "100%",
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
