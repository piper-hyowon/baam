// import React from "react";
// import { Dimensions, Image, Text, TouchableOpacity } from "react-native";
// import styled from "@emotion/native";
// const { height, width } = Dimensions.get("window");
// const vh = height / 100;
// const vw = width / 100;

// interface ChatHeaderProps {
//   title: string;
//   totalUser: number;
//   BtnLeft: any;
//   ChatUser: any;
//   IconSearch: any;
//   IconBell: any;
// }

// const ChatHeader: React.FC<ChatHeaderProps> = ({ title, totalUser, BtnLeft, ChatUser, IconSearch, IconBell }) => {
//   return (
//     <ChatHeaderView>
//       <TouchableOpacity>
//         <BackImage source={BtnLeft} />
//       </TouchableOpacity>
//       <TitleView>
//         <TitleText>{title}</TitleText>
//         <UserView>
//           <UserImage source={ChatUser} />
//           <UserText>{totalUser}명</UserText>
//         </UserView>
//       </TitleView>
//       <TouchableOpacity>
//         <SearchImage source={IconSearch} />
//       </TouchableOpacity>
//       <TouchableOpacity>
//         <BellImage source={IconBell} />
//       </TouchableOpacity>
//     </ChatHeaderView>
//   );
// };

// export default ChatHeader;

// // Styled components
// const ChatHeaderView = styled.View`
//   padding: 8px;
//   height: ${5.5 * vh}px;
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   justify-content: space-between;
// `;
// const BackImage = styled.Image`
//   width: 30px;
//   height: 30px;
// `;
// const TitleView = styled.View`
//   flex: 1;
//   align-items: center;
//   flex-direction: column;
//   margin-left: 28px;
// `;
// const TitleText = styled.Text`
//   font-size: 18px;
//   color: #000;
//   font-weight: bold;
//   text-align: center;
// `;
// const UserView = styled.View`
//   flex-direction: row;
// `;
// const UserImage = styled.Image`
//   width: 20px;
//   height: 20px;
//   margin-right: 2px;
//   align-items: flex-end;
// `;
// const UserText = styled.Text`
//   font-size: 14px;
//   color: #555555;
//   margin-left: 2px;
//   align-items: center;
// `;

// const SearchImage = styled.Image`
//   width: 30px;
//   height: 30px;
//   margin-right: 8px;
// `;
// const BellImage = styled.Image`
//   width: 30px;
//   height: 30px;
// `;
