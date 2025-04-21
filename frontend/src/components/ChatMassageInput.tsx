// import React, { useState } from "react";
// import { View, TextInput, Button, TouchableOpacity } from "react-native";
// import styled from "@emotion/native";
// import { useChatStore } from "../store/store";
// import { IconPlus, IconSearch, IconSend } from "../assets/assets";

// const ChatMessageInput: React.FC = () => {
//   const [message, setMessage] = useState("");
//   const addMessage = useChatStore((state) => state.addMessage);

//   return (
//     <MessageInputView>
//       <TouchableOpacity>
//         <PlusImage source={IconPlus} />
//       </TouchableOpacity>
//       <StyledTextInput placeholder="메시지를 입력하세요" value={message} onChangeText={setMessage} />
//       <TouchableOpacity>
//         <SendImage source={IconSend} />
//       </TouchableOpacity>
//     </MessageInputView>
//   );
// };

// export default ChatMessageInput;

// // Styled components
// const MessageInputView = styled.View`
//   padding-left: 16px;
//   padding-right: 16px;
//   height: 68px;
//   border-top-width: 1px;
//   border-top-color: #e9e9e9;
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   justify-content: center;
//   position: absolute;
//   bottom: 0;
//   left: 0;
//   right: 0;
// `;
// const PlusImage = styled.Image`
//   width: 24px;
//   height: 24px;
// `;
// const SendImage = styled.Image`
//   width: 24px;
//   height: 24px;
// `;
// const StyledTextInput = styled.TextInput`
//   border-radius: 20px;
//   background-color: #e9e9e9;
//   height: 40px;
//   padding-left: 12px;
//   flex: 1;
//   margin-right: 16px;
//   margin-left: 16px;
// `;
