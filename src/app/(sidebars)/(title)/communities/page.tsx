import { Feed } from "~/components/Feed";
import { CommunityView } from "~/components/communities/CommunityView";

const endpoint = "/api/community";

const community = async () => {

  return <Feed ItemView={CommunityView} endpoint={`${endpoint}`} initialData={undefined} initialCursor={undefined} />;
};


export default community;
