import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";

import fondo from "../assets/fondoScreen.jpg";
import BotonHome from "../components/BotonHome";
import Toast from "react-native-toast-message";
import moment from "moment";
import { Root, Popup } from "react-native-popup-confirm-toast";

import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { Button } from "@react-native-material/core";
import { getTikadas, getEmpleado, deleteTikada, URL } from "../api";
import { FlashList } from "@shopify/flash-list";
import { Picker } from "@react-native-picker/picker";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";

const TikadasEmpleados = ({ route }) => {
  const bottomSheetModalRef = useRef(null);
  const snapPoints = ["25%", "55%"];
  const [tikadas, setTikadas] = useState([]);
  const [sueldo, setSueldo] = useState(0);
  const [sueldoTotal, setSueldoTotal] = useState(0);
  const [empleado, setEmpleado] = useState({});
  const [pickMes, setPickMes] = useState(moment().format("MMMM"));
  const [pickYear, setPickYear] = useState(moment().format("YYYY"));
  const [search, setSearch] = useState(false);
  const [pickCategory, setPickCategory] = useState("Empleado");
  const textInputRef = useRef();
  function handlePresentModal() {
    bottomSheetModalRef.current?.present();
  }
  const loadTikadas = async () => {
    const dataUser = await getEmpleado(route.params.idEmpleado);
    setEmpleado(dataUser);

    const data = await getTikadas(route.params.idEmpleado, pickMes, pickYear);
    // const data = await getTikadas(route.params.idEmpleado, "octubre", "2022");
    setTikadas(data);
    let dineroPagar = 0;
    const algo = data.map((element, index) => {
      // console.log(DineroGanado(element.totalTrabajado, sueldo));

      dineroPagar += Number(DineroGanado(element.totalTrabajado, sueldo));
    });
    setSueldoTotal(financial(dineroPagar));
  };
  useEffect(() => {
    if (route && route.params) {
      loadTikadas();
    }
  }, [sueldo]);
  const handleSearch = () => {
    loadTikadas();
    setSearch(true);
  };
  function financial(x) {
    return Number.parseFloat(x).toFixed(2);
  }
  const DineroGanado = (tiempo, sueldo) => {
    const separar = tiempo.split(":");
    const horasTrabajadas = separar[0];
    const minutosTrabajados = separar[1];
    const minutosTrabajadosEntero = minutosTrabajados / 60;
    const dineroHoras = horasTrabajadas * sueldo;
    const dineroMinutos = minutosTrabajadosEntero * sueldo;
    const dineroTotalGanado = dineroHoras + dineroMinutos;
    return financial(dineroTotalGanado);
  };

  const handleDelete = async (id, sueldo) => {
    // console.log(id);

    try {
      Popup.show({
        type: "confirm",
        title: "¿Seguro quieres eliminar la tikada?",
        // textBody: '¿Desea cerrar la caja?',
        buttonText: "Si",
        confirmText: "No",
        callback: async () => {
          Toast.show({
            type: "success",
            text1: "Tikada eliminada",
            position: "top",
            visibilityTime: 1800,
          });
          await deleteTikada(id);
          setTikadas(tikadas.filter((element) => element._id != id));
          textInputRef.current.clear();
          setSueldo(0);
          setSueldoTotal(0);
          Popup.hide();
        },
        cancelCallback: () => {
          Popup.hide();
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  const renderItemList2 = (tikada, sueldoActual, index) => {
    return (
      <View
        style={{
          borderWidth: 0.17,
          borderRadius: 5,
          paddingHorizontal: 5,
          paddingVertical: 2,
          backgroundColor: "white",
          width: "100%",
          marginBottom: 10,
          // minHeight: 100,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons
                name="account-arrow-right"
                size={36}
                color="green"
              />
              <Text
                style={{ color: "green", fontWeight: "bold", fontSize: 22 }}
              >
                {tikada.entradaHumana.slice(0, -3)}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons
                name="account-arrow-left"
                size={36}
                color="red"
              />
              <Text style={{ color: "red", fontWeight: "bold", fontSize: 22 }}>
                {tikada.salidaHumana.slice(0, -3)}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons
                name="account-clock"
                size={36}
                color="black"
              />
              <Text style={{ color: "black", fontWeight: "600", fontSize: 22 }}>
                {tikada.horas} horas {tikada.minutos} minutos{" "}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View>
              <Text style={{ fontSize: 24, fontWeight: "bold" }}>Tikada </Text>
              <Text
                style={{ fontSize: 28, fontWeight: "bold", color: "#FF7000", textAlign: 'right'}}
              >
                #{index + 1}{" "}
              </Text>
              <View style={{alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() =>
                  handleDelete(
                    tikada._id,
                    DineroGanado(tikada.totalTrabajado, sueldoActual)
                  )
                }
              >
                <MaterialCommunityIcons
                  name="delete-circle"
                  size={30}
                  color="red"
                />
              </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View style={{ justifyContent: "center", flexDirection: "row" }}>
          <Text style={{ color: "blue", fontWeight: "bold", fontSize: 36 }}>
            {DineroGanado(tikada.totalTrabajado, sueldoActual)}€
          </Text>
        </View>
      </View>
    );
  };
  const renderItemList = (tikada, sueldoActual, index) => {
    return (
      <View
        style={{
          width: "100%",
          // height: 200,
          backgroundColor: "white",
          marginBottom: 10,
          borderWidth: 0.5,
          borderRadius: 5,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          elevation: 5,
        }}
      >
        <View>
          <View
            style={{
              flexDirection: "row",
              padding: 5,
              backgroundColor: "#56B93A",
              width: "60%",
              borderTopEndRadius: 10,
              borderBottomEndRadius: 10,
              marginVertical: 2,
            }}
          >
            <Text
              style={{ fontSize: 22, fontWeight: "bold", color: "#3D3D3D" }}
            >
              {tikada.entradaHumana.slice(0, -3)}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <View
              style={{
                flexDirection: "row",
                padding: 5,
                backgroundColor: "#FC5E5E",
                width: "60%",
                justifyContent: "flex-end",
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: "#3D3D3D",
                }}
              >
                {tikada.salidaHumana.slice(0, -3)}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#323432",
                width: 150,
                alignItems: "center",
                borderRadius: 15,
                paddingVertical: 5,
                marginTop: 1,
              }}
            >
              <Text
                style={{
                  textTransform: "uppercase",
                  fontSize: 24,
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {tikada.horas}:{tikada.minutos}{" "}
              </Text>
              <Text
                style={{
                  textTransform: "uppercase",
                  fontSize: 10,
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                (Tiempo trabajado)
              </Text>
            </View>
          </View>
          <Text
            style={{
              textAlign: "center",
              fontSize: 55,
              fontWeight: "bold",
              // marginTop: 5,
              color: "#003EFF",
            }}
          >
            {DineroGanado(tikada.totalTrabajado, sueldoActual)}€
          </Text>
          <View style={{ alignItems: "center" }}>
            <Button
              title="ELIminar"
              style={{
                backgroundColor: "#FD4A4A",
                width: "50%",
                marginBottom: 5,
              }}
              onPress={() => handleDelete(tikada._id)}
            />
          </View>
        </View>
      </View>
    );
  };
  // const renderItemList = (tikada, sueldoActual, index) => {
  //   return (
  //     <View
  //       key={index}
  //       style={{
  //         borderWidth: 0.3,
  //         borderRadius: 15,
  //         padding: 5,
  //         width: "100%",
  //         alignItems: "center",
  //         marginBottom: 5,
  //         backgroundColor: "white",
  //         shadowColor: "#000",
  //         shadowOffset: {
  //           width: 0,
  //           height: 2,
  //         },
  //         shadowOpacity: 0.25,
  //         shadowRadius: 3.84,

  //         elevation: 5,
  //       }}
  //     >
  //       <View
  //         style={{
  //           flexDirection: "row",
  //           backgroundColor: "#77BD84",
  //           width: "100%",
  //           paddingVertical: 5,
  //           paddingHorizontal: 10,
  //           borderRadius: 10,
  //           borderWidth: 0.5,
  //         }}
  //       >
  //         <Text style={{ fontWeight: "bold" }}>Entrada: </Text>
  //         <Text>{tikada.entradaHumana}</Text>
  //       </View>
  //       <View
  //         style={{
  //           flexDirection: "row",
  //           backgroundColor: "#E7A3A0",
  //           width: "100%",
  //           paddingVertical: 5,
  //           paddingHorizontal: 10,
  //           borderRadius: 10,
  //           borderWidth: 0.5,
  //           marginTop: 2,
  //         }}
  //       >
  //         <Text style={{ fontWeight: "bold" }}>Salida: </Text>
  //         <Text>{tikada.salidaHumana}</Text>
  //       </View>
  //       <View
  //         style={{
  //           borderWidth: 0.3,
  //           borderRadius: 15,
  //           paddingVertical: 10,
  //           paddingHorizontal: 16,
  //           backgroundColor: "#D8D8D850",
  //           marginTop: 5,
  //           width: "70%",
  //         }}
  //       >
  //         <View
  //           style={{
  //             borderWidth: 0.5,
  //             backgroundColor: "#A0C9E7",
  //             borderRadius: 5,
  //             padding: 5,
  //             marginBottom: 2,
  //           }}
  //         >
  //           <Text style={{ fontWeight: "bold", textAlign: "center" }}>
  //             Tiempo trabajado
  //           </Text>
  //         </View>
  //         <View
  //           style={{
  //             flexDirection: "row",
  //             justifyContent: "center",
  //           }}
  //         >
  //           <View
  //             style={{
  //               borderWidth: 0.5,
  //               backgroundColor: "white",
  //               borderRadius: 5,
  //               padding: 2,
  //               width: 50,
  //               alignItems: "center",
  //               marginRight: 5,
  //             }}
  //           >
  //             <Text style={{}}> {tikada.horas}</Text>
  //             <Text style={{ fontWeight: "bold" }}>Horas</Text>
  //           </View>
  //           <View
  //             style={{
  //               borderWidth: 0.5,
  //               backgroundColor: "white",
  //               borderRadius: 5,
  //               padding: 2,
  //               width: 70,
  //               alignItems: "center",
  //             }}
  //           >
  //             <Text style={{}}> {tikada.minutos}</Text>
  //             <Text style={{ fontWeight: "bold" }}>Minutos</Text>
  //           </View>
  //         </View>

  //         <View
  //           style={{
  //             borderWidth: 0.5,
  //             marginTop: 5,
  //             borderRadius: 5,
  //             backgroundColor: "#DE5B5B",
  //           }}
  //         >
  //           <Text
  //             style={{
  //               fontWeight: "bold",
  //               textAlign: "center",
  //               color: "white",
  //               fontSize: 18,
  //               fontWeight: "bold",
  //             }}
  //           >
  //             {DineroGanado(tikada.totalTrabajado, sueldoActual)}€
  //           </Text>
  //         </View>
  //       </View>
  //     </View>
  //   );
  // };
  return (
    <Root>
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
                  height: "100%",
                  backgroundColor: "#F6F6F6",
                  alignItems: "center",
                  paddingVertical: 15,
                  borderRadius: 15,
                }}
              >
                <View
                  style={{ width: "95%", height: "95%", alignItems: "center" }}
                >
                  {search == false && (
                    <>
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
                        <Text
                          style={{
                            textTransform: "uppercase",
                            fontSize: 22,
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          MES
                        </Text>
                      </View>
                      <Picker
                        style={{
                          width: "100%",
                          borderRadius: 20,
                          borderWidth: 0.3,
                          backgroundColor: "#EBEBEB",
                          marginBottom: 20,
                        }}
                        selectedValue={pickMes}
                        onValueChange={(itemValue, itemIndex) =>
                          setPickMes(itemValue)
                        }
                      >
                        {/* <Picker.Item
                          label={moment().format("MMMM").charAt(0).toUpperCase() + moment().format("MMMM").slice(1)}
                          value={moment().format("MMMM")}
                        /> */}
                        <Picker.Item label="Enero" value="enero" />
                        <Picker.Item label="Febrero" value="febrero" />
                        <Picker.Item label="Marzo" value="marzo" />
                        <Picker.Item label="Abril" value="abril" />
                        <Picker.Item label="Mayo" value="mayo" />
                        <Picker.Item label="Junio" value="junio" />
                        <Picker.Item label="Julio" value="julio" />
                        <Picker.Item label="Agosto" value="agosto" />
                        <Picker.Item label="Septiembre" value="septiembre" />
                        <Picker.Item label="Octubre" value="octubre" />
                        <Picker.Item label="Noviembre" value="noviembre" />
                        <Picker.Item label="Diciembre" value="diciembre" />
                      </Picker>
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
                        <Text
                          style={{
                            textTransform: "uppercase",
                            fontSize: 22,
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          año
                        </Text>
                      </View>
                      <Picker
                        style={{
                          width: "100%",
                          borderRadius: 20,
                          borderWidth: 0.3,
                          backgroundColor: "#EBEBEB",
                          marginBottom: 20,
                        }}
                        selectedValue={pickYear}
                        onValueChange={(itemValue, itemIndex) =>
                          setPickYear(itemValue)
                        }
                      >
                        {/* <Picker.Item label={moment().format("YYYY")} value={moment().format("YYYY")} /> */}

                        <Picker.Item label="2021" value="2021" />
                        <Picker.Item label="2022" value="2022" />
                        <Picker.Item label="2023" value="2023" />
                        <Picker.Item label="2024" value="2024" />
                      </Picker>
                      <Button
                        title="Ver tikadas"
                        style={{
                          backgroundColor: "#323432",
                          width: "80%",
                          borderRadius: 5,
                        }}
                        onPress={() => {
                          handleSearch();
                        }}
                      />
                    </>
                  )}
                  {search == true && (
                    <Button
                      title="Buscar otro mes"
                      style={{
                        backgroundColor: "#0078FF",
                        width: "100%",
                        marginBottom: 10,
                      }}
                      onPress={() => {
                        setSueldo(0);
                        setSearch(false);
                        setPickMes(moment().format("MMMM"));
                        setPickYear(moment().format("YYYY"));
                      }}
                    />
                  )}
                  {search == true && (
                    <>
                      <View
                        style={{
                          width: "100%",
                          paddingVertical: 10,
                          borderRadius: 15,
                          borderWidth: 0.5,
                          marginBottom: 3,
                          backgroundColor: "#272727",
                          paddingHorizontal: 5,
                        }}
                      >
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <View
                            style={{
                              backgroundColor: "white",
                              paddingVertical: 5,
                              borderRadius: 5,
                              paddingHorizontal: 3,
                              marginRight: 4,
                            }}
                          >
                            <Text
                              style={{
                                fontWeight: "bold",
                                fontSize: 18,
                                color: "black",
                              }}
                            >
                              Sueldo por hora:
                            </Text>
                          </View>
                          <TextInput
                            ref={textInputRef}
                            placeholder="0"
                            style={{
                              backgroundColor: "white",
                              borderWidth: 0.3,
                              width: "20%",
                              borderRadius: 5,
                              paddingHorizontal: 5,
                              paddingVertical: 3,
                              textAlign: "center",
                              fontSize: 22,
                            }}
                            onChangeText={(text) => {
                              setSueldoTotal(0);
                              setSueldo(text);
                            }}
                          />
                        </View>
                        <View
                          style={{
                            backgroundColor: "white",
                            paddingVertical: 5,
                            borderRadius: 5,
                            paddingHorizontal: 3,
                            marginRight: 4,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: 5,
                          }}
                        >
                          <Text
                            style={{
                              fontWeight: "bold",
                              fontSize: 18,
                              color: "black",
                            }}
                          >
                            Total {pickMes} {pickYear}:
                          </Text>
                          <Text
                            style={{
                              fontWeight: "bold",
                              fontSize: 18,
                              color: "red",
                            }}
                          >
                            {sueldoTotal}€
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          width: "100%",
                          height: "90%",
                          paddingBottom: 50,
                        }}
                      >
                        <View
                          style={{
                            width: "100%",
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: "#E0E0E0",
                            borderRadius: 15,
                            borderWidth: 0.17,
                            paddingHorizontal: 10,
                            paddingVertical: 2,
                            shadowColor: "#000",
                            shadowOffset: {
                              width: 0,
                              height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,

                            elevation: 5,
                            marginBottom: 5,
                          }}
                        >
                          <View style={{ width: "80%" }}>
                            <Text style={{ fontSize: 28 }}>
                              {empleado.nombre} {empleado.apellidos}
                            </Text>
                            <Text style={{ fontSize: 20 }}>{empleado.dni}</Text>
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "flex-end",
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: Platform.OS == "android" ? 16 : 20,
                                  color: "red",
                                  fontWeight: "bold",
                                }}
                              >
                                {tikadas.length} tikadas en{" "}
                              </Text>
                              <Text style={{fontSize: Platform.OS == "android" ? 16 : 20, fontWeight: "700" }}>
                                {pickMes.toLocaleUpperCase()} {pickYear}
                              </Text>
                            </View>
                          </View>
                          <View style={{ width: "20%" }}>
                            <Image
                              source={{ uri: `${URL}${empleado.foto}` }}
                              style={{
                                height: 70,
                                width: 70,
                                borderRadius: 50,
                                borderWidth: 0.3,
                              }}
                            />
                          </View>
                        </View>
                        <FlashList
                          extraData={sueldo}
                          data={tikadas}
                          keyExtractor={(item) => item._id}
                          renderItem={({ item, index }) =>
                            renderItemList2(item, sueldo, index)
                          }
                          estimatedItemSize={200}
                          ListEmptyComponent={() => (
                            <View style={{ alignItems: "center" }}>
                              <Text style={{ fontSize: 18 }}>
                                No hay tikadas este mes de {pickMes} {pickYear}
                              </Text>
                            </View>
                          )}
                        />
                      </View>
                    </>
                  )}
                </View>
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
    </Root>
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
export default TikadasEmpleados;
