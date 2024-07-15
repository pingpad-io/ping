import { BellIcon, BookmarkIcon, MailIcon } from "lucide-react";
import Link from "~/components/Link";
import { getServerAuth } from "~/utils/getLensClient";
import { ServerSignedIn } from "../auth/ServerSignedIn";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { lensProfileToUser } from "../user/User";
import { UserAvatar } from "../user/UserAvatar";
import { SearchBar } from "./Search";

const UserBar = async () => {
  const { handle, profileId, client } = await getServerAuth();
  const user = await client.profile.fetch({ forProfileId: profileId }).then((res) => lensProfileToUser(res));
  const handleOrProfileId = handle ?? profileId;

  return (
    <div className="flex flex-row gap-2 items-center justify-between">
      <div>
        <Link href={"/notifications"}>
          <Button variant="ghost" size="icon">
            <BellIcon size={20} />
          </Button>
        </Link>

        <Link href={"/bookmarks"}>
          <Button variant="ghost" size="icon">
            <BookmarkIcon size={20} />
          </Button>
        </Link>

        <Button variant="ghost" size="icon" disabled>
          <MailIcon size={20} />
        </Button>
      </div>

      <Link href={`/u/${handleOrProfileId}`} className="flex flex-row gap-2 items-center justify-between">
        <div className="hidden sm:flex">{handleOrProfileId}</div>
        <div className="w-8 h-8">
          <UserAvatar link={false} card={false} user={user} />
        </div>
      </Link>
    </div>
  );
};

export function Sidebar() {
  return (
    <div className="flex flex-col w-full gap-4 p-4 grow">
      <ServerSignedIn>
        <UserBar />
      </ServerSignedIn>
      <SearchBar defaultText="" />
      <Accordion defaultValue={["beta"]} className="w-full" type="multiple">
        <AccordionItem value="beta">
          <AccordionTrigger className="py-2">
            <span>
              About Pingpad
              <Badge className="ml-2 text-sm" variant="outline">
                beta
              </Badge>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <p>Welcome to pingpad!</p>
            <p>This is a beta, some things might be broken</p>
            <p>We would love to hear what you think!</p>
            <p>
              Leave your feedback here:{" "}
              <Link className="underline underline-offset-2" href={"/c/pingpad"}>
                /pingpad
              </Link>
            </p>
            <br />
            <p>
              big love,{" "}
              <Link className="underline underline-offset-2" href={"/u/pingpad"}>
                @pingpad
              </Link>{" "}
              team
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Links />
    </div>
  );
}

const Links = () => {
  const version = process.env.npm_package_version ?? "0.8";
  const git = process.env.VERCEL_GIT_COMMIT_SHA ?? "0000000";
  const gitSliced = git.slice(0, 7);

  return (
    <div className="flex flex-col gap-1 text-xs">
      <div className="flex flex-wrap h-fit w-fit gap-1 overflow-auto">
        <Link className="hover:underline" href={"/tos"}>
          ToS
        </Link>
        <Link className="hover:underline" href={"/policy"}>
          Privacy
        </Link>
        <Link href="https://github.com/pingpad-io/ping/" className="hover:underline" target="_blank" rel="noreferrer">
          GitHub
        </Link>
        <Link className="hover:underline" href={"https://discord.gg/DhMeQAXW4F"}>
          Discord
        </Link>
        <Link className="hover:underline" href={"/about"}>
          About
        </Link>
      </div>
      <span className="select-none">
        © 2024 Pingpad v{version}{" "}
        <Badge variant="outline" className="text-[10px] p-0.5 px-2 ml-2">
          <Link className="hover:underline" href={`https://github.com/pingpad-io/ping/commit/${gitSliced}`}>
            {gitSliced}
          </Link>
        </Badge>
      </span>
    </div>
  );
};
