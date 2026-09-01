import { useUiStore } from "../stores/useUiStore";
import { useNotasStore } from "../stores/useNotasStore";
import { tituloDaNota, confirmarEApagar } from "../util";

/*
  Sidebar.jsx
  Barra lateral esquerda: logo, "+ nova nota", a lista de tags
  (que filtra) e a lista de notas.
  As duas listas ficam neste mesmo arquivo como pequenos componentes;
  se crescerem muito, viram arquivos próprios.
*/

// estilo de um item clicável das listas (tag ou nota).
// O item selecionado é marcado só pelo fundo mais claro.
const ITEM = "w-full truncate rounded px-2 py-1 text-left text-[13px] hover:bg-hover";
const ITEM_ATIVO = "bg-elevado";

// --- lista de tags ---

// Um botão de tag. Fica destacado quando é a tag que filtra a lista.
function BotaoTag({ nome, escolhida, aoClicar }) {
  let classe = ITEM + " text-texto-2";
  if (escolhida) {
    classe = ITEM + " " + ITEM_ATIVO + " text-texto";
  }

  return (
    <button className={classe} onClick={aoClicar}>
      {nome}
    </button>
  );
}

// Monta a lista de tags a partir das tags que as notas já têm.
function ListaTags() {
  const notas = useNotasStore((e) => e.notas);
  const tagSelecionada = useNotasStore((e) => e.tagSelecionada);
  const selecionarTag = useNotasStore((e) => e.selecionarTag);

  // junta as tags das notas sem repetir, ignorando as notas sem tag
  const tags = [];
  for (const nota of notas) {
    if (nota.tag !== "" && !tags.includes(nota.tag)) {
      tags.push(nota.tag);
    }
  }
  tags.sort();

  return (
    <div className="flex flex-col">
      <span className="px-2 py-1 text-[11px] text-texto-3">TAGS</span>

      {/* "todas" = nenhum filtro */}
      <BotaoTag
        nome="todas"
        escolhida={tagSelecionada === null}
        aoClicar={() => selecionarTag(null)}
      />

      {tags.map((tag) => (
        <BotaoTag
          key={tag}
          nome={tag}
          escolhida={tag === tagSelecionada}
          aoClicar={() => selecionarTag(tag)}
        />
      ))}
    </div>
  );
}

// --- lista de notas ---

// Uma linha da lista: o título abre a nota e o × apaga.
// O × só aparece quando o mouse passa por cima (é o que "group" faz).
function LinhaNota({ nota, aberta, aoAbrir, aoApagar }) {
  let fundo = "hover:bg-hover";
  if (aberta) {
    fundo = ITEM_ATIVO;
  }

  return (
    <div className={"group flex items-center rounded " + fundo}>
      <button
        className="min-w-0 flex-1 truncate px-2 py-1 text-left text-[13px] text-texto-lista"
        onClick={aoAbrir}
      >
        {tituloDaNota(nota.conteudo)}
      </button>

      <button
        className="px-2 py-1 text-lg leading-none text-texto-3 opacity-0 hover:text-texto group-hover:opacity-100"
        onClick={aoApagar}
        title="Apagar nota"
      >
        ×
      </button>
    </div>
  );
}

// A lista de notas, filtrada pela tag escolhida.
function ListaNotas() {
  const notas = useNotasStore((e) => e.notas);
  const tagSelecionada = useNotasStore((e) => e.tagSelecionada);
  const notaAtivaId = useNotasStore((e) => e.notaAtivaId);
  const selecionarNota = useNotasStore((e) => e.selecionarNota);
  const apagarNota = useNotasStore((e) => e.apagarNota);

  // pergunta antes de apagar: é uma ação que não dá para desfazer
  function confirmarApagar(nota) {
    const titulo = tituloDaNota(nota.conteudo);
    confirmarEApagar("Apagar a nota " + titulo + "?", () => apagarNota(nota.id));
  }

  // sem tag escolhida (null) mostra todas; senão, só as daquela tag
  const visiveis = [];
  for (const nota of notas) {
    if (tagSelecionada === null || nota.tag === tagSelecionada) {
      visiveis.push(nota);
    }
  }

  if (visiveis.length === 0) {
    return (
      <span className="px-2 py-1 text-[12px] text-texto-3">Nenhuma nota</span>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      {visiveis.map((nota) => (
        <LinhaNota
          key={nota.id}
          nota={nota}
          aberta={nota.id === notaAtivaId}
          aoAbrir={() => selecionarNota(nota.id)}
          aoApagar={() => confirmarApagar(nota)}
        />
      ))}
    </div>
  );
}

// --- a sidebar em si ---
export default function Sidebar() {
  const abrirRegras = useUiStore((e) => e.abrirRegras);
  const criarNota = useNotasStore((e) => e.criarNota);

  async function novaNota() {
    try {
      await criarNota();
    } catch (erro) {
      console.error("Falha ao criar nota:", erro);
    }
  }

  return (
    <aside className="flex w-64 flex-col gap-1 border-r border-borda bg-painel p-2">
      <span className="px-2 py-1 text-[13px] text-texto-2">monoto</span>

      <button
        className="rounded px-2 py-1 text-left text-[13px] text-texto-2 hover:bg-hover hover:text-texto"
        onClick={novaNota}
      >
        + nova nota
      </button>

      <ListaTags />

      <div className="my-1 border-t border-borda" />

      <ListaNotas />

      <button
        className="mt-auto rounded border border-borda px-2 py-1 text-left text-[13px] text-texto-2 hover:text-texto"
        onClick={abrirRegras}
      >
        regras
      </button>
    </aside>
  );
}
