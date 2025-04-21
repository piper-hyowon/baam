import React from "react";
import { TTypo, Theme } from "../../../styles/theme";
import styled from "@emotion/native";
import { TextProps } from "react-native";

interface IListItemText extends TextProps {
  children: React.ReactNode;
  typography?: TTypo;
}

const ListItemText = ({ children, typography = "Body_04_Bold", ...props }: IListItemText) => {
  return (
    <StyledListItemText typography={typography} {...props}>
      {children}
    </StyledListItemText>
  );
};

export default React.memo(ListItemText);

export const StyledListItemText = styled.Text<{ typography: TTypo }>`
  ${({ typography }) => Theme.typo[typography]};
`;
