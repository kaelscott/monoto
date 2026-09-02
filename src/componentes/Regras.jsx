import { useUiStore } from "../stores/useUiStore";

/*
  Regras.jsx
  Tela das regras de horário, que aparece por cima do app quando o
  usuário clica em "regras" na barra lateral.

  Por enquanto só a casca: abre, fecha, e nada mais. A lista de regras
  e o formulário de criar entram nos próximos passos.
*/
export default function Regras() {
  const aberta = useUiStore((e) => e.regrasAbertas);
  const fechar = useUiStore((e) => e.fecharRegras);

  if (!aberta) {
    return null; // fechada: não desenha nada
  }

  // clicar no fundo escuro fecha a tela; clicar dentro da caixa não.
  // (stopPropagation impede que o clique "suba" até o fundo)
  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/60"
      onClick={fechar}
    >
      <div
        className="w-[460px] max-w-[90vw] rounded border border-borda bg-painel p-4"
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between text-xs text-texto-2">
          <span>regras de horário</span>
          <button
            className="px-1 text-lg leading-none text-texto-3 hover:text-texto"
            onClick={fechar}
            title="Fechar"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
