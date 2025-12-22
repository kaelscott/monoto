interface NotaProps {
  nota: string;
  onRemover: (nota: string) => void;
  onEditar: (textoAntigo: string, textoNovo: string) => void
}

function Nota({ nota, onRemover }: NotaProps) {
  function handleRemover() {
    onRemover(nota);
  }

  return (
    <li className="flex items-center justify-between p-2 border rounded">
      <p>{nota}</p>
      <button
        className="px-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
        onClick={handleRemover}
      >
        Remover
      </button>
    </li>
  );
}

export default Nota;
