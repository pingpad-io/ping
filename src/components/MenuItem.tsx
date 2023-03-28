import Link from "next/link";
import { ReactNode } from "react";

export const MenuItem = (props: {
  href: string;
  name: string;
  icon: JSX.Element;
  children?: ReactNode;
}) => {
  return (
    <div className="py-2 px-8">
      <Link
        href={props.href}
        className="flex flex-row place-content-end items-center gap-4 text-2xl"
      >
        {props.name}
        <div className="h-8 w-8 place-content-center items-center flex">{props.icon}</div>
      </Link>
      {props.children}
    </div>
  );
};
