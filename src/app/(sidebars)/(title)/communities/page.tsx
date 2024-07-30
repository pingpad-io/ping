import { Feed } from "~/components/Feed";
import { CommunityView } from "~/components/communities/CommunityView";

const endpoint = "/api/community";

const community = async () => {
  const communities = await getInitialFeed();

  if (!communities) {
    throw new Error("Failed to get communities");
  }

  return <Feed ItemView={CommunityView} endpoint={`${endpoint}`} initialData={communities} initialCursor={null} />;
};

const getInitialFeed = async () => {
  const data = await fetch(`https://pingpad.io${endpoint}`, {
    method: "GET",
  })
    .then((res) => res.json())
    .catch(() => {
      console.error("(×_×)⌒☆ Failed to fetch communities");
      return null;
    });

  const { communities } = data;

  return communities;
};

export default community;
