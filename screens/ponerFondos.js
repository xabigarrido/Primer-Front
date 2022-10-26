import fondoPiconera from "../assets/fondoScreen.jpg";
import fondoAntique from "../assets/fondoScreenAntique.png";
import fondoRosso from "../assets/fondoScreenRosso.png";

const [fondoMostrar, setFondoMostrar] = useState(null)


useEffect(()=>{
    if(user.empresa == "6350346b5e2286c0a43467c4"){
      setFondoMostrar(fondoPiconera) 
    }
    if(user.empresa == "635034a45e2286c0a43467c6"){
      setFondoMostrar(fondoAntique) 

    }
    if(user.empresa == "635034ab5e2286c0a43467c8"){
      setFondoMostrar(fondoRosso) 

    }
  },[])


import { useSelector } from "react-redux";
const user = useSelector((state) => state.userStore);
