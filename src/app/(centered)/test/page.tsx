import { FollowButton } from "~/components/FollowButton";
import Markdown from "~/components/Markdown";
import { lensProfileToUser } from "~/components/user/User";
import { getLensClient } from "~/utils/getLensClient";

const test = async () => {
  const { user, client } = await getLensClient();
  const anotherUser = await client.profile.fetch({ forHandle: "@lens/deana" }).then((res) => lensProfileToUser(res));

  return (
    <>
      <div className="prose dark:prose-invert p-8 lg:prose-lg">
        <h2>Testing</h2>
      </div>

      <Markdown content="@kualta @lens/kualta boop *bold* _italic_ `code`" />

      <FollowButton user={anotherUser} />
    </>
  );
};

export default test;
