import styled from "@emotion/native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import SubtractIcon from "../../assets/images/icon_subtract.svg";
import HeaderRightText from "../../components/common/HeaderRightText";
import { SettingStackParamList } from "../../navigations/SettingStackNavigation";
import { useProfileStore } from "../../store/store";
import useUserStore from "../../store/UserStore";
import { Theme } from "../../styles/theme";
import ProfileInfoItem from "./ProfileInfoItem";

function ImagePickerScreen() {
  const navigation = useNavigation<NavigationProp<SettingStackParamList>>();

  const { fullName, schoolName, grade, className, profileImage, backgroundImage, setProfileImage, setBackgroundImage } =
    useUserStore();
  const [localProfileImage, setLocalProfileImage] = useState<string | null>(profileImage);

  const handleChoosePhoto = () => {
    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorCode) {
        console.error("ImagePicker Error: ", response.errorCode);
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        if (asset.uri) {
          console.log("Image URI: ", asset.uri);
          setLocalProfileImage(asset.uri);
        } else {
          console.error("Image URI is undefined");
        }
      } else {
        console.log("No image selected");
      }
    });
  };

  const profileInfo = [
    { label: "이름", value: fullName },
    { label: "학교", value: schoolName },
    { label: "학년 반", value: `${grade} ${className}` }
  ];

  const handleSave = () => {
    if (localProfileImage) {
      setProfileImage(localProfileImage);
    }
    navigation.goBack();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleSave}>
          <HeaderRightText>저장</HeaderRightText>
        </TouchableOpacity>
      )
    });
  }, [navigation, localProfileImage]);

  return (
    <Container>
      <ProfileImageContainer>
        <ProfileImageButton onPress={handleChoosePhoto}>
          <ProfileImage
            source={localProfileImage ? { uri: localProfileImage } : require("../../assets/images/dummyprofile.png")}
          />
          <IconContainer>
            <SubtractIcon width={32} height={32} />
          </IconContainer>
        </ProfileImageButton>
      </ProfileImageContainer>
      <TextContainer>
        {profileInfo.map((info, index) => (
          <ProfileInfoItem key={index} label={info.label} value={info.value} />
        ))}
      </TextContainer>
    </Container>
  );
}

export default ImagePickerScreen;

const Container = styled.View`
  background-color: ${Theme.colors.White};
  flex: 1;
  padding: 0px 16px;
  padding-top: 32px;
  gap: 24px;
`;

const ProfileImageContainer = styled.View`
  align-items: center;
`;

const ProfileImageButton = styled.Pressable`
  width: 128px;
  height: 128px;
  align-items: center;
  position: relative;
`;

const ProfileImage = styled.Image`
  width: 128px;
  height: 128px;
  border-radius: 9999px;
`;

const IconContainer = styled.View`
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 1;
  background-color: ${Theme.colors.White};
  border-radius: 9999px;
  border-width: 2px;
  border-color: ${Theme.colors.White};
`;

const TextContainer = styled.View`
  gap: 44px;
`;
