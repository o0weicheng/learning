import { type ReactNode } from "react";

type GroupClickEventHandler = (
  event: React.MouseEvent<HTMLButtonElement>,
  index: number,
) => void;

export type ButtonProps = {
  children: ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export interface ButtonGroupProps extends Omit<ButtonProps, "onClick"> {
  onClick?: GroupClickEventHandler;
}

export { Button } from "./button";
export { ButtonGroup } from "./button-group";
