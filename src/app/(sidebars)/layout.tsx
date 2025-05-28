import Menu from "~/components/menu/Menu";
import { Sidebar } from "~/components/menu/Sidebar";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row justify-center shrink grow w-full">
      <Menu />

      <div className="min-w-0 max-w-2xl grow sm:shrink lg:max-w-2xl h-full">{children}</div>

      {/* <div className="hidden lg:flex sticky top-0 h-fit max-w-xs w-full">
        <Sidebar />
      </div> */}
    </div>
  );
}
