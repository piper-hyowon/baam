import React from "react";
import { View, Text, Image } from "react-native";
import styled from "@emotion/native";
interface AvatarProps {
  avatarUrl: string;
  userName: string;
  emoji: string;
}

function Avatar({ avatarUrl, userName, emoji, ...props }: AvatarProps) {
  return (
    <AvatarContainer>
      <AvatarWrapper>
        <AvatarImage source={{ uri: avatarUrl }} />

        <EmojiBadge>
          <EmojiText>{emoji}</EmojiText>
        </EmojiBadge>
      </AvatarWrapper>
      <UserName>{userName}</UserName>
    </AvatarContainer>
  );
}

export default Avatar;

const AvatarContainer = styled(View)`
  align-items: center;
  //   position: relative;
`;
const AvatarWrapper = styled(View)`
  position: relative;
`;
const AvatarImage = styled(Image)`
  width: 48px;
  height: 48px;
  border-radius: 40px;
  background-color: #e0e0e0;
`;

const UserName = styled(Text)`
  margin-top: 8px;
  font-size: 12px;
  color: #333;
`;

const EmojiBadge = styled(View)`
  position: absolute;
  top: -5px;
  right: -5px;
  translatex: 15px;
  translatey: -15px;
  width: 28px;
  height: 28px;
  border-radius: 100px;
  background-color: #fff;
  align-items: center;
  justify-content: center;
`;

const EmojiText = styled(Text)`
  font-size: 17px;
  text-align: center;
`;
