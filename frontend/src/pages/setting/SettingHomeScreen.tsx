import styled from "@emotion/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Image, SafeAreaView, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import BtnRight from "../../assets/images/btn_right.svg";
import Dialog from "../../components/common/Dialog";
import Switch from "../../components/common/Switch";
import useAuthStore from "../../store/UserAuthStore";
import { Theme } from "../../styles/theme";
import { VectorLeft } from "../../assets/assets";
import { StackScreenProps } from "@react-navigation/stack";
import { SettingStackParamList } from "../../navigations/SettingStackNavigation";
// import useUserStore from "@/store/UserStore";
type SettingHomeScreenProps = StackScreenProps<SettingStackParamList, "SettingHomeScreen">;

type User = {
  id: number;
  status: string;
  provider: string;
  schoolId: number;
  schoolName: string;
  grade: number;
  className: string;
  fullName: string;
  profileImageUrl?: string;
  backgroundImageUrl?: string;
  isTimetablePublic: boolean;
  isClassPublic: boolean;
  notificationsEnabled: boolean;
};
const API_URL = "https://b-site.site";
function SettingHomeScreen({ navigation, route }: SettingHomeScreenProps) {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noti, setNoti] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<User>();
  const [dummyState, setDummyState] = useState(false);

  // const { schoolName, grade, className, fullName, profileImage, backgroundImage, isClassPublic } = useUserStore();
  const { setToken, setIsAuthenticated, setRefreshToken } = useAuthStore();
  // const { accessToken: token } = useUserStore();
  const { token } = useAuthStore();

  const handleToggleSwitch = async () => {
    try {
      // 쿼리 파라미터로 enabled 값 전달
      const enabledValue = noti ? "false" : "true"; // noti 값에 따라 true 또는 false
      const url = `https://b-site.site/notifications-setting?enabled=${enabledValue}`;

      await axios.patch(
        url, // 쿼리 파라미터 포함된 URL
        {}, // PATCH 요청 시 body가 필요 없으므로 빈 객체
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}` // 실제 토큰으로 교체
          }
        }
      );

      setNoti(!noti); // 알림 설정 상태 토글
    } catch (error: any) {
      console.error("Error alarm setting:", error.response ? error.response.data : error.message);
    }
  };

  const handleLogout = () => {
    try {
      setToken("");
      setIsAuthenticated(false);
      setRefreshToken("");
    } catch (error) {
      console.error("Error fetching user info:", error);
    } finally {
      navigation.navigate("LoginPage");
    }
  };
  const handleShowDialog = () => {
    setIsDialogVisible(true);
  };

  const handleHideDialog = () => {
    setIsDialogVisible(false);
  };

  const handleConfirmDialog = async () => {
    //[ ]TODO : 회원 탈퇴 로직 추가
    try {
      const response = await axios.delete(`${API_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setToken("");
      setIsAuthenticated(false);
      setRefreshToken("");
    } catch (error) {
      console.error("Error fetching user info:", error);
    } finally {
      navigation.navigate("LoginPage");
    }
    handleHideDialog();
  };
  useEffect(() => {
    const getUserProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://b-site.site/user", {
          headers: {
            "Content-Type": "application/json", // JSON 형식으로 데이터를 보낼 것을 명시
            Authorization: `Bearer ${token}` // 필요시, Authorization 헤더에 토큰 포함
          }
        });
        setUserInfo(response.data);
        setNoti(response.data.notificationsEnabled);
      } catch (error: any) {
        console.error(error.response ? error.response.data : error.message); // 오류 처리
      } finally {
        setLoading(false);
      }
    };
    getUserProfile();
  }, []);
  const customerServiceOptions = [
    {
      label: "서비스약관",
      action: () => navigation.navigate("TermsOfServiceScreen")
    },
    {
      label: "로그아웃하기",
      action: handleLogout
    },
    {
      label: "회원 탈퇴하기",
      action: handleShowDialog
    }
  ];

  return (
    <Container>
      {loading && ( // 로딩 상태면 인디케이터 표시
        <LoadingContainer>
          <ActivityIndicator size="large" color="#898989" />
        </LoadingContainer>
      )}
      <Header style={{ zIndex: 2 }}>
        <BackButton onPress={() => navigation.goBack()}>
          <BackIcon source={VectorLeft} />
        </BackButton>
        <Text
          style={{
            fontSize: 18,
            lineHeight: 26,
            fontWeight: "600",
            fontFamily: "Pretendard",
            color: "#262626",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 272,
            height: 28
          }}
        >
          설정
        </Text>
        <View style={{ width: 24, height: 24 }} />
      </Header>

      <View>
        <ProfileButton
          style={{ paddingHorizontal: 16 }}
          onPress={() =>
            navigation.navigate("ProfileScreen", {
              fullName: userInfo?.fullName,
              schoolName: userInfo?.schoolName,
              schoolId: userInfo?.schoolId,
              grade: userInfo?.grade,
              className: userInfo?.className,
              isTimetablePublic: userInfo?.isTimetablePublic,
              isClassPublic: userInfo?.isClassPublic,
              profileImageUrl: userInfo?.profileImageUrl,
              backgroundImageUrl: userInfo?.backgroundImageUrl
            })
          }
        >
          <Image
            source={
              userInfo?.profileImageUrl
                ? { uri: userInfo.profileImageUrl }
                : require("../../assets/images/dummyprofile.png")
            }
            style={{ width: 48, height: 48, borderRadius: 24 }}
          />
          <UserInfo>
            <NameText>{userInfo?.fullName}</NameText>
            <SchoolText>{userInfo?.schoolName}</SchoolText>
          </UserInfo>
          <BtnRight style={{ marginLeft: "auto" }} />
        </ProfileButton>
        <Divider />
        <SectionContainer>
          <SectionTitleText>권한설정</SectionTitleText>
          <AlertContainer>
            <AlertInnerContainer>
              <AlertText>알림</AlertText>
              <AlertDescription>Baam에서 제공하는 알림에 동의합니다.</AlertDescription>
            </AlertInnerContainer>
            <Switch isSwitchOn={noti} onToggle={handleToggleSwitch} />
          </AlertContainer>
        </SectionContainer>
        <Divider />
        <SectionContainer>
          <SectionTitleText>고객센터</SectionTitleText>
          <CustomerContainer>
            {customerServiceOptions.map((option, index) => (
              <StyledPressable key={index} onPress={option.action}>
                <ButtonText>{option.label}</ButtonText>
                <BtnRight width={24} height={24} />
              </StyledPressable>
            ))}
          </CustomerContainer>
        </SectionContainer>
      </View>
      {isDialogVisible && (
        <Dialog
          isVisible={isDialogVisible}
          title="정말 탈퇴하시겠어요?"
          message="탈퇴하시게 되면 추후 서비스 이용이 어렵습니다. 추후 재가입하더라도 기존 데이터는 모두 삭제됩니다."
          onConfirm={handleConfirmDialog}
          onCancel={handleHideDialog}
        />
      )}
    </Container>
  );
}

