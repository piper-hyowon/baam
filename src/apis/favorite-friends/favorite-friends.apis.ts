import { HttpStatusCode } from "axios";
import { customAxios } from "../instance";
import { FavoriteFriendResponse } from "./favorite-friends.type";

export const getFavoriteFriends = async ({
  count,
  page
}: {
  count: number;
  page: number;
}): Promise<FavoriteFriendResponse> => {
  try {
    const response = await customAxios.get<FavoriteFriendResponse>(`friends/favorites?count=${count}&page=${page}`);

    if (response.status === HttpStatusCode.Ok) {
      return response.data;
    } else {
      throw new Error(`친구 목록 조회 실패: ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
};
