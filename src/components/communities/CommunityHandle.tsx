import Link from "~/components/Link";

export const CommunityHandle = ({ handle }: { handle: string }) => {
  return (
    <Link href={`/c/${handle}`} style={{ color: "currentColor" }}>
      <span className="whitespace-nowrap hover:underline">/{handle}</span>
    </Link>
  );
};
