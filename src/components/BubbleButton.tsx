import { ComponentProps, ReactNode } from "react";

// Props do botão bolha: herda todas as props nativas de <button> e exige conteúdo via `children`.
// Use para passar atributos como onClick, disabled, type etc.
export interface BubbleButtonProps extends ComponentProps<"button"> {
  children: ReactNode;
}

export function BubbleButton(props: BubbleButtonProps) {
  return (
    <button
      className="p-2 text-zinc-200 font-medium leading-none hover:text-zinc-50 hover:bg-zinc-600 data-[active=true]:text-violet-400"
      type="button"
      {...props}
    />
  );
}
