import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, SafeAreaView, Image, TouchableOpacity } from "react-native";
import styled from "@emotion/native";
import axios from "axios";
import { AddMemoIcon, TodayTodoImg, ChevronRight } from "../../assets/assets";
import { subjectList } from "../../utils/SubjectUtil";
import { getSubjectColorType } from "../../utils/SubjectUtil";
import ChatRooms from "./ChatRooms";
import useAuthStore from "@/store/UserAuthStore";
// import useUserStore from "@/store/UserStore";

type Memo = {
  id: number;
  subjectName: string;
  title: string;
  memo: object; // `content`는 객체이므로 `object` 타입으로 정의
  datetime: string;
};

type SubjectMemos = {
  subjectName: string;
  memos: Memo[];
};

function formatDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
  const dayOfWeek = daysOfWeek[today.getDay()];

  return `${month}.${day}.(${dayOfWeek})`;
}
function MemoScreen({ navigation, route }: any) {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [subjectMemos, setSubjectMemos] = useState<SubjectMemos[]>([]);
  const [selectedTab, setSelectedTab] = useState("subjects");
  // const { accessToken: token } = useUserStore();
  const { token } = useAuthStore();
  const Todayform = formatDate();
  const getTodayMemo = async () => {
    try {
      const response = await axios.get("https://b-site.site/subject-memo/today", {
        headers: {
          "Content-Type": "application/json", // JSON 형식으로 데이터를 보낼 것을 명시
          Authorization: `Bearer ${token}` // 필요시, Authorization 헤더에 토큰 포함
        }
      });
      console.log("여기", response.data.list);
      setMemos(response.data.list);
    } catch (error: any) {
      console.error(error.response ? error.response.data : error.message); // 오류 처리
    }
  };
  const getSubjectMemoList = async () => {
    try {
      const response = await axios.get("https://b-site.site/subject-memo?count=10&page=0", {
        headers: {
          "Content-Type": "application/json", // JSON 형식으로 데이터를 보낼 것을 명시
          Authorization: `Bearer ${token}` // 필요시, Authorization 헤더에 토큰 포함
        }
      });
      setSubjectMemos(response.data.list);
    } catch (error: any) {
      console.error(error.response ? error.response.data : error.message); // 오류 처리
    }
  };
  useEffect(() => {
    getTodayMemo();
    getSubjectMemoList();
  }, []);
  const MySubjects = () => {
    return (
      <ScrollView style={{ marginTop: 15 }}>
        <HeaderContainer>
          <TouchableOpacity
            style={{
              backgroundColor: "#7EB7FB",
              height: 128,
              borderRadius: 12,
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 24
            }}
            onPress={() => navigation.navigate("Calendar")}
          >
            <Text
              style={{ fontSize: 32, fontWeight: 700, fontFamily: "Esamanru OTF", color: "#fff", textAlign: "left" }}
            >
              오늘{"\n"}할일
            </Text>
            <Image source={TodayTodoImg} style={{ width: 70, height: 57 }} />
            <View style={{ marginLeft: 10 }}>
              <Text
                style={{ fontSize: 32, fontWeight: 700, fontFamily: "Esamanru OTF", color: "#fff", textAlign: "left" }}
              >
                {memos.length}개
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  lineHeight: 22,
                  fontWeight: "500",
                  fontFamily: "Pretendard",
                  color: "#fff",
                  textAlign: "left"
                }}
              >
                {" "}
                {Todayform}
              </Text>
            </View>
            <Image source={ChevronRight} style={{ width: 30, height: 30 }} />
          </TouchableOpacity>
        </HeaderContainer>

        {/* 과목별 메모 */}
        {subjectMemos.map((subjectMemo, index) => (
          <MemoSection bgColor={getSubjectColorType(subjectMemo.subjectName)} key={index}>
            <SectionTitle>{subjectMemo.subjectName}</SectionTitle>
            <HorizontalScrollView horizontal showsHorizontalScrollIndicator={false}>
              {subjectMemo.memos.map((memo) => (
                <MemoCard
                  backgroundColor="#FFFFFF"
                  key={memo.id}
                  onPress={() =>
                    navigation.navigate("EditMemoScreen", {
                      id: memo.id,
                      subjectName: memo.subjectName,
                      title: memo.title,
                      datetime: memo.datetime,
                      memo: memo.memo
                    })
                  }
                >
                  <MemoSubject textColor="#7B7B7B">{memo.subjectName}</MemoSubject>
                  <MemoTitle textColor="#8A7EFF">{memo.title}</MemoTitle>
                </MemoCard>
              ))}
            </HorizontalScrollView>
          </MemoSection>
        ))}
      </ScrollView>
    );
  };

  return (
    <Container>
      <ContentContainer>
        <Tabs>
          <TabButton active={selectedTab === "subjects"} onPress={() => setSelectedTab("subjects")}>
            <TabText active={selectedTab === "subjects"}>나의 수업합</TabText>
          </TabButton>
          <TabButton active={selectedTab === "chats"} onPress={() => setSelectedTab("chats")}>
            <TabText active={selectedTab === "chats"}>수업 톡방</TabText>
          </TabButton>
        </Tabs>
        <View>{selectedTab === "subjects" ? <MySubjects /> : <ChatRooms navigation={navigation} />}</View>
        {/* 추가버튼  */}
        <AddMemo onPress={() => navigation.navigate("EditMemoScreen")}>
          <Image source={AddMemoIcon} style={{ width: 30, height: 30 }} />
        </AddMemo>
      </ContentContainer>
    </Container>
  );
}

