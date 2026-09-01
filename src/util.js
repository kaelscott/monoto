/*
  util.js
  Funções pequenas, usadas em mais de um lugar.
*/

// Pergunta ao usuário e só apaga se ele confirmar. Serve para apagar
// nota e para apagar regra: as duas perguntam antes, porque não dá
// para desfazer.
export async function confirmarEApagar(pergunta, apagar) {
  const confirmou = window.confirm(pergunta);
  if (!confirmou) {
    return;
  }

  try {
    await apagar();
  } catch (erro) {
    console.error("Falha ao apagar:", erro);
  }
}

// Pega o TÍTULO de uma nota = a primeira linha de texto do conteúdo.
// O conteúdo vem em HTML (do editor), então primeiro tiramos as tags
// para sobrar só o texto puro.
export function tituloDaNota(conteudo) {
  // truque simples: jogamos o HTML num elemento temporário e lemos só o texto
  const temp = document.createElement("div");
  temp.innerHTML = conteudo || "";
  const texto = temp.textContent || "";

  const primeiraLinha = texto.trim().split("\n")[0].trim();
  return primeiraLinha || "Nota sem título";
}
