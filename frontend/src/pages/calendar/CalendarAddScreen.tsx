import styled from "@emotion/native";
import { NavigationProp, useNavigation, useRoute } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Keyboard, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useAddAgenda, useDeleteAgenda, useGetSubject, useUpdateAgenda } from "../../apis/calendar/calendar.queries";
import { AddAgendaData } from "../../apis/calendar/calendar.type";
import Chip from "../../components/common/Chip";
import { CalendarAddScreenRouteProp, CalendarStackParamList } from "../../navigations/CalendarStackNavigation";
import { Theme } from "../../styles/theme";

interface CalendarAddScreenProps {}

function CalendarAddScreen({}: CalendarAddScreenProps) {
  const queryClient = useQueryClient();

  // 일정 추가
  const { mutateAsync: addAgenda } = useAddAgenda();

  // 일정 수정
  const { mutateAsync: updateAgenda } = useUpdateAgenda();

  // 일정 삭제
  const { mutateAsync: deleteAgenda } = useDeleteAgenda();

  // 수강 과목 조회
  const { data: subjects } = useGetSubject();

  const subjectItems = subjects?.map((subject: string) => ({ label: subject, value: subject }));

  // 과목 Dropdown 관련 state
  const [openSubject, setOpenSubject] = useState(false);

  // store
  const route = useRoute<CalendarAddScreenRouteProp>();
  const { item } = route.params || {};
  const [localSubject, setLocalSubject] = useState<string>(item ? item.subjectName : "");

  const id = item?.id;

  const navigation = useNavigation<NavigationProp<CalendarStackParamList>>();

  const [formData, setFormData] = useState({
    title: "",
    date: new Date(),
    memo: "",
    selectedChip: "school" as "school" | "class" | "personal"
  });

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  useEffect(() => {
    if (item) {
      const [hours, minutes] = item.time.split(":");
      const initialDate = new Date(item.date);
      initialDate.setHours(parseInt(hours));
      initialDate.setMinutes(parseInt(minutes));

      setFormData({
        title: item.title || "",
        date: initialDate,
        memo: item.memo || "",
        selectedChip: item.type === "school" ? "school" : item.type === "class" ? "class" : "personal"
      });
    }
  }, [item]);

  const handleChipPress = (chip: "school" | "class" | "personal") => {
    const updatedFormData = {
      ...formData,
      selectedChip: chip
    };

    setFormData(updatedFormData);
  };

  const showDatePicker = () => {
    setIsDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setIsDatePickerVisible(false);
  };

  const handleConfirm = (selectedDate: Date) => {
    setFormData((prev) => ({
      ...prev,
      date: selectedDate
    }));
    hideDatePicker();
  };

  const handleInputChange = (field: string, value: string | Date) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDateToKorean = (date: Date) => {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = days[date.getDay()];
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "오후" : "오전";
    const adjustedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${year}년 ${month}월 ${day}일 (${weekday}) ${ampm} ${adjustedHours}:${formattedMinutes}`;
  };

  const handleSubmit = () => {
    const params = createAgendaParams(formData);

    console.log(params);

    const handleSuccess = () => {
      invalidateAndNavigate();
    };

    const handleError = (error: any) => {
      console.log(error.message);
    };

    if (id) {
      // 기존 일정 수정
      updateAgenda(
        { id: id, data: params },
        {
          onSuccess: handleSuccess,
          onError: handleError
        }
      );
    } else {
      // 일정 신규 생성
      addAgenda(params, {
        onSuccess: handleSuccess,
        onError: handleError
      });
    }
  };

  // 파라미터 생성 함수
  const createAgendaParams = (data: any): AddAgendaData => ({
    datetime: data.date.toISOString(),
    title: data.title,
    type: data.selectedChip,
    memo: data.memo,
    ...(data.selectedChip === "class" && { subjectName: localSubject })
  });

  // 쿼리 무효화 및 네비게이션 함수
  const invalidateAndNavigate = () => {
    queryClient.invalidateQueries({ queryKey: ["agenda"] });
    setTimeout(() => {
      navigation.goBack();
    }, 800);
  };

  return (
    <Container>
      <ChipRow>
        <TouchableOpacity onPress={() => handleChipPress("school")}>
          <Chip
            size="medium"
            backGroundColor={formData.selectedChip === "school" ? "#E6ECF5" : "#F8F8F8"}
            borderColor={formData.selectedChip === "school" ? "#E6ECF5" : "#F8F8F8"}
            textColor={formData.selectedChip === "school" ? "#327CEA" : "#7B7B7BB2"}
            borderRadiusType="circle"
          >
            학교 일정
          </Chip>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleChipPress("class")}>
          <Chip
            size="medium"
            backGroundColor={formData.selectedChip === "class" ? "#F5E0E0" : "#F8F8F8"}
            borderColor={formData.selectedChip === "class" ? "#F5E0E0" : "#F8F8F8"}
            textColor={formData.selectedChip === "class" ? "#F92626B2" : "#7B7B7BB2"}
            borderRadiusType="circle"
          >
            수업별 일정
          </Chip>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleChipPress("personal")}>
          <Chip
            size="medium"
            backGroundColor={formData.selectedChip === "personal" ? "#DFF2E1" : "#F8F8F8"}
            borderColor={formData.selectedChip === "personal" ? "#DFF2E1" : "#F8F8F8"}
            textColor={formData.selectedChip === "personal" ? "#27B560" : "#7B7B7BB2"}
            borderRadiusType="circle"
          >
            개별 일정
          </Chip>
        </TouchableOpacity>
      </ChipRow>
      <View style={{ gap: 12 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ gap: 12 }}>
            {formData.selectedChip === "class" && (
              <PickerContainer>
                <LabelContainer>
                  <DropDownPicker
                    items={subjectItems}
                    value={localSubject}
                    open={openSubject}
                    setValue={setLocalSubject}
                    setOpen={setOpenSubject}
                    placeholder="선택 필요"
                    style={pickerStyle}
                    labelStyle={{
                      fontSize: 16
                    }}
                    dropDownContainerStyle={{
                      borderColor: Theme.colors.Gray300
                    }}
                    closeAfterSelecting={true}
                    listMode="SCROLLVIEW"
                    scrollViewProps={{
                      nestedScrollEnabled: true
                    }}
                  />
                </LabelContainer>
              </PickerContainer>
            )}
            <InputWrapper>
              <LabelContainer>
                <Label>제목</Label>
                <StyledTextInput value={formData.title} onChangeText={(text) => handleInputChange("title", text)} />
              </LabelContainer>
            </InputWrapper>
            <TouchableOpacity onPress={showDatePicker}>
              <InputWrapper>
                <LabelContainer>
                  <Label>날짜</Label>
                  <InputContainer>
                    <DateText>{formatDateToKorean(formData.date)}</DateText>
                  </InputContainer>
                </LabelContainer>
              </InputWrapper>
            </TouchableOpacity>
            <StyledMemoInput
              placeholder="메모"
              value={formData.memo}
              onChangeText={(text) => handleInputChange("memo", text)}
              multiline
              numberOfLines={10}
            />
          </View>
        </TouchableWithoutFeedback>
        <Button
          onPress={() => {
            handleSubmit();
          }}
        >
          <ButtonText>작성 완료</ButtonText>
        </Button>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          date={formData.date}
          locale="ko-KR"
          confirmTextIOS="확인"
          cancelTextIOS="취소"
        />
      </View>
    </Container>
  );
}

const pickerStyle = {
  paddingHorizontal: 12,
  borderColor: Theme.colors.Gray300
};

const Container = styled.View`
  flex: 1;
  background-color: ${Theme.colors.White};
  padding: 16px;
  gap: 16px;
`;

const ChipRow = styled.View`
  flex-direction: row;
  gap: 12px;
`;

const InputWrapper = styled.View`
  background-color: ${Theme.colors.White};
  border: 1px solid ${Theme.colors.Gray300};
  border-radius: 8px;
  padding: 0 16px;
  justify-content: center;
  height: 51px;
`;

const PickerContainer = styled.View`
  height: 51px;
  z-index: 100;
`;

const LabelContainer = styled.View`
  flex-direction: row;
  align-items: center;
  height: 100%;
`;

const Label = styled.Text`
  font-size: 16px;
  color: ${Theme.colors.Gray700};
  margin-right: 12px;
  font-weight: 600;
`;

const InputContainer = styled.View`
  flex: 1;
  background-color: ${Theme.colors.White};
  padding: 0;
  justify-content: center;
`;

const StyledTextInput = styled.TextInput`
  font-size: 16px;
  flex: 1;
  padding: 0;
  margin: 0;
`;
const StyledMemoInput = styled.TextInput`
  font-size: 16px;
  background-color: ${Theme.colors.White};
  border: 1px solid ${Theme.colors.Gray300};
  border-radius: 8px;
  padding: 16px;
  justify-content: center;
  height: 350px;
`;

const DateText = styled.Text`
  font-size: 16px;
`;

const Button = styled.Pressable`
  margin-top: 21px;
  background-color: ${Theme.colors.Primary};
  border-radius: 24px;
  padding: 16px;
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: ${Theme.colors.White};
  font-size: 16px;
  font-weight: 500;
`;

export default CalendarAddScreen;
