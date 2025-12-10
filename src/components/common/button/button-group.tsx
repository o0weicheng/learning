import { cn } from "@/lib/utils";
import React from "react";
import type { ButtonGroupProps } from ".";

export const ButtonGroup = ({
  children,
  className,
  onClick,
}: ButtonGroupProps) => {
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (onClick) onClick(event, index);
  };

  return (
    <div
      className={cn(
        "inline-flex -space-x-px rounded-md overflow-hidden",
        className,
      )}
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return null;

        const element = child as React.ReactElement<{
          className: string;
          onClick: ButtonGroupProps["onClick"];
        }>;

        return React.cloneElement(element, {
          className: cn(element.props.className, "rounded-none", "focus:z-10"),
          onClick: (e) => handleClick(e, index),
        });
      })}
    </div>
  );
};
