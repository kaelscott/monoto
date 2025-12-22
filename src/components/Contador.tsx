import { useState } from "react";

function Contador() {
    const [contador, setContador] = useState(0)
    return (
        <div>
            <button onClick={() => { setContador(contador + 1) }}>+1</button>
            <h1>{contador}</h1>
        </div>
    )
}

export default Contador;    
