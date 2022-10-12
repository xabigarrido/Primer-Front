import { View, Text ,ImageBackground } from 'react-native'
import React from 'react'
import fondo from "../assets/fondoScreen.jpg";
import BotonHome from '../components/BotonHome'
import Toast from 'react-native-toast-message'
const ListaCajasFinales = () => {
    return (
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
                <Text>xxxx</Text>
              </View>
            </View>
          </BotonHome>
        </ImageBackground>
      );
}

export default ListaCajasFinales