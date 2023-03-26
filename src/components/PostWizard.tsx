import { useUser } from "@clerk/nextjs";
import Image from "next/image";

export default function PostWizard() {
  const { user } = useUser();
  if (!user) return null;

  return <div>
    <Image src={user.profileImageUrl} alt={'profile picture'} />
  </div>
}
