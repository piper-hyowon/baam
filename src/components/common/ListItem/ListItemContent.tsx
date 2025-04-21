import React from "react";
import { TTypo } from "../../../styles/theme";
import styled from "@emotion/native";
import { ViewProps } from "react-native";

interface IListItemContent extends ViewProps {
  children: React.ReactNode;
}

const ListItemContent = ({ children, ...props }: IListItemContent) => {
  return <StyledListItemContent {...props}>{children}</StyledListItemContent>;
};

export default React.memo(ListItemContent);

export const StyledListItemContent = styled.View`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  justify-content: flex-start;
  flex: 1;
`;
