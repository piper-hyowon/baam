import styled from "@emotion/native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { AgendaList, CalendarProvider, ExpandableCalendar, LocaleConfig } from "react-native-calendars";
import { Positions } from "react-native-calendars/src/expandableCalendar";
import { MarkedDates } from "react-native-calendars/src/types";
import { Path, Svg } from "react-native-svg";
import { useGetAgenda } from "../../apis/calendar/calendar.queries";
import { CalendarStackParamList } from "../../navigations/CalendarStackNavigation";
import useAuthStore from "../../store/UserAuthStore";
import { Theme } from "../../styles/theme";
import AgendaItem from "./AgendaItem";

// 달력 설정
LocaleConfig.locales["kr"] = {
  monthNames: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
  monthNamesShort: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
  dayNames: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
  dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"]
};
LocaleConfig.defaultLocale = "kr";

interface Agenda {
  datetime: string;
  id: number;
  memo: string | null;
  title: string;
  type: string;
  subjectName: string | null;
}

interface FormattedItem {
  date: string;
  data: {
    id: number;
    memo: string | null;
    title: string;
    type: string;
    dayOfWeek: string;
    time: string;
    subjectName: string | null;
  }[];
}

function CustomCalendar() {
  // state
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [marked, setMarked] = useState<MarkedDates>({});
  const [formattedData, setFormattedData] = useState<FormattedItem[]>([]);

  const navigation = useNavigation<NavigationProp<CalendarStackParamList>>();

  const renderItem = useCallback(({ item, index }: { item: any; index: number }) => {
    const isFirst = index === 0;
    const uniqueKey = `${item.date}_${item.hour}_${index}`;

    return <AgendaItem key={uniqueKey} item={item} showDate={isFirst} />;
  }, []);

  // react-query
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();

  const { data: agendas } = useGetAgenda({ year, month });

  useEffect(() => {
    if (agendas && agendas.length > 0) {
      const newFormattedData: FormattedItem[] = agendas.reduce((acc: FormattedItem[], currentItem: Agenda) => {
        const [date, time] = currentItem.datetime.split(" ");
        const existingDateTime = acc.find((item) => item.date === date);

        // 요일 구하기
        function getDayOfWeek(dateString: string) {
          const daysOfWeek = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
          const date = new Date(dateString);
          return daysOfWeek[date.getDay()];
        }

        const newDateItem = {
          id: currentItem.id,
          memo: currentItem.memo,
          title: currentItem.title,
          type: currentItem.type,
          subjectName: currentItem.subjectName || null,
          dayOfWeek: getDayOfWeek(date),
          date,
          time: time.substring(0, 5)
        };

        if (existingDateTime) {
          existingDateTime.data.push(newDateItem);
        } else {
          acc.push({
            date,
            data: [newDateItem]
          });
        }

        return acc;
      }, []);

      setFormattedData(newFormattedData); // formattedData 상태 업데이트
    }
  }, [agendas]);

  const filteredItems = formattedData.filter((item) => item.date === selectedDate);

  useEffect(() => {
    // formattedData가 준비된 후 marked 설정
    if (formattedData.length > 0) {
      const markedDates = getMarkedDates(formattedData);
      setMarked(markedDates); // marked 상태 업데이트
    }
  }, [formattedData]); // formattedData가 변경될 때마다 실행

  function getMarkedDates(data: FormattedItem[]): MarkedDates {
    const marked: MarkedDates = {};
    data.forEach((item) => {
      const dots = item.data.map((event) => {
        return { key: event.type, color: getDotColor(event.type) };
      });

      if (item.data.length > 0) {
        marked[item.date] = {
          marked: true,
          dots: dots.slice(0, 3)
        };
      } else {
        marked[item.date] = { disabled: true };
      }
    });

    return marked;
  }

  function getDotColor(key: string) {
    switch (key) {
      case "school":
        return "#327CEA";
      case "class":
        return "#F92626";
      case "personal":
        return "#27B560";
      default:
        return "grey";
    }
  }

  return (
    <StyledView>
      <CalendarProvider date={new Date().toISOString().split("T")[0]}>
        <ExpandableCalendar
          markingType="multi-dot"
          theme={{
            selectedDayTextColor: Theme.colors.White,
            selectedDayBackgroundColor: Theme.colors.Gray900,
            todayTextColor: Theme.colors.Gray900,
            dayTextColor: Theme.colors.Gray900,
            textDisabledColor: "#d9e1e8",
            arrowColor: Theme.colors.Black,
            textDayFontFamily: "Pretendard-Medium",
            textMonthFontFamily: "EsaManruMedium",
            textDayHeaderFontFamily: "EsaManruMedium",
            monthTextColor: Theme.colors.Black
          }}
          firstDay={0}
          markedDates={marked}
          closeOnDayPress={false}
          showSixWeeks
          monthFormat={"M월"}
          initialPosition={Positions.OPEN}
          disablePan
          hideKnob
          style={{
            paddingBottom: 50
          }}
          onDayPress={(day) => setSelectedDate(day.dateString)}
        />
        <AgendaContainer>
          <AgendaList
            sections={filteredItems}
            renderItem={renderItem}
            sectionStyle={styles.section}
            initialNumToRender={10}
            maxToRenderPerBatch={5}
            windowSize={5}
            renderSectionHeader={() => <></>}
          />
          <ButtonContainer>
            <Pressable onPress={() => navigation.navigate("CalendarAddScreen", {})}>
              <Svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <Path
                  d="M0 28C0 12.536 12.536 0 28 0C43.464 0 56 12.536 56 28C56 43.464 43.464 56 28 56C12.536 56 0 43.464 0 28Z"
                  fill="#262626"
                />
                <Path
                  d="M36 25.3333L30.6667 20M15.3333 40.6667L19.8458 40.1653C20.3971 40.104 20.6728 40.0734 20.9304 39.99C21.159 39.916 21.3766 39.8114 21.5771 39.6791C21.8032 39.5301 21.9994 39.3339 22.3916 38.9417L40 21.3333C41.4728 19.8606 41.4728 17.4727 40 16C38.5272 14.5272 36.1394 14.5272 34.6667 16L17.0583 33.6084C16.666 34.0006 16.4699 34.1967 16.3208 34.4228C16.1885 34.6234 16.084 34.8409 16.01 35.0695C15.9266 35.3272 15.8959 35.6028 15.8347 36.1542L15.3333 40.6667Z"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </Svg>
            </Pressable>
          </ButtonContainer>
        </AgendaContainer>
      </CalendarProvider>
    </StyledView>
  );
}

export default CustomCalendar;

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "lightgrey"
  }
});

const StyledView = styled.View`
  flex: 1;
  background-color: white;
`;

const AgendaContainer = styled.View`
  background-color: white;
  flex: 1;
  margin: 20px 16px;
`;

const ButtonContainer = styled.View`
  width: 56px;
  height: 56px;
  position: absolute;
  right: 16px;
  bottom: 16px;
`;
