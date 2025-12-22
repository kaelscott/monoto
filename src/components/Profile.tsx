interface ProfileProps {
  nome: string;
  imagemUrl: string;
}

export function Profile(props: ProfileProps) {
  return (
    <div className="border-b border-black">
      <p> {props.nome} </p>
      <img src={props.imagemUrl} width={200} />
    </div>
  );
}
