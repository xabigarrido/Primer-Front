import { Alert } from "react-native";

export const API = "http://192.168.0.14:4000/api";
export const URL = "http://192.168.0.14:4000/"

export const changeInfoUser = async (id, action) => {
  try {
    await fetch(`${API}/empleados/changeInfo/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tikado: action }),
    });
    console.log(id, action);
  } catch (error) {
    console.log(error);
  }
};

export const entradaTikada = async (action) => {
  try {
    const entrada = await fetch(`${API}/tikada/entrada`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(action),
    });
  } catch (error) {
    console.log(error);
  }
};

export const salidaTikada = async (id, action) => {
  try {
    const salida = await fetch(`${API}/tikada/salida/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(action),
    });
  } catch (error) {
    console.log(error);
  }
};

export const addToken = async (pushToken) => {
  try {
    await fetch(`${API}/notification/addToken`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pushToken),
    });
    return;
  } catch (error) {
    console.log(error);
  }
};

export const getProducts = async () => {
  try {
    const data = await fetch(`${API}/products`);
    const res = await data.json();
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const addComanda = async (newComanda) => {
  try {
    const add = await fetch(`${API}/comandas/addComanda`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newComanda),
    });
    return;
  } catch (error) {
    console.log(error);
  }
};

export const addMesa = async (numero) => {
  try {
    const mesa = { numeroMesa: numero, zona: "terraza" };
    const add = await fetch(`${API}/mesas/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mesa),
    });
    const data = await add.json();
    console.log(data);
    if (data.msg) {
      Alert.alert(data.msg);
    }
  } catch (error) {
    console.log(error);
  }
};

export const getMesas = async () => {
  try {
    const data = await fetch(`${API}/mesas`);
    return await data.json();
  } catch (error) {

    console.log(error);

  }
};

export const getMesa = async (id) => {
  try {
    const data = await fetch(`${API}/mesas/idMesa/${id}`);
    return await data.json();
  } catch (error) {
    console.log(error);
  }
};

export const getComanda = async (id) => {
  try {
    const data = await fetch(`${API}/comandas/getcomanda/${id}`);
    return await data.json();
  } catch (error) {
    console.log(error);
  }
};
