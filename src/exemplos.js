/*
  exemplos.js
  Dados FAKE (de mentirinha) que ficam só na memória, para a Fase 1.
  Servem para a interface já nascer com conteúdo e a gente conseguir testar.
  Na Fase 2 isso vai sair daqui e virá do banco de dados (SQLite).
*/

// Cada PASTA tem um id (número único) e um nome.
export const pastasExemplo = [
  { id: 1, nome: "ideias" },
  { id: 2, nome: "trabalho" },
  { id: 3, nome: "pessoal" },
];

// Cada NOTA tem id, a pasta dona (pastaId) e o conteúdo em HTML.
// O conteúdo vem em HTML porque é assim que o editor (TipTap) guarda o texto.
export const notasExemplo = [
  {
    id: 1,
    pastaId: 1,
    conteudo:
      "<h1>Bem-vindo ao monoto</h1><p>Capture suas ideias rápido. Selecione um texto para ver a barra flutuante.</p>",
  },
  {
    id: 2,
    pastaId: 2,
    conteudo:
      "<h2>Reunião de segunda</h2><p>Combinar prazos e revisar o backlog.</p>",
  },
  {
    id: 3,
    pastaId: 3,
    conteudo: "<p>Lista de compras: café, pão, frutas.</p>",
  },
];

// Uma REGRA de horário de exemplo (auto-pasta). Manda notas criadas em dias
// úteis, entre 09:00 e 12:00, para a pasta "trabalho".
export const regrasExemplo = [
  {
    nome: "Manhã de trabalho",
    pasta: "trabalho",
    dias: ["seg", "ter", "qua", "qui", "sex"],
    inicio: "09:00",
    fim: "12:00",
    ativa: true,
  },
];
