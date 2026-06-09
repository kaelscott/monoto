import { create } from "zustand";
import {
  inserirRegra,
  atualizarRegraAtiva,
  removerRegraDB,
} from "../banco";

/*
  useRegrasStore.js
  Store das REGRAS de auto-pasta por horário.
  Agora as regras vêm do banco (tabela time_rules): carregamos no boot e
  gravamos no banco ao adicionar, ligar/desligar ou remover.
*/
export const useRegrasStore = create((set) => ({
  regras: [],

  // chamado no boot, com as regras vindas do banco
  carregarRegras: (regras) => set({ regras }),

  // adiciona uma regra: grava no banco, pega o id e atualiza a tela
  adicionarRegra: async (regra) => {
    const id = await inserirRegra(regra);
    set((estado) => ({ regras: [...estado.regras, { ...regra, id }] }));
  },

  // liga/desliga uma regra
  alternarRegra: async (id) => {
    const estado = useRegrasStore.getState();
    const regra = estado.regras.find((r) => r.id === id);
    const nova = !regra.ativa;
    await atualizarRegraAtiva(id, nova);
    set((s) => ({
      regras: s.regras.map((r) => (r.id === id ? { ...r, ativa: nova } : r)),
    }));
  },

  // remove uma regra
  removerRegra: async (id) => {
    await removerRegraDB(id);
    set((estado) => ({
      regras: estado.regras.filter((r) => r.id !== id),
    }));
  },
}));
