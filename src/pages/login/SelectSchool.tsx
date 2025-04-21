import styled from "@emotion/native";
import axios from "axios";
import { useEffect, useState } from "react";
import SchoolList from "./SchoolList";
import { SafeAreaView } from "react-native-safe-area-context";
import { Theme } from "../../styles/theme";
import { TextInput } from "react-native";

export default function SelectSchool() {
  const [enteredText, setEnteredText] = useState("");

  const [schoolList, setSchoolList] = useState({
    list: [],
    total: null
  });

  useEffect(() => {
    async function fetchSchool() {
      const response = await axios.get("https://b-site.site/school-dataset/schools", {
        params: {
          count: 1000,
          page: 0,
          name: ""
        },
        headers: {
          Accept: "application/json"
        }
      });

      setSchoolList(response.data);
    }

    fetchSchool();
  }, []);

  // 학교 목록 조회
  async function handleSearchSchool(text: string) {
    setEnteredText(text);
    const response = await axios.get("https://b-site.site/school-dataset/schools", {
      params: {
        count: 100,
        page: 0,
        name: text
      },
      headers: {
        Accept: "application/json"
      }
    });
    setSchoolList(response.data);
  }

  return (
    <SafeAreaView style={{ backgroundColor: Theme.colors.White, flex: 1 }}>
      <RootContainer>
        <InputContainer>
          <StyledImg source={require("../../assets/images/image.png")} />
          <TextInput onChangeText={handleSearchSchool} value={enteredText} placeholder="Place holder" />
        </InputContainer>
        <SchoolList items={schoolList.list} />
      </RootContainer>
    </SafeAreaView>
  );
}

const RootContainer = styled.View`
  flex: 1;
  padding: 16px;
`;

const InputContainer = styled.View`
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 12px;
  padding: 0px 16px;
  background-color: ${Theme.colors.Gray100};
  gap: 12px;
`;

const StyledImg = styled.Image`
  width: 20px;
  height: 20px;
`;
