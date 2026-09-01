import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { useNotasStore } from "../stores/useNotasStore";
import { salvarConteudoNota } from "../banco";
import BarraFlutuante from "./BarraFlutuante";

/*
  Editor.jsx
  Área de escrita, usando a biblioteca TipTap (editor de texto rico).

  COMO O TIPTAP FUNCIONA AQUI (resumo):
  - useEditor(config, deps) cria um "editor" com as extensões escolhidas.
  - StarterKit já traz negrito, itálico, títulos, listas, etc.
  - Placeholder mostra um texto cinza quando a nota está vazia.
  - CharacterCount conta palavras e caracteres (usamos no rodapé).
  - EditorContent é onde o texto aparece na tela.
  - a barra que flutua ao selecionar texto fica em BarraFlutuante.jsx.

  Passamos [notaAtivaId] como dependência do useEditor. Assim, quando
  você troca de nota, o editor é RECRIADO já com o conteúdo certo — sem
  truques para "trocar o texto por dentro".

  O texto NÃO é salvo sozinho: quem salva é o Ctrl+S (ver ADR-008).
*/

// --- pedaços em volta do texto ---

// Campo da tag, no topo da nota. A tag é texto livre: serve para
// agrupar notas do mesmo assunto na barra lateral.
function CampoTag({ nota, definirTag }) {
  return (
    <input
      className="w-full bg-transparent pb-2 text-xs text-texto-2 placeholder:text-texto-3 focus:text-texto focus:outline-none"
      placeholder="sem tag"
      value={nota.tag}
      onChange={(evento) => definirTag(nota.id, evento.target.value)}
    />
  );
}

// Rodapé com a contagem de palavras e o aviso de texto não salvo.
function Rodape({ editor, naoSalvo }) {
  const palavras = editor.storage.characterCount.words();
  const caracteres = editor.storage.characterCount.characters();

  return (
    <div className="flex justify-end gap-3 pt-3 text-xs text-texto-3">
      <span>
        {palavras} palavras · {caracteres} caracteres
      </span>

      {naoSalvo && (
        <span className="text-texto-2" title="Não salvo — use Ctrl+S">
          ● não salvo
        </span>
      )}
    </div>
  );
}

// --- o editor em si ---
export default function Editor() {
  const notaAtivaId = useNotasStore((e) => e.notaAtivaId);
  const notas = useNotasStore((e) => e.notas);
  const atualizarConteudo = useNotasStore((e) => e.atualizarConteudo);
  const definirTag = useNotasStore((e) => e.definirTag);

  // true quando o texto mudou e ainda não foi gravado no banco
  const [naoSalvo, setNaoSalvo] = useState(false);

  // acha a nota que está aberta agora
  let nota = null;
  for (const item of notas) {
    if (item.id === notaAtivaId) {
      nota = item;
    }
  }

  // o texto que o editor mostra ao abrir
  let textoInicial = "";
  if (nota !== null) {
    textoInicial = nota.conteudo;
  }

  // ao trocar de nota, o aviso zera: a nota que abriu está igual ao banco
  useEffect(() => {
    setNaoSalvo(false);
  }, [notaAtivaId]);

  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        Placeholder.configure({ placeholder: "Comece a escrever..." }),
        CharacterCount,
      ],
      content: textoInicial,
      onUpdate: ({ editor }) => {
        if (notaAtivaId === null) {
          return;
        }
        // guarda o texto só na memória, para o título e o contador
        // acompanharem enquanto se digita. Gravar no banco é o Ctrl+S.
        atualizarConteudo(notaAtivaId, editor.getHTML());
        setNaoSalvo(true);
      },
    },
    [notaAtivaId] // recria o editor quando a nota muda
  );

  // Ctrl+S grava a nota aberta no banco
  useEffect(() => {
    async function aoTeclar(evento) {
      const comCtrl = evento.ctrlKey || evento.metaKey;
      const teclaS = evento.key.toLowerCase() === "s";

      if (!comCtrl || !teclaS) {
        return;
      }

      evento.preventDefault(); // o navegador tentaria "salvar a página"

      if (editor === null || notaAtivaId === null) {
        return;
      }

      try {
        await salvarConteudoNota(notaAtivaId, editor.getHTML());
        setNaoSalvo(false);
      } catch (erro) {
        console.error("Falha ao salvar a nota:", erro);
      }
    }

    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [editor, notaAtivaId]);

  if (editor === null) {
    return null; // o editor ainda está montando
  }

  // clicar na área vazia (fora do texto) leva o cursor para o fim
  function focarNoFim(evento) {
    if (evento.target === evento.currentTarget) {
      editor.chain().focus("end").run();
    }
  }

  return (
    <div
      className="mx-auto flex h-full max-w-texto cursor-text flex-col px-12 py-8"
      onClick={focarNoFim}
    >
      <BarraFlutuante editor={editor} />

      {nota !== null && <CampoTag nota={nota} definirTag={definirTag} />}

      <EditorContent editor={editor} className="flex-1" />

      <Rodape editor={editor} naoSalvo={naoSalvo} />
    </div>
  );
}
