import { NotificationCategory } from "./notification.enums";

// NotificationData 는 각 알림의 액션에 필요한 데이터(category 에 따라 다름)
export interface CalendarNotificationData {
  eventId: number;
}

export interface SubjectMemoNotificationData {
  eventId: number;
}

export interface FriendRequestNotificationData {
  requestId: number; // 수락, 거절/취소 시 사용
  requestType: "sent" | "received";
}

export type NotificationData = CalendarNotificationData | SubjectMemoNotificationData | FriendRequestNotificationData;

export interface Notification {
  id: number;
  category: NotificationCategory;
  title: string;
  body: NotificationData;
  sentAt: Date; // 알림 발송 시간
  isRead: boolean;
  message?: string | null;
}
