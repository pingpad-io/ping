import Link from "next/link";
import { ReactNode } from "react";

export const MenuItem = (props: {
  href: string;
  name: string;
  icon: JSX.Element;
}) => {
  return (
    <>
      <Link
        href={props.href}
        className="flex w-fit flex-row place-content-end gap-4 rounded-full px-3 md:px-6 py-3 text-2xl hover:bg-base-300"
      >
        <div className="hidden md:block">
          {props.name}
        </div>
        <div className="flex h-8 w-8 place-content-center items-center">
          {props.icon}
        </div>
      </Link>
    </>
  );
};
