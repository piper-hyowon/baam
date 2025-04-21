import React from "react";
import ListItemText from "./ListItemText";
import styled from "@emotion/native";
import { TColor, Theme } from "../../../styles/theme";
import { TouchableWithoutFeedback } from "react-native";
import ListItemContent from "./ListItemContent";

type TSize = "small" | "medium" | "large";
type TVariant = "square" | "rounded";

interface IListItem {
  children: React.ReactNode;
  size?: TSize;
  variant?: TVariant;
  bgColor?: TColor;
  textColor?: TColor;
  spacing?: string;
  leftIcon?: React.ReactNode; // TODO: Icon 컴포넌트 작업 전 임시
  rightIcon?: React.ReactNode; // TODO: Icon 컴포넌트 작업 전 임시
  onPress?: () => void;
}

const ListItem = ({ children, onPress, leftIcon, rightIcon, ...styles }: IListItem) => {
  const childrenItem = (
    <StyledListItem {...styles}>
      {leftIcon && leftIcon}
      {children}
      {rightIcon && rightIcon}
    </StyledListItem>
  );

  if (onPress) return <TouchableWithoutFeedback onPress={onPress}>{childrenItem}</TouchableWithoutFeedback>;

  return childrenItem;
};

export default Object.assign(React.memo(ListItem), {
  Content: ListItemContent,
  Text: ListItemText
});

const StyledListItem = styled.View<Pick<IListItem, "size" | "variant" | "bgColor" | "textColor" | "spacing">>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ bgColor = "Gray200" }) => Theme.colors[bgColor]};
  color: ${({ textColor = "Gray900" }) => Theme.colors[textColor]};

  ${({ variant = "square" }) =>
    variant === "square" ? "padding: 16px 12px;" : "padding: 16px 24px; border-radius: 24px;"};

  &:not(:first-of-type) {
    margin-top: ${({ spacing = "12px" }) => spacing};
  }
`;
