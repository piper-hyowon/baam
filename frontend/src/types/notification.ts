import { NotificationCategory } from "@/apis/notification/notification.enums";
import { NotificationData } from "@/apis/notification/notification.types";

export interface FCMMessage {
  messageId: string;
  data: NotificationData & { category: NotificationCategory };
  notification: {
    body: string;
    title: string;
  };
  from: string;
}

export interface NotificationState {
  message: FCMMessage | null;
  show: boolean;
}
