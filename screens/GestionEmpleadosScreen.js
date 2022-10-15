import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import { Root, Popup } from "react-native-popup-confirm-toast";

import fondo from "../assets/fondoScreen.jpg";
import BotonHome from "../components/BotonHome";
import Toast from "react-native-toast-message";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  TouchableOpacity,
} from "@gorhom/bottom-sheet";
import { Button } from "@react-native-material/core";
import { MaterialCommunityIcons, Fontisto } from "@expo/vector-icons";
import { addEmpleado, deleteEmpleado, getEmpleados, URL } from "../api";

const GestionEmpleadosScreen = ({ navigation }) => {
  const [empleados, setEmpleados] = useState([]);
  const [pickCategory, setPickCategory] = useState("Empleado");
  const [crearEmpleado, setCrearEmpleado] = useState(false);
  const bottomSheetModalRef = useRef(null);
  const snapPoints = ["50%", "100%"];
  const [nombreEmpleado, setnombreEmpleado] = useState("");
  const [apellidosEmpleado, setApellidosEmpleado] = useState("");
  const [emailEmpleado, setEmailEmpleado] = useState("");
  const [dniEmpleado, setDniEmpleado] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [rangoAdmin, setRangoAdmin] = useState([]);
  const [rangoEncargado, setRangoEncargado] = useState([]);
  const [rangoCamareroBarra, setRangoCamareroBarra] = useState([]);
  const [rangoBandeja, setRangoBandeja] = useState([]);
  const [rangoDj, setRangoDj] = useState([]);
  const [rangoMantenimiento, setRangoMantenimiento] = useState([]);
  const [rangoPortero, setRangoPortero] = useState([]);
  const [rangoRrpp, setRangoRrpp] = useState([]);
  const [rangoLimpieza, setRangoLimpieza] = useState([]);
  const [rangoEmpleado, setRangoEmpleado] = useState([]);
  const loadEmpleados = async () => {
    const data = await getEmpleados();
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
  };
  useEffect(() => {
    loadEmpleados();
    return () => {};
  }, []);
  function handlePresentModal() {
    bottomSheetModalRef.current?.present();
  }
  const handleCrearEmpleado = async () => {
    const newEmpleado = {
      nombre: nombreEmpleado,
      apellidos: apellidosEmpleado,
      email: emailEmpleado,
      password,
      repassword: rePassword,
      dni: dniEmpleado,
      rango: pickCategory,
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
      bottomSheetModalRef.current?.dismiss();
      return Toast.show({
        type: "success",
        text1: "Empleado agregado",
        position: "top",
        visibilityTime: 1800,
      });
    }

    // console.log('first')
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
                <Button
                  title="Crear Empleado"
                  onPress={() => {
                    handlePresentModal();
                    setCrearEmpleado(true);
                  }}
                />
                <ScrollView>
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
                    {rangoAdmin.map((empleado, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          Popup.show({
                            type: "confirm",
                            title: "¿Eliminar empleado?",
                            textBody: "",
                            buttonText: "Si",
                            confirmText: "No",
                            callback: () => {
                              deleteEmpleado(empleado._id);
                              setEmpleados(
                                empleados.filter(
                                  (element) => element._id != empleado._id
                                )
                              );
                              Toast.show({
                                type: "error",
                                text1: "Empleado eliminado",
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
                        <View
                          style={{
                            margin: 3,
                            borderRadius: 15,
                            borderWidth: 0.5,
                            padding: 10,
                            alignItems: "center",
                            backgroundColor: "white",
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
                          <Image
                            source={{ uri: `${URL}${empleado.foto}` }}
                            style={{
                              height: 60,
                              width: 60,
                              borderRadius: 50,
                              borderWidth: 0.3,
                            }}
                          />
                          <Text>{empleado.nombre}</Text>
                          <Text>{empleado.apellidos}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                    {rangoAdmin.length == 0 &&(<Text>Nadie en esta categoria</Text>)}
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
                    {rangoEncargado.map((empleado, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          Popup.show({
                            type: "confirm",
                            title: "¿Eliminar empleado?",
                            textBody: "",
                            buttonText: "Si",
                            confirmText: "No",
                            callback: () => {
                              deleteEmpleado(empleado._id);
                              setEmpleados(
                                empleados.filter(
                                  (element) => element._id != empleado._id
                                )
                              );
                              Toast.show({
                                type: "error",
                                text1: "Empleado eliminado",
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
                        <View
                          style={{
                            margin: 3,
                            borderRadius: 15,
                            borderWidth: 0.5,
                            padding: 10,
                            alignItems: "center",
                            backgroundColor: "white",
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
                          <Image
                            source={{ uri: `${URL}${empleado.foto}` }}
                            style={{
                              height: 60,
                              width: 60,
                              borderRadius: 50,
                              borderWidth: 0.3,
                            }}
                          />
                          <Text>{empleado.nombre}</Text>
                          <Text>{empleado.apellidos}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                    {rangoEncargado.length == 0 &&(<Text>Nadie en esta categoria</Text>)}
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
                    {rangoCamareroBarra.map((empleado, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          Popup.show({
                            type: "confirm",
                            title: "¿Eliminar empleado?",
                            textBody: "",
                            buttonText: "Si",
                            confirmText: "No",
                            callback: () => {
                              deleteEmpleado(empleado._id);
                              setEmpleados(
                                empleados.filter(
                                  (element) => element._id != empleado._id
                                )
                              );
                              Toast.show({
                                type: "error",
                                text1: "Empleado eliminado",
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
                        <View
                          style={{
                            margin: 3,
                            borderRadius: 15,
                            borderWidth: 0.5,
                            padding: 10,
                            alignItems: "center",
                            backgroundColor: "white",
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
                          <Image
                            source={{ uri: `${URL}${empleado.foto}` }}
                            style={{
                              height: 60,
                              width: 60,
                              borderRadius: 50,
                              borderWidth: 0.3,
                            }}
                          />
                          <Text>{empleado.nombre}</Text>
                          <Text>{empleado.apellidos}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                    {rangoCamareroBarra.length == 0 &&(<Text>Nadie en esta categoria</Text>)}
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
                    {rangoBandeja.map((empleado, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          Popup.show({
                            type: "confirm",
                            title: "¿Eliminar empleado?",
                            textBody: "",
                            buttonText: "Si",
                            confirmText: "No",
                            callback: () => {
                              deleteEmpleado(empleado._id);
                              setEmpleados(
                                empleados.filter(
                                  (element) => element._id != empleado._id
                                )
                              );
                              Toast.show({
                                type: "error",
                                text1: "Empleado eliminado",
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
                        <View
                          style={{
                            margin: 3,
                            borderRadius: 15,
                            borderWidth: 0.5,
                            padding: 10,
                            alignItems: "center",
                            backgroundColor: "white",
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
                          <Image
                            source={{ uri: `${URL}${empleado.foto}` }}
                            style={{
                              height: 60,
                              width: 60,
                              borderRadius: 50,
                              borderWidth: 0.3,
                            }}
                          />
                          <Text>{empleado.nombre}</Text>
                          <Text>{empleado.apellidos}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                    {rangoBandeja.length == 0 &&(<Text>Nadie en esta categoria</Text>)}
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
                    {rangoDj.map((empleado, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          Popup.show({
                            type: "confirm",
                            title: "¿Eliminar empleado?",
                            textBody: "",
                            buttonText: "Si",
                            confirmText: "No",
                            callback: () => {
                              deleteEmpleado(empleado._id);
                              setEmpleados(
                                empleados.filter(
                                  (element) => element._id != empleado._id
                                )
                              );
                              Toast.show({
                                type: "error",
                                text1: "Empleado eliminado",
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
                        <View
                          style={{
                            margin: 3,
                            borderRadius: 15,
                            borderWidth: 0.5,
                            padding: 10,
                            alignItems: "center",
                            backgroundColor: "white",
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
                          <Image
                            source={{ uri: `${URL}${empleado.foto}` }}
                            style={{
                              height: 60,
                              width: 60,
                              borderRadius: 50,
                              borderWidth: 0.3,
                            }}
                          />
                          <Text>{empleado.nombre}</Text>
                          <Text>{empleado.apellidos}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                    {rangoDj.length == 0 &&(<Text>Nadie en esta categoria</Text>)}
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
                    {rangoRrpp.map((empleado, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          Popup.show({
                            type: "confirm",
                            title: "¿Eliminar empleado?",
                            textBody: "",
                            buttonText: "Si",
                            confirmText: "No",
                            callback: () => {
                              deleteEmpleado(empleado._id);
                              setEmpleados(
                                empleados.filter(
                                  (element) => element._id != empleado._id
                                )
                              );
                              Toast.show({
                                type: "error",
                                text1: "Empleado eliminado",
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
                        <View
                          style={{
                            margin: 3,
                            borderRadius: 15,
                            borderWidth: 0.5,
                            padding: 10,
                            alignItems: "center",
                            backgroundColor: "white",
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
                          <Image
                            source={{ uri: `${URL}${empleado.foto}` }}
                            style={{
                              height: 60,
                              width: 60,
                              borderRadius: 50,
                              borderWidth: 0.3,
                            }}
                          />
                          <Text>{empleado.nombre}</Text>
                          <Text>{empleado.apellidos}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                    {rangoRrpp.length == 0 &&(<Text>Nadie en esta categoria</Text>)}
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
                    {rangoMantenimiento.map((empleado, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          Popup.show({
                            type: "confirm",
                            title: "¿Eliminar empleado?",
                            textBody: "",
                            buttonText: "Si",
                            confirmText: "No",
                            callback: () => {
                              deleteEmpleado(empleado._id);
                              setEmpleados(
                                empleados.filter(
                                  (element) => element._id != empleado._id
                                )
                              );
                              Toast.show({
                                type: "error",
                                text1: "Empleado eliminado",
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
                        <View
                          style={{
                            margin: 3,
                            borderRadius: 15,
                            borderWidth: 0.5,
                            padding: 10,
                            alignItems: "center",
                            backgroundColor: "white",
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
                          <Image
                            source={{ uri: `${URL}${empleado.foto}` }}
                            style={{
                              height: 60,
                              width: 60,
                              borderRadius: 50,
                              borderWidth: 0.3,
                            }}
                          />
                          <Text>{empleado.nombre}</Text>
                          <Text>{empleado.apellidos}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                    {rangoMantenimiento.length == 0 &&(<Text>Nadie en esta categoria</Text>)}
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
                    {rangoPortero.map((empleado, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          Popup.show({
                            type: "confirm",
                            title: "¿Eliminar empleado?",
                            textBody: "",
                            buttonText: "Si",
                            confirmText: "No",
                            callback: () => {
                              deleteEmpleado(empleado._id);
                              setEmpleados(
                                empleados.filter(
                                  (element) => element._id != empleado._id
                                )
                              );
                              Toast.show({
                                type: "error",
                                text1: "Empleado eliminado",
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
                        <View
                          style={{
                            margin: 3,
                            borderRadius: 15,
                            borderWidth: 0.5,
                            padding: 10,
                            alignItems: "center",
                            backgroundColor: "white",
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
                          <Image
                            source={{ uri: `${URL}${empleado.foto}` }}
                            style={{
                              height: 60,
                              width: 60,
                              borderRadius: 50,
                              borderWidth: 0.3,
                            }}
                          />
                          <Text>{empleado.nombre}</Text>
                          <Text>{empleado.apellidos}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                    {rangoPortero.length == 0 &&(<Text>Nadie en esta categoria</Text>)}
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
                    {rangoLimpieza.map((empleado, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          Popup.show({
                            type: "confirm",
                            title: "¿Eliminar empleado?",
                            textBody: "",
                            buttonText: "Si",
                            confirmText: "No",
                            callback: () => {
                              deleteEmpleado(empleado._id);
                              setEmpleados(
                                empleados.filter(
                                  (element) => element._id != empleado._id
                                )
                              );
                              Toast.show({
                                type: "error",
                                text1: "Empleado eliminado",
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
                        <View
                          style={{
                            margin: 3,
                            borderRadius: 15,
                            borderWidth: 0.5,
                            padding: 10,
                            alignItems: "center",
                            backgroundColor: "white",
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
                          <Image
                            source={{ uri: `${URL}${empleado.foto}` }}
                            style={{
                              height: 60,
                              width: 60,
                              borderRadius: 50,
                              borderWidth: 0.3,
                            }}
                          />
                          <Text>{empleado.nombre}</Text>
                          <Text>{empleado.apellidos}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                    {rangoLimpieza.length == 0 &&(<Text>Nadie en esta categoria</Text>)}

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
                    {rangoEmpleado.map((empleado, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          Popup.show({
                            type: "confirm",
                            title: "¿Eliminar empleado?",
                            textBody: "",
                            buttonText: "Si",
                            confirmText: "No",
                            callback: () => {
                              deleteEmpleado(empleado._id);
                              setEmpleados(
                                empleados.filter(
                                  (element) => element._id != empleado._id
                                )
                              );
                              Toast.show({
                                type: "error",
                                text1: "Empleado eliminado",
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
                        <View
                          style={{
                            margin: 3,
                            borderRadius: 15,
                            borderWidth: 0.5,
                            padding: 10,
                            alignItems: "center",
                            backgroundColor: "white",
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
                          <Image
                            source={{ uri: `${URL}${empleado.foto}` }}
                            style={{
                              height: 60,
                              width: 60,
                              borderRadius: 50,
                              borderWidth: 0.3,
                            }}
                          />
                          <Text>{empleado.nombre}</Text>
                          <Text>{empleado.apellidos}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                    {rangoEmpleado.length == 0 &&(<Text>Nadie en esta categoria</Text>)}
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
                    {empleados.map((empleado, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          Popup.show({
                            type: "confirm",
                            title: "¿Eliminar empleado?",
                            textBody: "",
                            buttonText: "Si",
                            confirmText: "No",
                            callback: () => {
                              deleteEmpleado(empleado._id);
                              setEmpleados(
                                empleados.filter(
                                  (element) => element._id != empleado._id
                                )
                              );
                              Toast.show({
                                type: "error",
                                text1: "Empleado eliminado",
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
                        <View
                          style={{
                            margin: 3,
                            borderRadius: 15,
                            borderWidth: 0.5,
                            padding: 10,
                            alignItems: "center",
                            backgroundColor: "white",
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
                          <Image
                            source={{ uri: `${URL}${empleado.foto}` }}
                            style={{
                              height: 60,
                              width: 60,
                              borderRadius: 50,
                              borderWidth: 0.3,
                            }}
                          />
                          <Text>{empleado.nombre}</Text>
                          <Text>{empleado.apellidos}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}

                  </View>

                </ScrollView>
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
                    placeholder="Contraseña"
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
                    placeholder="Repetir contraseña"
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
                    <Picker.Item label="Mantenimiento" value="Mantenimiento" />
                    <Picker.Item label="DJ" value="DJ" />
                    <Picker.Item label="Bandeja" value="Bandeja" />
                    <Picker.Item
                      label="Camarero barra"
                      value="Camarero barra"
                    />
                    <Picker.Item label="Encargado" value="Encargado" />
                    <Picker.Item label="Administrador" value="Administrador" />
                  </Picker>
                  <Button
                    title="Crear Empleado"
                    onPress={() => {
                      handleCrearEmpleado();
                    }}
                  />
                </View>
              )}
            </View>
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
export default GestionEmpleadosScreen;
