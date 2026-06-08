import { useState, useEffect, useMemo } from "react";
import { useUiStore } from "../stores/useUiStore";
import { useNotasStore } from "../stores/useNotasStore";
import estilos from "../estilos/CommandPalette.module.css";

/*
  CommandPalette.jsx
  Overlay estilo Raycast que abre com Ctrl+K.
  Tem um campo de busca, uma lista de ações e navegação por teclado
  (setas para mover, Enter para executar, Esc para fechar).
*/
export default function CommandPalette() {
  const aberta = useUiStore((e) => e.paletteAberta);
  const fechar = useUiStore((e) => e.fecharPalette);
  const abrirConfig = useUiStore((e) => e.abrirConfig);
  const alternarSidebar = useUiStore((e) => e.alternarSidebar);
  const adicionarToast = useUiStore((e) => e.adicionarToast);
  const criarNota = useNotasStore((e) => e.criarNota);

  const [busca, setBusca] = useState("");
  const [indice, setIndice] = useState(0); // qual ação está destacada

  // lista de ações do palette. useMemo evita recriar a lista a cada render.
  const acoes = useMemo(
    () => [
      {
        id: "nova",
        rotulo: "Nova nota",
        fazer: () => {
          criarNota();
          adicionarToast("Nota criada");
        },
      },
      { id: "config", rotulo: "Abrir configurações", fazer: abrirConfig },
      {
        id: "sidebar",
        rotulo: "Recolher/expandir a barra lateral",
        fazer: alternarSidebar,
      },
    ],
    [criarNota, adicionarToast, abrirConfig, alternarSidebar]
  );

  // filtra as ações pelo texto digitado
  const filtradas = acoes.filter((a) =>
    a.rotulo.toLowerCase().includes(busca.toLowerCase())
  );

  // ao abrir, limpa a busca e a seleção
  useEffect(() => {
    if (aberta) {
      setBusca("");
      setIndice(0);
    }
  }, [aberta]);

  if (!aberta) return null; // fechado: não desenha nada

  function executar(acao) {
    if (!acao) return;
    acao.fazer();
    fechar();
  }

  // teclado: setas movem a seleção, Enter executa, Esc fecha
  function aoTeclar(evento) {
    if (evento.key === "ArrowDown") {
      evento.preventDefault();
      setIndice((i) => Math.min(i + 1, filtradas.length - 1));
    } else if (evento.key === "ArrowUp") {
      evento.preventDefault();
      setIndice((i) => Math.max(i - 1, 0));
    } else if (evento.key === "Enter") {
      evento.preventDefault();
      executar(filtradas[indice]);
    } else if (evento.key === "Escape") {
      fechar();
    }
  }

  return (
    // clicar no fundo escuro fecha; clicar na caixa não (stopPropagation)
    <div className={estilos.fundo} onClick={fechar}>
      <div className={estilos.caixa} onClick={(e) => e.stopPropagation()}>
        <input
          className={estilos.busca}
          placeholder="buscar ação..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          onKeyDown={aoTeclar}
          autoFocus
        />
        <ul className={estilos.lista}>
          {filtradas.map((acao, i) => (
            <li
              key={acao.id}
              className={
                i === indice
                  ? `${estilos.item} ${estilos.selecionado}`
                  : estilos.item
              }
              onMouseEnter={() => setIndice(i)}
              onClick={() => executar(acao)}
            >
              {acao.rotulo}
            </li>
          ))}
          {filtradas.length === 0 && (
            <li className={estilos.vazio}>Nenhuma ação encontrada</li>
          )}
        </ul>
        <div className={estilos.dicas}>
          <span>↑↓ navegar</span>
          <span>↵ executar</span>
          <span>esc fechar</span>
        </div>
      </div>
    </div>
  );
}
