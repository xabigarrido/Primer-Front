import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Feather } from "@expo/vector-icons";
const BotonHome = ({ children }) => {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1 }}>
      {children}
      <View style={{ width: "100%", alignItems: "center", marginBottom: 0 }}>
        <TouchableOpacity onPress={() => navigation.navigate("TabScreen")}>
          <View
            style={{
              backgroundColor: "#000000",
              padding: 10,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              width: 100,
              alignItems: "center",
              zIndex: 900000
            }}
          >
            <Feather name="home" size={24} color="white" />
            <Text style={{ color: "white" }}>Inicio</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BotonHome;
