import { create } from "zustand";

interface UserState {
  id: number;
  status: string;
  provider: string;
  schoolId: number;
  schoolName: number;
  grade: number;
  className: string;
  fullName: string;
  profileImageUrl: string;
  backgroundImageUrl: string;
  isClassPublic: boolean;
  isTimetablePublic: boolean;
  setUser: (user: Partial<UserState>) => void;
  updateUser: (user: Partial<UserState>) => void;
}

export const useProfileStore = create<UserState>((set) => ({
  id: 0,
  status: "",
  provider: "",
  schoolId: 0,
  schoolName: 0,
  grade: 0,
  className: "",
  fullName: "",
  profileImageUrl: "",
  backgroundImageUrl: "",
  isClassPublic: true,
  isTimetablePublic: true,

  setUser: (user) => set(user),
  updateUser: (user) =>
    set((state) => ({
      ...state,
      ...user
    }))
}));
