import { useEffect, useState } from "react";
import { View, SafeAreaView, Text, TouchableOpacity, Image, ScrollView, Pressable } from "react-native";
import styled from "@emotion/native";
import { VectorLeft, FriendsIcon, Hamburger } from "../../assets/assets";
import useAuthStore from "../../store/UserAuthStore";
import axios from "axios";
import { getSubjectType } from "@/utils/SubjectUtil";
interface schoolmate {
  userId: number;

  fullName: string;
  profileImage: string;

  activeClassNow: string;
  initial: string;
}
const getRandomColor = (itemIndex: number): string => {
  const colorList = ["#cfbaf0", "#7EB7FB", "#55C4E0", "#51CA81", "#F98888", "#F7D978"];
  const colorIndex = itemIndex % colorList.length;
  return colorList[colorIndex];
};
export const ParticipantsList = ({ navigation, route }: any) => {
  const { token } = useAuthStore();
  const [total, setTotal] = useState(0);
  const [participants, setParticipants] = useState<schoolmate[]>([]);
  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const getParticipants = async () => {
    setLoading(true); // 로딩 시작
    console.log("roomId : ", route.params.roomId);
    try {
      const response = await axios.get(`https://b-site.site/chat/rooms/${route.params.roomId}/participants`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      console.log("res : ", response.data.list);
      setParticipants(response.data.list);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Error fetching friends:", error);
    } finally {
      setLoading(false); // 로딩 끝
    }
  };
  useEffect(() => {
    getParticipants();
  }, []);
  return (
    <Container>
      <Header style={{ zIndex: 2 }}>
        <BackButton onPress={() => navigation.goBack()}>
          <BackIcon source={VectorLeft} />
        </BackButton>

        <View style={{ flexDirection: "column", alignItems: "center" }}>
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
            {route.params.roomName}
          </Text>
        </View>
        <View style={{ width: 24, height: 24 }} />
      </Header>

      <FriendScroll>
        <TotalText>전체 (총{total}명)</TotalText>
        {participants.map((p, idx) => (
          <FriendItem key={idx}>
            {p.profileImage ? (
              <>
                <Avatar source={{ uri: p.profileImage }} />

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
                  {p.activeClassNow ? (
                    <Image
                      source={getSubjectType(p.activeClassNow)}
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
                  borderColor: getRandomColor(p.userId),
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
                  {p.activeClassNow ? (
                    <Image
                      source={getSubjectType(p.activeClassNow)}
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
                    color: getRandomColor(p.userId)
                  }}
                >
                  {p.fullName.slice(-2)}
                </Text>
              </View>
            )}
            <FriendInfo>
              <FriendName>{p.fullName}</FriendName>
            </FriendInfo>
          </FriendItem>
        ))}
      </FriendScroll>
    </Container>
  );
};
export default ParticipantsList;
const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #fff;
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
const Avatar = styled(Image)`
  width: 48px;
  height: 48px;
  border-radius: 25px;
  margin-right: 12px;
`;
const FriendItem = styled(TouchableOpacity)`
  padding-vertical: 8px;
  flex-direction: row;
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

const FriendScroll = styled(ScrollView)`
  padding: 16px;
`;

const TotalText = styled(Text)`
  font-size: 16px;
  font-weight: 500;
  font-family: "Pretendard";
  color: #7b7b7b;
  text-align: "left";
  margin-bottom: 18.5px;
`;
