import React, { createContext, useState, useCallback, useRef } from "react";
import { FCMMessage, NotificationState } from "../types/notification";

export interface NotificationContextType {
  notificationState: NotificationState;
  showNotification: (message: FCMMessage) => void;
  hideNotification: () => void;
}

const initialState: NotificationContextType = {
  notificationState: { message: null, show: false },
  showNotification: () => {},
  hideNotification: () => {}
};

export const NotificationContext = createContext<NotificationContextType>(initialState);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notificationState, setNotificationState] = useState<NotificationState>({
    message: null,
    show: false
  });
  const notificationQueue = useRef<FCMMessage[]>([]);

  const showNotification = useCallback(
    (message: FCMMessage) => {
      if (notificationState.show) {
        // 현재 알림이 표시 중이면 큐에 추가
        notificationQueue.current.push(message);
      } else {
        // 알림이 표시 중이 아니면 바로 표시
        setNotificationState({ message, show: true });
      }
    },
    [notificationState.show]
  );

  const hideNotification = useCallback(() => {
    setNotificationState({ message: null, show: false });

    if (notificationQueue.current.length > 0) {
      const nextNotification = notificationQueue.current.shift();
      if (nextNotification) {
        setNotificationState({ message: nextNotification, show: true });
      }
    }
  }, []);

  return (
    <NotificationContext.Provider value={{ notificationState, showNotification, hideNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
