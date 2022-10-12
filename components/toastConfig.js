import { BaseToast, ErrorToast } from "react-native-toast-message";
import { View, Text } from "react-native";

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
  tomatoToast: ({ text1, props }) => (
    <View style={{ height: 60, width: "100%", backgroundColor: "tomato" }}>
      <Text>{text1}</Text>
      <Text>{props.uuid}</Text>
    </View>
  ),
};
