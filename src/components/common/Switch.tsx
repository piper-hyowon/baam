import styled from "@emotion/native";
import React, { useEffect } from "react";
import { PressableProps } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import OffIcon from "../../assets/images/knob_off.svg";
import OnIcon from "../../assets/images/knob_on.svg";
import { Theme } from "../../styles/theme";

interface SwitchProps extends PressableProps {
  isSwitchOn: boolean;
  onToggle: () => void;
}

function Switch({ isSwitchOn, onToggle, ...props }: SwitchProps) {
  const offset = useSharedValue(isSwitchOn ? 24 : 0);

  useEffect(() => {
    offset.value = withTiming(isSwitchOn ? 24 : 0, { duration: 200 });
  }, [isSwitchOn, offset]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }]
  }));

  return (
    <SwitchPressable isSwitchOn={isSwitchOn} onPress={onToggle} {...props}>
      <AnimatedKnob style={animatedStyle}>
        {isSwitchOn ? <OnIcon width={20} height={20} /> : <OffIcon width={20} height={20} />}
      </AnimatedKnob>
    </SwitchPressable>
  );
}

export default Switch;

const SwitchPressable = styled.Pressable<{ isSwitchOn: boolean }>`
  width: 48px;
  height: 24px;
  flex-direction: row;
  align-items: center;
  padding: 2px;
  border-radius: 16px;
  border: 2px solid ${({ isSwitchOn }) => (isSwitchOn ? Theme.colors.Primary : Theme.colors.Gray300)};
  background-color: ${({ isSwitchOn }) => (isSwitchOn ? Theme.colors.Primary : Theme.colors.White)};
`;

const AnimatedKnob = styled(Animated.View)`
  width: 20px;
  height: 20px;
  align-items: center;
  justify-content: center;
`;
