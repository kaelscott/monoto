import { useEffect, useState } from "react";
import Sidebar from "./componentes/Sidebar";
import Editor from "./componentes/Editor";
import { useNotasStore } from "./stores/useNotasStore";
import { iniciarBanco } from "./banco";

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
      .then(({ notas }) => carregar(notas))
      .catch((problema) => {
        console.error("Falha ao iniciar o banco:", problema);
        setErro("Não foi possível abrir o banco: " + String(problema));
      });
  }, [carregar]);

  return (
    <div className="flex h-full">
      {/* erro do banco fica na tela até o usuário fechar (ADR-014) */}
      {erro && (
        <div className="fixed inset-x-0 top-0 z-30 flex items-center justify-between gap-3 bg-elevado px-4 py-2.5 text-texto">
          {erro}
          <button
            className="rounded border border-borda px-2.5 py-0.5 text-texto-2 hover:text-texto"
            onClick={() => setErro("")}
          >
            fechar
          </button>
        </div>
      )}

      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <Editor />
      </main>
    </div>
  );
}
