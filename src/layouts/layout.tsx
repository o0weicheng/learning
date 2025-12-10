import type { LayoutsProps } from ".";
import { Content } from "./content";
import { Sidebar } from "./sidebar";

export const Layout = ({ children }: LayoutsProps) => {
  return (
    <div className="grid grid-cols-(--layout-sidebar) mask-origin-content mask-content [grid-template-areas:'sidebar_content_toc'] px-6 justify-between h-screen w-screen overflow-hidden">
      <Content>{children}</Content>
      <Sidebar>sidebar</Sidebar>
    </div>
  );
};
