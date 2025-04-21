import React from "react";
import { SafeAreaView } from "react-native";
import Calendar from "../../components/calendar/Calendar";

interface CalendarHomeScreenProps {}

function CalendarHomeScreen({}: CalendarHomeScreenProps) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Calendar />
    </SafeAreaView>
  );
}

export default CalendarHomeScreen;
