import { create } from "zustand";
import { inserirPasta, inserirNota } from "../banco";

/*
  useNotasStore.js
  Store das PASTAS e NOTAS.
  Agora os dados vêm do banco (SQLite): no boot a gente carrega tudo, e ao
  criar pasta/nota a gente grava no banco e depois atualiza a tela.

  Obs.: o conteúdo da nota é salvo no banco pelo próprio editor (com debounce),
  então aqui "atualizarConteudo" mexe só na memória.
*/
export const useNotasStore = create((set) => ({
  pastas: [],
  notas: [],
  pastaSelecionadaId: null, // null = filtro "todas"
  notaAtivaId: null,

  // chamado no boot, depois que o banco devolve os dados
  carregar: (pastas, notas) =>
    set({
      pastas,
      notas,
      notaAtivaId: notas[0]?.id ?? null,
    }),

  selecionarPasta: (id) => set({ pastaSelecionadaId: id }),
  selecionarNota: (id) => set({ notaAtivaId: id }),

  // cria pasta: grava no banco, pega o id gerado e atualiza a tela
  criarPasta: async (nome) => {
    const id = await inserirPasta(nome);
    set((estado) => ({ pastas: [...estado.pastas, { id, nome }] }));
  },

  // cria nota vazia na pasta selecionada (ou na 1ª pasta) e a deixa aberta.
  // getState() lê o estado atual do store dentro de uma função assíncrona.
  criarNota: async () => {
    const estado = useNotasStore.getState();
    const pastaId = estado.pastaSelecionadaId ?? estado.pastas[0]?.id ?? null;
    const id = await inserirNota(pastaId, "");
    set((s) => ({
      notas: [{ id, pastaId, conteudo: "" }, ...s.notas],
      notaAtivaId: id,
    }));
  },

  // atualiza só na memória (o salvamento no banco é feito pelo editor com debounce)
  atualizarConteudo: (id, conteudo) =>
    set((estado) => ({
      notas: estado.notas.map((n) => (n.id === id ? { ...n, conteudo } : n)),
    })),
}));
