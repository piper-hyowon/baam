import styled from "@emotion/native";
import LottieView from "lottie-react-native";
import { AnimatedSplashImage } from "../../../assets/assets";
import { Theme } from "../../../styles/theme";

export default function LoadingOverlay() {
  return (
    <Root>
      <LottieView source={AnimatedSplashImage} autoPlay loop style={{ flex: 1, width: 300, height: 240 }} />
    </Root>
  );
}

const Root = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${Theme.colors.White};
`;
