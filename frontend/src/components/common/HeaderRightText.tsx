import styled from "@emotion/native";
import React from "react";
import { Theme } from "../../styles/theme";

interface HeaderRightTextProps {
  children: string;
}

function HeaderRightText({ children }: HeaderRightTextProps) {
  return <HeaderText>{children}</HeaderText>;
}

export default HeaderRightText;

const HeaderText = styled.Text`
  margin-right: 16px;
  color: ${Theme.colors.Black};
  font-size: 16px;
  font-weight: 500;
`;
