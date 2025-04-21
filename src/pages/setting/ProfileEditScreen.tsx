import styled from "@emotion/native";
import axios from "axios";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Image,
  Keyboard,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import DropDownPicker, { ItemType } from "react-native-dropdown-picker";
import HeaderRightText from "../../components/common/HeaderRightText";
import useAuthStore from "../../store/UserAuthStore";
import useUserStore from "../../store/UserStore";
import { Theme } from "../../styles/theme";
import RNPickerSelect from "react-native-picker-select";
import { DropDownDown } from "../../assets/assets";
import { VectorLeft, PencilImg } from "../../assets/assets";
import { StackScreenProps } from "@react-navigation/stack";
import { SettingScreenNavigationProp, SettingStackParamList } from "../../navigations/SettingStackNavigation";
import { useNavigation } from "@react-navigation/native";
type ProfileEditScreenProps = StackScreenProps<SettingStackParamList, "ProfileEditScreen">;

type Class = {
  label: string;
  value: string;
};
interface GradeData {
  grade: number;
  names: string[];
}

interface ResponseData {
  total: number;
  list: GradeData[];
}

function ProfileEditScreen({ navigation, route }: ProfileEditScreenProps) {
  const { fullName, schoolId, schoolName, grade, className } = route.params;
  const { token } = useAuthStore();
  const [responseData, setResponseData] = useState<ResponseData>({
    total: 0,
    list: []
  }); //학급정보
  const [localName, setLocalName] = useState(fullName);
  const [localSchool, setLocalSchool] = useState(schoolName);
  const [localSchoolId, setLocalSchoolId] = useState(schoolId);
  const [localGrade, setLocalGrade] = useState(grade);
  const [localClass, setLocalClass] = useState(className);

  const [openGrade, setOpenGrade] = useState(false);
  const [gradeItems, setGradeItems] = useState<ItemType<number>[]>([
    { label: "1학년", value: 1 },
    { label: "2학년", value: 2 },
    { label: "3학년", value: 3 }
  ]);
  const router = useNavigation<SettingScreenNavigationProp>();

  const [openClass, setOpenClass] = useState(false);
  //해당학교가 몇반까지 있는지 추가해야됨
  const [classItems, setClassItems] = useState<Class[]>([
    {
      label: "1",
      value: "1"
    }
  ]);

  const navigateToSchoolSearch = () => {
    // navigation.navigate("SchoolSearchScreen");
    router.push("SchoolSearchScreen", { changeSchoolId: setLocalSchoolId });
  };
  const updateProfile = async () => {
    try {
      // setLoading(true);
      await axios.patch(
        // PUT 메서드 사용
        `https://b-site.site/user`,
        {
          schoolId: localSchoolId,
          grade: localGrade,
          className: localClass,
          fullName: localName
        },
        {
          headers: {
            accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        }
      );

      // setLoading(false);
    } catch (error: any) {
      console.error(error.response ? error.response.data : error.message);
    }
  };
  const handleSave = () => {
    // setFullName(localName);
    // setSchoolName(localSchool);
    // setGrade(localGrade);
    // setClassName(localClass);
    console.log("new info : ", localName, localSchool, localGrade, localClass);
    updateProfile();
    navigation.reset({
      index: 0,
      routes: [{ name: "BottomTab", params: { screen: "Setting" } }]
    });
  };
  useEffect(() => {
    console.log("schoolId : ", localSchoolId);
  }, [localSchoolId]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleSave}>
          <HeaderRightText>저장</HeaderRightText>
        </TouchableOpacity>
      )
    });
  }, [navigation, handleSave]);

  useEffect(() => {
    if (route.params?.schoolName) {
      setLocalSchool(route.params.schoolName);
    }
  }, [route.params?.schoolName]);

  useEffect(() => {
    //학급정보 불러오기
    const getClassInfo = async () => {
      try {
        const response = await axios.get(`https://b-site.site/school-dataset/classes/${schoolId}`, {
          headers: {
            accept: "application/json" // JSON 형식으로 데이터를 보낼 것을 명시
          }
        });
        setResponseData(response.data);
      } catch (error: any) {
        console.error(error.response ? error.response.data : error.message); // 오류 처리
      }
    };
    getClassInfo();
  }, []);
  useEffect(() => {
    if (responseData?.list) {
      const selectedGrade = responseData.list.find((l) => l.grade == localGrade);
      if (selectedGrade) {
        // selectedGrade가 존재하는지 확인
        const newClassItems = selectedGrade.names.map((name) => ({
          label: name,
          value: name
        }));
        setClassItems(newClassItems);
      } else {
        // selectedGrade가 없을 때의 처리를 추가할 수도 있습니다.
        setClassItems([]); // 빈 배열로 초기화
      }
    }
  }, [localGrade, responseData]);
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setOpenGrade(false);
        setOpenClass(false);
      }}
    >
      <SafeAreaView style={{ backgroundColor: Theme.colors.White, flex: 1 }}>
        <Header style={{ zIndex: 2 }}>
          <BackButton onPress={() => navigation.goBack()}>
            <BackIcon source={VectorLeft} />
          </BackButton>
          <Text
            style={{
              fontSize: 18,
              lineHeight: 26,
              fontWeight: "600",
              fontFamily: "Pretendard",
              color: "#262626",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 272,
              height: 28
            }}
          >
            내 프로필
          </Text>
          <TouchableOpacity onPress={handleSave}>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 18,
                fontWeight: "500",
                fontFamily: "Pretendard",
                color: "#262626",
                textAlign: "right"
              }}
            >
              완료
            </Text>
          </TouchableOpacity>
        </Header>
        <Container>
          <InputContainer>
            <LabelText>이름</LabelText>
            <StyledTextInput value={localName} onChangeText={setLocalName} placeholder="이름" />
          </InputContainer>
          <InputContainer>
            <LabelText>학교</LabelText>
            <TouchableOpacity onPress={navigateToSchoolSearch}>
              <StyledTextInput value={localSchool} placeholder="학교" editable={false} pointerEvents="none" />
            </TouchableOpacity>
          </InputContainer>
          <RowContainer>
            <DropdownContainer style={{ zIndex: 3000 }}>
              <LabelText>학년</LabelText>
              {Platform.OS === "ios" ? (
                <RNPickerSelect
                  placeholder={{}}
                  value={localGrade}
                  onValueChange={setLocalGrade}
                  items={gradeItems}
                  style={{
                    inputIOS: {
                      width: "100%",
                      backgroundColor: "#e9e9e9",
                      padding: 16,
                      fontSize: 18,
                      fontWeight: 500,
                      color: "#7b7b7b",
                      borderRadius: 12
                    }
                  }}
                  useNativeAndroidPickerStyle={false}
                  Icon={() => {
                    return <DropdownIcon source={DropDownDown} />;
                  }}
                />
              ) : (
                <DropDownPicker
                  open={openGrade}
                  value={localGrade}
                  items={gradeItems}
                  setOpen={setOpenGrade}
                  setValue={setLocalGrade}
                  setItems={setGradeItems}
                  placeholder="학년 선택"
                  style={pickerStyle}
                  dropDownContainerStyle={dropDownContainerStyle}
                  closeAfterSelecting={true}
                  closeOnBackPressed={true}
                  onOpen={() => setOpenClass(false)}
                />
              )}
            </DropdownContainer>
            <DropdownContainer style={{ zIndex: 3000 }}>
              <LabelText>반</LabelText>
              {Platform.OS === "ios" ? (
                <RNPickerSelect
                  placeholder={{}}
                  value={localClass}
                  onValueChange={setLocalClass}
                  items={classItems}
                  style={{
                    inputIOS: {
                      width: "100%",
                      backgroundColor: "#e9e9e9",
                      padding: 16,
                      fontSize: 18,
                      fontWeight: 500,
                      color: "#7b7b7b",
                      borderRadius: 12,
                      justifyContent: "center",
                      alignItems: "center"
                    }
                  }}
                  useNativeAndroidPickerStyle={false}
                  Icon={() => {
                    return <DropdownIcon source={DropDownDown} />;
                  }}
                />
              ) : (
                <DropDownPicker
                  open={openClass}
                  value={localClass}
                  items={classItems}
                  setOpen={setOpenClass}
                  setValue={setLocalClass}
                  setItems={setClassItems}
                  placeholder="반 선택"
                  style={pickerStyle}
                  dropDownContainerStyle={dropDownContainerStyle}
                  closeAfterSelecting={true}
                  closeOnBackPressed={true}
                  onOpen={() => setOpenGrade(false)}
                />
              )}
            </DropdownContainer>
          </RowContainer>
        </Container>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

