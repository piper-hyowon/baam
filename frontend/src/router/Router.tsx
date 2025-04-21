// Router.js
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import styled from "@emotion/native";
import CalendarStackRouter from "./CalendarStackRouter";
import MemoStackRouter from "./MemoStackRouter";
import SettingStackRouter from "./SettingStackRouter";
import {
  BottomHomeIcon,
  BottomFriendsIcon,
  BottomCalendarIcon,
  BottomFolderIcon,
  BottomSettingIcon
} from "../assets/assets";
import { Image, StyleSheet, View, Text } from "react-native";
import SignUpStackRouter from "./SignUpStackRouter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuthStore from "../store/UserAuthStore";
import LoadingOverlay from "../components/common/ui/LoadingOverlay";
import HomeStackRouter from "./HomeStackRouter";
import axios from "axios";
import FriendsStackRouter from "./FriendsStackRouter";
import NotificationStackRouter from "./NotificationStackRouter";
import { SERVER_HOST } from "@env";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
interface CustomTabBarProps {
  state: any;
  navigation: any;
}

const CustomTabBar = ({ state, navigation }: CustomTabBarProps) => {
  return (
    <TabBarContainer>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const getIconSource = () => {
          switch (route.name) {
            case "Home":
              return BottomHomeIcon;
            case "Friends":
              return BottomFriendsIcon;
            case "Calendar":
              return BottomCalendarIcon;
            case "Memo":
              return BottomFolderIcon;
            case "Setting":
              return BottomSettingIcon;
            default:
              return null;
          }
        };
        const getText = () => {
          switch (route.name) {
            case "Home":
              return "홈";
            case "Friends":
              return "친구";
            case "Calendar":
              return "캘린더";
            case "Memo":
              return "수업함";
            case "Setting":
              return "설정";
            default:
              return null;
          }
        };

        return (
          <TabButton key={route.key} onTouchEnd={onPress}>
            <Image source={getIconSource()} style={[styles.icon, isFocused && styles.iconFocused]} />
            <Text
              style={{
                alignSelf: "stretch",
                fontSize: 12,
                lineHeight: 14,
                fontWeight: "600",
                fontFamily: "Pretendard",
                color: "#7b7b7b",
                textAlign: "center",
                marginTop: 4,
                marginBottom: 20
              }}
            >
              {getText()}
            </Text>
          </TabButton>
        );
      })}
    </TabBarContainer>
  );
};

export const MyTabs = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false
      }}
    >
      <Tab.Screen name="Home" component={HomeStackRouter} />
      <Tab.Screen name="Friends" component={FriendsStackRouter} />
      <Tab.Screen name="Calendar" component={CalendarStackRouter} />
      <Tab.Screen name="Memo" component={MemoStackRouter} />
      <Tab.Screen name="Setting" component={SettingStackRouter} options={{ unmountOnBlur: true }} />
    </Tab.Navigator>
  );
};
const TabBarContainer = styled(View)`
  flex-direction: row;
  width: "100%";
  height: 70px;
  background-color: #ffffff;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top-width: 1px;
  border-top-color: #7b7b7b;
`;
const TabButton = styled(View)`
  flex: 1;
  align-items: center;
`;
const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
    tintColor: "#7B7B7B" // 비활성화된 아이콘의 색상
  },
  iconFocused: {
    tintColor: "#8A7EFF" // 활성화된 아이콘의 색상
  }
});

function Router() {
  const { setToken, setIsAuthenticated, setRefreshToken } = useAuthStore();
  const [isTryingLogin, setIsTryingLogin] = useState(true);

  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem("refreshToken");

      if (storedToken) {
        axios
          .post(
            `${SERVER_HOST}/authentication/refresh-tokens`,
            {
              refreshToken: storedToken
            },
            {
              headers: {
                accept: "application/json",
                "Content-Type": "application/json"
              }
            }
          )
          .then(async (response) => {
            const accessToken = response.data.accessToken;
            const refreshToken = response.data.refreshToken;
            await AsyncStorage.setItem("refreshToken", refreshToken);
            await AsyncStorage.setItem("accessToken", accessToken);

            setRefreshToken(refreshToken);
            setToken(accessToken);
            setIsAuthenticated(true);
          })
          .catch((error) => {
            console.error(error);
          });
      }

      setTimeout(() => {
        setIsTryingLogin(false);
      }, 2500);
    }

    fetchToken();
  }, []);

  if (isTryingLogin) {
    return <LoadingOverlay />;
  }

  return <Navigation />;
}

function Navigation() {
  const { isAuthenticated } = useAuthStore();

  return !isAuthenticated ? <AuthStack /> : <AuthenticatedStack />;
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={SignUpStackRouter} />
    </Stack.Navigator>
  );
}

export function AuthenticatedStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BottomTab" component={MyTabs} />
      <Stack.Screen name="Notification" component={NotificationStackRouter} />
    </Stack.Navigator>
  );
}

export default Router;
