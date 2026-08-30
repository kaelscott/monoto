# ADR-010: Sem configurações de aparência

Status: recusado · 2026-08-30

O protótipo tinha uma tela com tamanho de fonte e opacidade, salvos num
`settings.json` pelo `plugin-store`.

Arrasta uma dependência, um módulo de leitura e gravação, um modal e o CSS
dele. O app tem um usuário: o autor — o tamanho de fonte que ele quer pode
ser o valor escrito em `tema.css`. Opacidade de janela é enfeite.

Mudar a aparência é editar `src/estilos/tema.css` e recompilar.
