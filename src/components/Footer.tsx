import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { UserAvatar } from "./UserAvatar";

export default function Footer() {
  const user = useUser();

  let footer = user.isSignedIn ? (
    <>
      <UserAvatar />
      <SignOutButton>
        <div className="btn-secondary btn-ghost btn w-28">Sign out</div>
      </SignOutButton>
    </>
  ) : (
    <>
      <SignInButton>
        <div className="btn-primary btn-ghost btn-wide btn">Sign In</div>
      </SignInButton>
    </>
  );

  return (
    <>
      {/* <div className="flex w-full flex-row place-content-around">{footer}</div> */}
    </>
  );
}
