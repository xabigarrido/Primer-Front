import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Button } from "@react-native-material/core";
import { getComanda, getMesa, URL } from "../api";
import { MaterialIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";

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
  }, [isFocus]);

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
  };

  const handlePagado = (id) => {
    console.log(id);
    const newComandas = comandas.map((comandaIndi) => {
      comandaIndi.contenido.map((element) => {
        if (element.idComanda == id) {
          element.pagadaIndiComanda = !element.pagadaIndiComanda;
          console.log(element);
          return element;
        }
      });
      return comandaIndi;
    });

    console.log(newComandas);
    setComandas(newComandas);
    // const newArray = comandas.map((comanda) => {
    //   if (comanda._id == id) {
    //     comanda.pagada = !comanda.pagada;
    //     return comanda;
    //   }
    //   return comanda;
    // });
    // console.log(newArray)
    // setComandas(newArray);
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
          <View key={multiComanda.idComanda} style={styles.containerComanda}>
            <View
              style={{
                width: "20%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={{
                  uri: `${URL}${comanda.contenido[0].imagenPrincipal}`,
                }}
                style={{ height: 100, width: 65 }}
              />
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
                <TouchableOpacity
                  onPress={() => deleteComanda(multiComanda.idComanda)}
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
                  backgroundColor: "white",
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
                <TouchableOpacity
                  onPress={() => handlePagado(multiComanda.idComanda)}
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
                      {multiComanda.pagadaIndiComanda ? "Pagada" : "Cobrar"}
                    </Text>
                  </View>
                </TouchableOpacity>
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
    <View>
      <View style={styles.containerPrincipal}>
        <View style={styles.containerComandas}>
          <View style={{ ...styles.bodyContainerBotones, marginBottom: 5 }}>
            <Button
              title="Crear comanda en la mesa"
              onPress={() => {
                navigation.navigate("ComandaScreen", {
                  idMesa: route.params.id,
                });
              }}
            />
          </View>
          <Text style={styles.title}>MESA {mesa.numeroMesa}</Text>
          <View style={styles.ContainerTiket}>
            <View style={{ height: "100%", width: "100%" }}>
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
          <View style={styles.bodyContainerBotones}>
            <Text style={{ ...styles.title, textAlign: "left", padding: 5 }}>
              Total actual: {precioActual} €
            </Text>
            {precioActual == 0 ? (
              <Button
                title="Terminada Cerrar"
                style={{ backgroundColor: "blue" }}
              />
            ) : (
              <Button
                title="Cobrar todo"
                style={{ backgroundColor: "green" }}
              />
            )}
          </View>
        </View>
      </View>
    </View>
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
    height: "100%",
    justifyContent: "space-between",
  },
  containerComandas: {
    width: "100%",
    height: "80%",
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
