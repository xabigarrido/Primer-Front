import {
    View,
    Text,
    ImageBackground,
    StyleSheet,
    TextInput,
    Image,
    Linking,
    ActivityIndicator,
    TouchableOpacity,
  } from "react-native";
  import ImageLoad from "react-native-image-progress";
  import ProgressBar from "react-native-progress/Bar";
  import ubicacion from "../assets/ubicacion.jpg";
  import * as ImagePicker from "expo-image-picker";
  
  import { FontAwesome } from "@expo/vector-icons";
  import botella from "../assets/botella.png";
  import copa from "../assets/copa2.jpg";
  import editarEmpleadoImg from "../assets/editarEmpleado.jpg";
  import cruz from "../assets/cruz.png";
  import activar from "../assets/activar.png";
  import {
    NativeViewGestureHandler,
    ScrollView,
  } from "react-native-gesture-handler";
  import "react-native-get-random-values";
  import React, { useRef, useState, useEffect } from "react";
  import { Picker } from "@react-native-picker/picker";
  import { Root, Popup } from "react-native-popup-confirm-toast";
  
  import fondo from "../assets/fondoScreen.jpg";
  import BotonHome from "../components/BotonHome";
  import Toast from "react-native-toast-message";
  import {
    BottomSheetModal,
    BottomSheetModalProvider,
  } from "@gorhom/bottom-sheet";
  import { Button } from "@react-native-material/core";
  import { MaterialCommunityIcons, Fontisto } from "@expo/vector-icons";
  import {
    addEmpleado,
    deleteEmpleado,
    getEmpleado,
    getEmpleados,
    loadEmpeladoTikadaActual,
    URL,
    salidaTikada,
    changeInfoUser,
    changeInfoUserMaster,
    deleteTikada,
    editarEmpleadoApi,
    API,
  } from "../api";
  import moment from "moment";
