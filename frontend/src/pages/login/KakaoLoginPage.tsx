import { StackScreenProps } from "@react-navigation/stack";
import { SafeAreaView, StyleSheet } from "react-native";
import WebView from "react-native-webview";
import { SignUpStackParamList } from "../../navigations/SignUpStackNavigation";
import { CLIENT_ID } from "@env";

type KakaoLoginPageProps = StackScreenProps<SignUpStackParamList, "KakaoLoginPage">;

export default function KakaoLoginPage({ navigation }: KakaoLoginPageProps) {
  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{
          uri: `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=https://b-site.site/authentication/kakao/callback`
        }}
        onNavigationStateChange={(navState) => {
          if (!navState.loading && navState.url.includes("authentication/kakao/callback")) {
            const code = navState.url.split("code=")[1];
            if (code) {
              navigation.navigate("SocialLoginRedirect", { code: code, provider: "kakao" });
            } else {
              console.log("Code not found in URL.");
            }
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
