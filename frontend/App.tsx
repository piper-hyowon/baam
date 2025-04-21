import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect } from "react";
import { StatusBar, StyleSheet, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "react-native/Libraries/NewAppScreen";
import Router from "./src/router/Router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEVICE_PUSH_TOKEN_KEY } from "./src/constants/async-storage-keys";
import { useNotification } from "./src/hooks/useNotification";
import { NotificationProvider } from "./src/contexts/NotificationContext";
import { FCMMessage } from "./src/types/notification";
import InAppNotification from "./src/components/notification/InAppNotification";

// 백그라운드 메시지 핸들러
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("[+] Background message handled: ", remoteMessage);
});

const queryClient = new QueryClient();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter
  };

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <NavigationContainer>
          <AppWithNotification backgroundStyle={backgroundStyle} isDarkMode={isDarkMode} />
        </NavigationContainer>
      </NotificationProvider>
    </QueryClientProvider>
  );
}

function AppWithNotification({
  backgroundStyle,
  isDarkMode
}: {
  backgroundStyle: { backgroundColor: string };
  isDarkMode: boolean;
}) {
  const { notificationState, showNotification, hideNotification } = useNotification();

  // 알림 권한 요청
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    // if enabled (TODO:)
  }

  useEffect(() => {
    requestUserPermission();
    getDevicePushToken();
    const unsubscribe = subscribe();
    return () => unsubscribe();
  }, []);

  const getDevicePushToken = async () => {
    const token = await messaging().getToken();
    if (token) {
      await AsyncStorage.setItem(DEVICE_PUSH_TOKEN_KEY, token);
    }
  };

  /**
   * FCM 메시지를 앱이 foreground 상태일 경우 메시지를 수신
   */
  const subscribe = () => {
    return messaging().onMessage(async (remoteMessage) => {
      showNotification(remoteMessage as FCMMessage);
    });
  };

  return (
    <SafeAreaView style={[backgroundStyle, styles.rootContainer]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <Router />
      {notificationState.show && notificationState.message && (
        <InAppNotification message={notificationState.message} onHide={hideNotification} duration={4000} />
      )}
    </SafeAreaView>
  );
}
export default App;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1
  }
});
