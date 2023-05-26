import Link from "next/link";
import { ReactNode, useContext } from "react";
import { CollapsedContext } from "./Menu";

export const MenuItem = (props: {
  href?: string;
  onClick?: () => void;
  name: string;
  icon: JSX.Element;
  side?: "left" | "right";
  className?: string;
  children?: ReactNode;
}) => {
  let collapsed = useContext(CollapsedContext);

  let text = !collapsed && <div className="hidden lg:block">{props.name}</div>;

  let style =
    (props.className ?? "") +
    ` flex w-fit flex-row place-content-end gap-4 rounded-3xl hover:bg-base-200 p-3`;

  let content = (
    <>
      {props.side === "left" ? (
        <>
          <div className="flex h-8 w-8 place-content-center items-center">
            {props.icon}
          </div>
          {text}
        </>
      ) : (
        <>
          {text}
          <div className="flex h-8 w-8 place-content-center items-center">
            {props.icon}
          </div>
        </>
      )}

      {props.children}
    </>
  );

  return (
    <>
      {props.href ? (
        <Link onClick={props.onClick} href={props.href} className={style}>
          {content}
        </Link>
      ) : props.onClick ? (
        <button onClick={props.onClick} className={style}>
          {content}
        </button>
      ) : (
        <div className={style}>{content}</div>
      )}
    </>
  );
};

export const CompactMenuItem = (props: {
  href?: string;
  onClick?: () => void;
  name: string;
  icon: JSX.Element;
  side?: "left" | "right";
  className?: string;
  children?: ReactNode;
}) => {
  let text = <div>{props.name}</div>;

  let style =
    (props.className ?? "") +
    ` flex h-min flex-row w-full pr-3 rounded-3xl place-items-center hover:bg-base-300`;

  let content = (
    <>
      {props.side === "left" ? (
        <>
          <div className="flex h-8 w-8 place-content-center items-center">
            {props.icon}
          </div>
          {text}
        </>
      ) : (
        <>
          {text}
          <div className="flex h-8 w-8 place-content-center items-center">
            {props.icon}
          </div>
        </>
      )}

      {props.children}
    </>
  );

  return (
    <>
      {props.href ? (
        <Link onClick={props.onClick} href={props.href} className={style}>
          {content}
        </Link>
      ) : props.onClick ? (
        <button onClick={props.onClick} className={style}>
          {content}
        </button>
      ) : (
        <div className={style}>{content}</div>
      )}
    </>
  );
};
