import { Alert } from "react-native";
import Toast from "react-native-toast-message";

// export const API = "http://192.168.0.14:4000/api";
// export const URL = "http://192.168.0.14:4000/";
export const API = "https://lapiconera.herokuapp.com/api"
export const URL = "https://lapiconera.herokuapp.com/";

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
  const dataMesa = {
    cantidad: newComanda.contenido.length,
    idMesa: newComanda.idMesa,
  };
  try {
    const add = await fetch(`${API}/comandas/addComanda`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newComanda),
    });
    const addComandaMesaNumber = await fetch(`${API}/mesas/addcomandasmesa`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataMesa),
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
      return Alert.alert(data.msg);
    }
    Toast.show({
      type: "success",
      text1: "Mesa agregada",
      position: "top",
      visibilityTime: 1800,
    });
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
export const getComandas = async () => {
  try {
    const data = await fetch(`${API}/comandas/`);
    return await data.json();
  } catch (error) {
    console.log(error);
  }
};
export const handleChangePagar = async (id) => {
  try {
    await fetch(`${API}/comandas/updatePagaIndi/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  } catch (error) {
    console.log(error);
  }
};

export const handlePagadoFetch = async (idMesa, idComanda, idPrecisa) => {
  const datos = `${idMesa},${idComanda},${idPrecisa}`;
  try {
    const salida = await fetch(`${API}/comandas/handlePagado/${datos}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error);
  }
};

export const handlecobrarTodoFetch = async (idMesa) => {
  try {
    const salida = await fetch(`${API}/comandas/handleCobrarTodo/${idMesa}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error);
  }
};

export const handleAbrirCaja = async (nombreCompleto) => {
  try {
    await fetch(`${API}/cajaActual/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ abiertaPor: nombreCompleto }),
    });
  } catch (error) {
    console.log(error);
  }
};

export const handleCerrarCaja = async (nombreCompleto) => {
  try {
    await fetch(`${API}/cajaActual/cerrarCaja`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombreCompleto }),
    });
  } catch (error) {
    console.log(error);
  }
};

export const isCajaOpen = async () => {
  try {
    const data = await fetch(`${API}/CajaActual`);
    return await data.json();
  } catch (error) {
    console.log(error);
  }
};

export const addComandaCaja = async (comandas, precio) => {
  try {
    await fetch(`${API}/cajaActual/addComanda`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comandas: comandas, precio }),
    });
  } catch (error) {
    console.log(error);
  }
};
export const addComandaCajaIndi = async (comandas, precio) => {
  try {
    await fetch(`${API}/cajaActual/addComandaIndi`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comandas: comandas, precio }),
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCajasFinales = async (req, res) => {
  try {
    const data = await fetch(`${API}/Cajasfinales`);
    return await data.json();
  } catch (error) {
    console.log(error);
  }
};

export const getCajaFinal = async (id) => {
  try {
    const data = await fetch(`${API}/cajasFinales/id/${id}`);
    return await data.json();
  } catch (error) {
    console.log(error);
  }
};

export const deleteComandaCajaNumero = async (idMesa, cantidad) => {
  try {
    await fetch(`${API}/mesas/deleteComandasMesa`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idMesa, cantidad }),
    });
  } catch (error) {
    console.log(error);
  }
};

export const editCopasBotellas = async (payload) => {
  try {
    await fetch(`${API}/empleados/updateCantidadComanda`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.log(error);
  }
};

export const getEmpleados = async () => {
  try {
    const data = await fetch(`${API}/empleados`);
    return await data.json();
  } catch (error) {
    console.log(error);
  }
};

export const getTikadas = async (id) => {
  try {
    const data = await fetch(`${API}/tikada/empleado/${id}`);
    return await data.json()
  } catch (error) {
    console.log(error);
  }
};

export const getEmpleado = async (id)=>{
  try {
    const data = await fetch(`${API}/empleados/user/${id}`)
    return await data.json();
    
  } catch (error) {
    console.log(error)
  }
}