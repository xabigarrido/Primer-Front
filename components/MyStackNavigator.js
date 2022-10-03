import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import CrearProducto from "../screens/CrearProducto";
import CrearComanda from "../screens/CrearComandav2";
import NotificationScreen from "../screens/NotificationScreen";
import EstadoMesa from "../screens/EstadoMesa";
import MesasScreen from "../screens/MesasScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import TikadaScreen from "../screens/TikadaScreen";
import PickMesasScreen from "../screens/PickMesaScreen";

const MyStackNavigator = () => {
  const MyStack = () => {
    const Stack = createStackNavigator();
    const Tab = createBottomTabNavigator();
    const TabScreen = () => {
      return (
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: {
              backgroundColor: "black",
              position: "absolute",
              borderTopWidth: 0,
              borderTopColor: "black",
              shadowColor: "black",
            },
          }}
        >
          <Tab.Screen
            name="HomeScreen2"
            component={HomeScreen}
            options={{
              headerShown: false,
              tabBarLabel: "Google",
              tabBarIcon: () => (
                <MaterialCommunityIcons name="home" size={24} color="white" />
              ),
            }}
          />
          <Tab.Screen
            name="Pepe"
            component={HomeScreen}
            options={{
              tabBarIcon: () => (
                <MaterialCommunityIcons
                  name="plus-circle"
                  size={24}
                  color="white"
                />
              ),
            }}
          />
        </Tab.Navigator>
      );
    };
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PruebasScreen"
            component={CrearProducto}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EstadoMesaScreen"
            component={EstadoMesa}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ComandaScreen"
            component={CrearComanda}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PickMesaScreen"
            component={PickMesasScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MesasScreen"
            component={MesasScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TabScreen"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TikadaScreen"
            component={TikadaScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  };

  return <MyStack />;
};

export default MyStackNavigator;
