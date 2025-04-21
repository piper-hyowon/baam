import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { FriendsStackParamList } from "../navigations/FriendsStackNavigation";
import { Theme } from "../styles/theme";
import { Pressable } from "react-native";
import styled from "@emotion/native";
import FriendProfile from "../pages/friends/FriendProfile";
import FriendListScreen from "../pages/friends/FriendListScreen";

const Stack = createNativeStackNavigator<FriendsStackParamList>();

export default function FriendsStackRouter() {
  const navigation = useNavigation<NavigationProp<FriendsStackParamList>>();

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
      <Stack.Screen name="FriendListScreen" component={FriendListScreen} options={{ headerShown: false }} />
      <Stack.Screen name="FriendProfile" component={FriendProfile} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

const StyledImg = styled.Image`
  width: 32px;
  height: 32px;
`;
