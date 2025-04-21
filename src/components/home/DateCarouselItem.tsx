import moment, { Moment } from "moment";
import { View, Text, Pressable } from "react-native";
import styled from "@emotion/native";
import { Theme } from "../../styles/theme";

interface DateCarouselItemProps {
  item: Moment;
  onPress: any;
}

function DateCarouselItem({ item, onPress }: DateCarouselItemProps) {
  const isToday = item.isSame(moment(), "day");

  return (
    <Container onPress={onPress}>
      <Cell isToday={isToday}>
        <Date>{item.format("DD")}</Date>
        <Weekday>{item.format("ddd")}</Weekday>
        {isToday && <TodayIndicator />}
      </Cell>
    </Container>
  );
}

const Container = styled(Pressable)`
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
`;

const Cell = styled(View)<{ isToday: boolean }>`
  width: ${(props) => (props.isToday ? "68px" : "60px")};
  height: ${(props) => (props.isToday ? "80px" : "68px")};
  border-radius: 12px;
  background-color: white;
  align-items: center;
  justify-content: center;
`;

const Date = styled(Text)`
  font-style: ${Theme.typo.Body_04_Bold};
  line-height: 0;
`;

const Weekday = styled(Text)`
  font-style: ${Theme.typo.Paragraph_01};
  color: ${Theme.colors.Gray600};
  line-height: 0;
`;

const TodayIndicator = styled(View)`
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background-color: ${Theme.colors.Gray800};
  position: absolute;
  bottom: 10px;
`;

export default DateCarouselItem;
