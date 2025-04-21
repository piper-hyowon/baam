import appleAuth from "@invertase/react-native-apple-authentication";
import { StackScreenProps } from "@react-navigation/stack";
import LottieView from "lottie-react-native";
import { useEffect, useState } from "react";
import { Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { AnimatedLogoImage, AppleImg, KakaoImg } from "../../assets/assets";
import { SignUpStackParamList } from "../../navigations/SignUpStackNavigation";
import * as S from "./styles";

type LoginPageProps = StackScreenProps<SignUpStackParamList, "LoginPage">;

export default function LoginPage({ navigation }: LoginPageProps) {
  let user: any = null;

  const [credentialStateForUser, updateCredentialStateForUser] = useState<any>(-1);

  async function fetchAndUpdateCredentialState(updateCredentialStateForUser: any) {
    if (user === null) {
      updateCredentialStateForUser("N/A");
    } else {
      const credentialState = await appleAuth.getCredentialStateForUser(user);
      if (credentialState === appleAuth.State.AUTHORIZED) {
        updateCredentialStateForUser("AUTHORIZED");
      } else {
        updateCredentialStateForUser(credentialState);
      }
    }
  }

  useEffect(() => {
    if (!appleAuth.isSupported) return;

    fetchAndUpdateCredentialState(updateCredentialStateForUser).catch((error) =>
      updateCredentialStateForUser(`Error: ${error.code}`)
    );
  }, []);

  useEffect(() => {
    if (!appleAuth.isSupported) return;

    return appleAuth.onCredentialRevoked(async () => {
      console.warn("Credential Revoked");
      fetchAndUpdateCredentialState(updateCredentialStateForUser).catch((error) =>
        updateCredentialStateForUser(`Error: ${error.code}`)
      );
    });
  }, []);

  if (Platform.OS === "ios" && !appleAuth.isSupported) {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <Text>Apple Authentication is not supported on this device.</Text>
      </View>
    );
  }

  async function handleSignInApple(updateCredentialStateForUser: any) {
    console.warn("Beginning Apple Authentication");

    // start a login request
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME]
      });

      console.log("appleAuthRequestResponse", appleAuthRequestResponse);

      const { user: newUser, email, nonce, identityToken, realUserStatus /* etc */ } = appleAuthRequestResponse;

      user = newUser;

      fetchAndUpdateCredentialState(updateCredentialStateForUser).catch((error) =>
        updateCredentialStateForUser(`Error: ${error.code}`)
      );

      if (identityToken) {
        navigation.navigate("SocialLoginRedirect", { code: identityToken, provider: "apple" });
      } else {
        // no token - failed sign-in?
      }

      if (realUserStatus === appleAuth.UserStatus.LIKELY_REAL) {
        console.log("I'm a real person!");
      }

      console.warn(`Apple Authentication Completed, ${user}, ${email}`);
    } catch (error: any) {
      if (error.code === appleAuth.Error.CANCELED) {
        console.warn("User canceled Apple Sign in.");
      } else {
        console.error(error);
      }
    }
  }

  return (
    <S.RootContainer>
      <S.ImageContainer>
        <LottieView source={AnimatedLogoImage} autoPlay loop style={{ width: 360, height: 800 }} />
      </S.ImageContainer>
      <S.TextContainer>
        <S.Title>너는 어떤 수업 듣고 있어?</S.Title>
        <S.SubTitle>내 시간표 관리부터</S.SubTitle>
        <S.SubTitle>친구들 수업 확인까지 동시에!</S.SubTitle>
      </S.TextContainer>
      <S.ButtonContainer>
        <Pressable onPress={() => navigation.navigate("KakaoLoginPage")}>
          <S.PrimaryButtonContainer>
            <Image source={KakaoImg} style={{ width: 29, height: 24 }} />
            <S.PrimaryButtonText>카카오로 로그인</S.PrimaryButtonText>
          </S.PrimaryButtonContainer>
        </Pressable>
        <Pressable
          onPress={() => {
            handleSignInApple(updateCredentialStateForUser);
          }}
        >
          {Platform.OS === "ios" && (
            <S.SecondaryButtonContainer>
              <Image source={AppleImg} style={{ width: 20, height: 24 }} />
              <S.SecondaryButtonText>애플로 로그인</S.SecondaryButtonText>
            </S.SecondaryButtonContainer>
          )}
        </Pressable>
      </S.ButtonContainer>
    </S.RootContainer>
  );
}

const styles = StyleSheet.create({
  appleButton: {
    width: 200,
    height: 60,
    margin: 10
  },
  header: {
    margin: 10,
    marginTop: 30,
    fontSize: 18,
    fontWeight: "600"
  },
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "pink"
  },
  horizontal: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 10
  }
});