export default ProfileEditScreen;

const Container = styled.View`
  flex: 1;
  padding: 16px;
  gap: 36px;
`;

const InputContainer = styled.View`
  gap: 8px;
`;

const LabelText = styled.Text`
  font-size: 18px;
`;

const StyledTextInput = styled.TextInput`
  background-color: ${Theme.colors.Gray200};
  padding: 16px;
  font-size: 18px;
  font-weight: 500;
  color: ${Theme.colors.Gray600};
  border-radius: 12px;
`;

const RowContainer = styled.View`
  flex-direction: row;
  width: 100%;
  gap: 16px;
`;

const InputContainer2 = styled.View`
  align-self: stretch;
  border-radius: 8px;
  border-color: #e9e9e9;
  border-width: 1px;
  width: 100%;
  flex-direction: row;
  align-items: center;
  padding: 16px;
  gap: 20px;
  margin-bottom: 12px;
`;
const DropdownContainer = styled.View`
  flex: 1;
  gap: 8px;
`;

const pickerStyle = {
  backgroundColor: Theme.colors.Gray200,
  borderColor: Theme.colors.Gray200,
  borderRadius: 12,
  height: 48
};

const dropDownContainerStyle = {
  borderColor: Theme.colors.Gray200,
  backgroundColor: Theme.colors.Gray200
};
const DropdownIcon = styled.Image`
  width: 24px;
  height: 24px;
  transform: rotate(180deg);
`;
const Header = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-vertical: 10px;
  padding-horizontal: 16px;
`;
const BackButton = styled(TouchableOpacity)`
  padding: 10px;
`;

const BackIcon = styled(Image)`
  width: 8.5px;
  height: 15px;
`;
