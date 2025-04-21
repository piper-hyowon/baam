import styled from "@emotion/native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Image, Pressable } from "react-native";
import { CalendarStackParamList } from "../navigations//CalendarStackNavigation";
import CalendarAddScreen from "../pages/calendar/CalendarAddScreen";
import CalendarHomeScreen from "../pages/calendar/CalendarHomeScreen";
import { Theme } from "../styles/theme";

const Stack = createNativeStackNavigator<CalendarStackParamList>();

const CalendarStackRouter = () => {
  const navigation = useNavigation<NavigationProp<CalendarStackParamList>>();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Theme.colors.White
        },
        headerTitleStyle: {
          fontFamily: "YourCustomFont",
          fontSize: 18,
          fontWeight: "500"
        },
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerLeft: () => (
          <Pressable onPress={() => navigation.goBack()}>
            <CustomImage source={require("../assets/images/btn_left.png")} />
          </Pressable>
        )
      }}
    >
      <Stack.Screen name="CalendarHomeScreen" component={CalendarHomeScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="CalendarAddScreen"
        component={CalendarAddScreen}
        options={{
          headerTitle: "일정 추가",
          headerRight: () => (
            <Pressable onPress={() => console.log("메모 삭제하기")}>
              <CustomImage source={require("../assets/images/hamburger.png")} />
            </Pressable>
          )
        }}
      />
    </Stack.Navigator>
  );
};

export default CalendarStackRouter;

const CustomImage = styled(Image)`
  width: 24px;
  height: 24px;
`;
