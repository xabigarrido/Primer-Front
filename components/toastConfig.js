import { BaseToast, ErrorToast } from "react-native-toast-message";
import { View, Text, Image } from "react-native";
import {URL} from '../api'

export const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ backgroundColor: "#CEFFBC", borderLeftWidth: 0, width: '90%'}}
      contentContainerStyle={{
        alignContent: "center",
        width: "100%",
      }}
      text1Style={{
        fontSize: 22,
        fontWeight: "400",
        textAlign: 'center'
      }}
      text2Style={{
        fontSize: 21,
      }}
    />
  ),
  /*
      Overwrite 'error' type,
      by modifying the existing `ErrorToast` component
    */
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ backgroundColor: "#FFAEAE", borderLeftWidth: 0, width: '90%'}}
      contentContainerStyle={{
        alignContent: "center",
        width: "100%",
      }}
      text1Style={{
        fontSize: 22,
        fontWeight: "400",
        textAlign: 'center',
      }}
      text2Style={{
        fontSize: 21,
      }}
    />
  ),
  /*
      Or create a completely new type - `tomatoToast`,
      building the layout from scratch.
  
      I can consume any custom `props` I want.
      They will be passed when calling the `show` method (see below)
    */
  entradaTikada: ({ props }) => (
    <View
    style={{
      width: "80%",
      backgroundColor: "#C9FEB8",
      // height: 65,
      borderRadius: 10,
      padding: 10,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 0.17
    }}
  >
    <View style={{flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', alignItems: 'center'}}>
    <Image 
    source={{uri: `${URL}${props.foto}`}}
    style={{width: 45, height: 45, borderRadius: 15,}}
    />
    <View>
    <Text style={{fontWeight: 'bold' }}>{props.nombre} {props.apellidos}</Text>
    <Text style={{fontWeight: '400' }}>ha entrado a trabajar</Text>
    </View>
    </View>

  </View>
  ),
  salidaTikada: ({ props }) => (
    <View
    style={{
      width: "80%",
      backgroundColor: "#FEB8B8",
      // height: 65,
      borderRadius: 10,
      padding: 10,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 0.17
    }}
  >
    <View style={{flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', alignItems: 'center'}}>
    <Image 
    source={{uri: `${URL}${props.foto}`}}
    style={{width: 45, height: 45, borderRadius: 15,}}
    />
    <View>
    <Text style={{fontWeight: 'bold' }}>{props.nombre} {props.apellidos}</Text>
    <Text style={{fontWeight: '400' }}>ha salido de trabajar</Text>
    </View>
    </View>

  </View>
  ),
};
