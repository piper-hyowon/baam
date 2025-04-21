import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView, Pressable, ScrollView, View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import styled from "@emotion/native";
import { useMeal } from "@/hooks/useMeals";
import MealInfo from "@/components/home/MealInfo";
import { parse } from "date-fns";
import {
  BtnLeft,
  ChevronRight,
  MondayIcon,
  TuesdayIcon,
  WednesdayIcon,
  ThursdayIcon,
  FridayIcon,
  WeekendIcon,
  BottomSettingIcon
} from "@/assets/assets";
import DateCarousel from "@/components/home/DateCarousel";
import { Theme } from "@/styles/theme";
import { customAxios } from "@/apis/instance";
import { User } from "../memo/ChatScreen";
import { useFavoriteFriends } from "@/hooks/useFavoriteFriends";
import FavoriteFriends from "@/components/home/FavoriteFriends";
import { HOME_SCREEN } from "@/constants";
import { RootNavigationProp } from "@/navigations/RootNavigation";
import moment from "moment";
import axios from "axios";
import { getTimetableColorType, getSubjectType } from "../../utils/SubjectUtil";
import useAuthStore from "@/store/UserAuthStore";
// import useUserStore from "@/store/UserStore";

type Current = {
  endTime: Date;
  startTime: Date;
  subject: string;
};
const HomeScreen: React.FC = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [haveTimetable, setHaveTimetable] = useState(false);
  const [currentSubject, setCurrentSubject] = useState<Current | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  // const { accessToken: token } = useUserStore();
  const { token } = useAuthStore();
  const handleDateChange = (date: moment.Moment) => {
    setSelectedDate(date);
    // 오늘 날짜와 비교
    const today = moment().startOf("day"); // 오늘 날짜의 시작 시점 (00:00:00)

    // 파라미터로 들어온 date가 오늘이 아닌 경우
    if (!date.isSame(today, "day")) {
      setHaveTimetable(false);
    } else {
      setHaveTimetable(true); // 현재 주제 초기화
    }
  };

  const navigateToFriendsList = () => {
    navigation.navigate("Friends", { screen: "FriendListScreen" });
  };

  const {
    meals,
    isLoading: mealsLoading,
    error: mealsError,
    refetch: refetchMeals
  } = useMeal(userInfo?.schoolId || null, selectedDate);

  const {
    friends,
    loading: friendsLoading,
    error: friendsError,
    refetch: refetchFriends,
    loadMore: loadMoreFriends,
    hasMore: hasMoreFriends,
    totalCount: totalFavoriteFriends
  } = useFavoriteFriends(HOME_SCREEN.FAVORITE_FRIENDS_COUNT);

  const getUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await customAxios.get("user");
      setUserInfo(response.data);
    } catch (error: any) {
      console.error(error.message);
      setUserInfo(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const getTimeSetting = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://b-site.site/timetable/time-settings", {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.firstPeriodStart) {
        //시간표 등록되어잇음
        setHaveTimetable(true);
      } else {
        //시간표 등록 전
        setHaveTimetable(false);
      }
    } catch (error: any) {
      console.error(error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  const getCurrrentSubject = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://b-site.site/timetable/current-subject", {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      // console.log(response.data);
      if (response.data.subject != null) {
        //듣는과목 있음
        setCurrentSubject({
          subject: response.data.subject,
          startTime: parse(response.data.startTime, "yyyy-MM-dd HH:mm:ss", new Date()),
          endTime: parse(response.data.endTime, "yyyy-MM-dd HH:mm:ss", new Date())
        });
        // setCurrentSubject(JSON.stringify(response.data));
        // console.log("듣는 과목 : ", response.data);
      }
    } catch (error: any) {
      console.error(error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  function getImoji(day: string): Image {
    const DayImoji: { [key: string]: Image } = {
      월요일: MondayIcon,
      화요일: TuesdayIcon,
      수요일: WednesdayIcon,
      목요일: ThursdayIcon,
      금요일: FridayIcon,
      토요일: WeekendIcon,
      일요일: WeekendIcon
    };
    return DayImoji[day];
  }
  function getComment(day: string): string {
    const DayComment: { [key: string]: string } = {
      월요일: "선배, \n월요일인데 마라탕 사주세요",
      화요일: "소원을 말해봐~ \n오늘이 금요일이었으면 좋겠지?",
      수요일: "워워 진정해~ \n이제 수요일 끝난거야",
      목요일: "하암~ 목요일인데 \n설마 보충수업 있는거 아니지?",
      금요일: "불금인데, \n모히또가서 몰디브 한잔 할사람?",
      토요일: "너 집에만 있을꺼야? \n주말은 순삭이야~!",
      일요일: "너 집에만 있을꺼야? \n주말은 순삭이야~!"
    };
    return DayComment[day];
  }

  function getTimes(date: string) {
    // const dates = parse(date, "yyyy-MM-dd HH:mm:ss", new Date());
    // return dates;
    const hours = new Date(date).getHours(); // 0-23 범위의 시간
    const minutes = new Date(date).getMinutes(); // 0-59 범위의 분

    // 두 자리로 포맷팅 (예: 12:00)
    const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    return formattedTime;
  }
  useFocusEffect(
    useCallback(() => {
      getUserProfile();
      refetchFriends(); // 화면에 돌아올 때마다 친구 목록을 다시 불러옴
    }, [getUserProfile, refetchFriends])
  );

  const getTodayInKorean = (): string => {
    const daysInKorean = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    const today = new Date();
    const dayIndex = today.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일
    return daysInKorean[dayIndex];
  };
  const TimeBar: React.FC<{ startTime: Date; endTime: Date }> = ({ startTime, endTime }) => {
    const [remainingTime, setRemainingTime] = useState<string>(""); // 남은 시간 상태

    useEffect(() => {
      const updateRemainingTime = () => {
        const now = new Date();
        const totalDuration = endTime.getTime() - startTime.getTime();
        const elapsed = Math.max(0, now.getTime() - startTime.getTime());

        const remaining = Math.max(0, totalDuration - elapsed);
        const remainingMinutes = Math.floor(remaining / 60000); // 밀리초를 분으로 변환

        // 남은 시간을 업데이트
        setRemainingTime(remainingMinutes > 0 ? `${remainingMinutes}분` : "시간 종료");
      };

      updateRemainingTime(); // 초기 남은 시간 계산
      const interval = setInterval(updateRemainingTime, 60000); // 1분마다 업데이트

      // 컴포넌트 언마운트 시 interval 정리
      return () => clearInterval(interval);
    }, [startTime, endTime]);
    return (
      <View style={styles.container}>
        <View style={styles.barContainer}>
          <View
            style={[
              styles.elapsedBar,
              {
                width: `${
                  ((new Date().getTime() - startTime.getTime()) / (endTime.getTime() - startTime.getTime())) * 100 - 8
                }%`
              }
            ]}
          />
          <View style={styles.timeText}>
            <Text
              style={{ fontSize: 14, fontWeight: "600", fontFamily: "Pretendard", color: "#fff", textAlign: "left" }}
            >
              {remainingTime}
            </Text>
          </View>
          <View
            style={[
              styles.remainingBar,
              {
                width: `${
                  (1 - (new Date().getTime() - startTime.getTime()) / (endTime.getTime() - startTime.getTime())) * 100 -
                  8
                }%`
              }
            ]}
          />
        </View>
      </View>
    );
  };
  useEffect(() => {
    refetchMeals();
  }, [selectedDate]);

  useEffect(() => {
    getTimeSetting();
  }, []);
  useEffect(() => {
    getCurrrentSubject();
  }, [haveTimetable]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FEFEFA" }}>
      <Container>
        <DateCarousel selectedDate={selectedDate} onDateChange={handleDateChange} />
        <ScrollView>
          <Section>
            <SectionHeader>
              <SectionHeaderTitle>시간표</SectionHeaderTitle>
              <Pressable>
                <CustomImage source={BtnLeft} style={{ transform: [{ scaleX: -1 }] }} />
              </Pressable>
            </SectionHeader>
            {haveTimetable ? (
              <TimeTableBox
                bgColor={currentSubject?.subject ? getTimetableColorType(currentSubject.subject) : "#DBD7FF"}
              >
                {currentSubject ? (
                  <>
                    {/* 과목 있는 경우 */}
                    <Image
                      source={getSubjectType(currentSubject.subject)}
                      style={{
                        width: 48,
                        height: 48,
                        marginBottom: 20
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 20,
                        letterSpacing: 1,
                        fontWeight: "600",
                        fontFamily: "Pretendard",
                        color: "#262626",
                        textAlign: "left"
                      }}
                    >
                      {currentSubject.subject}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        letterSpacing: 1,
                        fontFamily: "Pretendard",
                        color: "#262626",
                        marginTop: 4
                      }}
                    >
                      {getTimes(currentSubject.startTime)} ~ {getTimes(currentSubject.endTime)}
                    </Text>
                    <TimeBar startTime={currentSubject.startTime} endTime={currentSubject.endTime} />
                  </>
                ) : (
                  <>
                    {/* 과목 없는 경우 */}
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Image source={getImoji(getTodayInKorean())} style={{ width: 48, height: 48 }} />
                      <TouchableOpacity
                        style={{
                          backgroundColor: "rgba(265,265,265,0.3)",
                          marginBottom: 18,
                          borderRadius: 20,
                          padding: 2
                        }}
                        onPress={() => {
                          navigation.navigate("AddTimeTableScreen");
                        }}
                      >
                        <Image source={BottomSettingIcon} style={{ width: 30, height: 30, tintColor: "#FFFFFF" }} />
                      </TouchableOpacity>
                    </View>
                    <TimeTableBoxLabel>{getComment(getTodayInKorean())}</TimeTableBoxLabel>
                  </>
                )}
              </TimeTableBox>
            ) : (
              <EmptyTimeTableBox>
                <EmptyTimeTableBoxLabel>아직 시간표가 없어요!</EmptyTimeTableBoxLabel>
                <AddTimeTableButton onPress={() => navigation.navigate("SetTimeSetting")}>
                  <AddTimeTableButtonText>시간표 추가하기</AddTimeTableButtonText>
                  <CustomImage source={ChevronRight} />
                </AddTimeTableButton>
              </EmptyTimeTableBox>
            )}
          </Section>
          <Section>
            <SectionHeader>
              <SectionHeaderTitle>친한 친구들</SectionHeaderTitle>
              <Pressable onPress={navigateToFriendsList}>
                <CustomImage source={BtnLeft} style={{ transform: [{ scaleX: -1 }] }} />
              </Pressable>
            </SectionHeader>
            <FavoriteFriends
              friends={friends}
              loading={friendsLoading}
              error={friendsError}
              onLoadMore={loadMoreFriends}
              hasMore={hasMoreFriends}
              totalCount={totalFavoriteFriends}
            />
          </Section>
          <Section>
            <SectionHeader>
              <SectionHeaderTitle>오늘의 급식</SectionHeaderTitle>
            </SectionHeader>
            {loading ? (
              <EmptyMealLabel>사용자 정보를 불러오는 중...</EmptyMealLabel>
            ) : userInfo?.schoolId ? (
              <MealInfo meals={meals} isLoading={mealsLoading} error={mealsError} date={selectedDate} />
            ) : (
              <EmptyMealLabel>학교 정보가 없습니다.</EmptyMealLabel>
            )}
          </Section>
        </ScrollView>
      </Container>
    </SafeAreaView>
  );
};

