import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./index.css";


function App() {
  return (
    // Fundo escuro para destacar o vidro
    <div className="h-screen w-screen bg-gray-900 flex items-center justify-center">
      
      {/* O Cartão de Vidro */}
      <div className="w-96 p-8 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-xl text-white">
        <h1 className="text-2xl font-bold mb-2">Monoto Glass</h1>
        <p className="text-white/70">
          Se você consegue ver este cartão translúcido com fundo borrado, 
          o Tailwind está funcionando perfeitamente.
        </p>
      </div>

    </div>
  );
}

export default App;
