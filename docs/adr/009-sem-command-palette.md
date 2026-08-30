# ADR-009: Sem command palette

Status: recusado · 2026-08-30

O protótipo tinha um overlay estilo Raycast no Ctrl+K: busca, lista de ações
e navegação por setas. 125 linhas de JSX e 62 de CSS.

Tinha três ações no total, e duas saíram do escopo (ADR-010). Uma tela
inteira para substituir um botão.

Criar nota vira um botão na barra lateral e Ctrl+N. Se um dia houver muitas
ações, vale reabrir.
