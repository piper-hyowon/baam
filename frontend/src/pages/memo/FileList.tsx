import { useEffect, useState } from "react";
import { View, SafeAreaView, Text, Image, FlatList } from "react-native";
import styled from "@emotion/native";
import RNFS from "react-native-fs";
import { VectorLeft } from "../../assets/assets";

interface File {
  _data: {
    name: string;
    blobId: string;
    type: string;
    size: number;
  };
}

export const FileList = ({ navigation, route }: any) => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 이미지나 파일들만 불러오기 함수
  useEffect(() => {
    const loadFiles = async (chatRoomId: string) => {
      const path = `${RNFS.DocumentDirectoryPath}/chat_room_${chatRoomId}_files.json`;

      try {
        const jsonValue = await RNFS.readFile(path, "utf8");
        const parsedFiles: File[] = JSON.parse(jsonValue);
        setFiles(parsedFiles);
        setLoading(false);
        console.log("durl", parsedFiles);
      } catch (e) {
        console.log("Error loading files", e);
        setLoading(false);
      }
    };

    loadFiles(route.params.roomId);
  }, []);

  const renderFile = ({ item }: { item: File }) => {
    const filePath = `${RNFS.TemporaryDirectoryPath}/${item._data.name}`;
    console.log("File path: ", filePath);
    return (
      <FileContainer>
        <Image source={{ uri: `file://${filePath}` }} style={{ width: "100%", height: "100%" }} />
      </FileContainer>
    );
  };

  if (loading) {
    return <Text>Loading files...</Text>;
  }

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <BackIcon source={VectorLeft} />
        </BackButton>
        <HeaderText>{route.params.roomName}</HeaderText>
        <View style={{ width: 24, height: 24 }} />
      </Header>
      <ContentContainer>
        <SectionTitle>사진 파일</SectionTitle>
        <FlatList
          data={files}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderFile}
          numColumns={3} // 한 줄에 3개의 이미지를 렌더링
        />
      </ContentContainer>
    </Container>
  );
};

export default FileList;

// 스타일 통일 - emotion 사용

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #fff;
`;

const ContentContainer = styled.View`
  flex: 1;
  padding: 16px;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
`;

const BackButton = styled.TouchableOpacity`
  padding: 10px;
`;

const BackIcon = styled.Image`
  width: 8.5px;
  height: 15px;
`;

const HeaderText = styled.Text`
  font-size: 18px;
  line-height: 26px;
  font-weight: 600;
  font-family: "Pretendard";
  color: #262626;
  text-align: center;
  width: 272px;
  height: 28px;
`;

const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
`;

const FileContainer = styled.View`
  width: 30%;
  height: 100px;
  margin: 5px;
  background-color: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
`;
