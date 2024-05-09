import { Notification } from "./Notification";

export const NotificationView = ({ notification }: { notification: Notification }) => <div>{notification.id}</div>;
