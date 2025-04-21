import React, { useCallback, useEffect, useState } from "react";
import styled from "@emotion/native";
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  SafeAreaView,
  FlatList,
  Pressable,
  TouchableOpacity
} from "react-native";
import { IconSearch } from "../../assets/assets";
import Chip from "../../components/common/Chip";
import { FilterLine } from "../../assets/assets";
import axios from "axios";
import SchoolmateList from "./SchoolmateList";
import useAuthStore from "../../store/UserAuthStore";
import { StackNavigationProp } from "@react-navigation/stack";
import { FriendsStackParamList } from "../../navigations/FriendsStackNavigation";
import { useNavigation } from "@react-navigation/native";
import SchoolFriends from "./SchoolmateList";
import FriendsList from "./FriendsList";

type NavigationProps = StackNavigationProp<FriendsStackParamList, "FriendProfile">;

const filterList = [
  {
    id: 0,
    grade: "전체",
    isSelected: false
  },
  {
    id: 1,
    grade: "1학년",
    isSelected: false
  },
  {
    id: 2,
    grade: "2학년",
    isSelected: false
  },
  {
    id: 3,
    grade: "3학년",
    isSelected: false
  },
  {
    id: 4,
    grade: "즐겨찾기",
    isSelected: false
  }
];
interface schoolmate {
  userId: number;
  fullName: string;
  profileImage: string;
  grade: number;
  isFavorite: boolean;
}
interface schoolmateList {
  list: schoolmate[];
  total: number;
}
function FriendListScreen() {
  const navigation = useNavigation<NavigationProps>();
  const [selectedTab, setSelectedTab] = useState("friends");

  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const [enteredText, setEnteredText] = useState("");

  const [selectedFilter, setSelectedFilter] = useState("전체");

  useEffect(() => {
    console.log("friendlistscreen.tsx");
  }, []);

  return (
    <Container>
      <ContentContainer>
        <Tabs>
          <TabButton active={selectedTab === "friends"} onPress={() => setSelectedTab("friends")}>
            <TabText active={selectedTab === "friends"}>친구들</TabText>
          </TabButton>
          <TabButton active={selectedTab === "more"} onPress={() => setSelectedTab("more")}>
            <TabText active={selectedTab === "more"}>더보기</TabText>
          </TabButton>
        </Tabs>
        {selectedTab === "friends" ? (
          <ScrollViewContainer>
            <FriendsList />
          </ScrollViewContainer>
        ) : (
          <SchoolFriends />
        )}
      </ContentContainer>
    </Container>
  );
}

export default FriendListScreen;
const Container = styled.SafeAreaView`
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
  margin-bottom: 16px;
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

const SectionTitle = styled(Text)`
  font-size: 16px;
  font-weight: 500px;
  font-family: Pretendard;
  color: #7b7b7b;
  text-align: left;
  margin-vertical: 10.5px;
`;

const SearchContainer = styled(View)`
  align-self: stretch;
  border-radius: 12px;
  background-color: #f5f5f5;
  flex-direction: row;
  align-items: center;
  padding-horizontal: 16px;
  padding-vertical: 8px;
  margin-bottom: 20px;
`;

const SearchInput = styled(TextInput)`
  align-self: stretch;
  color: #000;
  line-height: 22px;
  font-family: Pretendard;
  font-size: 16px;
  margin-left: 12px;
  text-align: left;
  align-items: center;
`;
const ScrollViewContainer = styled(ScrollView)`
  flex: 1;
  padding-horizontal: 16px;
`;

const FriendInfo = styled(View)`
  margin-left: 12px;
  gap: 4px;
`;

const FriendName = styled(Text)`
  font-size: 16px;
  font-weight: 500;
`;

const FriendGrade = styled(Text)`
  font-size: 14px;
  color: #666;
`;
const Avatar = styled(Image)`
  width: 48px;
  height: 48px;
  border-radius: 25px;
  margin-right: 12px;
`;
const FriendItem = styled(Pressable)`
  padding-vertical: 8px;
  flex-direction: row;
  align-items: center;
`;
const EmptyText = styled(Text)`
  font-size: 14px;
  color: #999;
  text-align: center;
  margin-top: 20px;
`;
const FilterContainer = styled.View`
  flex-direction: row;
  padding: 10px;
  justify-content: space-around;
`;
