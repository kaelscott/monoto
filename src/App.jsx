import { useEffect, useState } from "react";
import Sidebar from "./componentes/Sidebar";
import Editor from "./componentes/Editor";
import { useNotasStore } from "./stores/useNotasStore";
import { iniciarBanco } from "./banco";
import estilos from "./estilos/App.module.css";

/*
  App.jsx
  Monta o layout: barra lateral com a lista de notas + área do editor.
  Também abre o banco quando o app inicia.
*/
export default function App() {
  const carregar = useNotasStore((e) => e.carregar);
  const [erro, setErro] = useState("");

  // no boot: abre o banco, garante as tabelas e carrega as notas
  useEffect(() => {
    iniciarBanco()
      .then(({ pastas, notas }) => carregar(pastas, notas))
      .catch((problema) => {
        console.error("Falha ao iniciar o banco:", problema);
        setErro("Não foi possível abrir o banco: " + String(problema));
      });
  }, [carregar]);

  return (
    <div className={estilos.app}>
      {/* erro do banco fica na tela até o usuário fechar (ADR-014) */}
      {erro && (
        <div className={estilos.erro}>
          {erro}
          <button onClick={() => setErro("")}>fechar</button>
        </div>
      )}

      <Sidebar />
      <main className={estilos.editor}>
        <Editor />
      </main>
    </div>
  );
}
