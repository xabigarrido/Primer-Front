import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Button } from "@react-native-material/core";
import {
  getComanda,
  getMesa,
  handlePagadoFetch,
  URL,
  handlecobrarTodoFetch,
  addComandaCaja,
  addComandaCajaIndi,
  deleteComandaCajaNumero,
  handleChangePagar,
} from "../api";
import { MaterialIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import BotonEspecial from "../components/BotonEspecial";
import { AntDesign } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { socket } from "../socket";

const EstadoMesa = ({ route, navigation }) => {
  const isFocus = useIsFocused();
  const [mesa, setMesa] = useState({});
  const [comandas, setComandas] = useState([]);
  const [precioActual, setPrecioActual] = useState(0);

  const loadMesa = async () => {
    const data = await getMesa(route.params.id);
    setMesa(data[0]);
    const arrayComandas = await getComanda(route.params.id);
    setComandas(arrayComandas);
  };

  useEffect(() => {
    loadMesa();
  }, [isFocus, cobrarTodo]);
  useEffect(() => {
    socket.on("servidor:actualizarComandas", () => {
      loadMesa();
    });

    return () => {
      socket.off("servidor:actualizarComandas");
    };
  }, []);

  useEffect(() => {
    let prueba = 0;
    comandas.map((comanda) =>
      comanda.contenido.map((e) => {
        if (e.pagadaIndiComanda == false) {
          prueba += e.precio;
        }
      })
    );
    setPrecioActual(prueba);
  }, [comandas]);

  const deleteComanda = (id) => {
    const newComandas = comandas.map((comandaIndi) => {
      const newContenido = comandaIndi.contenido.filter(
        (element) => element.idComanda != id
      );
      comandaIndi.contenido = newContenido;
      return comandaIndi;
    });
    setComandas(newComandas);
    deleteComandaCajaNumero(mesa._id, 1);
    Toast.show({
      type: "error",
      text1: `Producto eliminado`,
      position: "bottom",
      bottomOffset: 0,
      visibilityTime: 1000,
    });
  };
  const cobrarTodo = (id) => {
    // console.log(comandas[0].contenido);
    socket.emit("cliente:actualizarComandas");

    if (comandas.length == 0) {
      console.log("epaa");
      handleChangePagar(route.params.id)

    } else {
      let precioRestante = 0;
      const newArrayComandas = comandas.map((element) =>
        element.contenido.map((element) => {
          if (element.pagadaIndiComanda == false) {
            precioRestante += element.precio;
            return element;
          }
          return element;
        })
      );
      const newArrayComandasPagadas = comandas[0].contenido.filter(
        (element) => element.pagadaIndiComanda == false
      );
      // for(let i=0; i < newArrayComandas.length; i++){
      //   newArrayComandas[i].map(element => {
      //     element.pagadaIndiComanda = true;
      //     return element
      //   })
      // }
      handleChangePagar(route.params.id)
      // console.log(newArrayComandas)
      socket.emit("cliente:actualizarComandas");
      addComandaCaja(newArrayComandas, precioActual);
      handlecobrarTodoFetch(id);
      let comandasLength = [];
      const foundBorrarPagadas = comandas.map((element) => {
         element.contenido.filter((elementComanda) =>
          elementComanda.pagadaIndiComanda === false
            ? comandasLength.push(element)
            : null
        );
      });
      deleteComandaCajaNumero(mesa._id, comandasLength.length);
      loadMesa();
    }
  };
  const handlePagado = (id, idPrecisa, comanda, precio) => {
    addComandaCajaIndi(comanda, precio);
    handlePagadoFetch(route.params.id, id, idPrecisa);
    deleteComandaCajaNumero(mesa._id, 1);

    const newComandas = comandas.map((comandaIndi) => {
      comandaIndi.contenido.map((element) => {
        if (element.idComanda == id) {
          element.pagadaIndiComanda = !element.pagadaIndiComanda;
          return element;
        }
      });
      return comandaIndi;
    });

    setComandas(newComandas);
    Toast.show({
      type: "success",
      text1: "Cobrado",
      position: "bottom",
      bottomOffset: 0,
      visibilityTime: 1000,
    });
    socket.emit("cliente:actualizarComandas");
  };
  const ComandaVacia = () => {
    return (
      <View style={{ width: "100%", alignItems: "center", marginTop: 20 }}>
        <Text style={{ fontSize: 28 }}>Comanda vacia</Text>
      </View>
    );
  };

  const renderItems = (comanda) => {
    return (
      <View key={comanda._id}>
        {comanda.contenido.map((multiComanda) => (
          <View
            key={multiComanda.idComanda}
            style={{
              ...styles.containerComanda,
              backgroundColor: multiComanda.pagadaIndiComanda
                ? "#D3FEAB50"
                : "white",
            }}
          >
            <View
              style={{
                width: "20%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={{
                  uri: `${URL}${multiComanda.imagenPrincipal}`,
                }}
                style={{ height: 100, width: 65 }}
              />
              {multiComanda.referencia == "Copa" && (
                <View
                  style={{
                    backgroundColor: "red",
                    paddingHorizontal: 15,
                    paddingVertical: 5,
                    borderRadius: 15,
                    marginTop: 2,
                  }}
                >
                  <Text
                    style={{ color: "white", fontWeight: "bold", fontSize: 18 }}
                  >
                    x{multiComanda.multiplicador}
                  </Text>
                </View>
              )}
            </View>
            <View>
              <View style={styles.comandaTitle}>
                <View
                  style={{
                    ...styles.burbuja,
                    backgroundColor:
                      multiComanda.referencia == "Copa" ? "green" : "red",
                  }}
                >
                  <Text style={styles.textBurbuja}>
                    {multiComanda.referencia}
                  </Text>
                </View>
                <View
                  style={{
                    ...styles.burbuja,
                    backgroundColor: "white",
                    borderWidth: 0.5,
                  }}
                >
                  <Text style={{ ...styles.textBurbuja, color: "black" }}>
                    {multiComanda.producto}
                  </Text>
                </View>
                {multiComanda.pagadaIndiComanda != true && (
                  <TouchableOpacity
                  // onPress={() => deleteComanda(multiComanda.idComanda)}
                  >
                    <View
                      style={{
                        ...styles.burbuja,
                        backgroundColor: "white",
                        borderWidth: 0.5,
                      }}
                    >
                      <Text style={{ ...styles.textBurbuja, color: "black" }}>
                        <MaterialIcons name="delete" size={28} color="red" />
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  width: "80%",
                  borderWidth: 0.1,
                  marginVertical: 3,
                  padding: 2,
                  borderRadius: 5,
                  alignItems: "center",
                }}
              >
                {multiComanda.listRefrescos.map((refresco, index) => (
                  <Image
                    source={{
                      uri: `${URL}${refresco}`,
                    }}
                    style={{ width: 30, height: 30 }}
                    key={index}
                  />
                ))}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  width: "90%",
                }}
              >
                {multiComanda.pagadaIndiComanda == false && (
                  <TouchableOpacity
                    onPress={() =>
                      handlePagado(
                        multiComanda.idComanda,
                        comanda._id,
                        multiComanda,
                        multiComanda.precio
                      )
                    }
                  >
                    <View
                      style={{
                        ...styles.burbuja,
                        width: 100,
                        backgroundColor: multiComanda.pagadaIndiComanda
                          ? "#A0CD95"
                          : "white",
                      }}
                    >
                      <Text
                        style={{
                          ...styles.textBurbuja,
                          fontWeight: "bold",
                          color: "black",
                        }}
                      >
                        Cobrar
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                {multiComanda.pagadaIndiComanda == true && (
                  <View
                    style={{
                      ...styles.burbuja,
                      width: 100,
                      backgroundColor: "#A0CD95",
                    }}
                  >
                    <Text
                      style={{
                        ...styles.textBurbuja,
                        fontWeight: "bold",
                        color: "black",
                      }}
                    >
                      Pagada
                    </Text>
                  </View>
                )}
                <View
                  style={{
                    ...styles.burbuja,
                    width: 100,
                    backgroundColor: "#585858",
                  }}
                >
                  <Text style={{ ...styles.textBurbuja, fontWeight: "bold" }}>
                    {multiComanda.precio} €
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };
  return (
    <BotonEspecial>
      <View style={styles.containerPrincipal}>
        <View style={styles.containerComandas}>
          {/* <View style={{ ...styles.bodyContainerBotones, marginBottom: 5 }}>
            <Button
              title="Crear comanda en la mesa"
              onPress={() => {
                navigation.navigate("ComandaScreen", {
                  idMesa: route.params.id,
                });
              }}
            />
          </View> */}
          <Text style={styles.title}>MESA {mesa.numeroMesa}</Text>
          <View style={styles.ContainerTiket}>
            <View style={{ height: "100%", width: "100%", paddingBottom: 15 }}>
              <FlashList
                data={comandas}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => renderItems(item)}
                estimatedItemSize={200}
                ListEmptyComponent={<ComandaVacia />}
              />
            </View>
          </View>
        </View>
        <View style={styles.containerBotones}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "green",
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 10,
              marginTop: 50,
              marginBottom: 10,
              flexDirection: "row",
              height: 50,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("ComandaScreen", {
                  idMesa: route.params.id,
                });
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AntDesign name="pluscircle" size={24} color="white" />
                <Text style={{ color: "white", fontWeight: "500" }}>
                  {"  "}AGREGAR COMANDA
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.bodyContainerBotones}>
            <Text style={{ ...styles.title, textAlign: "left", padding: 5 }}>
              Total actual: {precioActual} €
            </Text>
            {precioActual == 0 && (
              <Button
                title="Terminada Cerrar"
                onPress={() => cobrarTodo(route.params.id)}
                style={{ backgroundColor: "blue" }}
              />
            )}
            {precioActual != 0 && (
              <Button
                onPress={() => {
                  cobrarTodo(route.params.id);
                }}
                title="Cobrar todo"
                style={{ backgroundColor: "green" }}
              />
            )}
          </View>
        </View>
      </View>
    </BotonEspecial>
  );
};
const styles = StyleSheet.create({
  textBurbuja: { fontSize: 22, color: "white" },
  burbuja: {
    backgroundColor: "red",
    paddingVertical: 3,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginRight: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
  comandaTitle: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  containerComanda: {
    width: "100%",
    backgroundColor: "white",
    minHeight: 100,
    flexDirection: "row",
    padding: 5,
    borderWidth: 0.3,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    marginBottom: 10,
  },
  title: {
    fontSize: 25,
    backgroundColor: "#1A1A1A",
    width: "100%",
    textAlign: "center",
    color: "white",
    borderRadius: 5,
    fontWeight: "bold",
  },

  bodyContainerBotones: { width: "80%" },
  ContainerTiket: {
    width: "100%",
  },
  containerPrincipal: {
    width: "100%",
    // backgroundColor: 'red'
  },
  containerComandas: {
    width: "100%",
    height: "81%",
    backgroundColor: "#F7F7F7",
    borderRadius: 15,
    padding: 1,
    alignItems: "center",
  },
  containerBotones: {
    width: "100%",
    height: "12%",
    backgroundColor: "#F7F7F7",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default EstadoMesa;
