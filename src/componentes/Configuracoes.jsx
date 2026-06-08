import { useEffect } from "react";
import { useUiStore } from "../stores/useUiStore";
import RegrasHorario from "./RegrasHorario";
import estilos from "../estilos/Configuracoes.module.css";

/*
  Configuracoes.jsx
  Modal central com as opções do app: tamanho da fonte, opacidade dos
  painéis, "iniciar com o sistema" e as regras de auto-pasta por horário.
  Fecha com Esc, clique fora ou no botão de fechar.
*/
export default function Configuracoes() {
  const aberta = useUiStore((e) => e.configAberta);
  const fechar = useUiStore((e) => e.fecharConfig);
  const tamanhoFonte = useUiStore((e) => e.tamanhoFonte);
  const definirTamanhoFonte = useUiStore((e) => e.definirTamanhoFonte);
  const opacidade = useUiStore((e) => e.opacidade);
  const definirOpacidade = useUiStore((e) => e.definirOpacidade);
  const iniciarComSistema = useUiStore((e) => e.iniciarComSistema);
  const alternarIniciarComSistema = useUiStore((e) => e.alternarIniciarComSistema);

  // fecha com a tecla Esc enquanto o modal está aberto
  useEffect(() => {
    if (!aberta) return;
    function aoTeclar(e) {
      if (e.key === "Escape") fechar();
    }
    window.addEventListener("keydown", aoTeclar);
    // limpa o "ouvinte" quando o modal fecha (boa prática)
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aberta, fechar]);

  if (!aberta) return null;

  return (
    <div className={estilos.fundo} onClick={fechar}>
      <div className={estilos.modal} onClick={(e) => e.stopPropagation()}>
        <header className={estilos.cabecalho}>
          <h2>configurações</h2>
          <button className={estilos.fechar} onClick={fechar} title="Fechar">
            ×
          </button>
        </header>

        {/* aparência */}
        <section className={estilos.secao}>
          <label className={estilos.campo}>
            <span>Tamanho da fonte (px)</span>
            <input
              type="number"
              min="10"
              max="24"
              value={tamanhoFonte}
              onChange={(e) => definirTamanhoFonte(Number(e.target.value))}
            />
          </label>

          <label className={estilos.campo}>
            <span>Opacidade dos painéis (%)</span>
            <input
              type="number"
              min="50"
              max="100"
              value={Math.round(opacidade * 100)}
              onChange={(e) => definirOpacidade(Number(e.target.value) / 100)}
            />
          </label>

          <label className={estilos.campoLinha}>
            <span>Iniciar com o sistema</span>
            <input
              type="checkbox"
              checked={iniciarComSistema}
              onChange={alternarIniciarComSistema}
            />
          </label>
        </section>

        {/* auto-pasta por horário */}
        <section className={estilos.secao}>
          <h3 className={estilos.tituloSecao}>Auto-pasta por horário</h3>
          <RegrasHorario />
        </section>
      </div>
    </div>
  );
}
