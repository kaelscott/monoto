import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// estilos globais: o tema (variáveis) vem primeiro, depois o base
import "./estilos/tema.css";
import "./estilos/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
