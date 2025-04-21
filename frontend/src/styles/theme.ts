import { css } from "@emotion/native";

const typoCreator = (fontFamily: string, fontSize: string, lineHeight: string) => {
  return css`
    font-family: ${fontFamily};
    font-size: ${fontSize};
    line-height: ${lineHeight};
  `;
};

export const Theme = {
  colors: {
    White: "#ffffff",
    Gray100: "#f5f5f5",
    Gray200: "#e9e9e9",
    Gray300: "#d9d9d9",
    Gray400: "#c4c4c4",
    Gray500: "#9d9d9d",
    Gray600: "#7b7b7b",
    Gray700: "#555555",
    Gray800: "#434343",
    Gray900: "#262626",
    Black: "#000000",
    Primary: "#8A7EFF",
    Blue50: "#E6F3FE",
    Blue100: "#548CEA",
    Blue200: "#9DCCFE",
    Blue300: "#7BB8FC",
    Blue400: "#65A8FB",
    Blue500: "#5899F9",
    Blue600: "#548CEA",
    Blue700: "#4E79D6",
    Blue800: "#4967C3",
    Blue900: "#4048A3",
    Violet: "#8A7EFF",
    Violet100: "#DBD7FF"
  },
  typo: {
    Display_01: typoCreator("EsaManruBold", "72px", "100%"),
    Head_01_RD: typoCreator("EsaManruLight", "16px", "20px"),
    Head_01_RP: typoCreator("EsaManruLight", "16px", "22px"),
    Head_01_MD: typoCreator("EsaManruMedium", "16px", "20px"),
    Head_01_MP: typoCreator("EsaManruMedium", "16px", "22px"),
    Title_01: typoCreator("EsaManruBold", "36px", "48px"),
    Heading_01: typoCreator("Pretendard-SemiBold", "24px", "30px"),
    Heading_02: typoCreator("EsaManruMedium", "24px", "28px"),
    Heading_03: typoCreator("EsaManruMedium", "16px", "22px"),
    Paragraph_01: typoCreator("Pretendard-Medium", "14px", "22px"),
    Body_01: typoCreator("Esamanru", "16px", "22px"),
    Body_02: typoCreator("Pretendard", "14px", "22px"),
    Body_03_Regular: typoCreator("Pretendard-Regular", "16px", "22px"),
    Body_03_Bold: typoCreator("Pretendard-Bold", "16px", "22px"),
    Body_04_Bold: typoCreator("Pretendard-Bold", "18px", "26px"),
    Body_04: typoCreator("Pretendard", "18px", "26px"),
    Caption_01: typoCreator("Pretendard-Regular", "12px", "16px"),
    Caption_02: typoCreator("Pretendard-Regular", "14px", "18px"),
    Label_01: typoCreator("Pretendard-Regular", "14px", "16px"),
    Label_02: typoCreator("Pretendard-Regular", "16px", "18px"),
    Label_03: typoCreator("Pretendard-Regular", "18px", "20px")
  }
};
export type TColor = keyof (typeof Theme)["colors"];
export type TTypo = keyof (typeof Theme)["typo"];
