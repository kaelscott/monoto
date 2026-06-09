# Monoto

App de notas **desktop**, offline e minimalista, com estética de terminal (tema escuro,
fonte monoespaçada, opacidade ajustável). Feito para capturar ideias rápido e organizar
notas em pastas — inclusive de forma automática, por regras de horário.

> ⚠️ **Beta** — em desenvolvimento. Por enquanto há build apenas para **Windows**.

## Funcionalidades

- Editor de texto rico (negrito, títulos, listas) com barra flutuante ao selecionar texto
- Notas organizadas em pastas, com auto-save enquanto você digita
- **Command palette** (Ctrl+K) para ações rápidas pelo teclado
- **Ícone na bandeja**: fechar a janela esconde o app (não encerra)
- **Atalho global** Ctrl+Shift+N para mostrar/esconder a janela de qualquer lugar
- **Auto-pasta por horário**: notas novas vão para uma pasta conforme o dia e a hora
- Tema escuro com tamanho de fonte e opacidade ajustáveis (e salvos entre sessões)

## Download (Windows)

Baixe o instalador na página de [Releases](https://github.com/kaelscott/monoto/releases).

> Como o app ainda não é assinado digitalmente, o Windows pode mostrar
> _"O Windows protegeu o seu computador"_. Clique em **Mais informações → Executar assim mesmo**.

## Tecnologias

Tauri 2 (Rust) · React + JavaScript · Vite · Zustand · CSS Modules · TipTap · SQLite

## Rodar localmente (desenvolvimento)

Pré-requisitos: [Node.js](https://nodejs.org/) e [Rust](https://www.rust-lang.org/) instalados.

```bash
npm install
npm run tauri dev      # abre o app desktop completo
```

Para gerar o instalador:

```bash
npm run tauri build    # gera o instalador em src-tauri/target/release/bundle/
```

---

Projeto pessoal de estudo.
