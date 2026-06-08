import { create } from "zustand";

/*
  useRegrasStore.js
  Store das REGRAS de auto-pasta por horário.
  Na Fase 1 é só visual: dá para criar, ligar/desligar e remover regras,
  mas a lógica que de fato escolhe a pasta pelo horário entra na Fase 2e.

  Cada regra tem: nome, pasta de destino, dias da semana, hora de início,
  hora de fim e se está ativa.
*/
export const useRegrasStore = create((set) => ({
  regras: [
    {
      id: 1,
      nome: "Manhã de trabalho",
      pasta: "trabalho",
      dias: ["seg", "ter", "qua", "qui", "sex"],
      inicio: "09:00",
      fim: "12:00",
      ativa: true,
    },
  ],

  adicionarRegra: (regra) =>
    set((estado) => ({
      regras: [...estado.regras, { ...regra, id: Date.now() }],
    })),

  alternarRegra: (id) =>
    set((estado) => ({
      regras: estado.regras.map((r) =>
        r.id === id ? { ...r, ativa: !r.ativa } : r
      ),
    })),

  removerRegra: (id) =>
    set((estado) => ({
      regras: estado.regras.filter((r) => r.id !== id),
    })),
}));
