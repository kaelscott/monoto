# Monoto

App de notas desktop, offline, com estética de terminal.
Escopo: criar, editar, listar e apagar notas — mais auto-tag por regras de horário.

## Nível do código

Este é um projeto de estudo de um desenvolvedor júnior iniciante.
O código precisa ser legível por alguém nesse nível, sem exceção.

- JavaScript, nunca TypeScript
- Nomes de variáveis, funções e arquivos em português
- Cada arquivo abre com um comentário explicando o que ele faz
- Sem abstração que não tenha uso hoje: nada de factory, interface,
  camada de serviço ou config para valor que nunca muda
- Sem sintaxe que exija parar para decifrar
- Função pequena e com um propósito só

## Regra de sinalização

Antes de escrever algo acima desse nível, pare e avise.
Explique o que é, por que apareceu e qual a alternativa mais simples.
Não implemente e peça desculpa depois.

Vale também para pedidos do próprio usuário: se o que ele pediu leva a
uma solução acima da régua, diga isso antes de começar.

## Decisões

Toda decisão de stack ou de escopo vive em `docs/adr/`.
Antes de adicionar uma feature ou uma dependência, escreva o ADR primeiro.

Features já avaliadas e recusadas estão lá. Não reintroduza sem um ADR novo
que explique o que mudou.

## Stack

React + Vite · Tauri 2 · Zustand · CSS Modules · TipTap · SQLite

## Comandos

    npm run tauri dev      # roda o app desktop
    npm run tauri build    # gera o instalador

## Commits

Formato convencional em português: `feat:`, `fix:`, `docs:`, `refactor:`.
Sem atribuição de IA — nem trailer de co-autoria, nem menção em PR.
