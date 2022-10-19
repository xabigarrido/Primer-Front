import React, { Suspense } from "react";
import { ScrollView } from "react-native";
import useSWR from "swr";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from "react-native";

export default function List() {
  const { data } = useSWR("http://192.168.0.14:4000/api/empleados");
  console.log(data);

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 100,
        }}
      >
        {data.map((user, index) => (
          <View style={styles.cardContainer}>
            <Image
              style={styles.image}
              source={{
                uri: `http://192.168.0.14:4000/${user.foto}`,
              }}
            />
            <Text style={styles.title}>{user.nombre}</Text>
            <TouchableOpacity style={styles.button}>
              <Text style={{ color: "white", fontWeight: "bold" }}>Meet</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  cardContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#00000030",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    alignSelf: "center",
    marginBottom: 30,
  },
  title: {
    color: "#181818",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 15,
  },
  image: {
    width: "100%",
    height: 230,
    borderRadius: 6,
  },
  button: {
    backgroundColor: "#000",
    width: "100%",
    height: 35,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
});
