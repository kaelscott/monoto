import { create } from "zustand";

/*
  useUiStore.js
  Store de INTERFACE: guarda o estado da tela que não é dado de nota.
  Por enquanto só se a tela de regras está aberta.

  COMO LER UM STORE DO ZUSTAND:
  - É um objeto com DADOS (ex.: regrasAbertas) e FUNÇÕES que mudam
    esses dados (ex.: abrirRegras).
  - "set" troca o estado.
  - Num componente, usamos assim:
        const aberta = useUiStore((estado) => estado.regrasAbertas);
    e o componente re-renderiza sozinho quando esse valor muda.
*/
export const useUiStore = create((set) => ({
  regrasAbertas: false,
  abrirRegras: () => set({ regrasAbertas: true }),
  fecharRegras: () => set({ regrasAbertas: false }),
}));
