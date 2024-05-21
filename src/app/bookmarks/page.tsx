import { BookmarkIcon } from "lucide-react";
import { FeedPageLayout } from "~/components/FeedPagesLayout";
import { InfiniteScroll } from "~/components/InfiniteScroll";
import { lensNotificationToNative } from "~/components/notifications/Notification";
import { lensItemToPost } from "~/components/post/Post";
import { Card } from "~/components/ui/card";
import { getLensClient } from "~/utils/getLensClient";

const endpoint = "/api/bookmarks";

const notifications = async () => {
  const { bookmarks, nextCursor } = await getInitialFeed();

  if (!bookmarks) {
    throw new Error("Failed to get bookmarks (╥_╥)");
  }

  return (
    <Card className="z-[30] hover:bg-card p-4 py-0 border-0">
      <h1 className="text-xl font-bold p-4 flex flex-row gap-2 items-center">
        <BookmarkIcon className="-mb-1" fill="hsl(var(--foreground))" /> bookmarks
      </h1>
      <InfiniteScroll endpoint={endpoint} initialData={bookmarks} initialCursor={nextCursor} />
    </Card>
  );
};

const getInitialFeed = async () => {
  const { client, isAuthenticated } = await getLensClient();
  if (isAuthenticated) {
    const data = await client.publication.bookmarks.fetch({}).catch((error) => {
      throw new Error(error.message);
    });

    if (data.isFailure()) throw new Error(data.error.message);

    const items = data.unwrap();
    const bookmarks = items.items?.map(lensItemToPost);

    return { bookmarks, nextCursor: items.pageInfo.next };
  }
  throw new Error("Unauthorized TT");
};

export default notifications;
