import { useState } from "react";
import { Logo } from "./Logo";
import { Profile } from "./Profile";

export function Header() {
  const [estaLogado, setEstaLogado] = useState(true);
  const menuItems = ["Início", "Notas", "Configurações"];

  return (
    <>
      <nav className="flex justify-between items-center p-4 border-b border-black">
        <ul className="flex gap-4">
          {menuItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </nav>

      {estaLogado ? (
        <>
          <Profile
            nome={"kael"}
            imagemUrl={
              "https://cdn.freecodecamp.org/curriculum/cat-photo-app/relaxing-cat.jpg"
            }
          />
          <button onClick={() => setEstaLogado(false)}>Sair</button>
        </>
      ) : (
        <button onClick={() => setEstaLogado(true)}>Fazer Login</button>
      )}

      <Logo tamanho={200} />
    </>
  );
}
