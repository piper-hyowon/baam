import styled from "@emotion/native";
import React from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { Theme } from "../../styles/theme";

interface TermsOfServiceScreenProps {}

function TermsOfServiceScreen({}: TermsOfServiceScreenProps) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Container>
        <ScrollView>
          <Content>
            <Paragraph>
              안녕하세요. (주)카카오 입니다. {"\n"}
              {"\n"}카카오 서비스를 이용해주시는 회원 여러분께 감사드리며, 카카오 개인정보 처리방침 변경에 대한 안내
              말씀 드립니다.{"\n"}
              {"\n"}1. 변경 내용{"\n"}∙ 회사의 개인정보 처리 업무 재위탁 현황을 추가합니다. ∙ ‘문자메세지 발송’ 업무를
              담당하는 수탁사를 현행화합니다.{"\n"}∙ 브런치스토리 서비스에서 제3자 제공하는 내역을 삭제합니다.{"\n"}∙
              제3자 제공 내역에서 제공받는 자의 보유기간 항목을 추가합니다.{"\n"}∙ 쿠키 수집 거부 방법에 대한 상세한
              내용을 추가합니다.{"\n"}∙ 이용자의 개인정보를 보호하기 위해 카카오가 수행하는 다양한 활동들을 추가합니다.
            </Paragraph>
          </Content>
        </ScrollView>
      </Container>
    </SafeAreaView>
  );
}

export default TermsOfServiceScreen;

const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: ${Theme.colors.White};
`;

const Content = styled.View`
  flex: 1;
`;

const Paragraph = styled.Text`
  ${Theme.typo.Caption_02}
  color: ${Theme.colors.Black};
`;
