# ADR-003: Zustand em vez de Context API

Status: aceito · 2026-08-30

Vários componentes leem e mudam os mesmos dados. Passar por props fica
repetitivo rápido.

Um store em Zustand é um objeto com dados e funções — sem provider, sem
reducer, sem dispatch:

    const notas = useNotasStore((e) => e.notas)

Context API exigiria envolver a árvore em providers e re-renderiza tudo que
consome o contexto. Redux tem muito mais conceito do que este app precisa.

Cada store guarda um assunto só.
