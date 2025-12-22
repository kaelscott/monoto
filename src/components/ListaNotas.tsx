import { useState } from "react";
import Nota from "./Nota";

function ListaNotas() {
  const [nota, setNota] = useState("");
  const [notas, setNotas] = useState<string[]>([]);

  function removerNota(nota: string) {
    const novaLista = notas.filter((itemAtual) => itemAtual !== nota);
    setNotas(novaLista);
  }

  return (
    <div>
      <input
        type="text"
        value={nota}
        onChange={(e) => {
          setNota(e.target.value);
        }}
        placeholder="Digite sua nota"
      />

      <button
        onClick={() => {
          setNotas([...notas, nota]), setNota("");
        }}
      >
        Adicionar Nota
      </button>

      <ul className="space-y-2">
        {notas.map((item, index) => (
          <Nota key={index} nota={item} onRemover={removerNota} onEditar={removerNota} />
        ))}
      </ul>
    </div>
  );
}

export default ListaNotas;
