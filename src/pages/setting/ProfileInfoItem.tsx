import styled from "@emotion/native";
import React from "react";
import { Theme } from "../../styles/theme";

interface ProfileInfoItemProps {
  label: string;
  value: string;
}
const ProfileInfoItem = ({ label, value }: ProfileInfoItemProps) => (
  <InfoItemContainer>
    <LabelText>{label}</LabelText>
    <ValueText>{value}</ValueText>
  </InfoItemContainer>
);

export default ProfileInfoItem;

const InfoItemContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const LabelText = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${Theme.colors.Gray700};
`;

const ValueText = styled.Text`
  font-size: 16px;
  color: ${Theme.colors.Gray800};
`;
