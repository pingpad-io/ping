import { UserAvatarArray } from "../UserAvatar";
import { Card, CardContent } from "../ui/card";
import { Notification } from "./Notification";

export const NotificationView = ({ notification }: { notification: Notification }) => {
  let notificationText = "";
  switch (notification.type) {
    case "Reaction":
      notificationText = "liked your post";
      break;
    case "Comment":
      notificationText = "commented on your post";
      break;
    case "Follow":
      notificationText = "started following you";
      break;
    case "Mention":
      notificationText = "mentioned you in a post";
      break;
    case "Repost":
      notificationText = "shared your post";
      break;
    case "Action":
      notificationText = "acted on your post";
      break;
    case "Quote":
      notificationText = "quoted your post";
      break;
  }
  const usersText = notification.who.map((profile, i) => {
    const user = profile.name ? profile.name : profile.handle;
    if (notification.who.length === 1) {
      return user;
    }
    if (i === notification.who.length - 1) {
      return ` and ${user}`;
    }
    return `${user}, `;
  });

  return (
    <Card>
      <CardContent className="flex h-fit flex-row gap-4 p-2 sm:p-4">
        <div className=" shrink-0 grow-0 rounded-full">
          <UserAvatarArray users={notification.who} />
        </div>
        <div className="flex flex-col w-3/4 shrink group max-w-2xl grow gap-2 place-content-start">
          {usersText} {notificationText}
          <div>{notification?.actedOn?.content}</div>
        </div>
      </CardContent>
    </Card>
  );
};
