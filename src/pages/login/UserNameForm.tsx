import styled from "@emotion/native";
import { Theme } from "../../styles/theme";
import OutSideLabelInput from "../../components/common/input/OutsideLabelInput";
import { Pressable, Text, View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { SignUpStackParamList } from "../../navigations/SignUpStackNavigation";
import useUserStore from "../../store/UserStore";
import { useState } from "react";

type UserNameFormProps = StackScreenProps<SignUpStackParamList, "UserNameForm">;

export default function UserNameForm({ navigation }: UserNameFormProps) {
  const { fullName, setFullName } = useUserStore((state) => state);

  const [validate, setValidate] = useState(true);

  let active = false;

  if (fullName !== "" && fullName.trim().length > 0) {
    active = true;
  }

  const koreanRegex = new RegExp(`^[가-힣\\s]{1,10}$`);
  const englishRegex = new RegExp(`^[a-zA-Z\\s]{1,20}$`);

  const submitHandler = () => {
    // 유효성 검사
    const regex = /^[가-힣a-zA-Z]{1,10}$/;

    if (!koreanRegex.test(fullName) && !englishRegex.test(fullName)) {
      setValidate(false);
      return;
    } else {
      setValidate(true);
      navigation.navigate("UserProfileForm");
    }
  };

  return (
    <RootContainer>
      <TextContainer>
        <Title>이름을 알려줄래?</Title>
        <SubTitle style={{ marginTop: 8 }}>친구들이 나를 쉽게 찾을 수 있게 도와줘!</SubTitle>
      </TextContainer>
      <OutSideLabelInput
        placeholder="실명"
        value={fullName}
        onClear={() => {
          setFullName("");
        }}
        onUpdateValue={setFullName}
        error={!validate}
        msg={"이름을 다시 입력해주세요!"}
      />
      <ButtonContainer active={active}>
        <Pressable
          onPress={() => {
            submitHandler();
          }}
          disabled={!active}
        >
          <View>
            <ButtonText active={active}>다음</ButtonText>
          </View>
        </Pressable>
      </ButtonContainer>
    </RootContainer>
  );
}

const RootContainer = styled.View`
  flex: 1;
  padding-top: 32px;
  padding-horizontal: 16px;
  background-color: ${Theme.colors.White};
`;

const TextContainer = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 107px;
`;

const Title = styled.Text`
  font-family: "Pretendard-Bold";
  font-size: 20px;
  line-height: 24px;
  color: ${Theme.colors.Gray900};
`;

const SubTitle = styled.Text`
  font-family: "Pretendard-Medium";
  font-size: 16px;
  line-height: 19px;
  color: ${Theme.colors.Gray900};
`;

const ButtonContainer = styled.View<{ active: boolean }>`
  width: 100%;
  position: absolute;
  left: 16px;
  bottom: 24px;
  height: 52px;
  padding: 16px 12px;
  border-radius: 24px;
  background-color: ${({ active }) => (active ? "#8A7EFF" : "#F3F2FF")};
`;

const ButtonText = styled.Text<{ active: boolean }>`
  ${Theme.typo.Label_03};
  text-align: center;
  color: ${({ active }) => (active ? Theme.colors.White : Theme.colors.Gray400)};
`;
