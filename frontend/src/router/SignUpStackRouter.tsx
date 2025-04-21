import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { SignUpStackParamList } from "../navigations/SignUpStackNavigation";
import LoginPage from "../pages/login/LoginPage";
import KakaoLoginPage from "../pages/login/KakaoLoginPage";
import KakaoLoginRedirect from "../pages/login/SocialLoginRedirect";
import SelectSchool from "../pages/login/SelectSchool";
import { Theme } from "../styles/theme";
import { Pressable } from "react-native";
import styled from "@emotion/native";
import SchoolInfoForm from "../pages/login/SchoolInfoForm";
import UserProfileForm from "../pages/login/UserProfileForm";
import UserNameForm from "../pages/login/UserNameForm";
import SocialLoginRedirect from "../pages/login/SocialLoginRedirect";

const Stack = createNativeStackNavigator<SignUpStackParamList>();

export default function SignUpStackRouter() {
  const navigation = useNavigation<NavigationProp<SignUpStackParamList>>();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Theme.colors.White },
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
      <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
      <Stack.Screen name="KakaoLoginPage" component={KakaoLoginPage} options={{ headerShown: false }} />
      <Stack.Screen name="SocialLoginRedirect" component={SocialLoginRedirect} options={{ headerShown: false }} />
      <Stack.Screen
        name="SelectSchool"
        component={SelectSchool}
        options={{
          title: "학교 선택"
        }}
      />
      <Stack.Screen
        name="SchoolInfoForm"
        component={SchoolInfoForm}
        options={{
          title: "정보 입력"
        }}
      />
      <Stack.Screen
        name="UserNameForm"
        component={UserNameForm}
        options={{
          title: "이름 입력"
        }}
      />
      <Stack.Screen
        name="UserProfileForm"
        component={UserProfileForm}
        options={{
          title: "프로필 설정"
        }}
      />
    </Stack.Navigator>
  );
}

const StyledImg = styled.Image`
  width: 32px;
  height: 32px;
`;
