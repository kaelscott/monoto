import { useState } from "react";
import { useRegrasStore } from "../stores/useRegrasStore";

/*
  FormularioRegra.jsx
  O formulário de criar uma regra de horário: a tag que a nota vai
  receber, os dias da semana e a faixa de horário.
*/

// Os dias da semana, na ordem em que aparecem nos botões.
const DIAS = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"];

// classes repetidas, guardadas aqui para as linhas não ficarem enormes
const CAMPO = "rounded border border-borda bg-transparent px-2 py-1.5 focus:outline-none";
const BOTAO = "rounded border border-borda py-1.5 text-texto-2 hover:text-texto";

// Um dos sete botões de dia. Fica destacado quando o dia está escolhido.
function BotaoDia({ dia, escolhido, aoClicar }) {
  let cor = "text-texto-3";
  if (escolhido) {
    cor = "bg-elevado text-texto";
  }

  return (
    <button
      type="button"
      className={"flex-1 rounded border border-borda py-1 text-xs " + cor}
      onClick={aoClicar}
    >
      {dia}
    </button>
  );
}

// Formulário de criar regra: a tag, os dias e a faixa de horário.
export default function FormularioRegra() {
  const criarRegra = useRegrasStore((e) => e.criarRegra);

  const [tag, setTag] = useState("");
  const [dias, setDias] = useState([]);
  const [inicio, setInicio] = useState("09:00");
  const [fim, setFim] = useState("12:00");

  // clicar num dia: tira se já estava escolhido, põe se não estava
  function alternarDia(dia) {
    const novos = [];

    for (const escolhido of dias) {
      if (escolhido !== dia) {
        novos.push(escolhido);
      }
    }

    // se o dia não estava na lista, ele entra agora
    if (!dias.includes(dia)) {
      novos.push(dia);
    }

    setDias(novos);
  }

  async function salvar(evento) {
    evento.preventDefault(); // não deixa a página recarregar

    const nome = tag.trim();
    if (nome === "" || dias.length === 0) {
      return;
    }

    try {
      await criarRegra({ tag: nome, dias: dias, inicio: inicio, fim: fim });
      setTag("");
      setDias([]);
    } catch (erro) {
      console.error("Falha ao criar regra:", erro);
    }
  }

  // só dá para salvar com uma tag escrita e ao menos um dia escolhido
  const podeSalvar = tag.trim() !== "" && dias.length > 0;

  return (
    <form className="flex flex-col gap-2" onSubmit={salvar}>
      <input
        className={CAMPO + " placeholder:text-texto-3"}
        placeholder="tag da regra"
        value={tag}
        onChange={(evento) => setTag(evento.target.value)}
      />

      <div className="flex gap-1">
        {DIAS.map((dia) => (
          <BotaoDia
            key={dia}
            dia={dia}
            escolhido={dias.includes(dia)}
            aoClicar={() => alternarDia(dia)}
          />
        ))}
      </div>

      {/* input type="time" já vem pronto do navegador: não escrevemos
          nenhum seletor de hora à mão */}
      <div className="flex items-center gap-2 text-xs text-texto-2">
        <input
          type="time"
          className={CAMPO}
          value={inicio}
          onChange={(evento) => setInicio(evento.target.value)}
        />
        às
        <input
          type="time"
          className={CAMPO}
          value={fim}
          onChange={(evento) => setFim(evento.target.value)}
        />
      </div>

      <button type="submit" className={BOTAO + " disabled:opacity-40"} disabled={!podeSalvar}>
        criar regra
      </button>
    </form>
  );
}
