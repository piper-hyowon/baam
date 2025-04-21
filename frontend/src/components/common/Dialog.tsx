import styled, { css } from "@emotion/native";
import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from "react-native";
import { Theme } from "../../styles/theme";

const { height } = Dimensions.get("window");

interface DialogProps {
  isVisible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}
function Dialog({ isVisible, title, message, onConfirm, onCancel, ...props }: DialogProps) {
  const translateY = new Animated.Value(height);

  useEffect(() => {
    if (isVisible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true
      }).start();
    } else {
      Animated.spring(translateY, {
        toValue: height,
        useNativeDriver: true
      }).start();
    }
  }, [isVisible]);

  return (
    <AnimatedOverlay style={{ transform: [{ translateY }] }}>
      <Container>
        <Title>{title}</Title>
        <Message>{message}</Message>
        <ButtonContainer>
          <Button onPress={onCancel} backgoundColor={Theme.colors.Gray400} marginRight="6px">
            <ButtonText textColor={Theme.colors.White}>취소</ButtonText>
          </Button>
          <Button onPress={onConfirm} backgoundColor={Theme.colors.Black} marginLeft="6px">
            <ButtonText textColor={Theme.colors.White}>확인</ButtonText>
          </Button>
        </ButtonContainer>
      </Container>
    </AnimatedOverlay>
  );
}

export default Dialog;
const AnimatedOverlay = styled(Animated.View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
`;

const Container = styled(View)`
  width: 280px;
  height: 198px;
  background-color: ${Theme.colors.White};
  padding: 20px;
  border-radius: 16px;
`;
const Title = styled(Text)`
  color: ${Theme.colors.Gray700};
  font-style: ${Theme.typo.Body_04};
  font-weight: bold;
  margin-bottom: 10px;
`;

const Message = styled(Text)`
  color: ${Theme.colors.Gray600};
  font-style: ${Theme.typo.Body_02};
  margin-bottom: 20px;
  color: #7b7b7b;
`;

const ButtonContainer = styled(View)`
  flex-direction: row;
  width: 240px;
  height: 42px;
  width: 100%;
`;

const Button = styled.TouchableOpacity<{
  backgoundColor: string;
  marginLeft?: string;
  marginRight?: string;
}>`
  padding: 12px 12px 12px 12px;
  align-items: center;
  flex: 1 0 0;
  border-radius: 8px;
  margin-left: ${({ marginLeft }) => marginLeft || "0px"};
  margin-right: ${({ marginRight }) => marginRight || "0px"};
  background: ${({ backgoundColor }) => backgoundColor};
`;

const ButtonText = styled.Text<{
  textColor: string;
}>`
  color: ${({ textColor }) => textColor};
  font-style: ${Theme.typo.Label_02};
`;
