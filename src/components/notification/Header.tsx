import React from "react";
import { Image, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import styled from "@emotion/native";
import { VectorLeft } from "@/assets/assets";

interface HeaderProps {
  onBackPress: () => void;
}

const HeaderComponent: React.FC<HeaderProps> = ({ onBackPress }) => {
  return (
    <Header style={{ zIndex: 2 }}>
      <BackButton onPress={onBackPress}>
        <BackIcon source={VectorLeft} />
      </BackButton>
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
        알림
      </Text>
      <View style={{ width: 24, height: 24 }} />
    </Header>
  );
};

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
export default HeaderComponent;
