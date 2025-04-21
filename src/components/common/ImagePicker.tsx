import { Alert, Pressable, StyleProp, View, ViewStyle } from "react-native";
import { ReactNode, useState } from "react";
import PermissionUtil from "../../utils/PermissionUtil";
import { launchImageLibrary } from "react-native-image-picker";

interface ImagePickerProps {
  type: string;
  onTakeImage: (args: { type: string; imageUri: string }) => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function ImagePickerComponent({ type, onTakeImage, children, ...props }: ImagePickerProps) {
  async function takeImageHandler() {
    const hasPermission = await PermissionUtil.cmmReqGalleryPermission();

    if (!hasPermission) {
      Alert.alert("갤러리 접근 허용(필수)", "갤러리 접근 권한을 허용해주세요.");
      return;
    }

    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorCode) {
        console.error("ImagePicker Error: ", response.errorCode);
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        if (asset.uri) {
          onTakeImage({ type: type, imageUri: asset.uri });
        } else {
          console.error("Image URI is undefined");
        }
      } else {
        console.log("No image selected");
      }
    });
  }

  return (
    <View {...props}>
      <Pressable onPress={takeImageHandler}>{children}</Pressable>
    </View>
  );
}
