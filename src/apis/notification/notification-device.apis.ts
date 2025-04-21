import { HttpStatusCode } from "axios";
import { customAxios } from "../instance";
import { ErrorCode } from "../error-codes";
import { DeviceType, OSType } from "./notification-device.enums";

/**
 * 디바이스 토큰 등록/업데이트
 * - 매번 사용자 로그인 성공 직후
 * - 푸시 알림 권한을 사용자가 허용한 직후
 * - 앱이 새로운 푸시 토큰을 받았을 때 (토큰 갱신) */
export const registerDeviceToken = async (data: {
  deviceToken: string;
  deviceType: DeviceType;
  osType: OSType;
}): Promise<void> => {
  try {
    const response = await customAxios.post("device-token", data);
    if (response.status !== HttpStatusCode.Ok) {
      if (response.status === HttpStatusCode.BadRequest) {
        if (response.data.code === ErrorCode.MalformedExpoPushToken) {
          throw new Error(`Expo 푸시 토큰 형식이 아님: ${data.deviceToken}`);
        } else if (response.data.code === ErrorCode.InvalidParameter) {
          throw new Error(`잘못된 요청 파라미터: '${response.data}`);
        }
      } else {
        throw new Error(`디바이스 토큰 등록/업데이트 실패: ${response.data}`);
      }
    }
  } catch (error) {
    throw error;
  }
};

/**
 * 디바이스 토큰 비활성화
 * - 로그아웃시 호출
 */
export const deactivateDeviceToken = async (deviceToken: string): Promise<boolean | null> => {
  const response = await customAxios.patch(`device-token/deactivate`, {
    deviceToken
  });

  switch (response.status) {
    case HttpStatusCode.Ok:
    case HttpStatusCode.Created:
      return response.data as boolean;
    case HttpStatusCode.BadRequest:
      if (response.data.code === ErrorCode.MalformedExpoPushToken) {
        console.log("Expo 푸시 토큰 형식이 아님:", deviceToken);
      } else if (response.data.code === ErrorCode.InvalidParameter) {
        console.log("잘못된 요청 파라미터:", response.data);
      }
      return null;
    case HttpStatusCode.NotFound:
      console.log("디바이스 토큰이 존재하지 않음:", deviceToken);
      return null;
    default:
      console.error("디바이스 토큰 비활성화 실패:", response.data);
      return null;
  }
};
