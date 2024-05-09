import { UserAvatarArray } from "../UserAvatar";
import { Card, CardContent } from "../ui/card";
import { Notification } from "./Notification";

export const NotificationView = ({ notification }: { notification: Notification }) => {
  let text = "";
  switch (notification.type) {
    case "Reaction":
      text = "liked your post";
      break;
    case "Comment":
      text = "commented on your post";
      break;
    case "Follow":
      text = "started following you";
      break;
    case "Mention":
      text = "mentioned you in a post";
      break;
    case "Repost":
      text = "shared your post";
      break;
    case "Action":
      text = "acted on your post";
      break;
    case "Quote":
      text = "quoted your post";
      break;
  }
  return (
    <Card>
      <CardContent className="flex h-fit flex-row gap-4 p-2 sm:p-4">
        <div className=" shrink-0 grow-0 rounded-full">
          <UserAvatarArray users={notification.who} />
        </div>
        <div className="flex w-3/4 shrink group max-w-2xl grow flex-col place-content-start">
          {text}
          {notification?.actedOn?.content}
        </div>
      </CardContent>
    </Card>
  );
};
