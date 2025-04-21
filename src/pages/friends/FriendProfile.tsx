import React, { useEffect, useState } from "react";
import styled from "@emotion/native";
import { View, Text, Image, ScrollView, SafeAreaView, TouchableOpacity, ImageBackground } from "react-native";
import { VectorLeft } from "../../assets/assets";
import { Star01, Star02, Hamburger, White } from "../../assets/assets";
import axios from "axios";
import useUserStore from "../../store/UserStore";
import useAuthStore from "../../store/UserAuthStore";
import { getSubjectType } from "@/utils/SubjectUtil";

interface timetable {
  day: number;
  period: number;
  subject: string;
  subjectShort: string;
}
interface UserDetail {
  isClassPublic: boolean;
  className: string;
  isTimetablePublic: boolean;
  allTimetable: timetable[];
  todayTimetable: timetable[];
  profileImage: string;
  profileBackgroundImage: string;
  schoolName: string;
  grade: number;
  status: string;
  fullName: string;
}
const period: { [key: number]: string } = {
  1: "9:00-9:45(1교시)",
  2: "10:00-10:45(2교시)",
  3: "11:00-11:45(3교시)",
  4: "12:00-12:45(4교시)",
  5: "13:00-13:45(5교시)",
  6: "14:00-14:45(6교시)",
  7: "15:00-15:45(7교시)",
  8: "16:00-16:45(8교시)"
};

const getRandomColor = (itemIndex: number): string => {
  const colorList = ["#cfbaf0", "#7EB7FB", "#55C4E0", "#51CA81", "#F98888", "#F7D978"];
  const colorIndex = itemIndex % colorList.length;
  return colorList[colorIndex];
};

