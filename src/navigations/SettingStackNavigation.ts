import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";

export type SettingStackParamList = {
  LoginPage: undefined;
  ImagePickerScreen: undefined;
  SchoolSearchScreen: { changeSchoolId: Function };
  ProfileEditScreen: {
    fullName?: string;
    schoolId?: number;
    schoolName?: string;
    grade?: number;
    className?: string;
  };
  ProfileScreen: {
    fullName?: string;
    schoolName?: string;
    schoolId?: number;
    grade?: number;
    className?: string;
    isTimetablePublic?: boolean;
    isClassPublic?: boolean;
    profileImageUrl?: string;
    backgroundImageUrl?: string;
  };
  TermsOfServiceScreen: undefined;
  SettingHomeScreen: undefined;
  BottomTab: undefined;
};
export type SettingScreenNavigationProp = NativeStackNavigationProp<SettingStackParamList, "SettingHomeScreen">;
