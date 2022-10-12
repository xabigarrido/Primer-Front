import { View, Text, ImageBackground, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, TextInput } from "@react-native-material/core";
import fondo from "../assets/fondo.png";
import { MaterialCommunityIcons, Fontisto } from "@expo/vector-icons";
import { API } from "../api";
import { useSelector, useDispatch } from "react-redux";
import { addInfoUser } from "../features/userStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import Toast from 'react-native-toast-message';

const LoginScreen = ({ navigation }) => {
  const [asyncData, setAsyncData] = useState(null);
  const dispatch = useDispatch();
  const isFocus = useIsFocused();
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("LoginUser");
      if (value !== null) {
        const res = await fetch(`${API}/empleados/user/${value}`);
        const data = await res.json();
        setAsyncData(data);
        dispatch(addInfoUser(data));
      }
    } catch (e) {
      // error reading value
      console.log(e);
    }
  };
  useEffect(() => {
    getData();
    return () => {
      getData();
    };
  }, [isFocus]);

  const getAsync = () => {
    if (asyncData != null) {
      navigation.navigate("TabScreen");
    }
  };
  useEffect(() => {
    getAsync();
    return () => {
      getAsync();
    };
  }, [asyncData]);

  const dataState = useSelector((state) => state.userStore);
  const image = {
    uri: fondo,
  };
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${API}/empleados/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      if (data[0] === true) {
        setUser({ email: "", password: "" });
        dispatch(addInfoUser(data[1]));
        AsyncStorage.setItem("LoginUser", data[1]._id);
        navigation.navigate("TabScreen");
      } else {
        // alerta incorrecto
        console.log(user);
        return Alert.alert(data[1].message);
      }
    } catch (error) {
      return console.log(error);
    }
  };
  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Producto agregado',
      visibilityTime: 1800,
      position: 'top',
      onPress: ()=>{ console.log('ss')}
    });
  }

  return (
    <ImageBackground
      source={fondo}
      resizeMode="cover"
      style={{ flex: 1, justifyContent: "center" }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 40
        }}
      >
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.62)",
            width: "82%",
            borderRadius: 5,
            alignItems: "center",
          }}
        >
          <TextInput
            placeholder="E-mail o DNI"
            value={user.email}
            style={{ margin: 10, width: "90%" }}
            onChangeText={(value) => setUser({ ...user, email: value })}
            leading={() => (
              <MaterialCommunityIcons
                name="account-circle"
                size={24}
                color="black"
              />
            )}
          />
          <TextInput
            placeholder="Contraseña"
            value={user.password}
            secureTextEntry={true}
            onChangeText={(value) => setUser({ ...user, password: value })}
            style={{ margin: 10, width: "90%" }}
            leading={() => <Fontisto name="locked" size={24} color="black" />}
          />
          <Button
            title="Acceder"
            style={{
              marginBottom: 5,
              width: "90%",
              backgroundColor: "black",
              paddingVertical: 5,
            }}
            onPress={handleSubmit}
          />
   
        </View>
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;
