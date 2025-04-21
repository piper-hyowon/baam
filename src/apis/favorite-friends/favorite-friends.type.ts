export interface FavoriteFriend {
  userId: number;
  fullName: string;
  profileImage: string;
  activeClassNow: string;
}

export interface FavoriteFriendResponse {
  total: number;
  list: FavoriteFriend[];
}
