import { Feed } from "~/components/Feed";
import { lensNotificationToNative } from "~/components/notifications/Notification";
import { NotificationView } from "~/components/notifications/NotificationView";
import { getServerAuth } from "~/utils/getServerAuth";
import { fetchNotifications } from "@lens-protocol/client/actions";

const endpoint = "/api/notifications";

const notifications = async () => {
  const { notifications, nextCursor } = await getInitialFeed();

  if (!notifications) {
    throw new Error("Failed to get notifications (T T)");
  }

  return (
    <Feed ItemView={NotificationView} endpoint={endpoint} initialData={notifications} initialCursor={nextCursor} />
  );
};

const getInitialFeed = async () => {
  const { client, isAuthenticated } = await getServerAuth();
  
  if (!isAuthenticated) {
    throw new Error("Unauthorized TT");
  }
  
  try {
    // Try using the fetchNotifications action with sessionClient
    if (client.isSessionClient()) {
      const result = await fetchNotifications(client, {
        cursor: undefined,
        filter: {
          timeBasedAggregation: true
        }
      });
      
      if (result.isErr()) {
        throw new Error(result.error.message);
      }
      
      const notifications = result.value.items.map(lensNotificationToNative);
      
      return { 
        notifications, 
        nextCursor: result.value.pageInfo.next 
      };
    } else {
      throw new Error("Session client required for notifications");
    }
  } catch (error) {
    console.error("Error using fetchNotifications action:", error);
    
    // We no longer need the fallback since the client.notifications.fetch() method
    // is deprecated in the new API. Instead, we'll throw an error.
    throw new Error("Failed to fetch notifications: " + (error.message || "Unknown error"));
  }
};

export default notifications;
