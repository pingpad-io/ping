import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

export default function Footer() {
  const user = useUser();
  return (
    <div>
      <div className="btn w-max">
        {user.isSignedIn && <SignOutButton />}
        {!user.isSignedIn && <SignInButton />}
      </div>
    </div>
  );
}
