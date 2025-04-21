/**
 * Common Component - Button - SolidButton
 */

import styled, { css } from "@emotion/native";
import { Pressable, View, ViewProps } from "react-native";
import { Theme } from "../../../styles/theme";
import { ReactNode } from "react";

type ButtonType = "primary" | "secondary" | "ghost" | "error";
type ButtonMode = "enable" | "outline" | "disable";
type ButtonSize = "medium" | "large";

interface ButtonProps extends ViewProps {
  type: ButtonType;
  mode: ButtonMode;
  size: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: string;
  onPress: () => void;
}

const InnerView = styled.View<{
  mode: ButtonMode;
  size: ButtonSize;
  defaultBgColor: string;
  pressedBgColor: string;
  border: string;
  pressed: boolean;
  onPress?: () => void;
}>`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: ${({ size }) => (size === "medium" ? "108px" : "130px")};
  background-color: ${({ mode, pressed, pressedBgColor, defaultBgColor }) =>
    pressed && mode === "enable" ? `${pressedBgColor}` : `${defaultBgColor}`};
  border: ${({ border }) => border && `1px solid ${border}`};
  padding: ${({ size }) => (size === "medium" ? "4px" : "6px")};
`;

const ButtonText = styled.Text<{
  color: string;
  size: ButtonSize;
}>`
  ${({ size }) => css`
    ${size === "medium" ? Theme.typo.Label_02 : Theme.typo.Label_03}
  `}
  color: ${({ color }) => color};
`;

export default function SolidButton({
  type,
  mode,
  size,
  leftIcon,
  rightIcon,
  children,
  onPress,
  ...props
}: ButtonProps) {
  let defaultBgColor: string;
  let pressedBgColor: string;
  let textColor: string = Theme.colors.White;
  let border: string;

  switch (type) {
    case "primary":
      defaultBgColor = Theme.colors.Black;
      pressedBgColor = Theme.colors.Gray800;
      break;
    case "secondary":
      defaultBgColor = Theme.colors.Gray400;
      pressedBgColor = Theme.colors.Gray600;
      break;
    case "ghost":
      defaultBgColor = Theme.colors.White;
      pressedBgColor = Theme.colors.Gray100;
      textColor = Theme.colors.Gray900;
      break;
    case "error":
      defaultBgColor = Theme.colors.White;
      pressedBgColor = Theme.colors.Gray100;
      textColor = "#F11414";
      break;
  }

  if (mode === "outline") {
    switch (type) {
      case "primary":
        defaultBgColor = "transparent";
        textColor = Theme.colors.Gray900;
        border = Theme.colors.Black;
        break;
      case "secondary":
        defaultBgColor = Theme.colors.White;
        border = Theme.colors.Gray600;
        textColor = Theme.colors.Gray900;
        break;
      case "ghost":
        border = Theme.colors.Black;
        break;
      case "error":
        border = "#F11414";
        break;
    }
  } else if (mode === "disable") {
    switch (type) {
      case "primary":
        defaultBgColor = Theme.colors.Gray200;
        break;
      case "secondary":
        defaultBgColor = Theme.colors.Gray200;
        break;
      case "ghost":
        defaultBgColor = Theme.colors.Gray100;
        textColor = Theme.colors.Gray200;
        break;
      case "error":
        defaultBgColor = Theme.colors.Gray100;
        textColor = Theme.colors.White;
        break;
    }
  }

  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <InnerView
          mode={mode}
          size={size}
          pressed={pressed}
          defaultBgColor={defaultBgColor}
          pressedBgColor={pressedBgColor}
          border={border}
          {...props}
        >
          {leftIcon && <View style={{ marginRight: 4 }}>{leftIcon}</View>}
          <ButtonText color={textColor} size={size}>
            {children}
          </ButtonText>
          {rightIcon && <View style={{ marginLeft: 4 }}>{rightIcon}</View>}
        </InnerView>
      )}
    </Pressable>
  );
}
