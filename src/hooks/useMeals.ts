import { Moment } from "moment";
import { fetchMealData } from "@/apis/meal/meal";
import { MealData } from "@/types/meal";
import { useCallback, useEffect, useState } from "react";

export const useMeal = (schoolId: number | null, date: Moment) => {
  const [meals, setMeals] = useState<MealData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchMeals = useCallback(async () => {
    if (schoolId === null) {
      setMeals([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchMealData(schoolId, date.format("YYYY-MM-DD"));
      if (data) {
        setMeals(data.list);
        setError(null);
      }
    } catch (err: any) {
      console.error(err);
      setError(err instanceof Error ? err : new Error("Unknown error occurred"));
      setMeals([]);
    } finally {
      setIsLoading(false);
    }
  }, [schoolId, date]);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  const refetch = useCallback(() => {
    fetchMeals();
  }, [fetchMeals]);

  return { meals, isLoading, error, refetch };
};
