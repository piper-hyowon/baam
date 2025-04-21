import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import TimeTable from "../../components/home/TimeTable";
import styled from "@emotion/native";
import { useEffect } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "@/navigations/HomeStackNavigation";

type HomeScreenProps = StackScreenProps<HomeStackParamList, "AddTimeTableDetailScreen">;

const AddTimeTableScreen = ({ navigation, route }: HomeScreenProps) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <TimeTable />

      <TimeTableText>남은 시간표를 채워줘!</TimeTableText>
      <SubmitButton backgroundColor="#8A7EFF" onPress={() => navigation.navigate("HomeScreen")}>
        <SubmitButtonText>시간표 등록하기</SubmitButtonText>
      </SubmitButton>
    </SafeAreaView>
  );
};

export default AddTimeTableScreen;

const TimeTableText = styled(Text)`
  position: absolute;
  bottom: 100px;
  border-radius: 24px;
  justify-content: center;
  font-size: 16px;
  font-family: Pretendard;
  color: #7b7b7b;
  left: 33%;
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
