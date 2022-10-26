import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome5,
  Fontisto,
  Entypo,
} from "@expo/vector-icons";

import {
  ScrollView,
  FlatList,
  NativeViewGestureHandler,
} from "react-native-gesture-handler";
import React, { useRef, useState, useEffect } from "react";
import moment from "moment";
import fondoPiconera from "../assets/fondoScreen.jpg";
import fondoAntique from "../assets/fondoScreenAntique.png";
import fondoRosso from "../assets/fondoScreenRosso.png";
import BotonHome from "../components/BotonHome";
import Toast from "react-native-toast-message";
import CalendarPicker from "react-native-calendar-picker";
import { useSelector } from "react-redux";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { Button } from "@react-native-material/core";
import { TextInput } from "react-native-gesture-handler";
import {
  addReserva,
  getReservas,
  getAllReservas,
  reservaRecibida,
  deleteReserva,
} from "../api";
import { FlashList } from "@shopify/flash-list";
const CalendarioScreen = () => {
  const user = useSelector((state) => state.userStore);
  const bottomSheetModalRef = useRef(null);
  const snapPoints = ["55%", "100%"];
  const [pickDay, setPickDay] = useState();
  const [openAddReserva, setOpenAddReserva] = useState(false);
  const [diaAddReserva, setDiaAddReserva] = useState(null);
  const [horaLlegada, setHoraLlegada] = useState("00:00");
  const [numeroMesa, setNumeroMesa] = useState(0);
  const [numeroPersonas, setNumeroPersonas] = useState(0);
  const [numeroBotellas, setNumeroBotellas] = useState(0);
  const [comentario, setComentario] = useState("Sin Comentario");
  const [nombreReserva, setNombreReserva] = useState(0);
  const [fechasColor, setFechasColor] = useState([]);
  const [reservas, setReservas] = useState([]);
const [fondoMostrar, setFondoMostrar] = useState(null)


  const loadReservas = async (date) => {
    const data = await getReservas(date, user.empresa);
    setReservas(data);
    // loadColorReservas();

  };

  const loadColorReservas = async () => {
    // console.log("paso");
    const data = await getAllReservas(user.empresa);
    let arrayFechas = [];
    data.map((element) => arrayFechas.push(element.reservaDia));
    // console.log(arrayFechas.length);

    let arrayFechasFinal = [];
    const resultado3 = {};
    arrayFechas.forEach((el) => (resultado3[el] = resultado3[el] + 1 || 1));
    const newArray3 = Object.entries(resultado3);
    const result3 = newArray3.forEach((el) => {
      // console.log("El producto: " + el[0] + " se repite: " + el[1]);
      let color = "blue";
      if (el[1] <= 5) {
        color = "#80F758";
      }
      if (el[1] >= 6 && el[1] <= 9) {
        color = "#F7BD58";
      }
      if (el[1] >= 10) {
        color = "#F75858";
      }
      arrayFechasFinal.push({
        date: el[0],
        style: {
          backgroundColor: color,
        },
        // textStyle: { color: "red", fontSize: 20, fontWeight: "bold" }, // sets the font color
        // containerStyle: [], // extra styling for day container
        // allowDisabled: true,
      });
      // arrayFechasFinal.push(el[0] + "/" + el[1]);
    });
    // console.log(arrayFechasFinal);
    setFechasColor(arrayFechasFinal);
  };
  useEffect(() => {
    if (addReserva != null) {
      loadReservas(diaAddReserva);
      loadColorReservas();
    }
    // return () => {};
  }, [pickDay]);

  useEffect(() => {
    loadColorReservas();

    // return () => {};
  }, []);
  useEffect(()=>{
    if(user.empresa == "6350346b5e2286c0a43467c4"){
      setFondoMostrar(fondoPiconera) 
    }
    if(user.empresa == "635034a45e2286c0a43467c6"){
      setFondoMostrar(fondoAntique) 

    }
    if(user.empresa == "635034ab5e2286c0a43467c8"){
      setFondoMostrar(fondoRosso) 

    }
  },[])


  // let today = moment();
  // let day = today.clone();
  let customDatesStyles = [
    {
      date: "2022-10-31T10:00:00.000Z",
      style: {
        backgroundColor:
          "#" +
          ("#00000" + ((Math.random() * (1 << 24)) | 0).toString(16)).slice(-6),
      },
      textStyle: { color: "red", fontSize: 20, fontWeight: "bold" }, // sets the font color
      containerStyle: [], // extra styling for day container
      allowDisabled: true,
    },
  ];
  // while (day.add(1, "day").isSame(today, "month")) {
  //   customDatesStyles.push({
  //     date: day.clone(),
  //     // Random colors
  //     style: {
  //       backgroundColor:
  //         "#" +
  //         ("#00000" + ((Math.random() * (1 << 24)) | 0).toString(16)).slice(-6),
  //     },
  //     textStyle: { color: "black" }, // sets the font color
  //     containerStyle: [], // extra styling for day container
  //     allowDisabled: true, // allow custom style to apply to disabled dates
  //   });
  // }
  function handlePresentModal() {
    limpiezaState();
    setOpenAddReserva(false);
    return bottomSheetModalRef.current?.snapToIndex(0);
  }
  const limpiezaState = () => {
    setHoraLlegada("00:00");
    setNombreReserva(0)
    setNumeroMesa(0);
    setNumeroPersonas(0);
    setNumeroBotellas(0);
    setComentario("Sin comentario");
  };
  useEffect(() => {
    bottomSheetModalRef.current?.present();
  }, [bottomSheetModalRef]);

  const handleAddReserva = () => {
    // if (nombreReserva == 0)
    //   return Alert.alert("Debe poner un nombre a la reserva");
    // if (numeroMesa == "") return Alert.alert("Debe poner un numero de mesa");
    // if (numeroPersonas == "")
    //   return Alert.alert("Debe poner un numero de mesa");
    // if (numeroBotellas == "")
    //   return Alert.alert("Debe poner un numero de botellas");
    const newReserva = {
      horaLlegada,
      mesa: numeroMesa,
      numeroPersonas,
      botellas: numeroBotellas,
      reservaCreadaPor: `${user.nombre} ${user.apellidos}`,
      reservaLlegada: false,
      comentario,
      diaDeLaReservaCreada: moment(),
      nombreDeLaReserva: nombreReserva,
      reservaDia: diaAddReserva,
      empresa: user.empresa,
    };
    addReserva(newReserva);
    loadReservas(diaAddReserva);
    loadColorReservas();
    setOpenAddReserva(!openAddReserva);
    limpiezaState();
    Toast.show({
      type: 'success',
      text1: 'Reserva agregada',
      visibilityTime: 1800,
    })

    // return bottomSheetModalRef.current?.dismiss();
  };
  const handleReservaRecibida = async (id) => {
    const newArray = reservas.map((element) => {
      if (element._id == id) {
        element.reservaLlegada = !element.reservaLlegada;
        return element;
      }
      return element;
    });

    setReservas(newArray);
    reservaRecibida(id);
  };

  const handleEliminarReserva = async (id) => {
    const newArray = reservas.filter((element) => element._id != id);

    setReservas(newArray);
    deleteReserva(id);
    Toast.show({
      type: 'error',
      text1: 'Reserva eliminada',
      visibilityTime: 1800,
    })
  };
  const renderItemList = (element) => {
    return (
      <View
        key={element._id}
        style={{
          width: "100%",
          minHeight: 150,
          borderWidth: 1,
          padding: 5,
          borderRadius: 10,
          marginBottom: 5,
          backgroundColor: element.reservaLlegada ? "#F2FFE9" : "white",
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
        <View style={{ flexDirection: "column" }}>
          <View style={{backgroundColor: '#ABB3AA50', borderRadius: 10, marginBottom: 5, borderWidth: 0.5}}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 32,
              textTransform: "uppercase",
              fontWeight: "600",
            }}
          >
            {element.nombreDeLaReserva}
          </Text>
          </View>
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                borderWidth: 0.5,
                backgroundColor: "white",
                width: "23%",
                borderRadius: 15,
                padding: 5,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 25, fontWeight: "bold", color: "red" }}>
                {element.mesa}
              </Text>
              <MaterialCommunityIcons
                name="table-furniture"
                size={32}
                color="black"
              />
            </View>
            <View
              style={{
                borderWidth: 0.5,
                backgroundColor: "white",
                width: "23%",
                borderRadius: 15,
                padding: 5,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 25, fontWeight: "bold", color: "red" }}>
                {element.numeroPersonas}
              </Text>
              <Fontisto name="persons" size={32} color="black" />
            </View>
            <View
              style={{
                borderWidth: 0.5,
                backgroundColor: "white",
                width: "23%",
                borderRadius: 15,
                padding: 5,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 25, fontWeight: "bold", color: "red" }}>
                {element.botellas}
              </Text>
              <FontAwesome5 name="wine-bottle" size={32} color="blue" />
            </View>
            <View
              style={{
                borderWidth: 0.5,
                backgroundColor: "white",
                width: "23%",
                borderRadius: 15,
                padding: 5,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold", color: "red" }}>
                {element.horaLlegada}
              </Text>
              <Entypo name="clock" size={32} color="black" />
            </View>
          </View>
          <View style={{ alignItems: "center" }}>
            <View
              style={{
                width: "80%",
                marginTop: 5,
                backgroundColor: "#5D40F1",
                alignItems: "center",
                borderRadius: 15,
                // marginVertical: 10,
                paddingVertical: 5,
                paddingHorizontal: 5,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  textTransform: "uppercase",
                  fontSize: 16,
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Reserva creada por
              </Text>
            </View>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              {element.reservaCreadaPor}
            </Text>
            <Text>{element.comentario}</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Button
                title={element.reservaLlegada ? "Recibida" : "Reserva recibida"}
                style={{
                  backgroundColor: element.reservaLlegada ? "green" : "orange",
                }}
                onPress={() => {
                  handleReservaRecibida(element._id);
                }}
              />
              {element.reservaLlegada == false && (
                <Button
                  leading={
                    <MaterialIcons name="delete" size={24} color="white" />
                  }
                  title="Eliminar"
                  style={{
                    backgroundColor: "red",
                  }}
                  onPress={() => {
                    handleEliminarReserva(element._id);
                  }}
                />
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };
  return (
    <BottomSheetModalProvider>
      <ImageBackground
        source={fondoMostrar}
        resizeMode="cover"
        style={{ flex: 1, justifyContent: "center" }}
      >
        <BotonHome>
          <View
            style={{
              flex: 1,
              // justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
            }}
          >
            <View
              style={{
                width: "100%",
                backgroundColor: "white",
                paddingVertical: 15,
                borderRadius: 15,
              }}
            >
              <CalendarPicker
                onDateChange={(date) => {
                  console.log(date)
                  handlePresentModal();
                  setPickDay(
                    `${moment(date).format("DD")} ${moment(date).format(
                      "MMMM"
                    )} ${moment(date).format("YYYY")}`
                  );
                  setDiaAddReserva(JSON.stringify(date).slice(1).slice(0, -1));
                }}
                startFromMonday={true}
                weekdays={["Lun", "Mar", "Mier", "Jue", "Vie", "Sab", "Dom"]}
                months={[
                  "Enero",
                  "Febrero",
                  "Marzo",
                  "Abril",
                  "Mayo",
                  "Junio",
                  "Julio",
                  "Agosto",
                  "Septiembre",
                  "Octubre",
                  "Noviembre",
                  "Diciembre",
                ]}
                previousTitle="Anterior"
                nextTitle="Siguiente"
                customDatesStyles={fechasColor}
                selectedDayStyle={{ backgroundColor: "none" }}
                todayBackgroundColor=""
              />
              <View style={{ alignItems: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}>
                  <View
                    style={{
                      backgroundColor: "#80F758",
                      width: 27,
                      height: 27,
                      borderRadius: 15,
                    }}
                  ></View>
                  <Text> Menos de 5 reservas</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}>
                  <View
                    style={{
                      backgroundColor: "#F7BD58",
                      width: 27,
                      height: 27,
                      borderRadius: 15,
                    }}
                  ></View>
                  <Text> Entre 6 y 9 reservas</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}>
                  <View
                    style={{
                      backgroundColor: "#F75858",
                      width: 27,
                      height: 27,
                      borderRadius: 15,
                    }}
                  ></View>
                  <Text> Mas de 10 reservas</Text>
                </View>
                
              </View>
              {/* <Button title="Press" onPress={handlePresentModal} /> */}
            </View>
          </View>
        </BotonHome>
      </ImageBackground>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={-1}
        enableDismissOnClose={false}
        snapPoints={snapPoints}
        dragFromTopOnly={true}
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
          <View style={style.containerModal}>
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
                {pickDay}
              </Text>
            </View>
            {openAddReserva == false && (
              <Button
                title="Añadir Reserva"
                style={{ backgroundColor: "blue" }}
                onPress={() => {
                  setOpenAddReserva(!openAddReserva);
                  return bottomSheetModalRef.current?.snapToIndex(1);
                }}
              />
            )}
            {openAddReserva == true && (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Button
                    title="Guardar Reserva"
                    style={{ backgroundColor: "green" }}
                    onPress={handleAddReserva}
                  />
                  <Button
                    leading={<Entypo name="cross" size={30} color="white" />}
                    style={{ backgroundColor: "red" }}
                    title="cerrar"
                    onPress={() => {
                      setOpenAddReserva(!openAddReserva);
                      limpiezaState();
                    }}
                  />
                </View>
                <View
                  style={{
                    borderWidth: 1,
                    width: "100%",
                    borderRadius: 15,
                    padding: 10,
                    marginTop: 10,
                    backgroundColor: "white",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 5,
                    }}
                  >
                    <TextInput
                      onChangeText={(text) => setNombreReserva(text)}
                      placeholder="Nombre de la reserva"
                      style={{
                        borderWidth: 0.5,
                        width: "100%",
                        padding: 10,
                        borderRadius: 10,
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: 22,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                      Hora llegada (Opcional)
                    </Text>
                    <TextInput
                      onChangeText={(text) => setHoraLlegada(text)}
                      placeholder="00:00"
                      style={{
                        borderWidth: 0.5,
                        width: 100,
                        padding: 10,
                        borderRadius: 10,
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: 22,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                      Mesa:
                    </Text>
                    <TextInput
                      onChangeText={(text) => setNumeroMesa(text)}
                      style={{
                        borderWidth: 0.5,
                        width: 100,
                        padding: 10,
                        borderRadius: 10,
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: 22,
                      }}
                      keyboardType="numeric"
                      placeholder="0"
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                      Numero personas:
                    </Text>
                    <TextInput
                      onChangeText={(text) => setNumeroPersonas(text)}
                      keyboardType="numeric"
                      placeholder="0"
                      style={{
                        borderWidth: 0.5,
                        width: 100,
                        padding: 10,
                        borderRadius: 10,
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: 22,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                      Botellas:
                    </Text>
                    <TextInput
                      onChangeText={(text) => setNumeroBotellas(text)}
                      keyboardType="numeric"
                      placeholder="0"
                      style={{
                        borderWidth: 0.5,
                        width: 100,
                        padding: 10,
                        borderRadius: 10,
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: 22,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "space-between",
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        marginBottom: 2,
                      }}
                    >
                      Comentario (Opcional)
                    </Text>
                    <TextInput
                      onChangeText={(text) => setComentario(text)}
                      placeholder="Comentario en la reserva..."
                      style={{
                        borderWidth: 0.5,
                        width: "100%",
                        padding: 10,
                        borderRadius: 10,
                        fontWeight: "bold",
                        fontSize: 22,
                      }}
                    />
                    <View
                      style={{
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          marginBottom: 2,
                        }}
                      >
                        Reserva creada
                      </Text>
                      <Text>
                        {user.nombre} {user.apellidos}
                      </Text>
                    </View>
                  </View>
                </View>
              </>
            )}

            <View style={{ marginTop: 10, width: "100%", height: "80%" }}>
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    borderWidth: 3,
                    paddingHorizontal: 20,
                    borderRadius: 10,
                    marginBottom: 3,
                    backgroundColor: "#FCEEA0",
                  }}
                >
                  <Text style={{ fontWeight: "bold", fontSize: 22 }}>
                    Total de reservas: {reservas.length}
                  </Text>
                </View>
              </View>
              {openAddReserva == false && (
                <FlatList
                  extraData={reservas}
                  data={reservas}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => renderItemList(item)}
                  // estimatedItemSize={200}
                />
              )}
            </View>
          </View>
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
export default CalendarioScreen;
