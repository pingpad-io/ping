import Menu from "~/components/menu/Menu";
import { Sidebar } from "~/components/menu/Sidebar";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row justify-center shrink grow w-full">
      <div className="hidden sm:flex sticky top-0 h-fit">
        <Menu />
      </div>

      <div className="min-w-0 max-w-2xl grow sm:shrink lg:max-w-2xl h-full">
        <div className="z-[100] flex sm:hidden h-fit w-full sticky top-0 bg-card rounded-b-lg drop-shadow-xl">
          <Menu />
        </div>
        {children}
      </div>

      <div className="hidden lg:flex sticky top-0 h-fit max-w-xs w-max">
        <Sidebar />
      </div>
    </div>
  );
}
