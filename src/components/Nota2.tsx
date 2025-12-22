interface Nota2Props {
    id: number;
    titulo: string;
    texto: string;
}

export function Nota2 ({titulo, texto}: Nota2Props) {
    return (
        <>
            {titulo}
            {texto}
        </>
    )
}