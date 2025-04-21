export const themeColor = "black";
export const lightThemeColor = "black";

export const getTheme = () => {
  const disabledColor = "gray";
  const extraDaysColor = "gray";

  return {
    // arrows
    arrowColor: "black",
    arrowStyle: { padding: 0 },
    // knob
    expandableKnobColor: themeColor,
    // month
    monthTextColor: "black",
    textMonthFontSize: 16,
    textMonthFontFamily: "HelveticaNeue",
    textMonthFontWeight: "600" as const,
    // day names
    textSectionTitleColor: "black",
    textDayHeaderFontSize: 12,
    textDayHeaderFontFamily: "HelveticaNeue",
    textDayHeaderFontWeight: "normal" as const,
    // dates
    todayTextColor: "#af0078",
    textDayFontSize: 20,
    textDayFontFamily: "HelveticaNeue",
    textDayFontWeight: "600" as const,
    textDayStyle: { marginTop: 4 },
    // selected date
    selectedDayBackgroundColor: themeColor,
    selectedDayTextColor: "white",
    // disabled date
    textDisabledColor: disabledColor,
    // extra days
    extraDayTextColor: extraDaysColor,
    // dot (marked date)
    dotColor: "blue",
    selectedDotColor: "blue",
    disabledDotColor: disabledColor,
    dotStyle: { marginTop: 6, width: 6, height: 6, borderRadius: 9999, marginHorizontal: 2 },
    calendarBackground: "#F8F8F8",

    "stylesheet.calendar.main": {
      monthView: {
        gap: 22
      },
      dayContainer: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      },
      day: {
        basic: {
          width: 28,
          height: 28,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 4
        },
        text: {
          fontSize: 16,
          color: themeColor,
          textAlign: "center"
        },
        today: {
          backgroundColor: "#af0078",
          borderRadius: 16,
          justifyContent: "center",
          alignItems: "center"
        },
        selected: {
          backgroundColor: themeColor,
          borderRadius: 16,
          justifyContent: "center",
          alignItems: "center"
        },
        disabledText: {
          color: disabledColor,
          textAlign: "center"
        },
        extraText: {
          color: extraDaysColor,
          textAlign: "center"
        }
      },
      dotsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 4
      }
    }
  };
};
