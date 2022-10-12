import React from "react";
import { store } from "./app/store";
import { Provider } from "react-redux";
import MyStackNavigator from "./components/MyStackNavigator";
import { View, Platform, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import "react-native-gesture-handler";
import { getStatusBarHeight } from "react-native-status-bar-height";
import CrearComanda from "./screens/CrearComandav2";
import Toast from "react-native-toast-message";
import {toastConfig} from './components/toastConfig'
const App = () => {

  console.log(Platform.OS);
  return (
    <Provider store={store}>
      <View style={{ flex: 1, backgroundColor: "black" }}>
        <View style={{ flex: 1, marginTop: getStatusBarHeight() }}>
          <StatusBar style="light" />
          {Platform.OS !== "web" ? (
            <>
              <MyStackNavigator />
              <Toast config={toastConfig}/>
            </>
          ) : (
            <CrearComanda />
          )}
        </View>
      </View>
    </Provider>
  );
};

export default App;
