import styled from "@emotion/native";
import React, { useState } from "react";
import { Pressable, View, ImageBackground, Image, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import ImagePicker from "react-native-image-crop-picker";
import Switch from "../../components/common/Switch";
import { White } from "../../assets/assets";
import ProfileInfoItem from "./ProfileInfoItem";
import { VectorLeft, PencilImg } from "../../assets/assets";
import axios from "axios";
import useAuthStore from "../../store/UserAuthStore";
import { Platform } from "react-native";
import RNFetchBlob from "rn-fetch-blob";
import { StackScreenProps } from "@react-navigation/stack";
import { SettingStackParamList } from "../../navigations/SettingStackNavigation";
// fullName,schoolName,grade,className, isTimetablePublic,isClassPublic
type ProfileScreenProps = StackScreenProps<SettingStackParamList, "ProfileScreen">;

function ProfileScreen({ navigation, route }: ProfileScreenProps) {
  const [localProfileImage, setLocalProfileImage] = useState<string | null>(route.params.profileImageUrl || "");
  const [localBackgroundImage, setLocalBackgroundImage] = useState<string | null>(
    route.params.backgroundImageUrl || ""
  );
  const [isTT, setIsTT] = useState<boolean>(route.params.isTimetablePublic || false);
  const [isCP, setIsCP] = useState<boolean>(route.params.isClassPublic || false);
  const {
    fullName,
    schoolName,
    grade,
    className,
    schoolId,
    isTimetablePublic,
    isClassPublic,
    profileImageUrl,
    backgroundImageUrl
  } = route.params;
  const { token } = useAuthStore();
  const getPhotos = async (chooseType: string) => {
    launchImageLibrary(
      {
        mediaType: "photo",
        includeBase64: true,
        maxHeight: 400,
        maxWidth: 400
      },
      (response) => {
        if (response.didCancel) {
          console.log("cancled");
        } else if (response.errorCode) {
          console.log(response.errorMessage);
        } else {
          if (chooseType === "profile") {
            setLocalProfileImage(response.assets?.[0].uri ? response.assets?.[0].uri : "");
            uploadImage(response.assets?.[0], chooseType);
          } else {
            setLocalBackgroundImage(response.assets?.[0].uri ? response.assets?.[0].uri : "");
            uploadImage(response.assets?.[0], chooseType);
          }
        }
      }
    );
  };

  const uploadImage = async (imagePath: any, chooseType: string) => {
    try {
      const isAndroid = Platform.OS === "android";
      let photoUri = imagePath.uri;

      var photo = {
        uri: photoUri,
        type: "multipart/form-data",
        name: imagePath.fileName || "image.jpeg"
      };
      const formData = new FormData();
      formData.append("schoolId", schoolId);
      formData.append("grade", grade);
      formData.append("className", className);
      formData.append("fullName", fullName);
      formData.append("isClassPublic", isClassPublic);
      formData.append("isTimetablePublic", isTimetablePublic);
      if (chooseType === "profile") {
        formData.append("profileImage", photo);
      } else {
        formData.append("backgroundImage", photo);
      }

      const response = await axios.patch("https://b-site.site/user", formData, {
        headers: {
          accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error("Upload error:", error);
    }
  };
  const profileInfo = [
    { label: "이름", value: fullName },
    { label: "학교", value: schoolName },
    { label: "학년 반", value: `${grade}학년 ${className}반` }
  ];

  const handleImagePress = () => {
    navigation.navigate("ImagePickerScreen");
  };
  const handleSave = () => {
    if (localProfileImage) {
      // setProfileImage(localProfileImage);
    }
    navigation.goBack();
  };

  const handleToggleTT = async () => {
    try {
      const param = {
        isTimetablePublic: isTT ? "false" : "true"
      };
      const url = "https://b-site.site/user";

      await axios.patch(
        url, // 쿼리 파라미터 포함된 URL
        param, // PATCH 요청 시 body가 필요 없으므로 빈 객체
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}` // 실제 토큰으로 교체
          }
        }
      );

      setIsTT(!isTT); // 알림 설정 상태 토글
    } catch (error: any) {
      console.error("Error alarm setting:", error.response ? error.response.data : error.message);
    }
  };

  const handleToggleCP = async () => {
    try {
      const param = {
        isClassPublic: isCP ? "false" : "true"
      };
      const url = "https://b-site.site/user";

      await axios.patch(
        url, // 쿼리 파라미터 포함된 URL
        param, // PATCH 요청 시 body가 필요 없으므로 빈 객체
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}` // 실제 토큰으로 교체
          }
        }
      );

      setIsCP(!isCP); // 알림 설정 상태 토글
    } catch (error: any) {
      console.error("Error alarm setting:", error.response ? error.response.data : error.message);
    }
  };
  return (
    <Container>
      <Header style={{ zIndex: 2 }}>
        <BackButton
          onPress={() => {
            //저장 추가
            navigation.goBack();
          }}
        >
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
          내 프로필
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ProfileEditScreen", {
              fullName: fullName,
              schoolId: schoolId,
              schoolName: schoolName,
              grade: grade,
              className: className
            })
          }
        >
          <Text
            style={{
              fontSize: 16,
              lineHeight: 18,
              fontWeight: "500",
              fontFamily: "Pretendard",
              color: "#262626",
              textAlign: "right"
            }}
          >
            수정
          </Text>
        </TouchableOpacity>
      </Header>
      <View style={{ marginHorizontal: 16 }}>
        <ImageBackground
          source={localBackgroundImage ? { uri: localBackgroundImage } : White}
          imageStyle={{ borderRadius: 16, height: 220, marginTop: 8, marginBottom: 20 }}
          style={{}}
        />
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: 230
          }}
        >
          <Pressable
            style={{ width: 80, height: 80, alignItems: "center", position: "relative" }}
            onPress={() => getPhotos("profile")}
          >
            <ProfileImage
              source={localProfileImage ? { uri: localProfileImage } : require("../../assets/images/dummyprofile.png")}
            />
            <IconContainer>
              <Image source={PencilImg} style={{ width: 32, height: 32 }} />
            </IconContainer>
          </Pressable>
          <Text
            style={{
              position: "absolute",
              left: 20,
              top: 164,
              fontSize: 16,
              lineHeight: 20,
              fontWeight: "500",
              fontFamily: "Esamanru OTF",
              color: "#fff",
              textAlign: "left"
            }}
          >
            {schoolName}
          </Text>
          <Text
            style={{
              position: "absolute",
              left: 20,
              top: 190,
              fontSize: 16,
              lineHeight: 20,
              fontWeight: "500",
              fontFamily: "Esamanru OTF",
              color: "#fff",
              textAlign: "left"
            }}
          >
            {grade}학년 {className}반
          </Text>

          <TouchableOpacity
            onPress={() => getPhotos("background")}
            style={{ position: "absolute", right: 20, bottom: 20, zIndex: 1, borderRadius: 1000 }}
          >
            <Image source={PencilImg} style={{ width: 32, height: 32 }} />
          </TouchableOpacity>
        </View>

        <TextContainer>
          {profileInfo.map((info, index) => (
            <ProfileInfoItem key={index} label={info.label} value={info.value} />
          ))}
          <AlertContainer>
            <AlertInnerContainer>
              <AlertText>시간표 공개 여부</AlertText>
              <AlertDescription>나의 시간표를 모두에게 공개합니다</AlertDescription>
            </AlertInnerContainer>

            <Switch isSwitchOn={isTT} onToggle={handleToggleTT} />
          </AlertContainer>
          <AlertContainer>
            <AlertInnerContainer>
              <AlertText>학급정보 공개 여부</AlertText>
              <AlertDescription>나의 학급정보를 모두에게 공개합니다</AlertDescription>
            </AlertInnerContainer>

            <Switch isSwitchOn={isCP} onToggle={handleToggleCP} />
          </AlertContainer>
        </TextContainer>
      </View>
    </Container>
  );
}

export default ProfileScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #fff;
`;

const ProfileImageContainer = styled.View`
  align-items: center;
`;

const ProfileImage = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 40px;
`;

const IconContainer = styled.View`
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 1;
  border-radius: 1000px;
`;

const TextContainer = styled.View`
  margin-top: 43px;
  gap: 40px;
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
const AlertContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
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
