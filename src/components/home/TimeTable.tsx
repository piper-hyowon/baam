import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import styled from "@emotion/native";
import { useNavigation } from "@react-navigation/native";
import { HomeScreenNavigationProp, HomeStackParamList } from "../../navigations/HomeStackNavigation";
import { IconPlus } from "@/assets/assets";
import axios from "axios";
import { StackScreenProps } from "@react-navigation/stack";
import useAuthStore from "@/store/UserAuthStore";
// import useUserStore from "@/store/UserStore";

const timeSlots = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
const weekdays = ["월", "화", "수", "목", "금"];

const getCurrentDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const Timetable = () => {
  const [timetable, setTimetable] = useState([{}]);

  const router = useNavigation<HomeScreenNavigationProp>();
  // const { accessToken: token } = useUserStore();
  const { token } = useAuthStore();

  // 요일(day)과 교시(period)를 기준으로 수업을 찾아 반환하는 함수
  const getSubjectForDayAndPeriod = (day: number, period: number) => {
    const subject = timetable.find((entry) => entry.day === day && entry.period === period);
    return subject ? subject.subjectShort : null;
  };

  useEffect(() => {
    const fetchTimetable = async () => {
      // 현재 날짜 가져오기
      const currentDate = getCurrentDate();

      try {
        console.log("curr", currentDate);
        // URL에 날짜를 포함한 GET 요청 보내기
        const response = await axios.get(`https://b-site.site/timetable?date=${currentDate}`, {
          headers: {
            "Content-Type": "application/json", // JSON 형식으로 데이터를 보낼 것을 명시
            Authorization: `Bearer ${token}` // 필요시, Authorization 헤더에 토큰 포함
          }
        });
        // 받아온 데이터 상태에 저장
        setTimetable(response.data.list);
      } catch (error) {
        console.error("Error fetching timetable:", error);
      }
    };
    fetchTimetable();
  });
  const dayToNumber: { [key: string]: number } = {
    월: 1,
    화: 2,
    수: 3,
    목: 4,
    금: 5
  };
  // 셀이 클릭되었을 때 호출되는 함수
  const handleCellPress = (day: string, timeSlot: string) => {
    console.log(`${day}요일, ${timeSlot}`);

    router.push("AddTimeTableDetailScreen", {
      day: dayToNumber[day],
      period: timeSlot
    });
  };

  return (
    <ScrollView>
      <Container>
        <Table>
          {/* Y Axis */}
          <YAxisColumn>
            <YAxisLabel>
              <YAxisText />
            </YAxisLabel>
            {timeSlots.map((time, index) => (
              <YAxisLabel key={index}>
                <YAxisText>{time}</YAxisText>
              </YAxisLabel>
            ))}
          </YAxisColumn>

          {/* Table Data */}
          {weekdays.map((day, dayIndex) => (
            <Column key={dayIndex}>
              {/* X Axis Header (요일) */}
              <Cell isHeader>
                <HeaderText>{day}</HeaderText>
              </Cell>

              {/* Table Content (수업 데이터) */}
              {timeSlots.map((time, rowIndex) => {
                const subject = getSubjectForDayAndPeriod(dayIndex + 1, rowIndex + 1); // dayIndex와 rowIndex는 0부터 시작하므로 +1
                const cellBackgroundColor = subject
                  ? "#FFFFFF" /* 과목이 있을 때 배경색 (연한 초록색) */
                  : "#C9C4FF20"; /* 과목이 없을 때 배경색 (연한 빨간색) */

                const cellBorderColor = subject ? "#E9E9E9" : "#C9C4FF";
                return (
                  <Cell
                    key={time}
                    onPress={() => handleCellPress(day, time)}
                    style={{ backgroundColor: cellBackgroundColor, borderColor: cellBorderColor }} // 배경색 적용
                  >
                    {subject ? (
                      <CellText>{subject}</CellText>
                    ) : (
                      <Image source={IconPlus} style={{ width: 18, height: 18 }} />
                    )}
                  </Cell>
                );
              })}
            </Column>
          ))}
        </Table>
      </Container>
    </ScrollView>
  );
};

export default Timetable;

// Styled components
const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

const Table = styled.View`
  flex: 1;
  flex-direction: row;
`;

const Column = styled.View`
  flex: 1;
`;

const YAxisColumn = styled.View`
  flex: 0.5;
`;

const Row = styled.View`
  flex-direction: row;
`;

const Cell = styled.TouchableOpacity<{ isHeader?: boolean }>`
  flex: 1;
  height: 48px;
  align-items: center;
  justify-content: center;

  border: ${(props) => (props.isHeader ? "none" : "1px solid #ddd")};
`;

const HeaderText = styled.Text`
  font-weight: bold;
  color: #333;
`;

const CellText = styled.Text`
  font-size: 16px;
  line-height: 22px;
  font-weight: 600;
  font-family: "Pretendard";
  color: "#262626";
  text-align: "center";
`;

const YAxisLabel = styled.View`
  flex: 1;
  height: 40px;
  align-items: center;
  padding-right: 10px;
  justify-content: center;
`;

const YAxisText = styled.Text`
  font-weight: bold;
  color: #333;
`;
