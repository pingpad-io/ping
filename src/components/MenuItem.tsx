import Link from "next/link";
import { ReactNode, useContext } from "react";
import { collapsedContext } from "./Menu";

export const MenuItem = (props: {
  href?: string;
  onClick?: () => void;
  name: string;
  icon: JSX.Element;
  children?: ReactNode;
}) => {
  let collapsed = useContext(collapsedContext);
  let text = collapsed ? (
    <></>
  ) : (
    <div className="hidden lg:block">{props.name}</div>
  );
  let padding = collapsed ? "px-3 lg:px-3 " : "px-3 lg:px-6";
  let style =
    `flex w-fit flex-row place-content-end gap-4 rounded-3xl \
    py-3 text-2xl hover:bg-base-200 ` + padding;

  return (
    <>
      {props.href ? (
        <Link onClick={props.onClick} href={props.href} className={style}>
          {text}
          <div className="flex h-8 w-8 place-content-center items-center">
            {props.icon}
          </div>
          {props.children}
        </Link>
      ) : (
        <button onClick={props.onClick} className={style}>
          {text}
          <div className="flex h-8 w-8 place-content-center items-center">
            {props.icon}
          </div>
          {props.children}
        </button>
      )}
    </>
  );
};
