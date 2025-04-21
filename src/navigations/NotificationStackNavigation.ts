import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type NotificationStackParamList = {
  NotificationScreen: undefined;
};

export type NotificationScreenNavigationProp = NativeStackNavigationProp<
  NotificationStackParamList,
  "NotificationScreen"
>;
