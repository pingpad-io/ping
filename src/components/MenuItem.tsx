import Link from "next/link";
import { useContext, type ReactNode } from "react";
import { CollapsedContext } from "./Menu";

export const MenuItem = (props: {
  href?: string;
  onClick?: () => void;
  icon: JSX.Element;
  text?: string;
  side?: "left" | "right";
  className?: string;
  children?: ReactNode;
}) => {
  const collapsed = useContext(CollapsedContext);
  const text = !collapsed && props.text && <div className="hidden lg:block">{props.text}</div>;
  const style = `flex w-fit flex-row place-content-end gap-4 rounded-btn hover:bg-base-200 p-2 sm:p-3 ${
    props.className ?? ""
  }`;
  const content = (
    <>
      {props.side !== "left" && text}
      <div className="flex h-8 w-8 place-content-center items-center">{props.icon}</div>
      {props.side === "left" && text}
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
        <button type="button" onClick={props.onClick} className={style}>
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
  text?: string;
  icon: JSX.Element;
  side?: "left" | "right";
  className?: string;
  children?: ReactNode;
}) => {
  const text = <>{props.text}</>;
  const style = `${props.className ?? ""} flex pr-3 flex-row rounded-btn place-items-center hover:bg-base-300`;

  const content = (
    <>
      {props.side !== "left" && text}
      <div className="flex h-8 w-8 place-content-center items-center">{props.icon}</div>
      {props.side === "left" && text}

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
        <button type="button" onClick={props.onClick} className={style}>
          {content}
        </button>
      ) : (
        <div className={style}>{content}</div>
      )}
    </>
  );
};
