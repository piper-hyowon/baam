/**
 * Common Component - Button - TextButton
 */

import styled, { css } from "@emotion/native";
import { ReactNode } from "react";
import { Pressable, View, ViewProps } from "react-native";
import { Theme } from "../../../styles/theme";

type ButtonType = "primary" | "support";
type ButtonSize = "small" | "medium";

interface ButtonProps extends ViewProps {
  type: ButtonType;
  size: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: string;
  onPress: () => void;
}

const OuterView = styled.View<{ type: ButtonType; size: ButtonSize; pressed: boolean }>`
  width: ${({ size }) => (size === "small" ? "74px" : "88px")};
  height: ${({ size }) => (size === "small" ? "32px" : "36px")};
  background-color: ${({ type, pressed }) =>
    pressed ? (type === "primary" ? "#E6ECF6" : Theme.colors.Gray200) : "transparent"};
  justify-content: center;
  align-items: center;
`;

const InnerView = styled.View`
  margin: 4px;
  padding: 4px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;

const ButtonText = styled.Text<{
  type: ButtonType;
  size: ButtonSize;
}>`
  ${({ size }) => css`
    ${size === "small" ? Theme.typo.Label_01 : Theme.typo.Label_02}
  `}
  color: ${({ type }) => (type === "primary" ? "#0b66ff" : Theme.colors.Gray700)};
`;

export default function TextButton({ type, size, leftIcon, rightIcon, children, onPress, ...props }: ButtonProps) {
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <OuterView type={type} size={size} pressed={pressed} {...props}>
          <InnerView>
            {leftIcon && <View>{leftIcon}</View>}
            <ButtonText type={type} size={size}>
              {children}
            </ButtonText>
            {rightIcon && <View>{rightIcon}</View>}
          </InnerView>
        </OuterView>
      )}
    </Pressable>
  );
}
