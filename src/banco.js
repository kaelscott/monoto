import Database from "@tauri-apps/plugin-sql";
import { pastasExemplo, notasExemplo } from "./exemplos";

/*
  banco.js
  Tudo que fala com o banco de dados SQLite fica aqui, num lugar só.
  Os componentes e stores NÃO escrevem SQL: eles chamam estas funções.

  Conceitos novos desta fase:
  - async/await: operações de banco demoram um tiquinho, então são
    "assíncronas". Usamos "await" para esperar o resultado.
  - db.execute(): roda comandos que mudam dados (CREATE, INSERT, UPDATE).
  - db.select(): roda consultas que LEEM dados (SELECT) e devolve uma lista.
  - Os "$1, $2" no SQL são lugares seguros para os valores (evitam erros e
    ataques de SQL injection); passamos os valores no array ao lado.
*/

// Guardamos a conexão aberta aqui, para o app inteiro usar a mesma.
let db = null;

// Cria as tabelas (só se ainda não existirem). Sem migrations versionadas:
// é o jeito mais simples para o nosso momento.
async function criarTabelas() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS pastas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS notas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pastaId INTEGER,
      conteudo TEXT NOT NULL DEFAULT ''
    )
  `);
  // Esta tabela é criada agora, mas só será usada na Fase 2e (regras de horário).
  await db.execute(`
    CREATE TABLE IF NOT EXISTS time_rules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      pasta TEXT,
      dias TEXT,
      inicio TEXT,
      fim TEXT,
      ativa INTEGER DEFAULT 1
    )
  `);
}

// Na 1ª execução (banco vazio), coloca alguns dados de exemplo.
async function semearSeVazio() {
  const linhas = await db.select("SELECT COUNT(*) AS total FROM pastas");
  if (linhas[0].total > 0) return; // já tem dados: não faz nada

  // insere as pastas e guarda o id que o banco gerou para cada nome
  const idPorNome = {};
  for (const pasta of pastasExemplo) {
    const r = await db.execute("INSERT INTO pastas (nome) VALUES ($1)", [pasta.nome]);
    idPorNome[pasta.nome] = r.lastInsertId;
  }

  // insere as notas, ligando cada uma à pasta certa pelo id recém-criado
  for (const nota of notasExemplo) {
    const nomePasta = pastasExemplo.find((p) => p.id === nota.pastaId)?.nome;
    const pastaId = idPorNome[nomePasta] ?? null;
    await db.execute("INSERT INTO notas (pastaId, conteudo) VALUES ($1, $2)", [
      pastaId,
      nota.conteudo,
    ]);
  }
}

// Abre o banco, garante as tabelas e os dados iniciais, e já devolve
// pastas e notas prontas para a tela. ("sqlite:monoto-app.db" faz o Tauri
// resolver o caminho na pasta de dados do app — nunca um caminho fixo.)
// Obs.: usamos um nome novo ("monoto-app.db") para não colidir com um banco
// antigo de uma versão anterior do app que ficou na pasta de dados.
export async function iniciarBanco() {
  db = await Database.load("sqlite:monoto-app.db");
  await criarTabelas();
  await semearSeVazio();
  return {
    pastas: await listarPastas(),
    notas: await listarNotas(),
  };
}

export async function listarPastas() {
  return db.select("SELECT id, nome FROM pastas ORDER BY id");
}

// notas mais novas primeiro (DESC), igual ao comportamento da Fase 1
export async function listarNotas() {
  return db.select("SELECT id, pastaId, conteudo FROM notas ORDER BY id DESC");
}

// insere uma pasta e devolve o id gerado
export async function inserirPasta(nome) {
  const r = await db.execute("INSERT INTO pastas (nome) VALUES ($1)", [nome]);
  return r.lastInsertId;
}

// insere uma nota e devolve o id gerado
export async function inserirNota(pastaId, conteudo) {
  const r = await db.execute(
    "INSERT INTO notas (pastaId, conteudo) VALUES ($1, $2)",
    [pastaId, conteudo]
  );
  return r.lastInsertId;
}

// salva o texto de uma nota que já existe
export async function salvarConteudoNota(id, conteudo) {
  await db.execute("UPDATE notas SET conteudo = $1 WHERE id = $2", [conteudo, id]);
}
