# ADR-006: CSS Modules em vez de Tailwind

Status: substituído pelo [ADR-016](016-tailwind.md) · 2026-08-30

O app é escuro e minimalista, com pouca cor.

CSS Modules é CSS normal — o que se aprende serve em qualquer lugar. O
`.module.css` restringe a classe ao componente, então estilo não vaza. Vite
suporta sem configurar nada. Tailwind deixaria o JSX cheio de classes e
somaria um passo de build.

Cores e medidas ficam em variáveis CSS em `src/estilos/tema.css`. Trocar o
tema é mudar esse arquivo.
