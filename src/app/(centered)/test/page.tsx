import { FollowButton } from "~/components/FollowButton";
import Markdown from "~/components/Markdown";
import { fetchAccount } from "@lens-protocol/client/actions";
import { lensAcountToUser } from "~/components/user/User";
import { getServerAuth } from "~/utils/getServerAuth";

const test = async () => {
  const { user, client } = await getServerAuth();
  
  // Fetch account by username
  const result = await fetchAccount(client, { username: "lens/deana" });
  const anotherUser = result.isOk() ? lensAcountToUser(result.value) : null;

  return (
    <>
      <div className="prose dark:prose-invert p-8 lg:prose-lg">
        <h2>Testing</h2>
      </div>

      <Markdown content="@kualta @lens/kualta boop *bold* _italic_ `code`" />

      {anotherUser && <FollowButton user={anotherUser} />}
    </>
  );
};

export default test;
