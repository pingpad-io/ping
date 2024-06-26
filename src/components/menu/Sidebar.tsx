import { BellIcon, Bookmark, BookmarkIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { getCookieAuth } from "~/utils/getCookieAuth";
import { getLensClient } from "~/utils/getLensClient";
import { ServerSignedIn } from "../ServerSignedIn";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { lensProfileToUser } from "../user/User";
import { UserAvatar } from "../user/UserAvatar";
import { SearchBar } from "./Search";

const UserBar = async () => {
  const { handle, profileId } = getCookieAuth();
  const { client } = await getLensClient();
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
        {/* <Separator className="max-w-[150px] mx-auto" /> */}
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
            <p>Welcome and thank you for being here so early!</p>
            <p>
              We would love to hear what you think! leave feedback on{" "}
              <a
                className="underline "
                href="https://github.com/pingpad-io/ping/issues"
                target="_blank"
                rel="noreferrer"
              >
                github
              </a>{" "}
              or{" "}
              <a className="underline " href="https://discord.gg/DhMeQAXW4F" target="_blank" rel="noreferrer">
                discord
              </a>
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
