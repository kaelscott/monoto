import { useUiStore } from "../stores/useUiStore";
import { useRegrasStore } from "../stores/useRegrasStore";

/*
  Regras.jsx
  Tela das regras de horário, que aparece por cima do app quando o
  usuário clica em "regras" na barra lateral.

  Uma regra diz: nesses dias da semana, nessa faixa de horário, a nota
  nova nasce com essa tag.
*/

// --- lista das regras que já existem ---

// Uma linha da lista, só mostrando os dados da regra por enquanto.
function LinhaRegra({ regra }) {
  return (
    <div className="flex items-center gap-2 rounded border border-borda p-2">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-texto">{regra.tag}</span>
        <span className="text-xs text-texto-2">
          {regra.dias.join(", ")} · {regra.inicio} às {regra.fim}
        </span>
      </div>
    </div>
  );
}

// A lista inteira, ou um aviso quando ainda não há regra nenhuma.
function ListaRegras() {
  const regras = useRegrasStore((e) => e.regras);

  if (regras.length === 0) {
    return (
      <p className="py-6 text-center text-xs text-texto-3">
        Nenhuma regra ainda.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      {regras.map((regra) => (
        <LinhaRegra key={regra.id} regra={regra} />
      ))}
    </div>
  );
}

// --- a tela em si ---
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

        <ListaRegras />
      </div>
    </div>
  );
}
