import { useState } from "react";
import styled from "@emotion/native";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "@/navigations/HomeStackNavigation";

interface ScheduleAddItemProps {
  title: string;
  addSubject: () => {};
}

const ScheduleAddItem = ({ title, addSubject }: ScheduleAddItemProps) => {
  return (
    <Container onPress={addSubject}>
      <Title>{title}</Title>
    </Container>
  );
};

const Container = styled.TouchableOpacity`
  width: 100%;
  height: 58px;
  justify-content: center;
  padding: 0 16px;
  border: 2px solid #f5f5f5;
  gap: 20px;
`;

const Title = styled.Text`
  font-size: 17px;
  font-weight: 600;
  color: #000;
`;

export default ScheduleAddItem;