export default MemoScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #fff;
`;

const ContentContainer = styled.View`
  flex: 1;
  padding-horizontal: 16px;
`;

const Tabs = styled.View`
  width: 100%;
  flex-direction: row;
  gap: 12px;
  padding-vertical: 4px;
  align-items: center;
  margin-bottom: 10px;
`;

const TabButton = styled.TouchableOpacity<{ active: boolean }>`
  align-self: stretch;
  border-bottom-width: 2px;
  border-bottom-color: ${(props) => (props.active ? "#8a7eff" : "#fff")};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-horizontal: 8px;
  padding-vertical: 4px;
`;

const TabText = styled.Text<{ active: boolean }>`
  color: ${(props) => (props.active ? "#000" : "#888")};
  font-size: 20px;
  line-height: 24px;
  font-weight: 500;
  font-family: "Esamanru OTF";
`;

const HeaderContainer = styled.TouchableOpacity`
  padding-bottom: 14px;
  margin-bottom: 16px;
  justify-content: center;
  align-items: center;
`;

const HeaderText = styled.Text`
  padding-bottom: 19px;
  margin-top: 22px;
  margin-left: 20px;
  font-size: 18px;
  font-weight: 600;
  font-family: "Pretendard";
  color: #434343;
  text-align: left;
`;

const HorizontalScrollView = styled(ScrollView)`
  padding-horizontal: 13.5px;
`;
//background-color: ${(props) => (props.backgroundColor ? props.backgroundColor : "#cfbaf0")};

const MemoCard = styled.TouchableOpacity<{ backgroundColor: string }>`
  border-radius: 12px;
  flex: 1;
  background-color: ${(props) => (props.backgroundColor ? props.backgroundColor : "#cfbaf0")};
  width: 100%;
  padding-horizontal: 16px;
  padding-top: 12px;
  padding-bottom: 16px;
  gap: 8px;
  margin-right: 12px;
  min-width: 120px;
`;

const MemoSubject = styled.Text<{ textColor: string }>`
  align-self: stretch;
  font-size: 12px;
  font-weight: 500;
  font-family: "Inter-Medium";
  color: ${(props) => (props.textColor ? props.textColor : "#7B7B7B")};

  text-align: left;
`;

const MemoTitle = styled.Text<{ textColor: string }>`
  align-self: stretch;
  font-size: 16px;
  font-weight: 600;
  font-family: "Pretendard";
  color: ${(props) => (props.textColor ? props.textColor : "#7B7B7B")};
  text-align: left;
`;

const MemoSection = styled.View<{ bgColor: string }>`
  padding-bottom: 16px;
  border-radius: 6px;
  background-color: ${(props) => (props.bgColor ? props.bgColor : "rgba(207, 186, 240, 0.1)")};
  margin-bottom: 16px;
`;

const SectionTitle = styled.Text`
  line-height: 22px;
  font-size: 16px;
  margin-bottom: 12px;
  margin-top: 12px;
  margin-left: 20px;
  font-weight: 500;
  font-family: "Pretendard";
  color: #262626;
  text-align: left;
`;

const AddMemo = styled.TouchableOpacity`
  position: absolute;
  bottom: 16px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: #262626;
  align-items: center;
  justify-content: center;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.3;
  shadow-radius: 4px;
  elevation: 5;
`;
