import styled from "@emotion/native";
import { Theme } from "../../styles/theme";

export const RootContainer = styled.View`
  flex: 1;
  background-color: white;
  padding: 160px 16px 72px 16px;
`;

export const ImageContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const StyledText = styled.Text`
  ${Theme.typo.Head_01_RD};
  color: ${Theme.colors.Black};
`;

export const PrimaryButtonContainer = styled.View`
  flex-direction: row;
  width: 100%;
  height: 56px;
  background-color: #fae407;
  justify-content: center;
  align-items: center;
  border-radius: 24px;
  gap: 8px;
  margin-bottom: 8px;
`;

export const PrimaryButtonText = styled.Text`
  ${Theme.typo.Label_03};
  color: ${Theme.colors.Black};
`;

export const SecondaryButtonContainer = styled.View`
  flex-direction: row;
  width: 100%;
  height: 56px;
  background-color: ${Theme.colors.Black};
  justify-content: center;
  align-items: center;
  border-radius: 24px;
  gap: 8px;
`;

export const SecondaryButtonText = styled.Text`
  ${Theme.typo.Label_03};
  color: ${Theme.colors.White};
`;

export const ButtonContainer = styled.View`
  width: 100%;
`;

export const TextContainer = styled.View`
  margin-bottom: 36px;
  justify-content: center;
  align-items: center;
`;

export const Title = styled.Text`
  font-family: "Pretendard-Bold";
  font-size: 20px;
  line-height: 23.87px;
  color: ${Theme.colors.Gray900};
  margin-bottom: 8px;
`;
export const SubTitle = styled.Text`
  font-family: "Pretendard";
  font-size: 16px;
  line-height: 19.09px;
  color: ${Theme.colors.Gray900};
`;
