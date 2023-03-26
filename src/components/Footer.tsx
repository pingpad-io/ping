import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { UserAvatar } from "./UserAvatar";

export default function Footer() {
  const user = useUser();

  let footer = user.isSignedIn ? (
    <>
      <UserAvatar />
      <div className="btn-secondary btn-ghost btn w-32">
        <SignOutButton />
      </div>
    </>
  ) : (
    <>
      <div className="btn-primary btn-ghost btn-wide btn">
        <SignInButton />
      </div>
    </>
  );

  return (
    <>
      <div className="flex w-full flex-row place-content-around">{footer}</div>
    </>
  );
}
