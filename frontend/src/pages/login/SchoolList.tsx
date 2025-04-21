import styled from "@emotion/native";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { useState } from "react";
import { Theme } from "../../styles/theme";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SignUpStackParamList } from "../../navigations/SignUpStackNavigation";
import useUserStore from "../../store/UserStore";

type NavigationProps = StackNavigationProp<SignUpStackParamList, "SchoolInfoForm">;

interface School {
  id: number;
  name: string;
  nameUs: string;
  postalCode: number;
  roadNameAddress: string;
}
interface SchoolListProps {
  items: School[];
}

export default function SchoolList({ items }: SchoolListProps) {
  const navigation = useNavigation<NavigationProps>();

  const { schoolId, setSchoolId, setSchoolName, setSchoolAddress } = useUserStore((state) => state);
  const [active, setActive] = useState(false);

  const handleSelect = (item: School) => {
    setSchoolId(item.id);
    setSchoolName(item.name);
    setSchoolAddress(item.roadNameAddress);
    setActive(true);
  };

  return (
    <>
      <Container>
        {items.length > 0 && (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const isActive = schoolId === item.id;
              return (
                <Pressable onPress={() => handleSelect(item)}>
                  <InnerContainer active={isActive}>
                    <SchoolText>{item.name}</SchoolText>
                    <AddressText>{item.roadNameAddress}</AddressText>
                  </InnerContainer>
                </Pressable>
              );
            }}
          />
        )}
      </Container>
      <ButtonContainer active={active}>
        <Pressable
          onPress={() => {
            if (schoolId !== null) {
              navigation.navigate("SchoolInfoForm");
            }
          }}
          disabled={!active}
        >
          <View>
            <ButtonText active={active}>확인</ButtonText>
          </View>
        </Pressable>
      </ButtonContainer>
    </>
  );
}

const InnerContainer = styled.View<{ active: boolean }>`
  width: 100%;
  border: 2px solid ${({ active }) => (active ? "#8A7EFF" : Theme.colors.Gray100)};
  border-radius: 12px;
  padding: 16px 12px;
  gap: 8px;
  margin-bottom: 12px;
  background-color: ${({ active }) => (active ? "#F3F2FF" : Theme.colors.White)};
`;

const Container = styled.View`
  flex: 1;
  margin-top: 32px;
`;

const SchoolText = styled.Text`
  ${Theme.typo.Body_04_Bold};
  color: ${Theme.colors.Gray900};
`;

const AddressText = styled.Text`
  ${Theme.typo.Body_03_Regular};
  color: ${Theme.colors.Gray900};
`;

const ButtonContainer = styled.View<{ active: boolean }>`
  width: 100%;
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
