import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NotificationStackParamList } from "@/navigations/NotificationStackNavigation";
import NotificationsScreen from "@/pages/notification/NotificationScreen";

const Stack = createNativeStackNavigator<NotificationStackParamList>();

function NotificationStackRouter() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NotificationScreen" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}

export default NotificationStackRouter;
