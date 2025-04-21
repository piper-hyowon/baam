import { View, Text, SafeAreaView, TouchableOpacity, Image } from "react-native";
import { VectorLeft, DropDownDown } from "../../assets/assets";
import styled from "@emotion/native";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "../../navigations/HomeStackNavigation";
import { useState } from "react";
import moment from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import axios from "axios";
import useAuthStore from "../../store/UserAuthStore";

type HomeScreenProps = StackScreenProps<HomeStackParamList, "SetTimeSetting">;

const SetTimeSetting = ({ navigation }: HomeScreenProps) => {
  const [firstPeriodStart, setFirstPeriodStart] = useState(new Date(2024, 9, 7, 9, 0)); // 기본값 9:00
  const [lunchTimeStart, setLunchTimeStart] = useState(new Date(2024, 9, 7, 12, 0)); // 기본값 12:00
  const [lunchTimeEnd, setLunchTimeEnd] = useState(new Date(2024, 9, 7, 13, 0)); // 기본값 13:00

  const [showFirstPeriodPicker, setShowFirstPeriodPicker] = useState(false);
  const [showLunchStartPicker, setShowLunchStartPicker] = useState(false);
  const [showLunchEndPicker, setShowLunchEndPicker] = useState(false);
  const { token } = useAuthStore();
  // 시간을 API 형식으로 변환하는 함수
  const formatTimeForAPI = (date: Date) => moment(date).format("HH:mm");

  const handleSubmit = async () => {
    await setTimeTable();
    await navigation.navigate("AddTimeTableScreen");
  };
  const setTimeTable = async () => {
    const params = {
      firstPeriodStart: formatTimeForAPI(firstPeriodStart),
      lunchTimeStart: formatTimeForAPI(lunchTimeStart),
      lunchTimeEnd: formatTimeForAPI(lunchTimeEnd)
    };
    try {
      const response = await axios.post("https://b-site.site/timetable/school-time-settings", params, {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      console.log("토큰:", token);
    } catch (error: any) {
      console.error(error.response ? error.response.data : error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header style={{ zIndex: 2 }}>
        <BackButton onPress={() => navigation.goBack()}>
          <BackIcon source={VectorLeft} />
        </BackButton>
        <Text
          style={{
            fontSize: 18,
            lineHeight: 26,
            fontWeight: "600",
            fontFamily: "Pretendard",
            color: "#262626",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 272,
            height: 28
          }}
        >
          시간 설정
        </Text>
        <View style={{ width: 24, height: 24 }} />
      </Header>

      <Text
        style={{
          alignSelf: "stretch",
          fontSize: 20,
          fontWeight: "600",
          fontFamily: "Pretendard",
          color: "#262626",
          textAlign: "center",
          marginTop: 32
        }}
      >
        먼저 너의 학교 시간을 알려줘!
      </Text>
      <Text
        style={{
          fontSize: 16,
          letterSpacing: 1,
          fontFamily: "Pretendard",
          color: "#7b7b7b",
          textAlign: "center",
          marginTop: 8
        }}
      >
        8시 40분부터 수업 듣는 학교도 있대..^ㅡ^
      </Text>

      {/* 1교시 시작 시간 */}
      <Text
        style={{
          alignSelf: "stretch",
          fontSize: 16,
          lineHeight: 22,
          fontFamily: "Pretendard",
          color: "#000",
          textAlign: "center",
          marginTop: 64
        }}
      >
        1교시 시작 시간
      </Text>
      <View style={{ flexDirection: "row", justifyContent: "center", alignContent: "center", marginTop: 16 }}>
        <Text
          style={{ fontSize: 28, fontWeight: "500", fontFamily: "Esamanru OTF", color: "#000", textAlign: "center" }}
        >
          {moment(firstPeriodStart).format("HH:mm")}
        </Text>
        <TouchableOpacity onPress={() => setShowFirstPeriodPicker(true)}>
          <Image
            source={DropDownDown}
            style={{ transform: [{ rotate: "180deg" }], width: 24, height: 24, marginLeft: 8 }}
          />
        </TouchableOpacity>
      </View>

      {/* 점심 시간 */}
      <Text
        style={{
          alignSelf: "stretch",
          fontSize: 16,
          lineHeight: 22,
          fontFamily: "Pretendard",
          color: "#000",
          textAlign: "center",
          marginTop: 64
        }}
      >
        점심시간
      </Text>
      <View style={{ flexDirection: "row", justifyContent: "center", alignContent: "center", marginTop: 16 }}>
        <Text
          style={{ fontSize: 28, fontWeight: "500", fontFamily: "Esamanru OTF", color: "#000", textAlign: "center" }}
        >
          {`${moment(lunchTimeStart).format("HH:mm")} - ${moment(lunchTimeEnd).format("HH:mm")}`}
        </Text>
        <TouchableOpacity onPress={() => setShowLunchStartPicker(true)}>
          <Image
            source={DropDownDown}
            style={{ transform: [{ rotate: "180deg" }], width: 24, height: 24, marginLeft: 8 }}
          />
        </TouchableOpacity>
      </View>

      {/* Modal Picker */}
      <DateTimePickerModal
        isVisible={showFirstPeriodPicker}
        mode="time"
        date={firstPeriodStart}
        onConfirm={(selectedDate) => {
          setShowFirstPeriodPicker(false);
          if (selectedDate) {
            setFirstPeriodStart(selectedDate);
          }
        }}
        onCancel={() => setShowFirstPeriodPicker(false)}
        headerTextIOS="1교시 시작 시간 선택"
        confirmTextIOS="확인"
        cancelTextIOS="취소"
        locale="ko_KR" // 한국어 적용
      />

      <DateTimePickerModal
        isVisible={showLunchStartPicker}
        mode="time"
        date={lunchTimeStart}
        onConfirm={async (selectedDate) => {
          setShowLunchStartPicker(false);

          if (selectedDate) {
            setLunchTimeStart(selectedDate);
            setTimeout(() => {
              setShowLunchEndPicker(true);
            }, 500); // 300ms 정도의 딜레이를 줍니다.
          }
        }}
        onCancel={() => setShowLunchStartPicker(false)}
        headerTextIOS="점심 시작 시간 선택"
        confirmTextIOS="확인"
        cancelTextIOS="취소"
        locale="ko_KR"
      />

      <DateTimePickerModal
        isVisible={showLunchEndPicker}
        mode="time"
        date={lunchTimeEnd}
        onConfirm={(selectedDate) => {
          setShowLunchEndPicker(false);
          if (selectedDate) {
            setLunchTimeEnd(selectedDate);
          }
        }}
        onCancel={() => setShowLunchEndPicker(false)}
        headerTextIOS="점심 끝 시간 선택"
        confirmTextIOS="확인"
        cancelTextIOS="취소"
        locale="ko_KR"
      />

      <SubmitButton backgroundColor="#8A7EFF" onPress={handleSubmit}>
        <SubmitButtonText>작성 완료</SubmitButtonText>
      </SubmitButton>
    </SafeAreaView>
  );
};

export default SetTimeSetting;

const Header = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-vertical: 10px;
  padding-horizontal: 16px;
`;
const BackButton = styled(TouchableOpacity)`
  padding: 10px;
`;

const BackIcon = styled(Image)`
  width: 8.5px;
  height: 15px;
`;

const SubmitButton = styled(TouchableOpacity)<{ backgroundColor: string }>`
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 34px;
  border-radius: 24px;
  background-color: ${(props) => (props.backgroundColor ? props.backgroundColor : "#8A7EFF")};
  justify-content: center;
  padding-horizontal: 24px;
  padding-vertical: 16px;
`;

const SubmitButtonText = styled(Text)`
  font-size: 18px;
  font-weight: 500;
  font-family: Pretendard;
  color: #ffffff;
  text-align: center;
`;
