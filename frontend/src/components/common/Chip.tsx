import styled, { css } from "@emotion/native";
import React, { ReactNode } from "react";
import { Dimensions, ViewProps } from "react-native";
import { Theme } from "../../styles/theme";

const { height, width } = Dimensions.get("window");
const vh = height / 100;
const vw = width / 100;

interface ChipProps extends ViewProps {
  size?: "small" | "medium";
  backGroundColor?: string;
  textColor?: string;
  borderColor?: string;
  children: ReactNode;
  borderRadiusType: "square" | "round" | "circle";
  LeftIcon?: ReactNode;
  RightIcon?: ReactNode;
}

function Chip({
  size = "small",
  backGroundColor = "#F8F8F8",
  textColor = Theme.colors.Gray600,
  borderColor = "#F8F8F8",
  children,
  borderRadiusType = "square",
  LeftIcon,
  RightIcon,
  ...props
}: ChipProps) {
  return (
    <ChipView
      size={size}
      borderColor={borderColor}
      backgroundColor={backGroundColor}
      borderRadiusType={borderRadiusType}
      {...props}
    >
      {LeftIcon && <IconWrapper style={{ marginRight: 4 }}>{LeftIcon}</IconWrapper>}
      <ChipText color={textColor} size={size}>
        {children}
      </ChipText>
      {RightIcon && <IconWrapper style={{ marginLeft: 4 }}>{RightIcon}</IconWrapper>}
    </ChipView>
  );
}

export default Chip;

function getBorderRadius(borderRadius: "square" | "round" | "circle") {
  switch (borderRadius) {
    case "circle":
      return 1000 * vw;
    case "round":
      return 8;
    case "square":
    default:
      return 0;
  }
}

const ChipView = styled.View<{
  backgroundColor: string;
  borderColor?: string;
  borderRadiusType: "square" | "round" | "circle";
  size: "small" | "medium";
}>`
  border-radius: ${({ borderRadiusType }) => `${getBorderRadius(borderRadiusType)}px`};
  background-color: ${({ backgroundColor }) => backgroundColor};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: ${({ size }) => (size === "small" ? "4px 8px" : "8px 12px")};
  border: ${({ borderColor }) => (borderColor ? `1px solid ${borderColor}` : "none")};
`;

const ChipText = styled.Text<{ color: string; size: "small" | "medium" }>`
  ${({ size }) => css`
    ${size === "small" ? Theme.typo.Label_01 : Theme.typo.Label_02}
  `}
  color: ${({ color }) => color};
`;

const IconWrapper = styled.View`
  justify-content: center;
  align-items: center;
`;
