import { useNavigation } from "@react-navigation/native";
import { RootNavigationProp } from "@/navigations/RootNavigation";
import { NotificationCategory } from "@/apis/notification/notification.enums";

/**
 * 인앱 알림 클릭시 페이지 이동
 */
export const useInAppNotificationNavigation = () => {
  const navigation = useNavigation<RootNavigationProp>();

  const navigateByInAppNotification = (category: NotificationCategory) => {
    switch (category) {
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
        // 친구 요청 알림은 수락/거절/취소를 [알림페이지]에서만 가능하기 때문에
        // [알림 페이지]로 이동
        // 단, [알림 페이지] 에서 친구 요청 아이템 클릭시 [친구 목록] 페이지로 이동
        navigation.navigate("Notification", { screen: "NotificationScreen" });
        break;
      default:
        console.warn("Unknown notification category");
    }
  };

  return navigateByInAppNotification;
};
