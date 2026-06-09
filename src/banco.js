import Database from "@tauri-apps/plugin-sql";
import { pastasExemplo, notasExemplo, regrasExemplo } from "./exemplos";

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

  // insere as regras de horário de exemplo
  for (const regra of regrasExemplo) {
    await inserirRegra(regra);
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
    regras: await listarRegras(),
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

// --- regras de horário (time_rules) ---

// lê as regras e converte os campos guardados como texto/número:
// 'dias' vira lista (estava "seg,ter") e 'ativa' vira true/false (estava 1/0)
export async function listarRegras() {
  const linhas = await db.select(
    "SELECT id, nome, pasta, dias, inicio, fim, ativa FROM time_rules ORDER BY id"
  );
  return linhas.map((r) => ({
    ...r,
    dias: r.dias ? r.dias.split(",") : [],
    ativa: r.ativa === 1,
  }));
}

// insere uma regra e devolve o id gerado.
// 'dias' é gravado como texto "seg,ter" e 'ativa' como 1/0.
export async function inserirRegra(regra) {
  const r = await db.execute(
    "INSERT INTO time_rules (nome, pasta, dias, inicio, fim, ativa) VALUES ($1, $2, $3, $4, $5, $6)",
    [
      regra.nome,
      regra.pasta,
      regra.dias.join(","),
      regra.inicio,
      regra.fim,
      regra.ativa ? 1 : 0,
    ]
  );
  return r.lastInsertId;
}

// liga/desliga uma regra
export async function atualizarRegraAtiva(id, ativa) {
  await db.execute("UPDATE time_rules SET ativa = $1 WHERE id = $2", [
    ativa ? 1 : 0,
    id,
  ]);
}

// remove uma regra
export async function removerRegraDB(id) {
  await db.execute("DELETE FROM time_rules WHERE id = $1", [id]);
}
