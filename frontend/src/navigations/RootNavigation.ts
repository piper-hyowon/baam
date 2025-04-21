import { NavigationProp, NavigatorScreenParams } from "@react-navigation/native";
import { HomeStackParamList } from "./HomeStackNavigation";
import { FriendsStackParamList } from "./FriendsStackNavigation";
import { CalendarStackParamList } from "./CalendarStackNavigation";
import { MemoStackParamList } from "./MemoStackNavigation";
import { SettingStackParamList } from "./SettingStackNavigation";
import { SignUpStackParamList } from "./SignUpStackNavigation";
import { NotificationStackParamList } from "./NotificationStackNavigation";

export type RootStackParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Friends: NavigatorScreenParams<FriendsStackParamList>;
  Calendar: NavigatorScreenParams<CalendarStackParamList>;
  Memo: NavigatorScreenParams<MemoStackParamList>;
  Setting: NavigatorScreenParams<SettingStackParamList>;
  SignUp: NavigatorScreenParams<SignUpStackParamList>;
  Notification: NavigatorScreenParams<NotificationStackParamList>;
};

export type RootNavigationProp = NavigationProp<RootStackParamList>;
