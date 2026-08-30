# ADR-015: Manter as regras de horário

Status: aceito · 2026-08-30

Uma regra diz: nesses dias da semana, nessa faixa de horário, nota nova
nasce com essa tag. "Seg a sex, 09:00–12:00, tag trabalho."

Esta é a única feature do protótipo que sobreviveu ao corte. Sem ela o
Monoto é um bloco de notas como qualquer outro — é ela que justifica o app
existir.

É também a parte mais avançada do projeto, o que contraria a régua do
CLAUDE.md. Foi mantida com essa ressalva consciente, e por um motivo: a
implementação é pequena. A decisão de qual tag usar é uma função pura —
recebe as regras e o horário, devolve a tag:

    escolherTag(regras, agora)

Sem ler banco, sem mexer na tela. Mesmas entradas, mesma saída. Fica em
`src/regrasHorario.js`, isolada e fácil de testar. O resto é um formulário
comum.

Se a lógica crescer além disso — regra que depende de outra regra,
prioridade entre regras, repetição por data — é sinal de que passou do nível
do projeto, e vale um ADR novo antes de continuar.
