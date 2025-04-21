import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  ActivityIndicator,
  Platform
} from "react-native";
import DatePicker from "react-native-date-picker";
import RNPickerSelect from "react-native-picker-select";
import DropDownPicker from "react-native-dropdown-picker";
import styled from "@emotion/native";
import { VectorLeft, DropDownDown, Hamburger } from "../../assets/assets";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import axios from "axios";
import useAuthStore from "../../store/UserAuthStore";

type Subject = {
  label: string;
  value: string;
};
function EditMemoScreen({ navigation, route }: any) {
  const [subjectList, setSubjectList] = useState<Subject[]>([]);
  const [subjectName, setSubjectName] = useState(route.params?.subjectName || "");
  const [date, setDate] = useState<Date>(route.params?.datetime ? new Date(route.params.datetime) : new Date());
  const [title, setTitle] = useState<any>(route.params?.title || "");
  const [content, setContent] = useState<any>(route.params?.memo || "");
  const [open, setOpen] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
  const [warningMessage, setWarningMessage] = useState<string>("");
  const [memoId, setMemoId] = useState<number | undefined>(route.params?.id);
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore();

  useEffect(() => {
    getSubjectList();
  }, []);
  useEffect(() => {
    if (!title.trim() || !content.trim() || content.length > 200) {
      setIsSubmitDisabled(true);
      if (content.length > 200) {
        setWarningMessage("내용이 200자를 초과했습니다.");
      } else {
        setWarningMessage("");
      }
    } else {
      setIsSubmitDisabled(false);
      setWarningMessage("");
    }
  }, [title, content]);

  const handleDateChange = (selectedDate: Date) => {
    setDate(selectedDate);
  };

  const openDatePicker = () => {
    setModalVisible(true);
    setOpen(true);
  };

  const closeDatePicker = () => {
    setOpen(false);
    setModalVisible(false);
  };
  const goMemoScreen = async () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "BottomTab", params: { screen: "Memo" } }]
    });
  };

  const createMemo = async () => {
    const params: any = {
      subjectName: subjectName,
      datetime: date,
      title: title,
      memo: content
    };
    console.log(params);
    try {
      const response = await axios.post("https://b-site.site/subject-memo", params, {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      console.log(response.data, "메모 생성");
    } catch (error: any) {
      console.error(error.response ? error.response.data : error.message);
    }
  };

  const updateMemo = async () => {
    try {
      setLoading(true);
      const response = await axios.patch(
        // PUT 메서드 사용
        `https://b-site.site/subject-memo/${memoId}`,
        {
          title: title,
          memo: content,
          datetime: date.toISOString() // ISOString으로 변환
        },
        {
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      setLoading(false);
    } catch (error: any) {
      console.error(error.response ? error.response.data : error.message);
    }
  };

  const postMemo = async () => {
    if (memoId != undefined) await updateMemo();
    else await createMemo();

    await goMemoScreen();
  };

  const [showDeleteOption, setShowDeleteOption] = useState(false);
  const deleteMemo = async () => {
    setLoading(true);
    if (showDeleteOption) await setShowDeleteOption(false);
    else await setShowDeleteOption(true);

    setLoading(false);
  };
  const handleDelete = async () => {
    try {
      // API 요청을 통해 친구 삭제
      await axios.delete(`https://b-site.site/subject-memo/${memoId}`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}` // 실제 토큰으로 교체
        }
      });
      // 추가적인 상태 업데이트나 페이지 리로드를 수행할 수 있습니다.
    } catch (error) {
      console.error("Error deleting memo:", error);
    } finally {
      setShowDeleteOption(false);
      goMemoScreen();
    }
  };

  const getSubjectList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        // PUT 메서드 사용
        `https://b-site.site/timetable/subjects`,

        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );
      response.data.map((subject: any) => {
        subjectList.push({ label: subject, value: subject });
      });
      setLoading(false);
    } catch (error: any) {
      console.error(error.response ? error.response.data : error.message);
    }
  };
  const formattedDate = format(date, "yyyy년 M월 d일(eee) HH:mm", { locale: ko });

  const formatDate = () => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 1월이 0부터 시작하므로 +1 필요
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDateTime;
  };
  return (
    <Container>
      <InnerContainer>
        {loading && ( // 로딩 상태면 인디케이터 표시
          <LoadingContainer>
            <ActivityIndicator size="large" color="#898989" />
          </LoadingContainer>
        )}
        <Header>
          <HeaderButton onPress={() => navigation.goBack()}>
            <HeaderIcon source={VectorLeft} />
          </HeaderButton>
          {memoId ? <Title>{subjectName} 메모</Title> : <Title>메모 추가</Title>}
          <TouchableOpacity onPress={deleteMemo}>
            <Image
              source={Hamburger}
              style={{
                width: 20,
                height: 20
              }}
            />
            {showDeleteOption && (
              <TouchableOpacity
                onPress={handleDelete} // 삭제 클릭 시 API 호출
                style={{
                  backgroundColor: "#fff",
                  borderWidth: 0.5,
                  borderRadius: 4,
                  position: "absolute",
                  width: 120,
                  height: 40,
                  top: 25,
                  left: -100,
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 100
                }}
              >
                <Text style={{ fontSize: 16, lineHeight: 22 }}>삭제하기</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </Header>
        {memoId ? (
          <></>
        ) : (
          <InputContainer>
            <InputLabel>과목</InputLabel>
            {Platform.OS === "ios" ? (
              <RNPickerSelect
                placeholder={{}}
                onValueChange={setSubjectName}
                items={subjectList}
                style={{
                  inputIOS: {
                    fontSize: 16,
                    color: "black",
                    paddingRight: 250,
                    width: "100%"
                  }
                }}
                useNativeAndroidPickerStyle={false}
                Icon={() => {
                  return <DropdownIcon source={DropDownDown} />;
                }}
              />
            ) : (
              <DropDownPicker
                open={open}
                value={subjectName}
                items={subjectList}
                setOpen={setOpen}
                setValue={setSubjectName}
                setItems={() => {}}
                style={{
                  borderColor: "#e9e9e9",
                  borderWidth: 1,
                  borderRadius: 12
                }}
                dropDownContainerStyle={{
                  borderColor: "#e9e9e9"
                }}
              />
            )}
          </InputContainer>
        )}

        <InputContainer>
          <InputLabel>제목</InputLabel>
          <StyledTextInput placeholder="제목을 입력하세요" value={title} onChangeText={setTitle} />
        </InputContainer>

        <MemoInputContainer onPress={openDatePicker}>
          <InputLabel>날짜</InputLabel>
          <DateText>{formattedDate}</DateText>
        </MemoInputContainer>

        <Modal transparent={true} visible={modalVisible} onRequestClose={closeDatePicker} animationType="slide">
          <ModalOverlayPressable onPress={closeDatePicker}>
            <DatePickerContainer>
              <DatePicker
                mode="datetime"
                date={date}
                onDateChange={handleDateChange}
                locale="ko" // 한국어 로케일 설정 (옵션)
              />
            </DatePickerContainer>
          </ModalOverlayPressable>
        </Modal>

        <TextAreaContainer>
          <StyledTextInput
            multiline
            placeholder="내용 작성"
            style={{ flex: 1 }}
            value={content}
            onChangeText={setContent}
          />
        </TextAreaContainer>
        {warningMessage ? <WarningText>{warningMessage}</WarningText> : null}
        <CharacterCount>{content.length}/200</CharacterCount>
        {isSubmitDisabled ? (
          <SubmitButton backgroundColor="#D9D9D9" onPress={postMemo}>
            <SubmitButtonText>작성 완료</SubmitButtonText>
          </SubmitButton>
        ) : (
          <SubmitButton backgroundColor="#8A7EFF" onPress={postMemo}>
            <SubmitButtonText>작성 완료</SubmitButtonText>
          </SubmitButton>
        )}
      </InnerContainer>
    </Container>
  );
}

// Styled Components
const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #fff;
`;

const InnerContainer = styled(View)`
  flex: 1;
  padding-horizontal: 16px;
`;

const Header = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const HeaderButton = styled(TouchableOpacity)`
  padding: 10px;
`;

const HeaderIcon = styled(Image)`
  width: 7.5px;
  height: 13.5px;
`;

const Title = styled(Text)`
  flex: 1;
  font-size: 18px;
  letter-spacing: 1px;
  font-weight: 500;
  font-family: Pretendard;
  color: #000;
  text-align: center;
`;

const EmptyView = styled(View)``;

const InputContainer = styled(View)`
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

const InputLabel = styled(Text)`
  text-align: left;
  color: #000;
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 600;
`;

const StyledTextInput = styled(TextInput)`
  text-align: left;
  color: #000;
  font-family: Pretendard;
  font-size: 16px;
`;

const DateText = styled(Text)`
  font-size: 18px;
  color: #333;
`;

const TextAreaContainer = styled(View)`
  align-self: stretch;
  border-radius: 8px;
  border-color: #e9e9e9;
  border-width: 1px;
  width: 100%;
  flex-direction: row;
  padding: 16px;
  height: 208px;
`;
const WarningText = styled(Text)`
  color: red;
  font-size: 12px;
  margin-top: 8px;
`;
const CharacterCount = styled(Text)`
  align-self: stretch;
  margin-top: 8px;
  text-align: right;
  font-size: 12px;
  line-height: 16px;
  font-family: Pretendard;
  color: #262626;
`;
const LoadingContainer = styled(View)`
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  align-items: center;
  justify-content: center;
  background-xolor: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;
const SubmitButton = styled(TouchableOpacity)<{ backgroundColor: string }>`
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 34px;
  border-radius: 24px;
  background-color: ${(props) => (props.backgroundColor ? props.backgroundColor : "#8A7EFF")};
  width: 100%;
  justify-content: center;
  padding-horizontal: 24px;
  padding-vertical: 16px;
`;

const SubmitButtonText = styled(Text)`
  font-size: 18px;
  font-weight: 500;
  font-family: Pretendard;
  color: #fff;
  text-align: center;
`;

const ModalOverlayPressable = styled(Pressable)`
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.5);
`;

const DatePickerContainer = styled(View)`
  background-color: #fff;
  padding-bottom: 16px;
  align-items: center;
`;

const MemoInputContainer = styled(TouchableOpacity)`
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

export default EditMemoScreen;
const DropdownIcon = styled.Image`
  width: 24px;
  height: 24px;
  transform: rotate(180deg);
  align-items: center;
  justify-content: center;
`;