export default SettingHomeScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #fff;
`;

const ProfileButton = styled.Pressable`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  gap: 16px;
`;

const UserInfo = styled.View`
  gap: 6px;
`;

const NameText = styled.Text`
  font-size: 20px;
  font-weight: 600;
`;

const SchoolText = styled.Text`
  font-size: 16px;
  font-weight: 500;
`;

const Divider = styled.View`
  height: 8px;
  background-color: ${Theme.colors.Gray100};
`;

const SectionContainer = styled.View`
  gap: 32px;
  padding: 16px;
  background-color: ${Theme.colors.White};
`;

const SectionTitleText = styled.Text`
  font-size: 18px;
`;

const AlertContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
`;

const AlertInnerContainer = styled.View`
  gap: 8px;
`;

const AlertText = styled.Text`
  font-size: 16px;
  font-weight: 400;
`;

const AlertDescription = styled.Text`
  font-size: 14px;
  font-weight: 400;
  color: #7c7c7c;
`;

const CustomerContainer = styled.View`
  gap: 32px;
`;

const StyledPressable = styled.Pressable`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  font-weight: 500;
`;
const Header = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-vertical: 10px;
  padding-horizontal: 16px;
`;
const BackButton = styled(TouchableOpacity)`
  padding: 10px;
`;

const BackIcon = styled(Image)`
  width: 8.5px;
  height: 15px;
`;
const LoadingContainer = styled(View)`
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  align-items: "center";
  justify-content: "center";
  background-color: "rgba(0, 0, 0, 0.5)";
  z-index: 1000;
`;
