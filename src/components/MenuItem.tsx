import Link from "next/link";

export const MenuItem = (props: {
  href?: string;
  onClick?: () => void;
  name: string;
  icon: JSX.Element;
}) => {
  let body = (
    <>
      <div className="hidden md:block">{props.name}</div>
      <div className="flex h-8 w-8 place-content-center items-center">
        {props.icon}
      </div>
    </>
  );
  return (
    <>
      {props.href !== "" && (
        <Link
          onClick={props.onClick}
          href={props.href || "/"}
          className="flex w-fit flex-row place-content-end gap-4 rounded-full px-3 py-3 text-2xl text-primary-content hover:bg-base-200 md:px-6"
        >
          {body}
        </Link>
      )}
      {props.href === "" && (
        <button
          onClick={props.onClick}
          className="flex w-fit flex-row place-content-end gap-4 rounded-full px-3 py-3 text-2xl text-primary-content hover:bg-base-200 md:px-6"
        >
          {body}
        </button>
      )}
    </>
  );
};
