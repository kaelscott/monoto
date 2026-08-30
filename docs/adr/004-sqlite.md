# ADR-004: SQLite em vez de localStorage

Status: aceito · 2026-08-30

As notas precisam continuar existindo depois de fechar o app.

localStorage é do WebView e some se ele limpar os dados. Um JSON no disco
reescreve o arquivo inteiro a cada gravação. SQLite é um arquivo na pasta
de dados do app e resolve apagar e atualizar com uma linha de SQL.

O SQL usado é básico: `SELECT`, `INSERT`, `UPDATE`, `DELETE`.

Todo acesso ao banco fica em `src/banco.js` — nenhum componente escreve SQL.
Os valores vão por `$1`, `$2`, nunca colados na string. Sem migrations: as
tabelas nascem com `CREATE TABLE IF NOT EXISTS`.
