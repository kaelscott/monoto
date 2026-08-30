# ADR-013: Sem autostart

Status: recusado · 2026-08-30

O protótipo tinha opção de iniciar o app com o Windows, via
`plugin-autostart`.

O Windows já faz isso: um atalho na pasta Inicializar resolve sem nenhuma
linha de código. A opção só existia porque havia uma tela de configurações
para colocá-la, e essa tela saiu (ADR-010).

Quem quiser põe um atalho em `shell:startup`. Isso vale um parágrafo no
README, não uma dependência.
