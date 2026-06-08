import { load } from "@tauri-apps/plugin-store";

/*
  configs.js
  Guarda as CONFIGURAÇÕES do app (fonte e opacidade) num arquivo settings.json,
  usando o plugin-store do Tauri. Assim elas continuam valendo na próxima vez
  que o app abrir.

  Como funciona:
  - load("settings.json") abre (ou cria) o arquivo de configurações.
  - store.get(chave) lê um valor; store.set(chave, valor) grava; store.save()
    escreve no disco.
*/

// guardamos o arquivo de configurações aberto aqui, para o app todo usar
let store = null;

// valores padrão, usados na 1ª vez (quando ainda não há nada salvo)
const PADRAO = { tamanhoFonte: 14, opacidade: 0.92 };

// abre o settings.json e devolve as configurações salvas (ou os padrões)
export async function iniciarConfigs() {
  store = await load("settings.json", { autoSave: false });
  const tamanhoFonte = (await store.get("tamanhoFonte")) ?? PADRAO.tamanhoFonte;
  const opacidade = (await store.get("opacidade")) ?? PADRAO.opacidade;
  return { tamanhoFonte, opacidade };
}

// salva uma configuração. É "best-effort": se der erro (ex.: rodando no
// navegador, sem Tauri), apenas avisa no console e não quebra o app.
export async function salvarConfig(chave, valor) {
  try {
    if (!store) return;
    await store.set(chave, valor);
    await store.save();
  } catch (erro) {
    console.error("Falha ao salvar configuração:", erro);
  }
}
