import React, { useState, useRef } from "react";
import { FlatList, Pressable } from "react-native";
import moment, { Moment } from "moment";
import styled from "@emotion/native";
import "moment/locale/ko";
import { DropDownDown, IconBell } from "@/assets/assets";
import { useNavigation } from "@react-navigation/native";
import { RootNavigationProp } from "@/navigations/RootNavigation";

type DateItem = Moment;

interface DateCarouselProps {
  selectedDate: Moment;
  onDateChange: (date: Moment) => void;
}

const generateDatesForMonth = (currentMonth: Moment): DateItem[] => {
  const startOfMonth = currentMonth.clone().startOf("month");
  const endOfMonth = currentMonth.clone().endOf("month");
  const datesArray: DateItem[] = [];

  let currentDate = startOfMonth;
  while (currentDate.isSameOrBefore(endOfMonth, "day")) {
    datesArray.push(moment(currentDate));
    currentDate.add(1, "day");
  }

  return datesArray;
};

const DateCarousel: React.FC<DateCarouselProps> = ({ selectedDate, onDateChange }) => {
  const navigation = useNavigation<RootNavigationProp>();

  const navigateToNotification = () => {
    navigation.navigate("Notification", { screen: "NotificationScreen" });
  };

  const [currentMonth, setCurrentMonth] = useState<Moment>(moment());
  const [dates, setDates] = useState<DateItem[]>(generateDatesForMonth(currentMonth));
  const flatListRef = useRef<FlatList<DateItem>>(null);

  const todayIndex = dates.findIndex((date) => date.isSame(moment(), "day"));

  const handleMonthChange = (direction: "prev" | "next") => {
    const newMonth = currentMonth.clone().add(direction === "next" ? 1 : -1, "month");
    setCurrentMonth(newMonth);
    setDates(generateDatesForMonth(newMonth));
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
  };

  const handleDatePress = (index: number, date: Moment) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index,
        animated: true,
        viewOffset: 0,
        viewPosition: 0.25
      });
    }
    onDateChange(date);
  };

  const renderItem = ({ item, index }: { item: DateItem; index: number }) => {
    const isSelected = item.isSame(selectedDate, "day");
    const isToday = item.isSame(moment(), "day");

    return (
      <DateItemContainer onPress={() => handleDatePress(index, item)} isSelected={isSelected}>
        <IndicatorContainer>
          {isToday ? (
            <>
              <GrayDot />
              <GrayDot />
              <GrayDot />
            </>
          ) : (
            <GrayDot />
          )}
        </IndicatorContainer>
        <DateNumber isSelected={isSelected}>{item.format("D")}</DateNumber>
        {/* 요일은 영어로 표시(Mon..) 해야해서 여기서만 en 사용 */}
        <DayText isSelected={isSelected}>{item.clone().locale("en").format("ddd")}</DayText>
        {isSelected && <SelectedIndicator />}
      </DateItemContainer>
    );
  };

  return (
    <Container>
      <TopBar>
        <MonthContainer>
          <MonthText>{currentMonth.format("M월")}</MonthText>
          <Pressable>
            <CalendarIconImage source={DropDownDown} style={{ transform: [{ scaleY: -1 }] }} />
          </Pressable>
        </MonthContainer>
        <Pressable onPress={navigateToNotification}>
          <NotificationIconImage source={IconBell} />
        </Pressable>
      </TopBar>

      <FlatList
        ref={flatListRef}
        data={dates}
        renderItem={renderItem}
        keyExtractor={(item) => item.format("YYYY-MM-DD")}
        horizontal
        initialScrollIndex={todayIndex}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        snapToAlignment="center"
        snapToInterval={60}
        decelerationRate="fast"
        getItemLayout={(data, index) => ({
          length: 60,
          offset: 60 * index,
          index
        })}
        style={{ flexGrow: 0 }}
      />
    </Container>
  );
};

const Container = styled.View`
  width: 360px;
  height: 144px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
`;

const TopBar = styled.View`
  width: 360px;
  height: 48px;
  padding: 10px 16px;
  background: white;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const MonthContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const MonthText = styled.Text`
  color: black;
  font-size: 24px;
  font-family: "Esamanru OTF";
  font-weight: 500;
  line-height: 28px;
`;

const CalendarIconImage = styled.Image`
  width: 24px;
  height: 24px;
`;

const NotificationIconImage = styled.Image`
  width: 24px;
  height: 24px;
`;

const DateItemContainer = styled.Pressable<{ isSelected: boolean }>`
  width: ${(props) => (props.isSelected ? "68px" : "60px")};
  height: ${(props) => (props.isSelected ? "80px" : "72px")};
  padding-top: 8px;
  padding-bottom: 14px;
  background: white;
  border-radius: 12px;
  border: 2px solid ${(props) => (props.isSelected ? "#434343" : "#E9E9E9")};
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-right: 16px;
  position: relative;
`;

const IndicatorContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 4px;
  position: absolute;
  top: 4px;
`;

const GrayDot = styled.View`
  width: 8px;
  height: 8px;
  background: rgba(217, 217, 217, 1);
  border-radius: 4px;
`;

const DateNumber = styled.Text<{ isSelected: boolean }>`
  color: ${(props) => (props.isSelected ? "#434343" : "black")};
  font-size: 17px; // 원래 20px (잘려서 17px로 수정)
  font-family: "Pretendard";
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0.5px;
  margin-top: 12px;
`;

const DayText = styled.Text<{ isSelected: boolean }>`
  color: ${(props) => (props.isSelected ? "#434343" : "#7B7B7B")};
  font-size: 14px;
  font-family: "Pretendard";
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0.5px;
  margin-top: 4px;
`;

const SelectedIndicator = styled.View`
  width: 40px;
  height: 4px;
  background: #434343;
  border-radius: 2px;
  position: absolute;
  bottom: 4px;
`;

export default DateCarousel;
