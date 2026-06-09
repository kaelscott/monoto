/*
  regrasHorario.js
  A lógica da "auto-pasta por horário", numa FUNÇÃO PURA.

  Função pura = só depende do que recebe (regras, pastas, agora) e não mexe
  em nada de fora (não lê banco, não muda tela). Por isso é fácil de entender
  e de testar: mesmas entradas -> mesma saída, sempre.
*/

// O JavaScript numera os dias 0=domingo .. 6=sábado. Aqui traduzimos para os
// rótulos curtos que as regras usam.
const DIAS_SEMANA = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];

// devolve a hora de "agora" como texto "HH:MM" (com zero à esquerda),
// no mesmo formato dos campos de hora das regras
function horaComo_HHMM(agora) {
  const h = String(agora.getHours()).padStart(2, "0");
  const m = String(agora.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

// Escolhe a pasta de uma nota nova conforme o horário.
// Regra: a PRIMEIRA regra ativa cujo dia da semana e faixa de horário batem
// com "agora" decide a pasta. Se nenhuma bater, devolve null.
export function escolherPasta(regras, pastas, agora) {
  const dia = DIAS_SEMANA[agora.getDay()];
  const hora = horaComo_HHMM(agora);

  // como as horas estão no formato "HH:MM", dá para comparar como texto
  const regra = regras.find(
    (r) => r.ativa && r.dias.includes(dia) && r.inicio <= hora && hora <= r.fim
  );
  if (!regra) return null;

  // a regra guarda o NOME da pasta; aqui achamos o id correspondente
  const pasta = pastas.find((p) => p.nome === regra.pasta);
  return pasta ? pasta.id : null;
}
