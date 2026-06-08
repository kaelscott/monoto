import { useState } from "react";
import { useUiStore } from "../stores/useUiStore";
import { useNotasStore } from "../stores/useNotasStore";
import { tituloDaNota } from "../util";
import estilos from "../estilos/Sidebar.module.css";

/*
  Sidebar.jsx
  Barra lateral esquerda. Contém o logo, o botão de recolher, a busca,
  o "+ nova nota", a lista de pastas, a lista de notas e o botão de
  configurações. As listas (pastas e notas) ficam neste mesmo arquivo
  como pequenos componentes; se crescerem muito, viram arquivos próprios.
*/

// --- lista de pastas, com o campo inline para criar uma nova ---
function ListaPastas() {
  const pastas = useNotasStore((e) => e.pastas);
  const pastaSelecionadaId = useNotasStore((e) => e.pastaSelecionadaId);
  const selecionarPasta = useNotasStore((e) => e.selecionarPasta);
  const criarPasta = useNotasStore((e) => e.criarPasta);

  // controla o campo inline de "nova pasta"
  const [criando, setCriando] = useState(false);
  const [nome, setNome] = useState("");

  function confirmar() {
    if (nome.trim()) criarPasta(nome.trim());
    setNome("");
    setCriando(false);
  }

  function aoTeclar(e) {
    if (e.key === "Enter") confirmar();
    if (e.key === "Escape") {
      setNome("");
      setCriando(false);
    }
  }

  return (
    <div className={estilos.pastas}>
      <div className={estilos.cabecalhoPastas}>
        <span>PASTAS</span>
        <button
          className={estilos.maisPasta}
          onClick={() => setCriando(true)}
          title="Nova pasta"
        >
          +
        </button>
      </div>

      {criando && (
        <input
          className={estilos.entradaPasta}
          placeholder="nome da pasta"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          onKeyDown={aoTeclar}
          onBlur={confirmar}
          autoFocus
        />
      )}

      {/* filtro "todas" (nenhuma pasta selecionada) */}
      <button
        className={
          pastaSelecionadaId === null
            ? `${estilos.pasta} ${estilos.pastaAtiva}`
            : estilos.pasta
        }
        onClick={() => selecionarPasta(null)}
      >
        todas
      </button>

      {pastas.map((p) => (
        <button
          key={p.id}
          className={
            p.id === pastaSelecionadaId
              ? `${estilos.pasta} ${estilos.pastaAtiva}`
              : estilos.pasta
          }
          onClick={() => selecionarPasta(p.id)}
        >
          {p.nome}
        </button>
      ))}
    </div>
  );
}

// --- lista de notas (filtrada pela pasta selecionada) ---
function ListaNotas() {
  const notas = useNotasStore((e) => e.notas);
  const pastaSelecionadaId = useNotasStore((e) => e.pastaSelecionadaId);
  const notaAtivaId = useNotasStore((e) => e.notaAtivaId);
  const selecionarNota = useNotasStore((e) => e.selecionarNota);

  // sem pasta selecionada (null) mostra todas; senão, só as da pasta
  const visiveis =
    pastaSelecionadaId === null
      ? notas
      : notas.filter((n) => n.pastaId === pastaSelecionadaId);

  return (
    <div className={estilos.notas}>
      {visiveis.map((n) => (
        <button
          key={n.id}
          className={
            n.id === notaAtivaId
              ? `${estilos.nota} ${estilos.notaAtiva}`
              : estilos.nota
          }
          onClick={() => selecionarNota(n.id)}
        >
          {tituloDaNota(n.conteudo)}
        </button>
      ))}
      {visiveis.length === 0 && (
        <span className={estilos.vazio}>Nenhuma nota</span>
      )}
    </div>
  );
}

// --- a sidebar em si ---
export default function Sidebar() {
  const recolhida = useUiStore((e) => e.sidebarRecolhida);
  const alternarSidebar = useUiStore((e) => e.alternarSidebar);
  const abrirPalette = useUiStore((e) => e.abrirPalette);
  const abrirConfig = useUiStore((e) => e.abrirConfig);
  const adicionarToast = useUiStore((e) => e.adicionarToast);
  const criarNota = useNotasStore((e) => e.criarNota);

  async function novaNota() {
    try {
      await criarNota();
      adicionarToast("Nota criada");
    } catch (erro) {
      console.error("Falha ao criar nota:", erro);
      adicionarToast("Erro ao criar nota: " + String(erro));
    }
  }

  return (
    <aside
      className={
        recolhida ? `${estilos.sidebar} ${estilos.recolhida}` : estilos.sidebar
      }
    >
      {/* topo: logo + botão de recolher */}
      <div className={estilos.topo}>
        {!recolhida && <span className={estilos.logo}>monoto</span>}
        <button
          className={estilos.recolher}
          onClick={alternarSidebar}
          title="Recolher/expandir"
        >
          ≡
        </button>
      </div>

      {/* o resto só aparece quando a sidebar está expandida */}
      {!recolhida && (
        <>
          <button className={estilos.busca} onClick={abrirPalette}>
            <span>buscar ação</span>
            <span className={estilos.atalho}>Ctrl K</span>
          </button>

          <button className={estilos.novaNota} onClick={novaNota}>
            + nova nota
          </button>

          <ListaPastas />

          <div className={estilos.divisoria} />

          <ListaNotas />

          <button className={estilos.config} onClick={abrirConfig}>
            configurações
          </button>
        </>
      )}
    </aside>
  );
}
