import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

export default function Header() {
  const user = useUser();

  return (
    <div className="flex w-full flex-row place-content-between">
      <div className="btn">
        {user.isSignedIn && <SignOutButton />}
        {!user.isSignedIn && <SignInButton />}
      </div>
      <h2 className="text-2xl">Twotter</h2>
      <div>a</div>
    </div>
  );
}
