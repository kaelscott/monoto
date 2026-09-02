/*
  regrasHorario.js
  A lógica da auto-tag por horário, numa FUNÇÃO PURA.

  Função pura = só depende do que recebe (as regras e o horário) e não
  mexe em nada de fora: não lê banco, não muda tela. Mesmas entradas,
  mesma saída, sempre. Por isso é fácil de entender e de testar.
*/

// O JavaScript numera os dias 0=domingo até 6=sábado. Aqui traduzimos
// para os nomes curtos que as regras usam.
const DIAS_SEMANA = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];

// Devolve a hora de "agora" como texto "HH:MM" (com zero à esquerda),
// no mesmo formato dos campos de hora das regras.
function horaComoTexto(agora) {
  const hora = String(agora.getHours()).padStart(2, "0");
  const minuto = String(agora.getMinutes()).padStart(2, "0");
  return hora + ":" + minuto;
}

// Diz se uma regra vale para este dia e esta hora.
// As horas estão escritas como "09:00", sempre com dois dígitos, então
// dá para compará-las como texto: "09:00" <= "10:30" é verdade, do
// mesmo jeito que seria com números.
function regraVale(regra, dia, hora) {
  if (!regra.ativa) {
    return false;
  }
  if (!regra.dias.includes(dia)) {
    return false;
  }
  if (hora < regra.inicio) {
    return false;
  }
  if (hora > regra.fim) {
    return false;
  }
  return true;
}

// Escolhe a tag de uma nota nova conforme o horário.
// Vale a PRIMEIRA regra da lista que bate com "agora".
// Se nenhuma bater, devolve "" (a nota nasce sem tag).
export function escolherTag(regras, agora) {
  const dia = DIAS_SEMANA[agora.getDay()];
  const hora = horaComoTexto(agora);

  for (const regra of regras) {
    if (regraVale(regra, dia, hora)) {
      return regra.tag;
    }
  }

  return "";
}