import useSWR from "swr";

  const GestionEmpleadosScreen = ({ navigation }) => {
    const [empleados, setEmpleados] = useState([]);
    const [pickCategory, setPickCategory] = useState("Empleado");
    const [pickCategoryEdit, setPickCategoryEdit] = useState("");
    const [crearEmpleado, setCrearEmpleado] = useState(false);
    const bottomSheetModalRef = useRef(null);
    const snapPoints = ["95%"];
    const [nombreEmpleado, setnombreEmpleado] = useState("");
    const [apellidosEmpleado, setApellidosEmpleado] = useState("");
    const [emailEmpleado, setEmailEmpleado] = useState("");
    const [dniEmpleado, setDniEmpleado] = useState("");
    const [password, setPassword] = useState("");
    const [numeroEmpleado, setNumeroEmpleado] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [rangoAdmin, setRangoAdmin] = useState([]);
    const [rangoEncargado, setRangoEncargado] = useState([]);
    const [rangoCamareroBarra, setRangoCamareroBarra] = useState([]);
    const [rangoBandeja, setRangoBandeja] = useState([]);
    const [rangoDj, setRangoDj] = useState([]);
    const [rangoMantenimiento, setRangoMantenimiento] = useState([]);
    const [rangoPortero, setRangoPortero] = useState([]);
    const [rangoCachimbero, setRangoCachimbero] = useState([]);
    const [rangoRrpp, setRangoRrpp] = useState([]);
    const [rangoLimpieza, setRangoLimpieza] = useState([]);
    const [rangoEmpleado, setRangoEmpleado] = useState([]);
    const [pickEmpleado, setPickEmpleado] = useState(null);
    const [trabajadoActual, setTrabajadoActual] = useState("00:00");
    const [horaEntrada, setHoraEntrada] = useState("Ninguna");
    const [showIban, setShowIban] = useState(false);
    const [editarEmpleado, setEditarEmpleado] = useState(null);
    const [listImage, setListImage] = useState([]);
    const [idTikada, setIdTikada] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
  
      if (!result.cancelled) {
        setListImage([...listImage, result.uri]);
      }
    };
    function secondsToString(seconds) {
      var hour = Math.floor(seconds / 3600);
      hour = hour < 10 ? "0" + hour : hour;
      var minute = Math.floor((seconds / 60) % 60);
      minute = minute < 10 ? "0" + minute : minute;
      var second = seconds % 60;
      second = second < 10 ? "0" + second : second;
      return hour + ":" + minute + ":" + second;
    }
    const loadEmpleados = async () => {
        const { data } = useSWR("http://192.168.0.14:4000/api/empleados");
        console.log(data)
    //   const data = await getEmpleados();
      setEmpleados(data);
      setRangoAdmin(data.filter((element) => element.rango == "Administrador"));
      setRangoEncargado(data.filter((element) => element.rango == "Encargado"));
      setRangoCamareroBarra(
        data.filter((element) => element.rango == "Camarero barra")
      );
      setRangoBandeja(data.filter((element) => element.rango == "Bandeja"));
      setRangoDj(data.filter((element) => element.rango == "DJ"));
      setRangoMantenimiento(
        data.filter((element) => element.rango == "Mantenimiento")
      );
      setRangoRrpp(data.filter((element) => element.rango == "RRPP"));
      setRangoLimpieza(data.filter((element) => element.rango == "Limpieza"));
      setRangoEmpleado(data.filter((element) => element.rango == "Empleado"));
      setRangoPortero(data.filter((element) => element.rango == "Portero"));
      setRangoCachimbero(data.filter((element) => element.rango == "Cachimbero"));
    };
    useEffect(() => {
      loadEmpleados();
      return () => {
        loadEmpleados();
      };
    }, []);
    const handleLoadTikadaEmpleado = async () => {
      if (pickEmpleado != null && pickEmpleado.tikado == true) {
        const data = await loadEmpeladoTikadaActual(pickEmpleado._id);
        const tiempoTrabajado = secondsToString(
          moment().diff(moment.unix(data.entrada), "s")
        );
        setIdTikada(data._id);
        const separar = tiempoTrabajado.split(":");
        const sep = data.entradaHumana.split(", ");
        setHoraEntrada(sep[1].slice(0, -3));
        return setTrabajadoActual(`${separar[0]}:${separar[1]}`);
      }
      setTrabajadoActual("00:00");
      setHoraEntrada("Ninguna");
    };
    useEffect(() => {
      handleLoadTikadaEmpleado();
      setEditarEmpleado(null);
  
      return () => {};
    }, [pickEmpleado]);
  
    function handlePresentModal() {
      return bottomSheetModalRef.current?.snapToIndex(0);
    }
    useEffect(() => {
      bottomSheetModalRef.current?.present();
      // console.log('pipi')
    }, [bottomSheetModalRef]);
    const handleCrearEmpleado = async () => {
      const newEmpleado = {
        nombre: nombreEmpleado,
        apellidos: apellidosEmpleado,
        email: emailEmpleado,
        password,
        repassword: rePassword,
        dni: dniEmpleado,
        rango: pickCategory,
        cuentaBancaria: "Sin informacion",
        telefono: numeroEmpleado,
      };
      const data = await addEmpleado(newEmpleado);
      if (data.length > 0) {
        return Toast.show({
          type: "error",
          text1: data[0].msg,
          position: "top",
          visibilityTime: 1800,
        });
      }
  
      if (data.token) {
        setCrearEmpleado(false);
        loadEmpleados();
        bottomSheetModalRef.current?.dismiss();
        return Toast.show({
          type: "success",
          text1: "Empleado agregado",
          position: "top",
          visibilityTime: 1800,
        });
      }
    };
    useEffect(() => {
      if (crearEmpleado == true)
        return bottomSheetModalRef.current?.snapToIndex(0);
    }, [crearEmpleado]);
    // const editFotoEmpleado = async (id, lista) => {
    //   try {
    //     for (let i = 0; i < lista.length; i++) {
    //       let filename = lista[i].split("/").pop();
    //       let match = /\.(\w+)$/.exec(filename);
    //       let type = match ? `image/${match[1]}` : "image";
    //       let data = new FormData();
    //       data.append("image", { uri: lista[i], name: filename, type });
  
    //       const query = await fetch(`${API}/empleados/cambiarFoto/${id}`, {
    //         method: "PUT",
    //         body: data,
    //         headers: { "Content-Type": "multipart/form-data" },
    //       });
    //     }
    //     setListImage([]);
    //     // const data = await getEmpleado(editarEmpleado._id);
    //     // dispatch(addInfoUser(data));
    //     loadEmpleados();
    //     return bottomSheetModalRef.current?.dismiss();
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
    const handleEditarEmpleado = async () => {
      // setEditarEmpleado((editarEmpleado.rango = pickCategoryEdit));
      if (listImage.length != 0) {
        // await editFotoEmpleado(editarEmpleado._id, listImage);
      }
      await editarEmpleadoApi(editarEmpleado._id, editarEmpleado);
      setListImage([]);
      setEditarEmpleado(null);
      setPickCategoryEdit("");
      loadEmpleados();
      bottomSheetModalRef.current?.dismiss();
    };
  
    const listEmpleados = (empleadosList) => {
      return (
        <View style={{ alignItems: "center" }}>
          {/* <Text>Trabajando: {empleadosList.filter(element => element.tikado = true).length}</Text> */}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {empleadosList.map((empleado, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setPickEmpleado(empleado);
                  setCrearEmpleado(false);
                  handlePresentModal();
                }}
              >
                <View
                  style={{
                    minWidth: 100,
                    maxWidth: 100,
                    // minHeight: 170,
                    maxHeight: 170,
                    margin: 3,
                    borderRadius: 15,
                    borderWidth: 0.5,
                    padding: 10,
                    alignItems: "center",
                    backgroundColor:
                      empleado.tikado == true
                        ? "#9DCA92"
                        : empleado.habilitadoUser == true
                        ? "white"
                        : "#FF9999",
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
                  {/* {loading == true && ()} */}
                  <Image
                    source={{ uri: `${URL}${empleado.foto}` }}
                    style={{
                      borderRadius: 50,
                      height: 60,
                      width: 60,
                      borderWidth: 0.3,
                    }}
                  />
                  <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                    {empleado.nombre}
                  </Text>
                  <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                    {empleado.apellidos}
                  </Text>
                  {empleado.tikado == true && (
                    <>
                      <View
                        style={{
                          height: 15,
                          width: 15,
                          backgroundColor: "#F90000",
                          borderRadius: 20,
                        }}
                      ></View>
                      <Text style={{ fontWeight: "600", fontSize: 10 }}>
                        TRABAJANDO
                      </Text>
                    </>
                  )}
                  {empleado.habilitadoUser == false && (
                    <>
                      <View
                        style={{
                          height: 15,
                          width: 15,
                          backgroundColor: "black",
                          borderRadius: 20,
                          borderWidth: 1,
                          borderColor: "white",
                        }}
                      ></View>
                      <Text style={{ fontWeight: "600", fontSize: 10 }}>
                        CUENTA
                      </Text>
                      <Text style={{ fontWeight: "600", fontSize: 10 }}>
                        SUSPENDIDA
                      </Text>
                    </>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
          {empleadosList.length == 0 && <Text>Nadie en esta categoria</Text>}
        </View>
      );
    };
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
                    backgroundColor: "#F6F6F6",
                    alignItems: "center",
                    paddingVertical: 15,
                    borderRadius: 15,
                  }}
                >
                  <ScrollView
                    contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
                  >
                    <Button
                      title="Crear Empleado"
                      onPress={() => {
                        setCrearEmpleado(true);
                        setPickEmpleado(null);
                        handlePresentModal();
                      }}
                      style={{
                        width: "95%",
                        height: 50,
                        marginTop: 10,
                        backgroundColor: "red",
                        justifyContent: "center",
                      }}
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "center",
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: "#323432",
                          width: "98%",
                          alignItems: "center",
                          borderRadius: 15,
                          marginVertical: 10,
                          paddingVertical: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 22,
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          ADMINISTRADORES
                        </Text>
                      </View>
                      {listEmpleados(rangoAdmin)}
  
                      <View
                        style={{
                          backgroundColor: "#323432",
                          width: "98%",
                          alignItems: "center",
                          borderRadius: 15,
                          marginVertical: 10,
                          paddingVertical: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 22,
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          ENCARGADOS
                        </Text>
                      </View>
                      {listEmpleados(rangoEncargado)}
  
                      <View
                        style={{
                          backgroundColor: "#323432",
                          width: "98%",
                          alignItems: "center",
                          borderRadius: 15,
                          marginVertical: 10,
                          paddingVertical: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 22,
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          CAMAREROS BARRAS
                        </Text>
                      </View>
                      {listEmpleados(rangoCamareroBarra)}
                      <View
                        style={{
                          backgroundColor: "#323432",
                          width: "98%",
                          alignItems: "center",
                          borderRadius: 15,
                          marginVertical: 10,
                          paddingVertical: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 22,
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          BANDEJAS
                        </Text>
                      </View>
                      {listEmpleados(rangoBandeja)}
                      <View
                        style={{
                          backgroundColor: "#323432",
                          width: "98%",
                          alignItems: "center",
                          borderRadius: 15,
                          marginVertical: 10,
                          paddingVertical: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 22,
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          CACHIMBEROS
                        </Text>
                      </View>
                      {listEmpleados(rangoCachimbero)}
  
                      <View
                        style={{
                          backgroundColor: "#323432",
                          width: "98%",
                          alignItems: "center",
                          borderRadius: 15,
                          marginVertical: 10,
                          paddingVertical: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 22,
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          DJ'S
                        </Text>
                      </View>
                      {listEmpleados(rangoDj)}
  
                      <View
                        style={{
                          backgroundColor: "#323432",
                          width: "98%",
                          alignItems: "center",
                          borderRadius: 15,
                          marginVertical: 10,
                          paddingVertical: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 22,
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          RELACIONES PUBLICAS
                        </Text>
                      </View>
                      {listEmpleados(rangoRrpp)}
  
                      <View
                        style={{
                          backgroundColor: "#323432",
                          width: "98%",
                          alignItems: "center",
                          borderRadius: 15,
                          marginVertical: 10,
                          paddingVertical: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 22,
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          MANTENIMIENTO
                        </Text>
                      </View>
                      {listEmpleados(rangoMantenimiento)}
  
                      <View
                        style={{
                          backgroundColor: "#323432",
                          width: "98%",
                          alignItems: "center",
                          borderRadius: 15,
                          marginVertical: 10,
                          paddingVertical: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 22,
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          PORTEROS
                        </Text>
                      </View>
                      {listEmpleados(rangoPortero)}
  
                      <View
                        style={{
                          backgroundColor: "#323432",
                          width: "98%",
                          alignItems: "center",
                          borderRadius: 15,
                          marginVertical: 10,
                          paddingVertical: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 22,
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          LIMPIEZA
                        </Text>
                      </View>
                      {listEmpleados(rangoLimpieza)}
  
                      <View
                        style={{
                          backgroundColor: "#323432",
                          width: "98%",
                          alignItems: "center",
                          borderRadius: 15,
                          marginVertical: 10,
                          paddingVertical: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 22,
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          EMPLEADOS
                        </Text>
                      </View>
                      {listEmpleados(rangoEmpleado)}
  
                      <View
                        style={{
                          backgroundColor: "#323432",
                          width: "98%",
                          alignItems: "center",
                          borderRadius: 15,
                          marginVertical: 10,
                          paddingVertical: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 22,
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          TODOS
                        </Text>
                      </View>
                      {listEmpleados(empleados)}
                    </View>
                  </ScrollView>
                </View>
              </View>
            </BotonHome>
          </ImageBackground>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={-1}
            snapPoints={snapPoints}
            onDismiss={() => {
              setCrearEmpleado(false);
              setPickEmpleado(null);
              setEditarEmpleado(null);
            }}
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
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
            >
              <View style={style.contentContainer}>
                <View style={style.containerModal}>
                  {crearEmpleado == true && (
                    <View style={{ width: "100%" }}>
                      <TextInput
                        placeholder="Nombre empleado"
                        style={{
                          borderWidth: 0.5,
                          width: "100%",
                          padding: 10,
                          borderRadius: 10,
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: 22,
                          marginBottom: 5,
                        }}
                        leading={() => (
                          <MaterialCommunityIcons
                            name="account-circle"
                            size={24}
                            color="black"
                          />
                        )}
                        onChangeText={(text) => setnombreEmpleado(text)}
                      />
                      <TextInput
                        placeholder="Apellidos"
                        style={{
                          borderWidth: 0.5,
                          width: "100%",
                          padding: 10,
                          borderRadius: 10,
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: 22,
                          marginBottom: 5,
                        }}
                        leading={() => (
                          <MaterialCommunityIcons
                            name="account-circle"
                            size={24}
                            color="black"
                          />
                        )}
                        onChangeText={(text) => setApellidosEmpleado(text)}
                      />
                      <TextInput
                        placeholder="E-mail"
                        style={{
                          borderWidth: 0.5,
                          width: "100%",
                          padding: 10,
                          borderRadius: 10,
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: 22,
                          marginBottom: 5,
                        }}
                        leading={() => (
                          <MaterialCommunityIcons
                            name="account-circle"
                            size={24}
                            color="black"
                          />
                        )}
                        onChangeText={(text) => setEmailEmpleado(text)}
                      />
                      <TextInput
                        placeholder="DNI"
                        style={{
                          borderWidth: 0.5,
                          width: "100%",
                          padding: 10,
                          borderRadius: 10,
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: 22,
                          marginBottom: 5,
                        }}
                        leading={() => (
                          <MaterialCommunityIcons
                            name="account-circle"
                            size={24}
                            color="black"
                          />
                        )}
                        onChangeText={(text) => setDniEmpleado(text)}
                      />
                      <TextInput
                        placeholder="NUMERO DE TELEFONO"
                        style={{
                          borderWidth: 0.5,
                          width: "100%",
                          padding: 10,
                          borderRadius: 10,
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: 22,
                          marginBottom: 5,
                        }}
                        leading={() => (
                          <MaterialCommunityIcons
                            name="account-circle"
                            size={24}
                            color="black"
                          />
                        )}
                        onChangeText={(text) => setNumeroEmpleado(text)}
                      />
                      <TextInput
                        placeholder="Contrase??a"
                        style={{
                          borderWidth: 0.5,
                          width: "100%",
                          padding: 10,
                          borderRadius: 10,
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: 22,
                          marginBottom: 5,
                        }}
                        leading={() => (
                          <MaterialCommunityIcons
                            name="account-circle"
                            size={24}
                            color="black"
                          />
                        )}
                        onChangeText={(text) => setPassword(text)}
                      />
                      <TextInput
                        placeholder="Repetir contrase??a"
                        style={{
                          borderWidth: 0.5,
                          width: "100%",
                          padding: 10,
                          borderRadius: 10,
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: 22,
                          marginBottom: 5,
                        }}
                        leading={() => (
                          <MaterialCommunityIcons
                            name="account-circle"
                            size={24}
                            color="black"
                          />
                        )}
                        onChangeText={(text) => setRePassword(text)}
                      />
                      <Picker
                        style={{
                          width: "100%",
                          borderRadius: 20,
                          borderWidth: 0.3,
                          backgroundColor: "#EBEBEB",
                          marginBottom: 20,
                        }}
                        selectedValue={pickCategory}
                        onValueChange={(itemValue, itemIndex) =>
                          setPickCategory(itemValue)
                        }
                      >
                        <Picker.Item label="Empleado" value="Empleado" />
                        <Picker.Item label="Limpieza" value="Limpieza" />
                        <Picker.Item label="RRPP" value="RRPP" />
                        <Picker.Item label="Portero" value="Portero" />
                        <Picker.Item
                          label="Mantenimiento"
                          value="Mantenimiento"
                        />
                        <Picker.Item label="DJ" value="DJ" />
                        <Picker.Item label="Bandeja" value="Bandeja" />
                        <Picker.Item label="Cachimbero" value="Cachimbero" />
                        <Picker.Item
                          label="Camarero barra"
                          value="Camarero barra"
                        />
                        <Picker.Item label="Encargado" value="Encargado" />
                        <Picker.Item
                          label="Administrador"
                          value="Administrador"
                        />
                      </Picker>
                      <Button
                        title="Crear Empleado"
                        onPress={() => {
                          handleCrearEmpleado();
                        }}
                      />
                    </View>
                  )}
                  {editarEmpleado == null && pickEmpleado != null && (
                    <View style={{ width: "100%", paddingHorizontal: 10 }}>
                      <View
                        style={{
                          width: "100%",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <View style={{ width: "80%" }}>
                          <Text style={{ fontSize: 32 }}>
                            {pickEmpleado.nombre}
                          </Text>
                          <Text style={{ fontSize: 28 }}>
                            {pickEmpleado.apellidos}
                          </Text>
                          <Text style={{ fontSize: 27 }}>
                            {pickEmpleado.dni.toLocaleUpperCase()}
                          </Text>
                        </View>
                        <View style={{ width: "20%" }}>
                          <Image
                            source={{ uri: `${URL}${pickEmpleado.foto}` }}
                            style={{
                              height: 70,
                              width: 70,
                              borderRadius: 50,
                              borderWidth: 0.3,
                            }}
                          />
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          Linking.openURL(
                            `https://wa.me/+34${pickEmpleado.telefono
                              .split(" ")
                              .join("")}`
                          );
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: "#86B278",
                            borderRadius: 10,
                            paddingVertical: 5,
                            paddingHorizontal: 10,
                            alignItems: "center",
                            marginBottom: 5,
                            borderWidth: 1.5,
                            borderColor: "#4F6848",
                          }}
                        >
                          <Text style={{ fontWeight: "bold" }}>
                            Enviar whatsapp
                          </Text>
                          <Text
                            style={{
                              fontSize: 20,
                              textAlign: "right",
                              color: "white",
                            }}
                          >
                            {pickEmpleado.telefono}{" "}
                            <FontAwesome
                              name="whatsapp"
                              size={24}
                              color="white"
                            />
                          </Text>
                        </View>
                      </TouchableOpacity>
  
                      {pickEmpleado.tikado == true && (
                        <>
                          <View
                            style={{
                              backgroundColor: "white",
                              borderRadius: 10,
                              paddingVertical: 5,
                              paddingHorizontal: 10,
                              alignItems: "center",
                              marginBottom: 5,
                              borderWidth: 0.17,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 20,
                                fontWeight: "bold",
                                color: "#50AA00",
                              }}
                            >
                              ENTRADA A TRABAJAR
                            </Text>
                            <Text style={{ fontSize: 26, fontWeight: "bold" }}>
                              {horaEntrada}
                            </Text>
                            <Button
                              title="Eliminar tikada"
                              style={{ backgroundColor: "#FC6E6E" }}
                              onPress={() => {
                                Popup.show({
                                  type: "confirm",
                                  title: "??Seguro quieres eliminar la tikada?",
                                  // textBody: '??Desea cerrar la caja?',
                                  buttonText: "Si",
                                  confirmText: "No",
                                  callback: async () => {
                                    changeInfoUser(pickEmpleado._id, false);
                                    deleteTikada(idTikada);
                                    Toast.show({
                                      type: "success",
                                      text1: "Tikada eliminada",
                                      visibilityTime: 1800,
                                    });
                                    loadEmpleados();
                                    bottomSheetModalRef.current?.dismiss();
                                    Popup.hide();
                                  },
                                  cancelCallback: () => {
                                    Popup.hide();
                                  },
                                });
                              }}
                            />
                          </View>
                          <View
                            style={{
                              backgroundColor: "white",
                              borderRadius: 10,
                              paddingVertical: 5,
                              paddingHorizontal: 10,
                              alignItems: "center",
                              marginBottom: 5,
                              borderWidth: 0.17,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 20,
                                fontWeight: "bold",
                                color: "#0067AA",
                              }}
                            >
                              TIEMPO TRABAJANDO ACTUAL
                            </Text>
                            <Text style={{ fontSize: 26, fontWeight: "bold" }}>
                              {trabajadoActual}
                            </Text>
                            <Button
                              title="cerrar tikada"
                              style={{ backgroundColor: "orange" }}
                              onPress={() => {
                                Popup.show({
                                  type: "confirm",
                                  title: "??Seguro quieres cerrar la tikada?",
                                  // textBody: '??Desea cerrar la caja?',
                                  buttonText: "Si",
                                  confirmText: "No",
                                  callback: async () => {
                                    changeInfoUser(pickEmpleado._id, false);
                                    const newSalida = {
                                      salidaHumana: moment().format(
                                        "DD/MM/YYYY, HH:mm:ss"
                                      ),
                                      salida: moment().unix(),
                                    };
                                    salidaTikada(pickEmpleado._id, newSalida);
                                    Toast.show({
                                      type: "success",
                                      text1: "Tikada cerrada",
                                      visibilityTime: 1800,
                                    });
                                    loadEmpleados();
                                    bottomSheetModalRef.current?.dismiss();
                                    Popup.hide();
                                  },
                                  cancelCallback: () => {
                                    Popup.hide();
                                  },
                                });
                              }}
                            />
                          </View>
                        </>
                      )}
                      <View
                        style={{
                          // flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-around",
                          width: "100%",
                          marginBottom: 5,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: "white",
                            width: "100%",
                            justifyContent: "space-evenly",
                            borderRadius: 5,
                            padding: 5,
                            borderWidth: 0.17,
                            flexDirection: "row",
                            marginBottom: 5,
                          }}
                        >
                          <Image
                            source={copa}
                            style={{ width: 60, height: 60 }}
                          />
                          <View>
                            <View
                              style={{
                                backgroundColor: "orange",
                                borderRadius: 15,
                                paddingHorizontal: 10,
                                paddingVertical: 2,
                                flexDirection: "row",
                                marginBottom: 3,
                                alignItems: "center",
                              }}
                            >
                              <Text>HOY </Text>
                              <Text style={{ fontWeight: "bold", fontSize: 22 }}>
                                {pickEmpleado.totalCopasHoy}
                              </Text>
                            </View>
                            <View
                              style={{
                                backgroundColor: "#C8C8C8",
                                borderRadius: 15,
                                paddingHorizontal: 10,
                                paddingVertical: 2,
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <Text>TOTAL </Text>
                              <Text style={{ fontWeight: "bold", fontSize: 22 }}>
                                {pickEmpleado.totalCopas}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View
                          style={{
                            backgroundColor: "white",
                            width: "100%",
                            justifyContent: "space-evenly",
                            borderRadius: 5,
                            padding: 5,
                            borderWidth: 0.17,
                            flexDirection: "row",
                            marginBottom: 5,
                          }}
                        >
                          <Image
                            source={botella}
                            style={{ width: 60, height: 60 }}
                          />
                          <View>
                            <View
                              style={{
                                backgroundColor: "orange",
                                borderRadius: 15,
                                paddingHorizontal: 10,
                                paddingVertical: 2,
                                flexDirection: "row",
                                marginBottom: 3,
                                alignItems: "center",
                              }}
                            >
                              <Text>HOY </Text>
                              <Text style={{ fontWeight: "bold", fontSize: 22 }}>
                                {pickEmpleado.totalBotellasHoy}
                              </Text>
                            </View>
                            <View
                              style={{
                                backgroundColor: "#C8C8C8",
                                borderRadius: 15,
                                paddingHorizontal: 10,
                                paddingVertical: 2,
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <Text>TOTAL </Text>
                              <Text style={{ fontWeight: "bold", fontSize: 22 }}>
                                {pickEmpleado.totalBotellas}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-evenly",
                          backgroundColor: "#9F9F9F50",
                          padding: 5,
                          borderRadius: 10,
                          borderWidth: 0.17,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("TikadasEmpleadoById", {
                              idEmpleado: pickEmpleado._id,
                            })
                          }
                        >
                          <View style={{ alignItems: "center" }}>
                            <Image
                              source={ubicacion}
                              style={{
                                width: 50,
                                height: 50,
                                borderRadius: 15,
                                borderWidth: 0.1,
                              }}
                            />
                            <View
                              style={{
                                alignItems: "center",
                                backgroundColor: "#323432",
                                paddingHorizontal: 5,
                                paddingVertical: 2,
                                borderRadius: 5,
                                marginTop: 3,
                              }}
                            >
                              <Text style={{ color: "white" }}>VER </Text>
                              <Text style={{ color: "white" }}>TIKADAS</Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            setEditarEmpleado(pickEmpleado);
                            setPickCategoryEdit(pickEmpleado.rango);
                            // setnombreEmpleado()
                            // setApellidosEmpleado()
                            // setEmailEmpleado()
                            // setPassword()
                            // setDniEmpleado()
                            // pickCategory()
                            // setCuentaBancaria()
                            // setNumeroEmpleado()
                            // nombre: nombreEmpleado,
                            // apellidos: apellidosEmpleado,
                            // email: emailEmpleado,
                            // password,
                            // repassword: rePassword,
                            // dni: dniEmpleado,
                            // rango: pickCategory,
                            // cuentaBancaria,
                            // telefono: numeroEmpleado,
                          }}
                        >
                          <View style={{ alignItems: "center" }}>
                            <Image
                              source={editarEmpleadoImg}
                              style={{
                                width: 50,
                                height: 50,
                                borderRadius: 15,
                                borderWidth: 0.1,
                              }}
                            />
                            <View
                              style={{
                                alignItems: "center",
                                backgroundColor: "#323432",
                                paddingHorizontal: 5,
                                paddingVertical: 2,
                                borderRadius: 5,
                                marginTop: 3,
                              }}
                            >
                              <Text style={{ color: "white" }}>EDITAR </Text>
                              <Text style={{ color: "white" }}>EMPLEADO</Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                        {pickEmpleado.habilitadoUser == true ? (
                          <TouchableOpacity
                            onPress={() => {
                              Popup.show({
                                type: "confirm",
                                title: "??Suspender cuenta?",
                                textBody: "",
                                buttonText: "Si",
                                confirmText: "No",
                                callback: () => {
                                  changeInfoUserMaster(pickEmpleado._id, {
                                    habilitadoUser: false,
                                  });
                                  // setEmpleados(
                                  //   empleados.map((element) =>
                                  //     element._id == pickEmpleado._id
                                  //       ? (element.habilitadoUser = false)
                                  //       : element
                                  //   )
                                  // );
                                  loadEmpleados();
                                  bottomSheetModalRef.current?.dismiss();
  
                                  Toast.show({
                                    type: "error",
                                    text1: "Cuenta suspendida",
                                    position: "top",
                                    visibilityTime: 1800,
                                  });
                                  Popup.hide();
                                },
                                cancelCallback: () => {
                                  Popup.hide();
                                },
                              });
                            }}
                          >
                            <View style={{ alignItems: "center" }}>
                              <Image
                                source={cruz}
                                style={{
                                  width: 50,
                                  height: 50,
                                  borderRadius: 15,
                                  borderWidth: 0,
                                }}
                              />
                              <View
                                style={{
                                  alignItems: "center",
                                  backgroundColor: "#323432",
                                  paddingHorizontal: 5,
                                  paddingVertical: 2,
                                  borderRadius: 5,
                                  marginTop: 3,
                                }}
                              >
                                <Text style={{ color: "white" }}>SUSPENDER </Text>
                                <Text style={{ color: "white" }}>CUENTA</Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={() => {
                              Popup.show({
                                type: "confirm",
                                title: "??Activar cuenta?",
                                textBody: "",
                                buttonText: "Si",
                                confirmText: "No",
                                callback: () => {
                                  changeInfoUserMaster(pickEmpleado._id, {
                                    habilitadoUser: true,
                                  });
                                  // setEmpleados(
                                  //   empleados.map((element) =>
                                  //     element._id == pickEmpleado._id
                                  //       ? (element.habilitadoUser = false)
                                  //       : element
                                  //   )
                                  // );
                                  loadEmpleados();
                                  bottomSheetModalRef.current?.dismiss();
  
                                  Toast.show({
                                    type: "error",
                                    text1: "Cuenta activada",
                                    position: "top",
                                    visibilityTime: 1800,
                                  });
                                  Popup.hide();
                                },
                                cancelCallback: () => {
                                  Popup.hide();
                                },
                              });
                            }}
                          >
                            <View style={{ alignItems: "center" }}>
                              <Image
                                source={activar}
                                style={{
                                  width: 50,
                                  height: 50,
                                  borderRadius: 15,
                                  borderWidth: 0,
                                }}
                              />
                              <View
                                style={{
                                  alignItems: "center",
                                  backgroundColor: "#323432",
                                  paddingHorizontal: 5,
                                  paddingVertical: 2,
                                  borderRadius: 5,
                                  marginTop: 3,
                                }}
                              >
                                <Text style={{ color: "white" }}>ACTIVAR </Text>
                                <Text style={{ color: "white" }}>CUENTA</Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        )}
                      </View>
                      <View
                        style={{
                          backgroundColor: "white",
                          borderRadius: 10,
                          paddingVertical: 5,
                          paddingHorizontal: 10,
                          alignItems: "center",
                          marginTop: 15,
                          borderWidth: 0.17,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            color: "red",
                          }}
                        >
                          DIA DE ALTA EN LA APLICACION
                        </Text>
                        <Text
                          style={{
                            fontSize: 22,
                            fontWeight: "bold",
                            color: "#494949",
                          }}
                        >
                          {moment(new Date(pickEmpleado.diaCreado))
                            .format("DD MMMM YYYY")
                            .toLocaleUpperCase()}
                        </Text>
                        <Button title="Eliminar empleado" />
                      </View>
                      <View
                        style={{
                          width: "100%",
                          alignItems: "center",
                          marginTop: 5,
                        }}
                      >
                        <Button
                          title="Ver IBAN"
                          style={{ backgroundColor: "#737373" }}
                          onPress={() => setShowIban(!showIban)}
                        />
                        {showIban == true && (
                          <View
                            style={{
                              marginTop: 1,
                              borderWidth: 0.17,
                              backgroundColor: "white",
                              width: "100%",
                              paddingVertical: 2,
                              paddingHorizontal: 3,
                              borderRadius: 15,
                              alignItems: "center",
                            }}
                          >
                            <Text>ES21 1465 0100 72 2030876293</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  )}
  
                  {editarEmpleado != null && (
                    <View style={{ width: "100%", alignItems: "center" }}>
                      <TouchableOpacity onPress={pickImage}>
                        {listImage.length == 0 ? (
                          <Image
                            source={{ uri: `${URL}${pickEmpleado.foto}` }}
                            style={{
                              height: 70,
                              width: 70,
                              borderRadius: 50,
                              borderWidth: 0.3,
                            }}
                          />
                        ) : (
                          <Image
                            source={{ uri: listImage[0] }}
                            style={{
                              height: 70,
                              width: 70,
                              borderRadius: 50,
                              borderWidth: 0.3,
                            }}
                          />
                        )}
                      </TouchableOpacity>
                      <TextInput
                        placeholder={editarEmpleado.nombre}
                        style={{
                          marginTop: 5,
                          borderWidth: 0.5,
                          width: "100%",
                          padding: 10,
                          borderRadius: 10,
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: 22,
                          marginBottom: 5,
                        }}
                        leading={() => (
                          <MaterialCommunityIcons
                            name="account-circle"
                            size={24}
                            color="black"
                          />
                        )}
                        onChangeText={(text) => (editarEmpleado.nombre = text)}
                      />
                      <TextInput
                        placeholder={editarEmpleado.apellidos}
                        style={{
                          borderWidth: 0.5,
                          width: "100%",
                          padding: 10,
                          borderRadius: 10,
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: 22,
                          marginBottom: 5,
                        }}
                        leading={() => (
                          <MaterialCommunityIcons
                            name="account-circle"
                            size={24}
                            color="black"
                          />
                        )}
                        onChangeText={(text) => (editarEmpleado.apellidos = text)}
                      />
                      <TextInput
                        placeholder={editarEmpleado.email}
                        style={{
                          borderWidth: 0.5,
                          width: "100%",
                          padding: 10,
                          borderRadius: 10,
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: 22,
                          marginBottom: 5,
                        }}
                        leading={() => (
                          <MaterialCommunityIcons
                            name="account-circle"
                            size={24}
                            color="black"
                          />
                        )}
                        onChangeText={(text) => (editarEmpleado.email = text)}
                      />
                      <TextInput
                        placeholder={editarEmpleado.dni}
                        style={{
                          borderWidth: 0.5,
                          width: "100%",
                          padding: 10,
                          borderRadius: 10,
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: 22,
                          marginBottom: 5,
                        }}
                        leading={() => (
                          <MaterialCommunityIcons
                            name="account-circle"
                            size={24}
                            color="black"
                          />
                        )}
                        onChangeText={(text) => (editarEmpleado.dni = text)}
                      />
                      <TextInput
                        placeholder={editarEmpleado.telefono}
                        style={{
                          borderWidth: 0.5,
                          width: "100%",
                          padding: 10,
                          borderRadius: 10,
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: 22,
                          marginBottom: 5,
                        }}
                        leading={() => (
                          <MaterialCommunityIcons
                            name="account-circle"
                            size={24}
                            color="black"
                          />
                        )}
                        onChangeText={(text) => (editarEmpleado.telefono = text)}
                      />
                      <TextInput
                        placeholder={editarEmpleado.cuentaBancaria}
                        style={{
                          borderWidth: 0.5,
                          width: "100%",
                          padding: 10,
                          borderRadius: 10,
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: 22,
                          marginBottom: 5,
                        }}
                        leading={() => (
                          <MaterialCommunityIcons
                            name="account-circle"
                            size={24}
                            color="black"
                          />
                        )}
                        onChangeText={(text) =>
                          (editarEmpleado.cuentaBancaria = text)
                        }
                      />
                      {/* <TextInput
                      placeholder="Nueva contrase??a"
  
                      secureTextEntry={true}
                      style={{
                        borderWidth: 0.5,
                        width: "100%",
                        padding: 10,
                        borderRadius: 10,
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: 22,
                        marginBottom: 5,
                      }}
                      leading={() => (
                        <MaterialCommunityIcons
                          name="account-circle"
                          size={24}
                          color="black"
                        />
                      )}
                      onChangeText={(text) => editarEmpleado.password(text)}
                    />
                    <TextInput
                      placeholder="Repetir contrase??a"
                      style={{
                        borderWidth: 0.5,
                        width: "100%",
                        padding: 10,
                        borderRadius: 10,
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: 22,
                        marginBottom: 5,
                      }}
                      leading={() => (
                        <MaterialCommunityIcons
                          name="account-circle"
                          size={24}
                          color="black"
                        />
                      )}
                      onChangeText={(text) => setRePassword(text)}
                    /> */}
                      <Picker
                        style={{
                          width: "100%",
                          borderRadius: 20,
                          borderWidth: 0.3,
                          backgroundColor: "#EBEBEB",
                          marginBottom: 20,
                        }}
                        selectedValue={pickCategoryEdit}
                        onValueChange={(itemValue, itemIndex) =>
                          setPickCategoryEdit(itemValue)
                        }
                      >
                        <Picker.Item
                          label={editarEmpleado.rango}
                          value={editarEmpleado.rango}
                        />
                        <Picker.Item label="Empleado" value="Empleado" />
                        <Picker.Item label="Limpieza" value="Limpieza" />
                        <Picker.Item label="RRPP" value="RRPP" />
                        <Picker.Item label="Portero" value="Portero" />
                        <Picker.Item
                          label="Mantenimiento"
                          value="Mantenimiento"
                        />
                        <Picker.Item label="DJ" value="DJ" />
                        <Picker.Item label="Bandeja" value="Bandeja" />
                        <Picker.Item label="Cachimbero" value="Cachimbero" />
                        <Picker.Item
                          label="Camarero barra"
                          value="Camarero barra"
                        />
                        <Picker.Item label="Encargado" value="Encargado" />
                        <Picker.Item
                          label="Administrador"
                          value="Administrador"
                        />
                      </Picker>
                      <Button
                        title="Editar empleado"
                        onPress={() => {
                          handleEditarEmpleado();
                        }}
                      />
                      <Button
                        style={{ marginTop: 10, backgroundColor: "red" }}
                        title="Cancelar"
                        onPress={() => {
                          setEditarEmpleado(null);
                        }}
                      />
                    </View>
                  )}
                </View>
              </View>
            </ScrollView>
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
  export default GestionEmpleadosScreen;
  