import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { MemoStackParamList } from "../navigations/MemoStackNavigation";
import { Theme } from "../styles/theme";
import { Pressable } from "react-native";
import styled from "@emotion/native";
import EditMemoScreen from "../pages/memo/EditMemoScreen";
import ChatScreen from "../pages/memo/ChatScreen";
import MemoScreen from "../pages/memo/MemoScreen";
import FileList from "../pages/memo/FileList";
import ParticipantsList from "../pages/memo/ParticipantsList";

const Stack = createNativeStackNavigator<MemoStackParamList>();

export default function MemoStackRouter() {
  const navigation = useNavigation<NavigationProp<MemoStackParamList>>();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Theme.colors.White },
        headerTitleStyle: {
          fontSize: 18,
          fontFamily: "Pretendard-Bold"
        },
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerLeft: () => (
          <Pressable onPress={() => navigation.goBack()}>
            <StyledImg source={require("../assets/images/btn_left.png")} />
          </Pressable>
        )
      }}
    >
      <Stack.Screen name="MemoScreen" component={MemoScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EditMemoScreen" component={EditMemoScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
      <Stack.Screen name="FileList" component={FileList} options={{ headerShown: false }} />
      <Stack.Screen name="ParticipantsList" component={ParticipantsList} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

const StyledImg = styled.Image`
  width: 32px;
  height: 32px;
`;
