import { PropsWithChildren } from "react";
import Menu from "./Menu";
import Sidebar from "./Sidebar";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <>
      <Menu />
      <div className="min-h-full max-w-2xl grow border-base-300 sm:shrink lg:max-w-2xl">
        {props.children}
      </div>
      <Sidebar />
    </>
  );
};
