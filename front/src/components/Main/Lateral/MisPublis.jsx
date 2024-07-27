import { useState } from "react";


function MisPublis() {

    const [contador, setContador] = useState(0);

    const incrementarContador = () => {
        setContador(contador + 1);
        console.log(contador);
      };
    return (
      <>

       <button onClick={incrementarContador}>Incrementar</button>
       <h1>Contador: {contador}</h1>

      </>
    )
  } export default MisPublis;