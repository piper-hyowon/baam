import { HttpStatusCode } from "axios";
import { customAxios } from "../instance";
import { ErrorCode } from "../error-codes";
import { Notification } from "./notification.types";

export const getNotifications = async (
  page: number,
  count: number
): Promise<{
  total: number;
  list: Notification[];
} | null> => {
  const response = await customAxios.get(`notifications?count=${count}&page=${page}`);

  if (response.status === HttpStatusCode.Ok) {
    return response.data;
  } else {
    console.error("알림 목록 조회 실패:", response.data);

    return null;
  }
};

export const markAsRead = async (id: number): Promise<boolean | null> => {
  const response = await customAxios.post(`notifications/${id}/read`);

  switch (response.status) {
    case HttpStatusCode.Ok:
      return response.data as boolean;
    case HttpStatusCode.NotModified:
      console.log("이미 읽은 알림:", id);
      return response.data as boolean;
    case HttpStatusCode.BadRequest:
      if (response.data.code === ErrorCode.InvalidParameter) {
        console.log("잘못된 요청 파라미터:", response.data);
        return null;
      }
    case HttpStatusCode.NotFound:
      console.log("알림 ID 없음", id);
      return null;
    default:
      console.error("알림 읽음 표시 실패:", response.data);
      return null;
  }
};
