import { ReactNode } from "react";

const MiniProfile = (props: { id: string; children: ReactNode }) => {
  return (
    <div className="min-h-full max-w-full shrink-0 grow border-x border-base-300 sm:shrink lg:max-w-2xl">
      Profile
      {props.children}
    </div>
  );
};

export default MiniProfile;
