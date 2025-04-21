import styled from "@emotion/native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Theme } from "../styles/theme";
import { Pressable } from "react-native";
import { SettingStackParamList } from "../navigations/SettingStackNavigation";
import ImagePickerScreen from "../pages/setting/ImagePickerScreen";
import ProfileEditScreen from "../pages/setting/ProfileEditScreen";
import ProfileScreen from "../pages/setting/ProfileScreen";
import SchoolSearchScreen from "../pages/setting/SchoolSearchScreen";
import SettingHomeScreen from "../pages/setting/SettingHomeScreen";
import TermsOfServiceScreen from "../pages/setting/TermsOfServiceScreen";
import LoginPage from "../pages/login/LoginPage";

const Stack = createNativeStackNavigator<SettingStackParamList>();
export default function SettingStackRouter() {
  const navigation = useNavigation<NavigationProp<SettingStackParamList>>();

  // const navigateToProfileEditScreen = (school?: string) => {
  //   navigation.navigate("ProfileEditScreen", { school });
  // };

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "Theme.colors.White " },
        headerTitleStyle: {
          fontSize: 18,
          fontFamily: "Pretendard-Bold"
        },
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerLeft: () => (
          <Pressable onPress={() => navigation.goBack()}>
            <StyledImg source={require("../assets/images/btn_left.png")} />
          </Pressable>
        )
      }}
    >
      <Stack.Screen name="SettingHomeScreen" component={SettingHomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="SchoolSearchScreen"
        component={SchoolSearchScreen}
        options={{ headerShown: false, presentation: "modal" }}
      />
      <Stack.Screen name="ProfileEditScreen" component={ProfileEditScreen} options={{ headerShown: false }} />
      <Stack.Screen name="TermsOfServiceScreen" component={TermsOfServiceScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ImagePickerScreen" component={ImagePickerScreen} options={{ headerShown: false }} />
      <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

const StyledImg = styled.Image`
  width: 32px;
  height: 32px;
`;
