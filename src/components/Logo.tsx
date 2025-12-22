interface LogoProps {
  tamanho: number;
}

export function Logo(props: LogoProps) {
  return (
    <>
      <img
        src="https://static.vecteezy.com/ti/fotos-gratis/p1/3827322-gato-branco-e-cinza-fofo-gratis-foto.jpg"
        height={props.tamanho}
        width={props.tamanho}
        className="rounded-full"
      />
    </>
  );
}
