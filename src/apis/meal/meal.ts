import { MealResponse } from "@/types/meal";
import axios, { HttpStatusCode } from "axios";
import { SERVER_HOST } from "@env";

export const fetchMealData = async (schoolId: number, date: string): Promise<MealResponse | null> => {
  // 급식 API 는 토큰 필요 없음
  // 예외처리도 schoolId Not Found 만 있음
  const response = await axios.get(`${SERVER_HOST}/school-dataset/meal?schoolId=${schoolId}&date=${date}`);
  if (response.status === HttpStatusCode.Ok) {
    return response.data;
  } else {
    console.log("급식 조회 실패: ", response.data);

    return null;
  }
};
