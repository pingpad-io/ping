import Link from "next/link";
import { ReactNode } from "react";

export const MenuItem = (props: {
  href?: string;
  onClick?: () => void;
  name: string;
  icon: JSX.Element;
  children?: ReactNode;
}) => {
  return (
    <>
      {props.href ? (
        <Link
          onClick={props.onClick}
          href={props.href}
          className="flex w-fit flex-row place-content-end gap-4 rounded-3xl px-3 py-3 text-2xl hover:bg-base-200 lg:px-6"
        >
          <div className="hidden lg:block">{props.name}</div>
          <div className="flex h-8 w-8 place-content-center items-center">
            {props.icon}
          </div>
          {props.children}
        </Link>
      ) : (
        <button
          onClick={props.onClick}
          className="flex w-fit flex-row place-content-end gap-4 rounded-3xl px-3 py-3 text-2xl hover:bg-base-200 lg:px-6"
        >
          <div className="hidden lg:block">{props.name}</div>
          <div className="flex h-8 w-8 place-content-center items-center">
            {props.icon}
          </div>
          {props.children}
        </button>
      )}
    </>
  );
};
