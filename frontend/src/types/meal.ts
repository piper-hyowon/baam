export interface MealData {
  date: string;
  type: "조식" | "중식" | "석식";
  menu: string[];
}

export interface MealResponse {
  total: number;
  list: MealData[];
}
