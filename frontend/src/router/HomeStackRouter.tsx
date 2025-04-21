import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../pages/home/HomeScreen";
import { Pressable, Image } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { HomeStackParamList } from "../navigations/HomeStackNavigation";
import styled from "@emotion/native";
import AddTimeTableScreen from "../pages/home/AddTimeTableScreen";
import AddTimeTableDetailScreen from "../pages/home/AddTimeTableDetailScreen";
import SetTimeSetting from "@/pages/home/SetTimeSetting";

const Stack = createNativeStackNavigator();

const HomeStackRouter = () => {
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "500"
        },
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerLeft: (props: any) =>
          props?.canGoBack ? (
            <Pressable onPress={() => navigation.goBack()}>
              <CustomImage source={require("../assets/images/btn_left.png")} />
            </Pressable>
          ) : (
            false
          )
      }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SetTimeSetting" component={SetTimeSetting} options={{ headerShown: false }} />
      <Stack.Screen name="AddTimeTableScreen" component={AddTimeTableScreen} options={{ headerTitle: "시간표 추가" }} />
      <Stack.Screen
        name="AddTimeTableDetailScreen"
        component={AddTimeTableDetailScreen}
        options={{ headerTitle: "시간표 추가", presentation: "modal" }}
      />
    </Stack.Navigator>
  );
};

const CustomImage = styled(Image)`
  width: 32px;
  height: 32px;
`;

export default HomeStackRouter;
