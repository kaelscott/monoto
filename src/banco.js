import Database from "@tauri-apps/plugin-sql";
import { notasExemplo } from "./exemplos";

/*
  banco.js
  Tudo que fala com o banco de dados SQLite fica aqui, num lugar só.
  Os componentes e stores NÃO escrevem SQL: eles chamam estas funções.
  Duas tabelas: "notas" (id, conteudo, tag) e "regras" (a auto-tag).

  Os "$1, $2" no SQL são os lugares onde os valores entram. Passamos os
  valores no array ao lado, nunca colados na string: é isso que evita
  erro de aspas e ataque de SQL injection.
*/

// Guardamos a conexão aberta aqui, para o app inteiro usar a mesma.
let db = null;

// Cria as tabelas (só se ainda não existirem). Sem migrations versionadas:
// é o jeito mais simples para o nosso momento.
async function criarTabelas() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS notas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conteudo TEXT NOT NULL DEFAULT '',
      tag TEXT NOT NULL DEFAULT ''
    )
  `);
  // Uma regra diz: nesses dias, nessa faixa de horário, a nota nova
  // nasce com essa tag. Os dias ficam num texto só ("seg,ter,qua") e
  // "ativa" fica como 1 ou 0, porque o SQLite não tem lista nem booleano.
  await db.execute(`
    CREATE TABLE IF NOT EXISTS regras (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tag TEXT NOT NULL,
      dias TEXT NOT NULL,
      inicio TEXT NOT NULL,
      fim TEXT NOT NULL,
      ativa INTEGER NOT NULL DEFAULT 1
    )
  `);
}

// Na 1ª execução (banco vazio), coloca algumas notas de exemplo.
async function semearSeVazio() {
  const linhas = await db.select("SELECT COUNT(*) AS total FROM notas");
  if (linhas[0].total > 0) return; // já tem notas: não faz nada

  for (const nota of notasExemplo) {
    await inserirNota(nota.conteudo, nota.tag);
  }
}

// Abre o banco, garante a tabela e os dados iniciais, e já devolve as
// notas prontas para a tela. ("sqlite:monoto-app.db" faz o Tauri resolver
// o caminho na pasta de dados do app — nunca um caminho fixo.)
export async function iniciarBanco() {
  db = await Database.load("sqlite:monoto-app.db");
  await criarTabelas();
  await semearSeVazio();
  return {
    notas: await listarNotas(),
    regras: await listarRegras(),
  };
}

// notas mais novas primeiro (DESC)
async function listarNotas() {
  return db.select("SELECT id, conteudo, tag FROM notas ORDER BY id DESC");
}

// insere uma nota e devolve o id gerado
export async function inserirNota(conteudo, tag) {
  const r = await db.execute(
    "INSERT INTO notas (conteudo, tag) VALUES ($1, $2)",
    [conteudo, tag]
  );
  return r.lastInsertId;
}

// troca a tag de uma nota
export async function salvarTagNota(id, tag) {
  await db.execute("UPDATE notas SET tag = $1 WHERE id = $2", [tag, id]);
}

// salva o texto de uma nota que já existe
export async function salvarConteudoNota(id, conteudo) {
  await db.execute("UPDATE notas SET conteudo = $1 WHERE id = $2", [conteudo, id]);
}

// apaga uma nota de vez
export async function apagarNotaDB(id) {
  await db.execute("DELETE FROM notas WHERE id = $1", [id]);
}

// --- regras de horário ---

// Lê as regras e converte os campos que o SQLite guarda de outro jeito:
// 'dias' volta a ser lista (estava "seg,ter") e 'ativa' volta a ser
// true/false (estava 1/0).
async function listarRegras() {
  const linhas = await db.select(
    "SELECT id, tag, dias, inicio, fim, ativa FROM regras ORDER BY id"
  );
  // o banco devolve 'dias' como texto ("seg,ter") e 'ativa' como 1 ou 0.
  // Aqui montamos a regra do jeito que o resto do app espera.
  const regras = [];
  for (const linha of linhas) {
    regras.push({
      id: linha.id,
      tag: linha.tag,
      dias: linha.dias.split(","),
      inicio: linha.inicio,
      fim: linha.fim,
      ativa: linha.ativa === 1,
    });
  }
  return regras;
}

// insere uma regra e devolve o id gerado
export async function inserirRegra(regra) {
  const r = await db.execute(
    "INSERT INTO regras (tag, dias, inicio, fim, ativa) VALUES ($1, $2, $3, $4, $5)",
    [regra.tag, regra.dias.join(","), regra.inicio, regra.fim, 1]
  );
  return r.lastInsertId;
}

// liga ou desliga uma regra
export async function salvarRegraAtiva(id, ativa) {
  // o SQLite não tem true/false: guardamos 1 para ligada e 0 para desligada
  let numero = 0;
  if (ativa) {
    numero = 1;
  }
  await db.execute("UPDATE regras SET ativa = $1 WHERE id = $2", [numero, id]);
}

// apaga uma regra de vez
export async function apagarRegraDB(id) {
  await db.execute("DELETE FROM regras WHERE id = $1", [id]);
}
