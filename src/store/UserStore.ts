import { NumberArray } from "react-native-svg";
import { create } from "zustand";

interface UserStore {
  accessToken: string;
  schoolId: number | null;
  schoolName: string | null;
  schoolAddress: string | null;
  grade: number | null;
  className: string | null;
  fullName: string;
  profileImage: string;
  backgroundImage: string;
  isClassPublic: boolean;
  isTimetablePublic: boolean;
  setAccessToken: (token: string) => void;
  setSchoolId: (id: number) => void;
  setSchoolName: (name: string) => void;
  setSchoolAddress: (address: string) => void;
  setGrade: (grade: number | null) => void;
  setClassName: (className: string | null) => void;
  setFullName: (userName: string) => void;
  setProfileImage: (profileImage: string) => void;
  setBackgroundImage: (backgroundImage: string) => void;
  setIsClassPublic: (isClassPublic: boolean) => void;
  setIsTimetablePublic: (isTimetablePublic: boolean) => void;
}

const useUserStore = create<UserStore>((set) => ({
  accessToken: "",
  schoolId: null,
  schoolName: null,
  schoolAddress: null,
  grade: null,
  className: null,
  fullName: "",
  profileImage: "",
  backgroundImage: "",
  isClassPublic: true,
  isTimetablePublic: true,
  setAccessToken: (token) => set({ accessToken: token }),
  setSchoolId: (id) => set({ schoolId: id }),
  setSchoolName: (name) => set({ schoolName: name }),
  setSchoolAddress: (address) => set({ schoolAddress: address }),
  setGrade: (grade) => set({ grade: grade }),
  setClassName: (className) => set({ className: className }),
  setFullName: (fullName) => set({ fullName: fullName }),
  setProfileImage: (profileImage) => set({ profileImage: profileImage }),
  setBackgroundImage: (backgroundImage) => set({ backgroundImage: backgroundImage }),
  setIsClassPublic: (isClassPublic) => set({ isClassPublic: isClassPublic }),
  setIsTimetablePublic: (isTimetablePublic) => set({ isTimetablePublic: isTimetablePublic })
}));

export default useUserStore;
