import { type PropsWithChildren } from "react";
import Menu from "./Menu";
import Sidebar from "./Sidebar";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <>
      <Menu />
      <div className="min-h-full min-w-0 max-w-2xl grow sm:shrink lg:max-w-2xl">{props.children}</div>
      <Sidebar />
    </>
  );
};
