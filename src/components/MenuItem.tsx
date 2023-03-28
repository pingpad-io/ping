import Link from "next/link";
import { ReactNode } from "react";

export const MenuItem = (props: {
  href: string;
  name: string;
  icon: JSX.Element;
  children?: ReactNode;
}) => {
  return (
    <>
      <Link
        href={props.href}
        className="flex flex-row place-content-end items-center gap-4 rounded-full px-6 py-3 text-2xl hover:bg-slate-800"
      >
        {props.name}
        <div className="flex h-8 w-8 place-content-center items-center">
          {props.icon}
        </div>
      </Link>
      {props.children}
    </>
  );
};
