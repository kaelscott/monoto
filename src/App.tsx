import { useState } from "react";
import "./index.css";
import { Editor } from "./components/Editor";
import { Sidebar } from "./components/Sidebar";

function App() {

  const [tituloAtual, setTituloAtual] = useState("");

  return (

    <div className="flex h-screen w-full bg-zinc-900 text-zinc-100 font-sans">
      <Sidebar />

      {/* --- ÁREA PRINCIPAL (Editor) --- */}
      {/* flex-1: Ocupa todo o espaço que sobrar na tela. */}
      <main className="flex-1 flex flex-col h-full bg-zinc-950">
        {/* Cabeçalho da Nota */}
        <header className="h-14 border-b border-zinc-800 flex items-center px-8">
          <input
            type="text"
            className="flex-1 bg-transparent text-xl text-zinc-100 placeholder:text-zinc-600 outline-none"
            placeholder="Título da nota..."
            value={tituloAtual}
            onChange={(e) => setTituloAtual(e.target.value)}
            
          />
        </header>

        <Editor />
      </main>
    </div>
  );
}

export default App;
