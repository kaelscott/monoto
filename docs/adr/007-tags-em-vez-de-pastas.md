# ADR-007: Tags em vez de pastas

Status: aceito · 2026-08-30 · substitui as pastas do protótipo

O protótipo organizava notas em pastas: uma tabela `pastas`, uma coluna
`pastaId` em `notas`, lista na barra lateral e tela para gerenciar.

Nenhuma nota precisa estar em dois lugares nem dentro de outra pasta — a
hierarquia nunca foi usada. Tag faz o mesmo trabalho com uma coluna `TEXT`
na própria tabela `notas`, e continua servindo de destino para as regras de
horário (ADR-015), que era o único motivo real da pasta existir.

Uma nota tem no máximo uma tag. A tag é texto livre, sem cadastro: erro de
digitação cria uma tag nova sem avisar.
