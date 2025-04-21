// import { SafeAreaView, Text, View, Image, TouchableOpacity, FlatList, TextInput } from "react-native";
// import styled from "@emotion/native";
// import { BtnLeft, ChatUser, DummyProfile, IconBell, IconSearch } from "../assets/assets";
// import { useChatStore } from "../store/store";
// import ChatHeader from "../components/ChatHeader";
// import ChatMessageInput from "../components/ChatMassageInput";
// import { Message } from "../store/store";
// const dummydata = {
//   title: "화법과 작문",
//   totalUser: 34,
//   content: [
//     {
//       id: 1,
//       name: "장혜림",
//       content: "혹시 화작 수행평가 날짜 아는 사람..?",
//       create_date: "2024-07-09T08:42:20.124Z",

//       profileImgUrl: DummyProfile,
//       isOpen: true
//     },
//     {
//       id: 2,
//       name: "나",
//       content: "몰라몰라몰라몰라몰라몰라몰라몰라몰라몰라몰라몰라몰라몰라몰라몰라몰라몰라몰라",
//       create_date: "2024-07-09T08:42:30.124Z",
//       profileImgUrl: null,
//       isOpen: true
//     },
//     {
//       id: 3,
//       name: "장혜림",
//       content: "혹시 화작 수행평가 날짜 아는 사람..?",
//       create_date: "2024-07-09T08:44:40.124Z",
//       profileImgUrl: DummyProfile,
//       isOpen: true
//     },
//     {
//       id: 4,
//       name: "나",
//       content: "알아알아알아알아알아알아알아알아알아알아알아알아알아알아알아알아알아",
//       create_date: "2024-07-10T08:42:20.124Z",
//       profileImgUrl: null,
//       isOpen: false
//     },
//     {
//       id: 5,
//       name: "장혜림",
//       content: "혹시 화작 수행평가 날짜 아는 사람..?",
//       create_date: "2024-07-10T08:44:40.124Z",
//       profileImgUrl: DummyProfile,
//       isOpen: true
//     },
//     {
//       id: 6,
//       name: "나",
//       content: "알아알아알아알아알아알아알아알아알아알아알아알아알아알아알아",
//       create_date: "2024-07-10T08:45:20.124Z",
//       profileImgUrl: null,
//       isOpen: false
//     }
//   ]
// };
// const StyledSafeAreaView = styled(SafeAreaView)`
//   flex: 1;
//   background-color: #fff;
// `;

// const DateView = styled(View)`
//   margin: 16px;
//   align-items: center;
// `;

// const ChatView = styled(View)`
//   flex: 1;
//   padding: 16px;
//   background-color: #e2e2e2;
//   margin-bottom: 68px;
// `;

// const StyledText = styled(Text)`
//   font-size: 16px;
//   color: #333;
// `;
// function ChatScreen() {
//   const { title, totalUser, messages } = useChatStore();
//   return (
//     <StyledSafeAreaView>
//       <ChatHeader
//         title={dummydata.title}
//         totalUser={dummydata.totalUser}
//         BtnLeft={BtnLeft}
//         ChatUser={ChatUser}
//         IconSearch={IconSearch}
//         IconBell={IconBell}
//       />
//       <ChatView>
//         {/* <DateView>
//           <StyledText>2024/3/27 월요일</StyledText>
//         </DateView> */}
//         <FlatList
//           data={dummydata.content}
//           keyExtractor={(item) => item.id.toString()}
//           renderItem={({ item }) => <MessageItem message={item} />}
//         />
//       </ChatView>

//       <ChatMessageInput />
//     </StyledSafeAreaView>
//   );
// }
// export default ChatScreen;
// const MessageItem: React.FC<{ message: Message }> = ({ message }) => {
//   if (message.name != "나") {
//     return (
//       <LeftBubble>
//         <Profile>
//           <ProfileImage source={DummyProfile} />
//           <NameText>{message.name}</NameText>
//         </Profile>
//         <TextBubble>
//           <MessageText>{message.content}</MessageText>
//         </TextBubble>
//       </LeftBubble>
//     );
//   } else {
//     return (
//       <RightBubble>
//         <MessageText>{message.content}</MessageText>
//       </RightBubble>
//     );
//   }
// };

// const LeftBubble = styled.View`
//   display: flex;
//   flex-direction: row;
//   align-items: flex-start;
//   margin-bottom: 24px;
//   max-width: 250px;
// `;
// const Profile = styled.View`
//   display: flex;
//   align-items: center;
// `;
// const ProfileImage = styled.Image`
//   width: 48px;
//   height: 48px;
//   align-items: center;
//   margin-bottom: 4px;
// `;
// const NameText = styled.Text`
//   font-size: 12px;
//   color: #000;
//   font-weight: 600;
// `;
// const TextBubble = styled.View`
//   margin-left: 20px;
//   padding: 12px;
//   align-items: center;

//   background-color: #f8f6fe;
//   border-top-left-radius: 0px;
//   border-top-right-radius: 12px;
//   border-bottom-left-radius: 12px;
//   border-bottom-right-radius: 12px;
// `;
// const RightBubble = styled.View`
//   display: flex;
//   flex-direction: row;
//   align-items: flex-end;
//   margin-bottom: 24px;
//   padding: 12px;
//   background-color: #f8f6fe;
//   border-top-left-radius: 12px;
//   border-top-right-radius: 0px;
//   border-bottom-left-radius: 12px;
//   border-bottom-right-radius: 12px;
//   align-self: flex-end;
//   max-width: 200px;
// `;
// const MessageText = styled.Text`
//   font-size: 16px;
//   color: #000;
//   font-weight: 500;
// `;
