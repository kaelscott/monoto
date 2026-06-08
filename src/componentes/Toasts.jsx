import { useEffect } from "react";
import { useUiStore } from "../stores/useUiStore";
import estilos from "../estilos/Toasts.module.css";

/*
  Toasts.jsx
  Mostra os avisos rápidos no canto inferior direito.
  Cada toast some sozinho depois de ~3 segundos.
*/

// Um único toast. Ele se "auto-remove" da lista quando o tempo acaba.
function ToastItem({ id, mensagem }) {
  const remover = useUiStore((estado) => estado.removerToast);

  useEffect(() => {
    // setTimeout: executa a função depois de 3000ms (3s)
    const tempo = setTimeout(() => remover(id), 3000);
    // se o componente sair antes, cancelamos o timer (evita erro)
    return () => clearTimeout(tempo);
  }, [id, remover]);

  return <div className={estilos.toast}>{mensagem}</div>;
}

export default function Toasts() {
  const toasts = useUiStore((estado) => estado.toasts);

  return (
    <div className={estilos.pilha}>
      {toasts.map((t) => (
        <ToastItem key={t.id} id={t.id} mensagem={t.mensagem} />
      ))}
    </div>
  );
}
