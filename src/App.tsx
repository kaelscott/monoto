import { use, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./index.css";
import Contador from "./components/Contador";
import ListaNotas from "./components/ListaNotas";
import { Header } from "./components/Header";
import { Nota2 } from "./components/Nota2";

interface Nota {
  id: number;
  titulo: string;
  texto: string;
}

function App() {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [tituloInput, setTituloInput] = useState("");
  const [textoInput, setTextoInput] = useState("");

  return (
    <>
      <Nota2 id={1} titulo="penuis" texto="penis" />
      <input type="text" placeholder="Título" />
      <input type="text" placeholder="Digite sua nota" />
    </>
  );
}

export default App;
