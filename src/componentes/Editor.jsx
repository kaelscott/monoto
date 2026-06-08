import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { useNotasStore } from "../stores/useNotasStore";
import estilos from "../estilos/Editor.module.css";

/*
  Editor.jsx
  Área de escrita, usando a biblioteca TipTap (editor de texto rico).

  COMO O TIPTAP FUNCIONA AQUI (resumo):
  - useEditor(config, deps) cria um "editor" com as extensões que escolhemos.
  - StarterKit já traz negrito, itálico, títulos, listas, etc.
  - Placeholder mostra um texto cinza quando a nota está vazia.
  - CharacterCount conta palavras/caracteres (usamos no rodapé).
  - EditorContent é onde o texto aparece na tela.
  - BubbleMenu é a barra que flutua quando você seleciona um texto.

  O segredo da simplicidade: passamos [notaAtivaId] como dependência do
  useEditor. Assim, quando você troca de nota, o editor é RECRIADO já com o
  conteúdo certo — sem truques para "trocar o texto por dentro".
*/

// Um botão da barra flutuante. "ativo" deixa em destaque quando o estilo
// já está aplicado no texto selecionado (ex.: negrito ligado).
function BotaoBarra({ titulo, aoClicar, ativo, children }) {
  return (
    <button
      type="button"
      title={titulo}
      onMouseDown={(e) => e.preventDefault()} // não perde a seleção do texto
      onClick={aoClicar}
      className={ativo ? `${estilos.botaoBarra} ${estilos.ativo}` : estilos.botaoBarra}
    >
      {children}
    </button>
  );
}

// A barra flutuante (bubble menu) com os botões de formatação.
function BarraFlutuante({ editor }) {
  return (
    <BubbleMenu editor={editor} className={estilos.barra} tippyOptions={{ duration: 120 }}>
      <BotaoBarra titulo="Negrito" ativo={editor.isActive("bold")} aoClicar={() => editor.chain().focus().toggleBold().run()}>N</BotaoBarra>
      <BotaoBarra titulo="Itálico" ativo={editor.isActive("italic")} aoClicar={() => editor.chain().focus().toggleItalic().run()}>i</BotaoBarra>
      <BotaoBarra titulo="Tachado" ativo={editor.isActive("strike")} aoClicar={() => editor.chain().focus().toggleStrike().run()}>S</BotaoBarra>
      <BotaoBarra titulo="Código" ativo={editor.isActive("code")} aoClicar={() => editor.chain().focus().toggleCode().run()}>{"</>"}</BotaoBarra>
      <span className={estilos.separador} />
      <BotaoBarra titulo="Título 1" ativo={editor.isActive("heading", { level: 1 })} aoClicar={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</BotaoBarra>
      <BotaoBarra titulo="Título 2" ativo={editor.isActive("heading", { level: 2 })} aoClicar={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</BotaoBarra>
      <BotaoBarra titulo="Lista" ativo={editor.isActive("bulletList")} aoClicar={() => editor.chain().focus().toggleBulletList().run()}>•</BotaoBarra>
    </BubbleMenu>
  );
}

// Rodapé com a contagem de palavras e caracteres.
function RodapeContador({ editor }) {
  const palavras = editor.storage.characterCount.words();
  const caracteres = editor.storage.characterCount.characters();
  return (
    <div className={estilos.rodape}>
      {palavras} palavras · {caracteres} caracteres
    </div>
  );
}

export default function Editor() {
  const notaAtivaId = useNotasStore((e) => e.notaAtivaId);
  const notas = useNotasStore((e) => e.notas);
  const atualizarConteudo = useNotasStore((e) => e.atualizarConteudo);

  // acha a nota que está aberta agora
  const nota = notas.find((n) => n.id === notaAtivaId);

  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        Placeholder.configure({ placeholder: "Comece a escrever..." }),
        CharacterCount,
      ],
      content: nota?.conteudo || "",
      // a cada mudança, salvamos o conteúdo na memória.
      // (Na Fase 2a colocaremos um "debounce" para salvar com calma.)
      onUpdate: ({ editor }) => {
        if (notaAtivaId) atualizarConteudo(notaAtivaId, editor.getHTML());
      },
    },
    [notaAtivaId] // recria o editor quando a nota muda
  );

  if (!editor) return null; // editor ainda está montando

  // clicar na área vazia (fora do texto) leva o cursor para o fim
  function focarNoFim(evento) {
    if (evento.target === evento.currentTarget) {
      editor.chain().focus("end").run();
    }
  }

  return (
    <div className={estilos.area} onClick={focarNoFim}>
      <BarraFlutuante editor={editor} />
      <EditorContent editor={editor} className={estilos.conteudo} />
      <RodapeContador editor={editor} />
    </div>
  );
}
