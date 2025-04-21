import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackScreenProps } from "@react-navigation/stack";
import axios from "axios";
import { useEffect } from "react";
import { View } from "react-native";
import { SignUpStackParamList } from "../../navigations/SignUpStackNavigation";
import useAuthStore from "../../store/UserAuthStore";
import useUserStore from "../../store/UserStore";
import { DEVICE_PUSH_TOKEN_KEY } from "@/constants/async-storage-keys";
import { registerDeviceToken } from "@/apis/notification/notification-device.apis";
import { getDeviceType, getOSType } from "@/utils/DeviceUtil";

type SocialLoginRedirectProps = StackScreenProps<SignUpStackParamList, "SocialLoginRedirect">;

export default function SocialLoginRedirect({ navigation, route }: SocialLoginRedirectProps) {
  const provider = route.params.provider;
  const code = route.params.code;

  const { setAccessToken } = useUserStore((state) => state);
  const { setToken, setRefreshToken, setIsAuthenticated } = useAuthStore();

  useEffect(() => {
    const requestBody = {
      code,
      provider
    };

    // 기 가입 이력 여부에 따른 스크린 이동
    async function checkUserStatusAndNavigate() {
      const response = await axios.post("https://b-site.site/authentication", requestBody, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      const accessToken = response.data.accessToken;
      const refreshToken = response.data.refreshToken;
      const status = response.data.user.status;

      setAccessToken(accessToken);
      setToken(accessToken);
      setRefreshToken(refreshToken);

      // 기기에 jwt 토큰 저장
      await AsyncStorage.setItem("accessToken", accessToken);
      await AsyncStorage.setItem("refreshToken", refreshToken);

      const storedDeviceToken = (await AsyncStorage.getItem(DEVICE_PUSH_TOKEN_KEY)) || "";

      if (storedDeviceToken) {
        await registerDeviceToken({
          deviceToken: storedDeviceToken,
          deviceType: getDeviceType(),
          osType: getOSType()
        });
      }

      // 최초 가입 회원(학교 선택 화면으로 이동)
      if (status === "active") {
        // 스크린 이동
        setIsAuthenticated(true);
        navigation.reset({
          index: 0,
          routes: [{ name: "BottomTab" }]
        });
      } else {
        // 처음 가입
        navigation.navigate("SelectSchool");
      }
    }

    checkUserStatusAndNavigate();
  }, []);

  return <View></View>;
}
