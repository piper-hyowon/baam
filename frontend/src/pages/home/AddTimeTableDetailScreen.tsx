import { useEffect, useState } from "react";
import { View, Text, Image, SafeAreaView, StatusBar, useColorScheme } from "react-native";
import { IconSearch } from "../../assets/assets";
import styled from "@emotion/native";
import DropDown from "../../components/common/Dropdown";
import ScheduleAddItem from "../../components/home/ScheduleAddItem";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "@/navigations/HomeStackNavigation";
import axios from "axios";
import useAuthStore from "@/store/UserAuthStore";
// import useUserStore from "@/store/UserStore";

const pillOptions = ["전체", "국어", "수학", "영어", "과학", "사회", "기타"];
// const schedules = ["국어", "고전 읽기", "고전과 윤리", "과학사", "기술가정", "가정학", "논리학"];

type HomeScreenProps = StackScreenProps<HomeStackParamList, "AddTimeTableDetailScreen">;

const AddTimeTableDetailScreen = ({ navigation, route }: HomeScreenProps) => {
  const day = route.params.day;
  const period = route.params.period;
  const isDarkMode = useColorScheme() === "dark";
  const [activeOption, setActiveOption] = useState("전체");
  const [schedules, setSchedules] = useState([]);
  const [grade, setGrade] = useState(1);
  // const { accessToken: token } = useUserStore();
  const { token } = useAuthStore();
  const getYear = (): number => {
    const today = new Date();
    const year = today.getFullYear();
    return year;
  };
  const getMonth = (): number => {
    const today = new Date();
    const month = today.getMonth();
    return month;
  };
  const getGrade = async () => {
    try {
      const response = await axios.get(`https://b-site.site/user`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      setGrade(response.data.grade);
    } catch (error) {
      console.error("Error fetching timetable:", error);
    }
  };
  const year = getYear();
  const fetchSubjects = async (category: string) => {
    try {
      // URL에 날짜를 포함한 GET 요청 보내기
      if (category === "전체") {
        const response = await axios.get(
          `https://b-site.site/school-dataset/subjects?grade=${grade}&year=${year}&count=100&page=0`
        );

        setSchedules(response.data.list);
      } else {
        const response = await axios.get(
          `https://b-site.site/school-dataset/subjects?grade=${grade}&year=${year}&count=100&page=0&category=${category}`
        );
        setSchedules(response.data.list);
      }
      // 받아온 데이터 상태에 저장
    } catch (error) {
      console.error("Error fetching timetable:", error);
    }
  };

  const addSubject = async (title: string) => {
    const month = getMonth();
    const params: any = {
      year: year,
      semester: month <= 7 ? 1 : 2,
      day: day,
      period: Number(period),
      subjectName: title
    };
    console.log("params : ", params);
    try {
      // URL에 날짜를 포함한 GET 요청 보내기
      const response = await axios.put(`https://b-site.site/timetable`, params, {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      // 받아온 데이터 상태에 저장
    } catch (error) {
      console.error("Error fetching timetable:", error);
    } finally {
      navigation.navigate("AddTimeTableScreen");
    }
  };
  const handlePillPress = (option: string) => {
    setActiveOption(option); // 선택된 옵션으로 상태 업데이트
    fetchSubjects(option);
  };
  useEffect(() => {
    const getDetail = async () => {
      await getGrade();
      await fetchSubjects("전체");
    };
    getDetail();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle={isDarkMode ? "dark-content" : "light-content"} />
      <Container>
        <SearchInputContainer>
          <SearchInputIcon source={IconSearch} />
          <SearchInput placeholder="Placeholder" />
        </SearchInputContainer>

        <PillContainer>
          {pillOptions.map((option) => (
            <Pill key={option} isActive={option === activeOption} onPress={() => handlePillPress(option)}>
              <PillText isActive={option === activeOption}>{option}</PillText>
            </Pill>
          ))}
        </PillContainer>

        <AddScheduleContainer contentContainerStyle={{ gap: 12, paddingVertical: 4, marginBottom: 26, height: "80%" }}>
          {schedules.map((item) => (
            <ScheduleAddItem key={item} title={item} addSubject={() => addSubject(item)} />
          ))}
        </AddScheduleContainer>
      </Container>
    </SafeAreaView>
  );
};

const Container = styled.View`
  flex: 1;
  padding: 0 16px;
  background-color: #fff;
  gap: 20px;
`;

const SearchInputContainer = styled.View`
  width: 100%;
  height: 40px;
  background-color: #f5f5f5;
  border-radius: 12px;
  flex-direction: row;
  align-items: center;
  padding: 0 16px;
`;

const SearchInputIcon = styled.Image`
  width: 24px;
  height: 24px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  margin-left: 8px;
`;

const PillContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

const Pill = styled.TouchableOpacity<{ isActive?: boolean }>`
  background-color: ${(props) => (props.isActive ? "#8A7EFF33" : "#f5f5f5")};
  border-radius: 12px;
  padding: 8px 12px;
  margin-right: 8px;
  margin-bottom: 8px;
`;

const PillText = styled.Text<{ isActive?: boolean }>`
  color: ${(props) => (props.isActive ? "#8A7EFF" : "#7B7B7BB2")};
`;

const AddScheduleContainer = styled.ScrollView``;

export default AddTimeTableDetailScreen;
