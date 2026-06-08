import { useEffect } from "react";
import Sidebar from "./componentes/Sidebar";
import Editor from "./componentes/Editor";
import CommandPalette from "./componentes/CommandPalette";
import Configuracoes from "./componentes/Configuracoes";
import Toasts from "./componentes/Toasts";
import { useUiStore } from "./stores/useUiStore";
import { useNotasStore } from "./stores/useNotasStore";
import { iniciarBanco } from "./banco";
import estilos from "./estilos/App.module.css";

/*
  App.jsx
  Monta o layout (sidebar + editor) e os "overlays" que ficam por cima
  (command palette, configurações e toasts). Também cuida de duas coisas
  globais: aplicar a aparência (fonte/opacidade) e o atalho Ctrl+K.
*/
export default function App() {
  const tamanhoFonte = useUiStore((e) => e.tamanhoFonte);
  const opacidade = useUiStore((e) => e.opacidade);
  const alternarPalette = useUiStore((e) => e.alternarPalette);
  const carregar = useNotasStore((e) => e.carregar);

  // no boot: abre o banco, garante tabelas/dados e carrega pastas e notas
  useEffect(() => {
    iniciarBanco()
      .then(({ pastas, notas }) => carregar(pastas, notas))
      .catch((erro) => console.error("Falha ao iniciar o banco:", erro));
  }, [carregar]);

  // aplica fonte e opacidade nas variáveis CSS sempre que mudarem
  useEffect(() => {
    const raiz = document.documentElement;
    raiz.style.setProperty("--tamanho-fonte", `${tamanhoFonte}px`);
    raiz.style.setProperty("--opacidade", String(opacidade));
  }, [tamanhoFonte, opacidade]);

  // atalho Ctrl+K (ou Cmd+K no Mac) abre/fecha o command palette
  useEffect(() => {
    function aoTeclar(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        alternarPalette();
      }
    }
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [alternarPalette]);

  return (
    <div className={estilos.app}>
      <Sidebar />
      <main className={estilos.editor}>
        <Editor />
      </main>

      {/* overlays: aparecem por cima quando abertos */}
      <CommandPalette />
      <Configuracoes />
      <Toasts />
    </div>
  );
}
