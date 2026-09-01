import { create } from "zustand";
import { inserirRegra, salvarRegraAtiva, apagarRegraDB } from "../banco";

/*
  useRegrasStore.js
  Store das REGRAS de horário. Uma regra diz: nesses dias da semana,
  nessa faixa de horário, a nota nova nasce com essa tag.

  As regras vêm da tabela "regras" do banco: carregamos no boot e, ao
  criar, ligar/desligar ou apagar, gravamos e atualizamos a tela.

  Assim como no store das notas, montamos listas e objetos NOVOS a cada
  mudança: é isso que faz o React perceber que algo mudou e redesenhar.
*/
export const useRegrasStore = create((set) => ({
  regras: [],

  // chamado no boot, com as regras vindas do banco
  carregarRegras: (regras) => set({ regras: regras }),

  // cria uma regra: grava no banco, pega o id gerado e atualiza a tela.
  // Toda regra nasce ligada.
  criarRegra: async (dados) => {
    const id = await inserirRegra(dados);

    const regra = {
      id: id,
      tag: dados.tag,
      dias: dados.dias,
      inicio: dados.inicio,
      fim: dados.fim,
      ativa: true,
    };

    set((estado) => {
      const lista = [];
      for (const antiga of estado.regras) {
        lista.push(antiga);
      }
      lista.push(regra); // a regra nova entra no fim da lista
      return { regras: lista };
    });
  },

  // liga a regra se estava desligada, e desliga se estava ligada
  alternarRegra: async (id) => {
    const regras = useRegrasStore.getState().regras;

    // acha a regra que foi clicada
    let clicada = null;
    for (const regra of regras) {
      if (regra.id === id) {
        clicada = regra;
      }
    }

    const ativa = !clicada.ativa;
    await salvarRegraAtiva(id, ativa);

    set((estado) => {
      const lista = [];
      for (const regra of estado.regras) {
        if (regra.id === id) {
          // a regra que mudou entra como um objeto NOVO
          lista.push({
            id: regra.id,
            tag: regra.tag,
            dias: regra.dias,
            inicio: regra.inicio,
            fim: regra.fim,
            ativa: ativa,
          });
        } else {
          lista.push(regra);
        }
      }
      return { regras: lista };
    });
  },

  // apaga a regra do banco e da tela
  apagarRegra: async (id) => {
    await apagarRegraDB(id);

    set((estado) => {
      // monta a lista de novo, pulando a regra apagada
      const lista = [];
      for (const regra of estado.regras) {
        if (regra.id !== id) {
          lista.push(regra);
        }
      }
      return { regras: lista };
    });
  },
}));
