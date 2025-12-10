import type { LayoutsProps } from ".";

export const Sidebar = ({ children }: LayoutsProps) => {
  return <aside className="[grid-area:sidebar]">{children}</aside>;
};
