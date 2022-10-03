import { View, Text, Button } from "react-native";
import React, { useEffect, useState } from "react";
import {API} from '../api'

const NotificationScreen = () => {
  const [tokens, setTokens] = useState([]);

  const getTokens = async () => {
    const data = await fetch(`${API}/notification/tokens`);
    const res = await data.json()
    setTokens(res)
  };
  useEffect(() => {
    getTokens();
  }, []);

  const handleSubmit = async () => {
    let tokensArray = []
    tokens.forEach(element => {
      tokensArray.push(element.token)
    })
  
    for(let i = 0; i<tokensArray.length; i++){
      await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: tokensArray[i],
        data: { extraData: "Some data" },
        title: "La piconera",
        body: "Comanda nueva",
      }),
    });
    }
  };
  return (
    <View>
      <Text>NotificationScreen</Text>
      <Button title="Click" onPress={() => handleSubmit()} />
    </View>
  );
};

export default NotificationScreen;
