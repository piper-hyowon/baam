import HeaderComponent from "@/components/notification/Header";
import NotificationItem from "@/components/notification/Item";
import styled from "@emotion/native";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { FriendRequestNotificationData, Notification } from "@/apis/notification/notification.types";
import { NotificationCategory } from "@/apis/notification/notification.enums";
import { RootNavigationProp } from "@/navigations/RootNavigation";
import { getNotifications, markAsRead } from "@/apis/notification/notification.apis";
import { acceptOrRejectFriendRequest, deleteSentFriendRequest } from "@/apis/friend-request.ts/friend-request.apis";

const PAGE_SIZE = 15;

const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalNotifications, setTotalNotifications] = useState(0);

  const loadNotifications = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const result = await getNotifications(page, PAGE_SIZE);

      if (result) {
        const { total, list } = result;
        setNotifications((prev) => [...prev, ...list]);
        setTotalNotifications(total);
        setHasMore(notifications.length + list.length < total);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleNotificationPress = async (notification: Notification) => {
    try {
      if (notification.category !== NotificationCategory.FriendRequest) {
        markAsRead(notification.id);
        updateNotificationReadStatus(notification.id);
      }
    } catch (error) {
      console.error("알림 읽음 처리 실패:", error);
    }

    // 알림 종류에 따른 페이지 이동
    switch (notification.category) {
      case NotificationCategory.Calendar:
        navigation.navigate("Calendar", {
          screen: "CalendarHomeScreen"
        });
        break;
      case NotificationCategory.SubjectMemo:
        navigation.navigate("Memo", {
          screen: "MemoScreen"
        });
        break;
      case NotificationCategory.FriendRequest:
        navigation.navigate("Friends", {
          screen: "FriendListScreen"
        });
        break;
      default:
        console.warn("Unknown notification category");
    }
  };

  const handleAcceptFriendRequest = async (requestId: number) => {
    await acceptOrRejectFriendRequest(requestId, true);
  };

  const handleRejectFriendRequest = async (requestId: number) => {
    await acceptOrRejectFriendRequest(requestId, false);
  };

  const handleCancelFriendRequest = async (requestId: number) => {
    await deleteSentFriendRequest(requestId);
  };

  const handleFriendRequestAction = async (
    notificationId: number,
    requestId: number,
    action: "accept" | "reject" | "cancel"
  ) => {
    try {
      switch (action) {
        case "accept":
          await handleAcceptFriendRequest(requestId);
          break;
        case "reject":
          await handleRejectFriendRequest(requestId);
          break;
        case "cancel":
          await handleCancelFriendRequest(requestId);
          break;
        default:
          console.warn("Unknown action:", action);
      }

      // 액션 성공 후 읽음 처리
      await markAsRead(notificationId);

      // 상태 업데이트
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId ? { ...notification, isRead: true } : notification
        )
      );
    } catch (error) {
      console.error(`Failed to ${action} friend request:`, error);
    }
  };

  const updateNotificationReadStatus = (notificationId: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === notificationId ? { ...notification, isRead: true } : notification
      )
    );
  };

  const groupNotifications = (notifications: Notification[]): Record<string, Notification[]> => {
    const groups: Record<string, Notification[]> = {};
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    notifications.forEach((notification) => {
      const notificationDate = new Date(notification.sentAt);
      let key: string;

      if (notificationDate.toDateString() === today.toDateString()) {
        key = "오늘";
      } else if (notificationDate.toDateString() === yesterday.toDateString()) {
        key = "어제";
      } else if (notificationDate.toDateString() === twoDaysAgo.toDateString()) {
        key = "그저께";
      } else {
        key = notificationDate.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
      }

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(notification);
    });

    return groups;
  };

  const groupedNotifications = groupNotifications(notifications);

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
      loadNotifications();
    }
  };

  return (
    <Container>
      <HeaderComponent onBackPress={handleBackPress} />
      {totalNotifications === 0 ? (
        <NoNotificationContainer>
          <NoNotificationText>알림이 없습니다.</NoNotificationText>
        </NoNotificationContainer>
      ) : (
        <ScrollView onScroll={handleScroll} scrollEventThrottle={400}>
          {Object.entries(groupedNotifications).map(([date, notifications]) => (
            <View key={date}>
              <DateHeader>{date}</DateHeader>
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  category={notification.category}
                  title={notification.title}
                  description={notification.message}
                  isRead={notification.isRead}
                  onPress={() => handleNotificationPress(notification)}
                  onAccept={
                    notification.category === NotificationCategory.FriendRequest
                      ? () =>
                          handleFriendRequestAction(
                            notification.id,
                            (notification.body as FriendRequestNotificationData).requestId,
                            "accept"
                          )
                      : undefined
                  }
                  onReject={
                    notification.category === NotificationCategory.FriendRequest
                      ? () =>
                          handleFriendRequestAction(
                            notification.id,
                            (notification.body as FriendRequestNotificationData).requestId,
                            "reject"
                          )
                      : undefined
                  }
                  onCancel={
                    notification.category === NotificationCategory.FriendRequest
                      ? () =>
                          handleFriendRequestAction(
                            notification.id,
                            (notification.body as FriendRequestNotificationData).requestId,
                            "cancel"
                          )
                      : undefined
                  }
                  requestType={
                    notification.category === NotificationCategory.FriendRequest
                      ? (notification.body as FriendRequestNotificationData).requestType
                      : undefined
                  }
                />
              ))}
            </View>
          ))}
          {loading && <ActivityIndicator size="large" color="#0000ff" />}
        </ScrollView>
      )}
    </Container>
  );
};
export default NotificationsScreen;

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #fff;
`;

const DateHeader = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #434343;
  padding: 8px 16px;
  background-color: white;
`;

const NoNotificationContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const NoNotificationText = styled.Text`
  font-size: 16px;
  color: #888;
`;
