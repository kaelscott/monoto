# ADR-005: TipTap em vez de editor próprio

Status: aceito · 2026-08-30

O app precisa de negrito, títulos e listas — não só texto cru.

Editor de texto rico à mão envolve `contenteditable`, seleção, cursor, colar
de fora, desfazer. Cada um com casos estranhos em cada navegador. Daria mais
código que o app inteiro. O StarterKit do TipTap já traz tudo isso.

O conteúdo é guardado como HTML no banco, então pegar o título da nota exige
tirar as tags e ler a primeira linha. Isso fica em `src/util.js`.
