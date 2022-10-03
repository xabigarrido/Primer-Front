import { View, Text } from "react-native";
import React,{useState} from "react";
import { useSelector } from "react-redux";

const Button = () => {
  const data = useSelector((state) => state.userStore);
  console.log(data[0].dni)
  return (
    <View>
      <Text>Button</Text>
    </View>
  );
};

export default Button;
