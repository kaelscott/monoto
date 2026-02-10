// src/Tiptap.tsx
import { useEditor, useEditorState, EditorContent } from "@tiptap/react"; // hook do editor, hook de estado e componente de renderização
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit"; // extensões base do Tiptap
import { initialContent } from "./initialContent"; // conteúdo inicial do editor
import { Bold, Italic, Strikethrough } from 'lucide-react'; // icones
import { BubbleButton } from "./BubbleButton";

// inicializa o Tiptap, aplica o conteúdo inicial e controla o BubbleMenu com estado de formatação.
export function Editor() {
  const editor = useEditor({
    extensions: [StarterKit], // define your extension array
    content: initialContent, // initial content
    editorProps: {
      attributes: {
        class:
          "prose prose-invert focus:outline-none max-w-[800px] mx-auto p-6",
      },
    },
  });

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor.isActive("bold"),
      isItalic: ctx.editor.isActive("italic"),
      isStrike: ctx.editor.isActive("strike"),
    }),
  });

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>

      {editor && (
        <BubbleMenu
          className="bg-zinc-700 shadow-xl border border-zinc-600 shadow-black/20 rounded-lg overflow-hidden flex divide-x divide-zinc-600"
          editor={editor}
        >
          {/* Negrito */}
          <BubbleButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            data-active={editorState?.isBold}
          >
            <Bold size={15} />
          </BubbleButton>

          {/* Italico */}
          <BubbleButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            data-active={editorState?.isItalic}
          >
            <Italic size={15}/>
          </BubbleButton>

          {/* Sublinhado */}
          <BubbleButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            data-active={editorState?.isStrike}
          >
            <Strikethrough size={15} />
          </BubbleButton>
        </BubbleMenu>
      )}
    </>
  );
}
