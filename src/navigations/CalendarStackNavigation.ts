import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Agenda } from "../types/agenda";

export type CalendarStackParamList = {
  CalendarHomeScreen: undefined;
  CalendarAddScreen: { item?: Agenda };
};

export type CalendarAddScreenNavigationProp = NativeStackNavigationProp<CalendarStackParamList, "CalendarAddScreen">;
export type CalendarAddScreenRouteProp = RouteProp<CalendarStackParamList, "CalendarAddScreen">;
