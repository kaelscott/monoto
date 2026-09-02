import { create } from "zustand";
import { inserirNota, apagarNotaDB, salvarTagNota } from "../banco";
import { escolherTag } from "../regrasHorario";
import { useRegrasStore } from "./useRegrasStore";

/*
  useNotasStore.js
  Store das NOTAS: a lista, qual está aberta e qual tag filtra a lista.
  Os dados vêm do banco (SQLite): carregamos tudo no boot e, ao criar,
  apagar ou marcar com tag, gravamos no banco e atualizamos a tela.

  Obs.: o TEXTO da nota é gravado pelo Ctrl+S no editor (ADR-008), então
  "atualizarConteudo" aqui mexe só na memória.

  IMPORTANTE — por que criamos objetos e listas NOVAS:
  o React só redesenha a tela quando percebe que algo mudou, e ele
  percebe comparando se o objeto é OUTRO. Se mudássemos a nota por
  dentro (nota.tag = "trabalho"), continuaria sendo o mesmo objeto e a
  tela não atualizaria. Por isso montamos uma nota nova, campo a campo.
*/
export const useNotasStore = create((set) => ({
  notas: [],
  notaAtivaId: null,
  tagSelecionada: null, // null = mostra todas

  // chamado no boot, depois que o banco devolve as notas
  carregar: (notas) => {
    let primeiraNota = null;
    if (notas.length > 0) {
      primeiraNota = notas[0].id;
    }
    set({ notas: notas, notaAtivaId: primeiraNota });
  },

  selecionarNota: (id) => set({ notaAtivaId: id }),
  selecionarTag: (tag) => set({ tagSelecionada: tag }),

  // Cria uma nota vazia e a deixa aberta. Se alguma regra de horário
  // bate com o momento de agora, a nota já nasce com a tag dela.
  criarNota: async () => {
    const regras = useRegrasStore.getState().regras;
    const tag = escolherTag(regras, new Date());

    const id = await inserirNota("", tag);
    const nota = { id: id, conteudo: "", tag: tag };

    set((estado) => {
      // a nota nova entra no começo da lista
      const lista = [nota];
      for (const antiga of estado.notas) {
        lista.push(antiga);
      }
      return { notas: lista, notaAtivaId: id };
    });
  },

  // apaga a nota do banco e da tela
  apagarNota: async (id) => {
    await apagarNotaDB(id);

    set((estado) => {
      // monta a lista de novo, pulando a nota apagada
      const lista = [];
      for (const nota of estado.notas) {
        if (nota.id !== id) {
          lista.push(nota);
        }
      }

      // se a nota apagada era a que estava aberta, abre a primeira que
      // sobrou; se não sobrou nenhuma, não fica nenhuma aberta
      let aberta = estado.notaAtivaId;
      if (aberta === id) {
        if (lista.length > 0) {
          aberta = lista[0].id;
        } else {
          aberta = null;
        }
      }

      return { notas: lista, notaAtivaId: aberta };
    });
  },

  // troca a tag de uma nota. Diferente do texto, a tag é gravada na hora:
  // é um campo curto, não tem por que esperar um Ctrl+S.
  definirTag: async (id, tag) => {
    await salvarTagNota(id, tag);

    set((estado) => {
      const lista = [];
      for (const nota of estado.notas) {
        if (nota.id === id) {
          // a nota que mudou entra como um objeto NOVO, com a tag nova
          lista.push({ id: nota.id, conteudo: nota.conteudo, tag: tag });
        } else {
          lista.push(nota);
        }
      }
      return { notas: lista };
    });
  },

  // atualiza só na memória (quem grava o texto no banco é o Ctrl+S)
  atualizarConteudo: (id, conteudo) => {
    set((estado) => {
      const lista = [];
      for (const nota of estado.notas) {
        if (nota.id === id) {
          lista.push({ id: nota.id, conteudo: conteudo, tag: nota.tag });
        } else {
          lista.push(nota);
        }
      }
      return { notas: lista };
    });
  },
}));
