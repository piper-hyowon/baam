import { Platform, Dimensions } from "react-native";
import { DeviceType, OSType } from "@/apis/notification/notification-device.enums";

export function getDeviceType(): DeviceType {
  const { width, height } = Dimensions.get("window");
  const aspectRatio = height / width;

  if (Platform.OS === "web") return DeviceType.OTHER;
  if (aspectRatio > 1.6) return DeviceType.PHONE;
  return DeviceType.TABLET;
}

export function getOSType(): OSType {
  if (Platform.OS === "ios") return OSType.IOS;
  if (Platform.OS === "android") return OSType.ANDROID;
  return OSType.OTHER;
}