function FriendProfile({ navigation, route }: any) {
  const [selectedTab, setSelectedTab] = useState("today");
  const [requestId, setRequestId] = useState();
  const [isFavorite, setIsFavorite] = useState(route.params.isFavorite);
  const [profile, setProfile] = useState<UserDetail>({
    isClassPublic: false,
    className: "",
    isTimetablePublic: false,
    allTimetable: [],
    todayTimetable: [],
    profileImage: "",
    profileBackgroundImage: "",
    schoolName: "",
    grade: 0,
    status: "None",
    fullName: ""
  });

  const { token } = useAuthStore();
  const [showDeleteOption, setShowDeleteOption] = useState(false);
  const handleShowDeleteOption = () => {
    if (showDeleteOption) setShowDeleteOption(false);
    else setShowDeleteOption(true);
  };
  useEffect(() => {
    console.log("친친 여부 : ", route.params.isFavorite);
  }, []);
  const handleFavorite = async () => {
    try {
      await axios.patch(
        `https://b-site.site/friends/${route.params.userId}/favorite`,
        {},
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ` + token // 실제 토큰으로 교체
          }
        }
      );
      console.log("변경");
      setIsFavorite(!isFavorite);
    } catch (error: any) {
      console.error("Error patching favorite friend :", error);
    }
  };
  const handlePostRequest = async () => {
    try {
      // API 요청을 통해 친구 삭제
      await axios.post(
        `https://b-site.site/friend-requests/${route.params.userId}`,
        {},
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}` // 실제 토큰으로 교체
          }
        }
      );
    } catch (error) {
      console.error("Error deleting friend:", error);
    } finally {
      console.log("token: ", token);
      setProfile((prevProfile) => ({
        ...prevProfile, // 이전 상태의 모든 필드를 유지
        status: "RequestSent" // status 필드만 새 값으로 업데이트
      }));
    }
  };
  const handleDeleteRequest = async () => {
    try {
      const response = await axios.get(`https://b-site.site/friend-requests/sent`, {
        params: {
          count: 100,
          page: 0
        },
        headers: {
          accept: "application/json", // JSON 형식으로 데이터를 보낼 것을 명시
          Authorization: `Bearer ${token}` // 필요시, Authorization 헤더에 토큰 포함
        }
      });
      console.log("re ::", response.data.list);
      const foundRequest = response.data.list.find((item: any) => item.userId === route.params.userId);
      if (foundRequest) {
        setRequestId(foundRequest.id); // userId를 상태로 설정
      }

      // API 요청을 통해 친구 삭제

      // 추가적인 상태 업데이트나 페이지 리로드를 수행할 수 있습니다.
    } catch (error) {
      console.error("Error deleting friend:", error);
    } finally {
      try {
        await axios.delete(`https://b-site.site/friend-requests/${requestId}`, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ` + token // 실제 토큰으로 교체
          }
        });
      } catch (error: any) {
        console.error("Error deleting friend:", error);
      }
      console.log("requestId: ", requestId);
      setProfile((prevProfile) => ({
        ...prevProfile, // 이전 상태의 모든 필드를 유지
        status: "None" // status 필드만 새 값으로 업데이트
      }));
    }
  };
  const handleDelete = async () => {
    try {
      // API 요청을 통해 친구 삭제
      await axios.delete(`https://b-site.site/friends/${route.params.userId}`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}` // 실제 토큰으로 교체
        }
      });
      // 추가적인 상태 업데이트나 페이지 리로드를 수행할 수 있습니다.
    } catch (error) {
      console.error("Error deleting friend:", error);
    } finally {
      setShowDeleteOption(false);
      setProfile((prevProfile) => ({
        ...prevProfile, // 이전 상태의 모든 필드를 유지
        status: "None" // status 필드만 새 값으로 업데이트
      }));
    }
  };
  useEffect(() => {
    const getFriendDetail = async () => {
      try {
        const response = await axios.get(`https://b-site.site/friends/detail/${route.params.userId}`, {
          headers: {
            "Content-Type": "application/json", // JSON 형식으로 데이터를 보낼 것을 명시
            Authorization: `Bearer ${token}` // 필요시, Authorization 헤더에 토큰 포함
          }
        });
        setProfile(response.data);
      } catch (error: any) {
        console.error(error.response ? error.response.data : error.message); // 오류 처리
      } finally {
      }
    };
    getFriendDetail();
  }, []);

  const TodayTimetable = () => {
    return (
      <>
        {profile.isTimetablePublic ? (
          <ScrollView>
            {profile.todayTimetable ? (
              profile.todayTimetable.map((it, idx) => (
                <View
                  key={idx}
                  style={{
                    backgroundColor: "rgba(207, 186, 240, 0.1)",
                    borderRadius: 12,
                    marginHorizontal: 16,
                    marginBottom: 8,
                    paddingHorizontal: 16,
                    paddingVertical: 18,
                    flexDirection: "row",
                    alignItems: "center"
                  }}
                >
                  <Image source={getSubjectType(it.subject)} style={{ width: 40, height: 40 }} />
                  <View style={{ marginLeft: 20, gap: 8 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        fontFamily: "Pretendard",
                        color: "#434343",
                        textAlign: "left"
                      }}
                    >
                      {it.subject}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "500",
                        fontFamily: "Pretendard",
                        color: "#7b7b7b",
                        textAlign: "left"
                      }}
                    >
                      {period[it.period]}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Text>시간표가 등록되지 않은 회원입니다.</Text>
              </View>
            )}
          </ScrollView>
        ) : (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text>시간표 비공개 회원입니다.</Text>
          </View>
        )}
      </>
    );
  };
  const TotalTimetable = () => {
    return (
      <>
        {profile.isTimetablePublic ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text>시간표 비공개 회원입니다.</Text>
          </View>
        ) : (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text>시간표 비공개 회원입니다.</Text>
          </View>
        )}
      </>
    );
  };

  return (
    <Container>
      <ContentContainer>
        {profile.status == "Friends" ? (
          <Header style={{ zIndex: 2 }}>
            <BackButton onPress={() => navigation.goBack()}>
              <BackIcon source={VectorLeft} />
            </BackButton>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {isFavorite ? (
                //즐겨찾기
                <TouchableOpacity onPress={handleFavorite}>
                  <Image source={Star02} />
                </TouchableOpacity>
              ) : (
                //빈별
                <TouchableOpacity onPress={handleFavorite}>
                  <Image source={Star01} />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={handleShowDeleteOption}>
                <Image source={Hamburger} style={{ width: 24, height: 24 }} />
                {showDeleteOption && (
                  <TouchableOpacity
                    onPress={handleDelete} // 삭제 클릭 시 API 호출
                    style={{
                      backgroundColor: "#fff",
                      borderWidth: 0.5,
                      borderRadius: 4,
                      position: "absolute",
                      width: 120,
                      height: 40,
                      top: 25,
                      left: -100,
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <Text style={{ fontSize: 16, lineHeight: 22 }}>친구 삭제하기</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            </View>
          </Header>
        ) : (
          <Header>
            <BackButton onPress={() => navigation.goBack()}>
              <BackIcon source={VectorLeft} />
            </BackButton>
          </Header>
        )}

        <View>
          <ImageBackground
            source={profile.profileBackgroundImage ? profile.profileBackgroundImage : White}
            imageStyle={{ borderRadius: 16, height: 220, marginHorizontal: 16, marginTop: 8, marginBottom: 20 }}
            style={{ zIndex: 0 }}
          />
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: 230
            }}
          >
            {profile.profileImage ? (
              <Image source={{ uri: profile.profileImage }} style={{ height: 80, width: 80, borderRadius: 1000 }} />
            ) : (
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 1000,
                  marginRight: 12,
                  borderColor: getRandomColor(profile.grade),
                  borderWidth: 4,
                  backgroundColor: "#fff"
                }}
              >
                <Text
                  style={{
                    position: "absolute",
                    marginTop: -12,
                    marginLeft: -22,
                    top: "50%",
                    left: "50%",
                    fontSize: 24,
                    lineHeight: 28,
                    fontWeight: "500",
                    fontFamily: "Esamanru OTF",
                    color: getRandomColor(profile.grade)
                  }}
                >
                  {profile.fullName.slice(-2)}
                </Text>
              </View>
            )}

            <Text
              style={{
                position: "absolute",
                left: 35,
                top: 160,
                fontSize: 16,
                lineHeight: 20,
                fontWeight: "500",
                fontFamily: "Esamanru OTF",
                color: "#fff",
                textAlign: "left"
              }}
            >
              {profile.schoolName}
            </Text>
            {profile.status == "Friends" && profile.isClassPublic ? (
              <Text
                style={{
                  position: "absolute",
                  left: 35,
                  top: 184,
                  fontSize: 16,
                  lineHeight: 20,
                  fontWeight: "500",
                  fontFamily: "Esamanru OTF",
                  color: "#fff",
                  textAlign: "left"
                }}
              >
                {profile.grade}학년 {profile.className}반
              </Text>
            ) : (
              <></>
            )}
          </View>
        </View>
        <Tabs>
          <TabButton active={selectedTab === "today"} onPress={() => setSelectedTab("today")}>
            <TabText active={selectedTab === "today"}>오늘 시간표</TabText>
          </TabButton>
          <TabButton active={selectedTab === "total"} onPress={() => setSelectedTab("total")}>
            <TabText active={selectedTab === "total"}>전체 시간표</TabText>
          </TabButton>
        </Tabs>
        <View style={{ flex: 1 }}>{selectedTab === "today" ? <TodayTimetable /> : <TotalTimetable />}</View>
        {profile.status == "Friends" ? (
          <></>
        ) : (
          <>
            {profile.status == "RequestSent" ? (
              <SubmitButton backgroundColor="#555555" onPress={handleDeleteRequest}>
                <SubmitButtonText>친구 요청 취소하기</SubmitButtonText>
              </SubmitButton>
            ) : (
              <SubmitButton backgroundColor="#8A7EFF" onPress={handlePostRequest}>
                <SubmitButtonText>친구 요청하기</SubmitButtonText>
              </SubmitButton>
            )}
          </>
        )}
      </ContentContainer>
    </Container>
  );
}

export default FriendProfile;
const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #fff;
`;

const ContentContainer = styled.View`
  flex: 1;
`;
const Tabs = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

const TabButton = styled.TouchableOpacity<{ active: boolean }>`
  align-self: stretch;
  border-bottom-width: 2px;
  border-bottom-color: ${(props) => (props.active ? "#262626" : "#D9D9D9")};
  align-items: center;
  width: 50%;
`;

const TabText = styled.Text<{ active: boolean }>`
  text-align: "left";
  color: ${(props) => (props.active ? "#262626" : "#7B7B7B")};
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  font-family: Pretendard;
  padding-vertical: 10px;
`;

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
  color: #fff;
  text-align: center;
`;
