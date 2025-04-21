import styled from "@emotion/native";
import { FlatList, Image, Pressable, ScrollView, Text, TextInput, View, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { FriendsStackParamList } from "../../navigations/FriendsStackNavigation";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { IconSearch } from "../../assets/assets";

import { getSubjectType } from "@/utils/SubjectUtil";
import useUserStore from "@/store/UserStore";
import useAuthStore from "@/store/UserAuthStore";
type NavigationProps = StackNavigationProp<FriendsStackParamList, "FriendProfile">;

interface schoolmate {
  userId: number;
  fullName: string;
  profileImage: string;
  activeClassNow: string;
  isFavorite: boolean;
}
interface schoolmateList {
  list: schoolmate[];
}

export default function FriendsList() {
  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const navigation = useNavigation<NavigationProps>();
  const [favoriteFriends, setFavoriteFriends] = useState<schoolmateList>({
    list: []
  });
  const [friends, setFriends] = useState<schoolmateList>({
    list: []
  });
  const [total, setTotal] = useState(0);
  // const { accessToken: token } = useUserStore();
  const { token } = useAuthStore();
  const [enteredText, setEnteredText] = useState("");

  const fetchFriends = async (page: number) => {
    setLoading(true); // 로딩 시작
    try {
      const response = await axios.get("https://b-site.site/friends", {
        params: {
          count: 20,
          page: page
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const newFriends = response.data.all;
      const favoriteFriends = response.data.favaorites;
      setFriends((prev) => ({
        list: page === 0 ? newFriends : [...prev.list, ...newFriends]
      }));
      setFavoriteFriends((prev) => ({
        list: page === 0 ? favoriteFriends : [...prev.list, ...favoriteFriends]
      }));
    } catch (error) {
      console.error("Error fetching friends:", error);
    } finally {
      setLoading(false); // 로딩 끝
    }
  };

  const handleEndReached = () => {
    // if (!loading && friends.list.length < total) {
    //   const nextPage = Math.floor(friends.list.length / 20);
    //   fetchFriends(nextPage);
    // }
  };

  const handleSearchFriends = async (text: string) => {
    setEnteredText(text);
    const response = await axios.get("https://b-site.site/friends", {
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
    console.log("검색결과", text, response.data.all);
    setFriends({ list: response.data.all });
    setFavoriteFriends({ list: response.data.favaorites });
  };

  const getRandomColor = (itemIndex: number): string => {
    const colorList = ["#cfbaf0", "#7EB7FB", "#55C4E0", "#51CA81", "#F98888", "#F7D978"];
    const colorIndex = itemIndex % colorList.length;
    return colorList[colorIndex];
  };

  useEffect(() => {
    fetchFriends(0);
    // console.log("friendslist.tsx");
  }, []);
  // useEffect(() => {
  //   console.log("??", favoriteFriends.list);
  // }, [favoriteFriends]);

  return (
    <View style={{ flex: 1 }}>
      <SearchContainer>
        <Image source={IconSearch} style={{ width: 24, height: 24 }} />
        <SearchInput placeholder="검색어를 입력하세요" onChangeText={handleSearchFriends} value={enteredText} />
      </SearchContainer>
      <View style={{ flex: 1, justifyContent: "flex-start", minHeight: "30%" }}>
        <SectionTitle>즐겨찾기</SectionTitle>
        {favoriteFriends.list && favoriteFriends.list.length > 0 ? (
          favoriteFriends.list.map((friend) => (
            <FriendItem
              key={friend.userId} // key prop 추가
              onPress={() =>
                navigation.navigate("FriendProfile", {
                  userId: friend.userId,
                  isFavorite: true
                })
              }
            >
              {friend.profileImage ? (
                <>
                  <Avatar source={{ uri: friend.profileImage }} />
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
                    {friend.activeClassNow ? (
                      <Image
                        source={getSubjectType(friend.activeClassNow)}
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
                    borderColor: getRandomColor(friend.userId),
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
                    {friend.activeClassNow ? (
                      <Image
                        source={getSubjectType(friend.activeClassNow)}
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
                      color: getRandomColor(friend.userId)
                    }}
                  >
                    {friend.fullName.slice(-2)}
                  </Text>
                </View>
              )}
              <FriendInfo>
                <FriendName>{friend.fullName}</FriendName>
                {/* <FriendGrade>{friend.grade}학년</FriendGrade> */}
              </FriendInfo>
            </FriendItem>
          ))
        ) : (
          <Text>No friends found</Text>
        )}
        <SectionTitle>전체</SectionTitle>
        {friends.list && friends.list.length > 0 ? (
          friends.list.map((friend) => (
            <FriendItem
              key={friend.userId} // key prop 추가
              onPress={() =>
                navigation.navigate("FriendProfile", {
                  userId: friend.userId,
                  isFavorite: friend.isFavorite
                })
              }
            >
              {friend.profileImage ? (
                <>
                  <Avatar source={{ uri: friend.profileImage }} />
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
                    {friend.activeClassNow ? (
                      <Image
                        source={getSubjectType(friend.activeClassNow)}
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
                    borderColor: getRandomColor(friend.userId),
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
                    {friend.activeClassNow ? (
                      <Image
                        source={getSubjectType(friend.activeClassNow)}
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
                      color: getRandomColor(friend.userId)
                    }}
                  >
                    {friend.fullName.slice(-2)}
                  </Text>
                </View>
              )}
              <FriendInfo>
                <FriendName>{friend.fullName}</FriendName>
                {/* <FriendGrade>{friend.grade}학년</FriendGrade> */}
              </FriendInfo>
            </FriendItem>
          ))
        ) : (
          <Text>No friends found</Text>
        )}
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
