import { create } from "zustand";
import { pastasExemplo, notasExemplo } from "../exemplos";

/*
  useNotasStore.js
  Store das PASTAS e NOTAS, mais qual pasta/nota está selecionada.
  Na Fase 1 ele começa com os dados de exemplo (em memória).
*/
export const useNotasStore = create((set) => ({
  pastas: pastasExemplo,
  notas: notasExemplo,

  // qual pasta está selecionada no filtro (null = mostrar "todas")
  pastaSelecionadaId: null,
  selecionarPasta: (id) => set({ pastaSelecionadaId: id }),

  // qual nota está aberta no editor
  notaAtivaId: notasExemplo[0]?.id ?? null,
  selecionarNota: (id) => set({ notaAtivaId: id }),

  // cria uma pasta nova
  criarPasta: (nome) =>
    set((estado) => {
      const nova = { id: Date.now(), nome };
      return { pastas: [...estado.pastas, nova] };
    }),

  // cria uma nota nova (vazia) na pasta selecionada (ou na 1ª pasta)
  // e já a deixa aberta no editor
  criarNota: () =>
    set((estado) => {
      const pastaId = estado.pastaSelecionadaId ?? estado.pastas[0]?.id ?? null;
      const nova = { id: Date.now(), pastaId, conteudo: "" };
      return {
        notas: [nova, ...estado.notas],
        notaAtivaId: nova.id,
      };
    }),

  // salva o conteúdo de uma nota (o editor chama isso ao digitar)
  atualizarConteudo: (id, conteudo) =>
    set((estado) => ({
      notas: estado.notas.map((n) =>
        n.id === id ? { ...n, conteudo } : n
      ),
    })),
}));
