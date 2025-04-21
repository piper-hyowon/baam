import styled from "@emotion/native";
import { FlatList, Image, Pressable, ScrollView, Text, TextInput, View, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { FilterLine } from "../../assets/assets";
import { FriendsStackParamList } from "../../navigations/FriendsStackNavigation";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Chip from "../../components/common/Chip";

import { IconSearch } from "../../assets/assets";

import { getSubjectType } from "@/utils/SubjectUtil";
import useUserStore from "@/store/UserStore";
import useAuthStore from "@/store/UserAuthStore";
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
  activeClassNow: string;
}
interface schoolmateList {
  list: schoolmate[];
}

export default function SchoolFriends() {
  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const navigation = useNavigation<NavigationProps>();
  const [schoolFriends, setSchoolFriends] = useState<schoolmateList>({
    list: []
  });
  const [filterCache, setFilterCache] = useState<{ [key: string]: { list: schoolmate[]; total: number } }>({});
  const [selectedFilter, setSelectedFilter] = useState("전체");
  // const { accessToken: token } = useUserStore();
  const { token } = useAuthStore();
  const [page, setPage] = useState(0);
  const [enteredText, setEnteredText] = useState("");

  const fetchSchoolMates = async (page: number, filter: string) => {
    setLoading(true); // 로딩 시작
    console.log("fetchschoolmates");
    const params: any = {
      count: 10,
      page: page
    };
    if (filter === "1학년" || filter === "2학년" || filter === "3학년") {
      params.grades = Number(filter[0]);
    } else if (filter === "즐겨찾기") {
      params.isFavorite = true;
    }
    try {
      const response = await axios.get("https://b-site.site/schoolmates", {
        params,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const newSchoolmates = response.data.list;
      console.log("new", newSchoolmates);
      setSchoolFriends((prev) => ({
        list: page === 0 ? newSchoolmates : [...prev.list, ...newSchoolmates]
      }));
      // console.log("totall : ", response.data.total, filter, page);
      setFilterCache((prevCache) => ({
        ...prevCache,
        [filter]: {
          list: page === 0 ? newSchoolmates : [...(prevCache[filter]?.list || []), ...newSchoolmates],
          total: response.data.total
        }
      }));
    } catch (error) {
      console.error("Error fetching schoolmates:", error);
    } finally {
      setLoading(false); // 로딩 끝
    }
  };

  const handleEndReached = () => {
    // console.log("3개", schoolFriends.list.length, filterCache[selectedFilter]?.total || 0);
    if (!loading && schoolFriends.list.length < (filterCache[selectedFilter]?.total || 0)) {
      // console.log("why not?");
      const nextPage = Math.floor(schoolFriends.list.length / 10);
      setPage(nextPage);
      fetchSchoolMates(nextPage, selectedFilter);
    }
  };

  const handleSearchSchoolmate = async (text: string) => {
    setEnteredText(text);
    setSelectedFilter("전체");
    const response = await axios.get("https://b-site.site/schoolmates", {
      params: {
        count: 1000,
        page: 0,
        name: text
      },
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      }
    });
    setSchoolFriends({ list: response.data.list });
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
  };

  const getRandomColor = (itemIndex: number): string => {
    const colorList = ["#cfbaf0", "#7EB7FB", "#55C4E0", "#51CA81", "#F98888", "#F7D978"];
    const colorIndex = itemIndex % colorList.length;
    return colorList[colorIndex];
  };
  useEffect(() => {
    if (filterCache[selectedFilter]) {
      setSchoolFriends({
        list: filterCache[selectedFilter].list
      });
    } else {
      setPage(0);
      fetchSchoolMates(0, selectedFilter);
    }
  }, [selectedFilter]);

  return (
    <View style={{ flex: 1 }}>
      <SearchContainer>
        <Image source={IconSearch} style={{ width: 24, height: 24 }} />
        <SearchInput placeholder="검색어를 입력하세요" onChangeText={handleSearchSchoolmate} value={enteredText} />
      </SearchContainer>
      <ScrollView
        horizontal
        contentContainerStyle={{ gap: 7, paddingVertical: 4, marginBottom: 26, height: "80%" }}
        showsHorizontalScrollIndicator={false}
      >
        <TouchableOpacity>
          <Chip
            borderRadiusType="circle"
            children="필터"
            textColor="#7b7b7b"
            size="medium"
            LeftIcon={<Image source={FilterLine} style={{ width: 18, height: 18 }} />}
          />
        </TouchableOpacity>
        {filterList.map((filter) => (
          <TouchableOpacity key={filter.id} onPress={() => handleFilterSelect(filter.grade)}>
            <Chip
              borderRadiusType="circle"
              children={filter.grade}
              backGroundColor={selectedFilter === filter.grade ? "#8A7EFF33" : "#f0f0f0"}
              textColor={selectedFilter === filter.grade ? "#8A7EFF" : "#7b7b7b"}
              size="medium"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={{ flex: 1, justifyContent: "flex-start", minHeight: "76%" }}>
        <SectionTitle>전체</SectionTitle>

        <FlatList
          data={schoolFriends.list}
          renderItem={({ item }) => (
            <FriendItem
              onPress={() =>
                navigation.navigate("FriendProfile", {
                  userId: item.userId,
                  isFavorite: item.isFavorite
                })
              }
            >
              {item.profileImage ? (
                <>
                  {/* <Image source={getSubjectType(item.activeClassNow)} style={{ width: 40, height: 40 }} /> */}

                  <Avatar source={{ uri: item.profileImage }} />

                  <View
                    style={{
                      position: "absolute",
                      left: 32,
                      top: -2,
                      width: 24,
                      height: 24,
                      zIndex: 900,
                      borderColor: "#E9E9E9",
                      borderWidth: 1,
                      borderRadius: 25,
                      backgroundColor: "#fff",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    {item.activeClassNow ? (
                      <Image
                        source={getSubjectType(item.activeClassNow)}
                        style={{
                          width: 16,
                          height: 16,
                          zIndex: 1000
                        }}
                      />
                    ) : (
                      <Image
                        source={getSubjectType("기타")}
                        style={{
                          width: 16,
                          height: 16,
                          zIndex: 1000
                        }}
                      />
                    )}
                  </View>
                </>
              ) : (
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 25,
                    marginRight: 12,
                    borderColor: getRandomColor(item.userId),
                    borderWidth: 2
                  }}
                >
                  <View
                    style={{
                      position: "absolute",
                      right: -10,
                      top: -10,
                      width: 24,
                      height: 24,
                      zIndex: 900,
                      borderColor: "#E9E9E9",
                      borderWidth: 1,
                      borderRadius: 25,
                      backgroundColor: "#fff",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    {item.activeClassNow ? (
                      <Image
                        source={getSubjectType(item.activeClassNow)}
                        style={{
                          width: 16,
                          height: 16,
                          zIndex: 1000
                        }}
                      />
                    ) : (
                      <Image
                        source={getSubjectType("기타")}
                        style={{
                          width: 16,
                          height: 16,
                          zIndex: 1000
                        }}
                      />
                    )}
                  </View>
                  <Text
                    style={{
                      position: "absolute",
                      top: "30%",
                      left: "20%",
                      fontSize: 16,
                      lineHeight: 20,
                      fontWeight: "500",
                      fontFamily: "Esamanru OTF",
                      color: getRandomColor(item.userId)
                    }}
                  >
                    {item.fullName.slice(-2)}
                  </Text>
                </View>
              )}
              <FriendInfo>
                <FriendName>{item.fullName}</FriendName>
                <FriendGrade>{item.grade}학년</FriendGrade>
              </FriendInfo>
            </FriendItem>
          )}
          keyExtractor={(item) => item.userId.toString()}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5} // 스크롤이 리스트의 50% 지점에 도달했을 때 fetchMoreData 호출
          ListFooterComponent={loading ? <Text>Loading...</Text> : null}
        />
      </View>
    </View>
  );
}
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
