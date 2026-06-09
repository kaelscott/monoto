import { register, unregisterAll } from "@tauri-apps/plugin-global-shortcut";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { enable, disable, isEnabled } from "@tauri-apps/plugin-autostart";

/*
  sistema.js
  Integrações com o sistema operacional:
  - atalho global Ctrl+Shift+N para mostrar/esconder a janela de qualquer lugar
  - autostart: iniciar (ou não) o app junto com o sistema

  Toda a lógica fica em JavaScript; o Rust só registrou os plugins.
*/

// Registra o atalho global. "CommandOrControl" vira Ctrl no Windows/Linux e Cmd no Mac.
export async function registrarAtalhoGlobal() {
  try {
    // limpa registros antigos antes (evita erro de "atalho já registrado"
    // quando o app recarrega durante o desenvolvimento)
    await unregisterAll();
    await register("CommandOrControl+Shift+N", (evento) => {
      // o atalho dispara ao apertar E ao soltar; só agimos ao apertar
      if (evento.state === "Pressed") alternarJanela();
    });
  } catch (erro) {
    console.error("Falha ao registrar atalho global:", erro);
  }
}

// Mostra a janela se estiver escondida; esconde se estiver visível.
async function alternarJanela() {
  const janela = getCurrentWindow();
  if (await janela.isVisible()) {
    await janela.hide();
  } else {
    await janela.show();
    await janela.setFocus();
  }
}

// --- autostart (iniciar com o sistema) ---

// devolve true/false se o app está marcado para iniciar com o sistema
export async function autostartLigado() {
  try {
    return await isEnabled();
  } catch (erro) {
    console.error("Falha ao verificar autostart:", erro);
    return false;
  }
}

// liga ou desliga o autostart conforme o valor recebido
export async function definirAutostart(ligar) {
  try {
    if (ligar) await enable();
    else await disable();
  } catch (erro) {
    console.error("Falha ao mudar autostart:", erro);
  }
}
