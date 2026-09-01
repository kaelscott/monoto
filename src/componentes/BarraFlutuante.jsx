import { BubbleMenu } from "@tiptap/react";

/*
  BarraFlutuante.jsx
  A barrinha que aparece flutuando quando você seleciona um texto na
  nota, com os botões de negrito, itálico, títulos e lista.
*/

// Um botão da barra. Fica claro quando o estilo já está aplicado no
// texto selecionado (ex.: negrito ligado).
function BotaoBarra({ titulo, aoClicar, ativo, children }) {
  let cor = "text-texto-2";
  if (ativo) {
    cor = "text-texto";
  }

  return (
    <button
      type="button"
      title={titulo}
      onMouseDown={(evento) => evento.preventDefault()} // não perde a seleção
      onClick={aoClicar}
      className={"rounded px-2 py-1 hover:bg-hover " + cor}
    >
      {children}
    </button>
  );
}

// A barra flutuante com os botões de formatação.
// "editor.chain().focus().toggleBold().run()" é como o TipTap aplica um
// estilo: volta o foco para o texto e executa o comando escolhido.
export default function BarraFlutuante({ editor }) {
  return (
    <BubbleMenu
      editor={editor}
      className="flex items-center gap-0.5 rounded border border-borda bg-elevado px-1 py-0.5"
      tippyOptions={{ duration: 120 }}
    >
      <BotaoBarra
        titulo="Negrito"
        ativo={editor.isActive("bold")}
        aoClicar={() => editor.chain().focus().toggleBold().run()}
      >
        N
      </BotaoBarra>

      <BotaoBarra
        titulo="Itálico"
        ativo={editor.isActive("italic")}
        aoClicar={() => editor.chain().focus().toggleItalic().run()}
      >
        i
      </BotaoBarra>

      <BotaoBarra
        titulo="Tachado"
        ativo={editor.isActive("strike")}
        aoClicar={() => editor.chain().focus().toggleStrike().run()}
      >
        S
      </BotaoBarra>

      <BotaoBarra
        titulo="Código"
        ativo={editor.isActive("code")}
        aoClicar={() => editor.chain().focus().toggleCode().run()}
      >
        {"</>"}
      </BotaoBarra>

      <span className="mx-1 h-4 w-px bg-borda" />

      <BotaoBarra
        titulo="Título 1"
        ativo={editor.isActive("heading", { level: 1 })}
        aoClicar={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        H1
      </BotaoBarra>

      <BotaoBarra
        titulo="Título 2"
        ativo={editor.isActive("heading", { level: 2 })}
        aoClicar={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </BotaoBarra>

      <BotaoBarra
        titulo="Lista"
        ativo={editor.isActive("bulletList")}
        aoClicar={() => editor.chain().focus().toggleBulletList().run()}
      >
        •
      </BotaoBarra>
    </BubbleMenu>
  );
}
