import { LensClient, production, PublicationMetadataMainFocusType, PublicationType } from "@lens-protocol/client";
import { HomePage } from "./HomePage";
import { localStorage } from "~/utils/storage";
import { SessionType, useSession as useLensSession } from "@lens-protocol/react-web";
import { getAuthenticatedClient } from "~/utils/getAuthenticatedClient";
import { createWalletClient } from "viem";
import { useAccount, useWalletClient } from "wagmi";
import { getWalletClient } from "@wagmi/core";
import { Card } from "~/components/ui/card";

const home = async () => {
  // const wagmi = useAccount()
  // const wallet = createWalletClient(wagmi)

  // const result = await lens.explore.publications({
  //   orderBy: ExplorePublicationsOrderByType.Latest,
  // });

  // const { data: session } = useLensSession();
  // if (!session || !(session.type === SessionType.WithProfile)) {
  // return null
  // }

  // const handle = session.profile.handle?.fullHandle
  // const publications = await lens.feed.fetch({ where: { for: "@kualta" } });

  return (
    <>
      <Card className="z-[30] sticky top-0 flex-col hidden sm:flex flex-none p-4 border-0">
      {/* <PostWizard /> */}

      <HomePage />
      </Card>
      {/* <Feed {...posts} /> */}
    </>
  );
};

export default home;
