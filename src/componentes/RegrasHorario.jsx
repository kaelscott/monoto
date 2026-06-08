import { useState } from "react";
import { useRegrasStore } from "../stores/useRegrasStore";
import { useNotasStore } from "../stores/useNotasStore";
import { useUiStore } from "../stores/useUiStore";
import estilos from "../estilos/Configuracoes.module.css";

/*
  RegrasHorario.jsx
  Formulário enxuto para criar regras de "auto-pasta por horário" e a
  lista das regras já criadas (ligar/desligar e remover).
  Na Fase 1 isto é só visual; a lógica que escolhe a pasta entra na Fase 2e.
*/

const DIAS = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"];

export default function RegrasHorario() {
  const regras = useRegrasStore((e) => e.regras);
  const adicionarRegra = useRegrasStore((e) => e.adicionarRegra);
  const alternarRegra = useRegrasStore((e) => e.alternarRegra);
  const removerRegra = useRegrasStore((e) => e.removerRegra);
  const pastas = useNotasStore((e) => e.pastas);
  const adicionarToast = useUiStore((e) => e.adicionarToast);

  // estado do formulário (a regra que está sendo montada)
  const [nome, setNome] = useState("");
  const [pasta, setPasta] = useState(pastas[0]?.nome ?? "");
  const [dias, setDias] = useState([]);
  const [inicio, setInicio] = useState("09:00");
  const [fim, setFim] = useState("12:00");

  // marca ou desmarca um dia da semana
  function alternarDia(dia) {
    setDias((atual) =>
      atual.includes(dia) ? atual.filter((d) => d !== dia) : [...atual, dia]
    );
  }

  function adicionar() {
    if (!nome.trim()) {
      adicionarToast("Dê um nome para a regra");
      return;
    }
    adicionarRegra({ nome: nome.trim(), pasta, dias, inicio, fim, ativa: true });
    // limpa o formulário para a próxima regra
    setNome("");
    setDias([]);
  }

  return (
    <div className={estilos.regras}>
      {/* formulário de nova regra */}
      <div className={estilos.formRegra}>
        <input
          className={estilos.entrada}
          placeholder="nome da regra"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <select
          className={estilos.entrada}
          value={pasta}
          onChange={(e) => setPasta(e.target.value)}
        >
          {pastas.map((p) => (
            <option key={p.id} value={p.nome}>
              {p.nome}
            </option>
          ))}
        </select>

        <div className={estilos.dias}>
          {DIAS.map((dia) => (
            <button
              key={dia}
              type="button"
              className={
                dias.includes(dia)
                  ? `${estilos.dia} ${estilos.diaAtivo}`
                  : estilos.dia
              }
              onClick={() => alternarDia(dia)}
            >
              {dia}
            </button>
          ))}
        </div>

        <div className={estilos.horas}>
          <input type="time" value={inicio} onChange={(e) => setInicio(e.target.value)} />
          <span>até</span>
          <input type="time" value={fim} onChange={(e) => setFim(e.target.value)} />
        </div>

        <button className={estilos.adicionar} onClick={adicionar}>
          adicionar regra
        </button>
      </div>

      {/* lista das regras já criadas */}
      <ul className={estilos.listaRegras}>
        {regras.map((r) => (
          <li key={r.id} className={estilos.regra}>
            <label className={estilos.regraInfo}>
              <input
                type="checkbox"
                checked={r.ativa}
                onChange={() => alternarRegra(r.id)}
              />
              <span>
                <strong>{r.nome}</strong> → {r.pasta} · {r.inicio}-{r.fim} ·{" "}
                {r.dias.join(" ")}
              </span>
            </label>
            <button
              className={estilos.remover}
              onClick={() => removerRegra(r.id)}
              title="Remover"
            >
              ×
            </button>
          </li>
        ))}
        {regras.length === 0 && (
          <li className={estilos.vazio}>Nenhuma regra ainda</li>
        )}
      </ul>
    </div>
  );
}