const Container = styled.View`
  flex: 1;
  align-items: center;
  gap: 20px;
`;

const Section = styled.View`
  width: 100%;
  gap: 12px;
  padding: 0 16px;
  align-items: center;
`;

const SectionHeader = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
`;

const SectionHeaderTitle = styled.Text`
  color: #262626;
  font-family: "Pretendard";
  font-size: 18px;
  font-weight: 500;
  line-height: 26px;
`;

const TimeTableBox = styled.View<{ bgColor: string }>`
  width: 100%;
  height: 174px;
  background-color: ${(props) => props.bgColor};
  border-radius: 20px;
  justify-content: center;
  padding-vertical: 16px;
  padding-horizontal: 20px;
`;
const EmptyTimeTableBox = styled.View`
  width: 100%;
  height: 267px;
  background-color: #f3f2ff;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  gap: 40px;
`;

const EmptyTimeTableBoxLabel = styled.Text`
  color: #555555;
  font-family: "Pretendard";
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
`;
const TimeTableBoxLabel = styled.Text`
  color: #000;
  font-family: "Pretendard";
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  text-align: "left";
  flex: 1;
  margin-top: 34px;
`;

const AddTimeTableButton = styled(Pressable)`
  padding: 16px 14px 16px 12px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #8a7eff;
  border-radius: 56px;
`;

const AddTimeTableButtonText = styled.Text`
  color: white;
  font-family: "Pretendard";
  font-size: 18px;
  font-weight: 500;
  line-height: 20px;
  margin-right: 6px;
`;

const CustomImage = styled.Image`
  width: 24px;
  height: 24px;
`;

const EmptyMealLabel = styled.Text`
  font-family: "Pretendard";
  font-size: 16px;
  font-weight: 500;
  color: #7b7b7b;
  padding: 20px 0;
`;

export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    alignItems: "center"
    // margin: 20
  },
  barContainer: {
    flexDirection: "row",

    // overflow: "hidden",
    justifyContent: "center",
    alignItems: "center"
  },
  elapsedBar: {
    height: 3,
    backgroundColor: "black"
  },
  remainingBar: {
    height: 3,
    backgroundColor: "white"
  },
  timeText: {
    backgroundColor: "#262626",
    height: "100%",
    borderRadius: 45,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 2
  }
});
