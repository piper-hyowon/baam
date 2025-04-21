import { getFavoriteFriends } from "@/apis/favorite-friends/favorite-friends.apis";
import { FavoriteFriend } from "@/apis/favorite-friends/favorite-friends.type";
import { useCallback, useEffect, useState } from "react";

export const useFavoriteFriends = (initialCount: number) => {
  const [friends, setFriends] = useState<FavoriteFriend[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchFriends = useCallback(
    async (pageNum: number) => {
      if (!hasMore && pageNum !== 0) return;

      setLoading(true);
      setError(null);
      try {
        const result = await getFavoriteFriends({ count: initialCount, page: pageNum });
        if (result) {
          const { list, total } = result;

          setTotalCount(total);

          if (pageNum === 0) {
            setFriends(list);
          } else {
            setFriends((prev) => [...prev, ...list]);
          }

          setHasMore((prev) => (pageNum === 0 ? list.length < total : prev));
          setPage((prevPage) => prevPage + 1);
        }
      } catch (err: any) {
        console.error(err.message);
        console.error(err.stack);
        setError(err instanceof Error ? err : new Error("An error occurred"));
      } finally {
        setLoading(false);
      }
    },
    [initialCount]
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore && friends.length < totalCount) {
      fetchFriends(page);
    }
  }, [loading, hasMore, friends.length, totalCount, fetchFriends]);

  useEffect(() => {
    fetchFriends(0);
  }, [fetchFriends]);

  const refetch = useCallback(() => {
    setHasMore(true);
    setPage(0);
    fetchFriends(0);
  }, [fetchFriends]);

  return { friends, loading, error, refetch, loadMore, hasMore, totalCount };
};
