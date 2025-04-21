import styled from "@emotion/native";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback } from "react";
import { Pressable, View } from "react-native";
import { Rect, Svg } from "react-native-svg";
import { CalendarAddScreenNavigationProp } from "../../navigations/CalendarStackNavigation";
import { Theme } from "../../styles/theme";
import { Agenda } from "../../types/agenda";

interface ItemProps {
  item: Agenda;
  showDate: boolean;
}

const isEmpty = (obj: any) => {
  return Object.keys(obj).length === 0;
};

function AgendaItem(props: ItemProps) {
  const { item, showDate } = props;
  const navigation = useNavigation<CalendarAddScreenNavigationProp>();

  const itemPressed = useCallback(() => {
    navigation.navigate("CalendarAddScreen", { item });
  }, [item, navigation]);

  const isToday = (dateString: string) => {
    const today = new Date().toISOString().split("T")[0];
    return dateString === today;
  };

  if (isEmpty(item)) {
    return <></>;
  }

  return (
    <>
      {showDate && (
        <DateContainer>
          <StyledDOM>{item.date.split("-")[2]}</StyledDOM>
          <StyledDOW>{item.dayOfWeek}</StyledDOW>
        </DateContainer>
      )}
      <ItemContainer onPress={itemPressed}>
        <View>
          <Svg width="4" height="45" viewBox="0 0 4 45" fill="none">
            <Rect
              y="0.5"
              width="4"
              height="44"
              rx="2"
              fill={item.type === "school" ? "#327CEA" : item.type === "class" ? "#F92626" : "#27B560"}
            />
          </Svg>
        </View>
        <TextContainer>
          <StyledTitle>{item.title}</StyledTitle>
          <StyledTime>{item.time}</StyledTime>
        </TextContainer>
      </ItemContainer>
    </>
  );
}

const DateContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

const StyledDOM = styled.Text`
  color: ${Theme.colors.Gray900};
  font-family: "Pretendard-Bold";
  font-size: 24px;
  font-weight: 600;
`;

const StyledDOW = styled.Text`
  color: ${Theme.colors.Gray500};
  font-family: "Pretendard-Medium";
  font-size: 16px;
  font-weight: 500;
`;

const ItemContainer = styled(Pressable)`
  width: 100%;
  background-color: #ffffff;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const TextContainer = styled.View`
  gap: 8px;
`;

const StyledTitle = styled.Text`
${Theme.typo.Body_04_Bold};
color: ${Theme.colors.Gray800};
}
`;

const StyledTime = styled.Text`
  font-family: "Pretendard";
  font-weight: 400;
  font-size: 16px;
  color: ${Theme.colors.Gray500};
`;

export default AgendaItem;
