import { HttpStatusCode } from "axios";
import { customAxios } from "../instance";
import { ErrorCode } from "../error-codes";

const handleFriendRequestError = (response: any, requestId: number) => {
  if (response.status === HttpStatusCode.BadRequest && response.data.code === ErrorCode.InvalidParameter) {
    throw new Error(`잘못된 요청 파라미터: ${response.data}`);
  } else if (response.status === HttpStatusCode.NotFound && response.data.code === ErrorCode.ContentNotFound) {
    throw new Error(`요청 ID 없음: ${requestId}`);
  } else {
    throw new Error("친구 요청 처리 실패");
  }
};

const processFriendRequest = async (
  method: "patch" | "delete",
  requestId: number,
  data?: { accept: boolean }
): Promise<void> => {
  try {
    const response = await customAxios[method](`friend-requests/${requestId}`, data);
    if (response.status !== HttpStatusCode.Ok) {
      handleFriendRequestError(response, requestId);
    }
  } catch (error) {
    throw error;
  }
};

export const acceptOrRejectFriendRequest = async (requestId: number, accept: boolean): Promise<void> => {
  return processFriendRequest("patch", requestId, { accept });
};

export const deleteSentFriendRequest = async (requestId: number): Promise<void> => {
  return processFriendRequest("delete", requestId);
};
