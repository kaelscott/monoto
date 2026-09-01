# ADR-016: Tailwind em vez de CSS Modules

Status: aceito · 2026-08-30 · substitui o ADR-006

O ADR-006 escolheu CSS Modules por ser CSS normal, o que continua verdade.
A troca é por outro motivo: Tailwind é o padrão que aparece no mercado, e
este é um projeto de estudo — aprender a ferramenta é parte do objetivo.

Na prática, o estilo passa a ficar no próprio JSX:

    <aside className="flex w-64 flex-col gap-2 bg-painel p-3">

O custo é real e vale registrar: a linha de classes fica longa e o JSX
fica mais poluído do que com `className={estilos.sidebar}`.

Usamos a versão 4, onde as cores do tema são declaradas em `@theme`
dentro do próprio CSS — não existe mais `tailwind.config.js`. As
variáveis que estavam em `tema.css` viram cores do Tailwind, então
`var(--painel)` passa a ser escrito como `bg-painel`.

Os arquivos `.module.css` são apagados na migração.

Na mesma passagem a fonte do app passou a ser sem serifa (Inter e as do
sistema), como no Obsidian. A monoespaçada ficou só para trechos de
código dentro da nota.
