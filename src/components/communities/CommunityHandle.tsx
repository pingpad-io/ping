import Link from "~/components/Link";

export const CommunityHandle = ({ handle }: { handle: string }) => {
  return (
    <Link href={`/c/${handle}`}>
      <span className="whitespace-nowrap underline">/{handle}</span>
    </Link>
  );
};
