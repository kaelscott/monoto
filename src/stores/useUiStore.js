import { create } from "zustand";
import { salvarConfig } from "../configs";

/*
  useUiStore.js
  Store de INTERFACE: guarda o "estado da tela" que não é dado de nota
  (sidebar aberta/fechada, modais, aparência, toasts...).

  COMO LER UM STORE DO ZUSTAND:
  - É um objeto com DADOS (ex.: sidebarRecolhida) e FUNÇÕES que mudam
    esses dados (ex.: alternarSidebar).
  - "set" troca o estado. set((estado) => ...) recebe o estado atual.
  - Num componente, usamos assim:
        const recolhida = useUiStore((estado) => estado.sidebarRecolhida);
    e o componente re-renderiza sozinho quando esse valor muda.
*/
export const useUiStore = create((set) => ({
  // --- sidebar recolhida ou não ---
  sidebarRecolhida: false,
  alternarSidebar: () =>
    set((estado) => ({ sidebarRecolhida: !estado.sidebarRecolhida })),

  // --- command palette (Ctrl+K) ---
  paletteAberta: false,
  abrirPalette: () => set({ paletteAberta: true }),
  fecharPalette: () => set({ paletteAberta: false }),
  alternarPalette: () =>
    set((estado) => ({ paletteAberta: !estado.paletteAberta })),

  // --- modal de configurações ---
  configAberta: false,
  abrirConfig: () => set({ configAberta: true }),
  fecharConfig: () => set({ configAberta: false }),

  // --- aparência (o App.jsx aplica esses valores nas variáveis CSS) ---
  // ao mudar, atualizamos a tela (set) e salvamos no settings.json (salvarConfig)
  tamanhoFonte: 14, // em pixels
  opacidade: 0.92, // de 0 a 1
  definirTamanhoFonte: (px) => {
    set({ tamanhoFonte: px });
    salvarConfig("tamanhoFonte", px);
  },
  definirOpacidade: (valor) => {
    set({ opacidade: valor });
    salvarConfig("opacidade", valor);
  },

  // --- "iniciar com o sistema" (autostart) ---
  // aqui guardamos só o valor para a tela; ligar/desligar de verdade no SO
  // é feito no componente de Configurações (via sistema.js).
  iniciarComSistema: false,
  definirIniciarComSistema: (valor) => set({ iniciarComSistema: valor }),

  // --- toasts (avisos rápidos no canto da tela) ---
  toasts: [],
  adicionarToast: (mensagem) =>
    set((estado) => ({
      toasts: [...estado.toasts, { id: Date.now(), mensagem }],
    })),
  removerToast: (id) =>
    set((estado) => ({
      toasts: estado.toasts.filter((t) => t.id !== id),
    })),
}));
