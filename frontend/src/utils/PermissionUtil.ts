import { Alert, PermissionsAndroid, Platform } from "react-native";
import { PERMISSIONS, Permission, RESULTS, checkMultiple, request, requestMultiple } from "react-native-permissions";

/**
 * '앱의 권한'을 공통으로 관리하는 유틸입니다.
 */
class PermissionUtil {
  /**
   * Check Device Platform
   */

  cmmDevicePlatfromCheck = (): boolean => {
    let isUseDevice = true;

    if (Platform.OS !== "ios" && Platform.OS !== "android") {
      !isUseDevice;
    }

    return isUseDevice;
  };

  /**
   * 갤러리 접근 권한
   * @returns
   */
  cmmReqGalleryPermission = async (): Promise<boolean> => {
    let permissions: Permission[];

    let hasPermission = false;

    if (Platform.OS === "android") {
      permissions =
        Platform.Version >= 33
          ? [PERMISSIONS.ANDROID.READ_MEDIA_IMAGES, PERMISSIONS.ANDROID.READ_MEDIA_VIDEO]
          : Platform.Version > 28 && Platform.Version < 33
          ? [PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE]
          : [PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE];
    } else {
      permissions = [PERMISSIONS.IOS.PHOTO_LIBRARY];
    }

    try {
      // 갤러리 접근 권한 허용 여부 체크
      const result = await checkMultiple(permissions);
      const hasPermission = permissions.every((permission) => result[permission] === RESULTS.GRANTED);
      return hasPermission;
    } catch (err) {
      Alert.alert("Camera permission err");
      console.warn(err);
      return false;
    }
  };
}

export default new PermissionUtil();
