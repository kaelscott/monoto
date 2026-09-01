# Decisões de Arquitetura (ADR)

Um ADR registra uma decisão: o contexto, o que foi decidido e o que custa.
Serve para não refazer a mesma discussão daqui a seis meses.

Regra do projeto: o ADR vem antes do código. Feature ou dependência nova
começa por um documento aqui.

## Aceitos

| # | Decisão |
|---|---|
| [001](001-tauri.md) | Tauri em vez de Electron |
| [002](002-javascript.md) | JavaScript em vez de TypeScript |
| [003](003-zustand.md) | Zustand em vez de Context API |
| [004](004-sqlite.md) | SQLite em vez de localStorage |
| [005](005-tiptap.md) | TipTap em vez de editor próprio |
| [007](007-tags-em-vez-de-pastas.md) | Tags em vez de pastas |
| [008](008-salvar-manual.md) | Salvar manual em vez de auto-save |
| [015](015-regras-de-horario.md) | Manter as regras de horário |
| [016](016-tailwind.md) | Tailwind em vez de CSS Modules |

## Recusados

| # | Decisão |
|---|---|
| [009](009-sem-command-palette.md) | Sem command palette |
| [010](010-sem-configuracoes.md) | Sem configurações de aparência |
| [011](011-sem-bandeja.md) | Sem bandeja do sistema |
| [012](012-sem-atalho-global.md) | Sem atalho global |
| [013](013-sem-autostart.md) | Sem autostart |
| [014](014-sem-toasts.md) | Sem toasts |

## Substituídos

| # | Decisão |
|---|---|
| [006](006-css-modules.md) | CSS Modules em vez de Tailwind — ver ADR-016 |
