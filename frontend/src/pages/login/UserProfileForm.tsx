import styled from "@emotion/native";
import { Theme } from "../../styles/theme";
import { CardBackgroundImg, PencilImg } from "../../assets/assets";
import ImagePickerComponent from "../../components/common/ImagePicker";
import { Pressable, View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { SignUpStackParamList } from "../../navigations/SignUpStackNavigation";
import useUserStore from "../../store/UserStore";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuthStore from "../../store/UserAuthStore";

type UserProfileFormProps = StackScreenProps<SignUpStackParamList, "UserProfileForm">;

export default function UserProfileForm({ navigation }: UserProfileFormProps) {
  const {
    accessToken,
    schoolId,
    fullName,
    schoolName,
    grade,
    className,
    profileImage,
    backgroundImage,
    setProfileImage,
    setBackgroundImage
  } = useUserStore((state) => state);

  const { refreshToken, setIsAuthenticated } = useAuthStore();

  function takeImageHandler({ type, imageUri }: { type: string; imageUri: string }) {
    switch (type) {
      case "bg":
        setBackgroundImage(imageUri);
        break;
      case "profile":
        setProfileImage(imageUri);
        break;
    }
  }

  function formSubmitHandler() {
    const formData = new FormData();
    formData.append("schoolId", String(schoolId));
    formData.append("grade", String(grade));
    formData.append("className", String(className));
    formData.append("fullName", fullName);

    axios
      .patch("https://b-site.site/user", formData, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data"
        }
      })
      .then((response) => {
        AsyncStorage.setItem("accessToken", accessToken);
        AsyncStorage.setItem("refreshToken", refreshToken);
        setIsAuthenticated(true);
        navigation.reset({
          index: 0,
          routes: [{ name: "BottomTab" }]
        });

      })
      .catch((error) => {
        console.log(error);
      });
  }

  let backgroundImagePreview = <BackgroundImage source={CardBackgroundImg} />;
  let profileImagePreview = (
    <DefaultProfile>
      <DefaultProfileName>{fullName}</DefaultProfileName>
    </DefaultProfile>
  );

  if (backgroundImage.length > 0) {
    backgroundImagePreview = <BackgroundImage source={{ uri: backgroundImage }} />;
  }

  if (profileImage.length > 0) {
    profileImagePreview = <ProfileImage source={{ uri: profileImage }} />;
  }

  return (
    <RootContainer>
      <CardContainer>
        {backgroundImagePreview}
        <ProfileImageContainer>
          {profileImagePreview}
          <ImagePickerComponent
            type="profile"
            onTakeImage={takeImageHandler}
            style={{ position: "absolute", width: 32, height: 32, top: 54, right: 2, bottom: 2, left: 54 }}
          >
            <EditIcon source={PencilImg} />
          </ImagePickerComponent>
        </ProfileImageContainer>
        <TextContainer>
          <StyledText>{schoolName}</StyledText>
          <StyledText>
            {grade}학년 {className}반
          </StyledText>
        </TextContainer>
        <ImagePickerComponent
          type="bg"
          onTakeImage={takeImageHandler}
          style={{ position: "absolute", width: 32, height: 32, bottom: 12, right: 16 }}
        >
          <EditIcon source={PencilImg} />
        </ImagePickerComponent>
      </CardContainer>
      <Caption>프로필은 이후에도 변경이 가능해요.</Caption>
      <ButtonContainer>
        <Pressable onPress={formSubmitHandler}>
          <View>
            <ButtonText>다음</ButtonText>
          </View>
        </Pressable>
      </ButtonContainer>
    </RootContainer>
  );
}

const RootContainer = styled.View`
  flex: 1;
  background-color: ${Theme.colors.White};
  padding-top: 148px;
  padding-bottom: 24px;
  padding-horizontal: 16px;
  align-items: center;
`;

const CardContainer = styled.View`
  position: relative;
  width: 328px;
  height: 200px;
  border-radius: 16px;
`;

const EditIcon = styled.Image`
  width: 32px;
  height: 32px;
`;

const BackgroundImage = styled.Image`
  width: 328px;
  height: 200px;
  border-radius: 16px;
`;

const TextContainer = styled.View`
  position: absolute;
  left: 10px;
  bottom: 16px;
  right: 54px;
`;

const StyledText = styled.Text`
  ${Theme.typo.Head_01_MD};
  color: ${Theme.colors.White};
`;

const ProfileImageContainer = styled.View`
  width: 88px;
  height: 88px;
  position: absolute;
  top: 56px;
  right: 120px;
`;

const DefaultProfile = styled.View`
  width: 80px;
  height: 80px;
  border: 4px solid #51ca81;
  background-color: white;
  border-radius: 9999px;
  justify-content: center;
  align-items: center;
`;

const DefaultProfileName = styled.Text`
  font-family: EsaManruMedium;
  font-size: 24px;
  color: #51ca81;
`;

const ProfileImage = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 9999px;
`;

const Caption = styled.Text`
  position: absolute;
  bottom: 88px;
  font-family: "Pretendard";
  font-size: 14px;
  color: ${Theme.colors.Gray900};
`;

const ButtonContainer = styled.View`
  width: 100%;
  position: absolute;
  left: 16px;
  bottom: 24px;
  height: 52px;
  padding: 16px 12px;
  border-radius: 24px;
  background-color: #8a7eff;
`;

const ButtonText = styled.Text`
  ${Theme.typo.Label_03};
  text-align: center;
  color: ${Theme.colors.White};
`;
