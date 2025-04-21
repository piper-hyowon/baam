import { MarkedDates } from "react-native-calendars/src/types";

const isEmpty = (obj: any) => {
  return Object.keys(obj).length === 0;
};

const today = new Date().toISOString().split("T")[0];
const pastDate = getPastDate(3);
const futureDates = getFutureDates(12);
const dates = [pastDate, today].concat(futureDates);

function getFutureDates(numberOfDays: number) {
  const array: string[] = [];
  for (let index = 1; index <= numberOfDays; index++) {
    let d = Date.now();
    if (index > 8) {
      const newMonth = new Date(d).getMonth() + 1;
      d = new Date(d).setMonth(newMonth);
    }
    const date = new Date(d + 864e5 * index);
    const dateString = date.toISOString().split("T")[0];
    array.push(dateString);
  }
  return array;
}

function getPastDate(numberOfDays: number) {
  return new Date(Date.now() - 864e5 * numberOfDays).toISOString().split("T")[0];
}

function getDayOfWeek(dateString: string) {
  const daysOfWeek = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  const date = new Date(dateString);
  return daysOfWeek[date.getDay()];
}

export const agendaItems = [
  {
    title: dates[0],
    data: [
      {
        id: "1",
        key: "school_event",
        hour: "09:00",
        duration: "1h",
        title: "1학기 중간고사",
        date: dates[0],
        dayOfWeek: getDayOfWeek(dates[0]),
        color: "#E199F0",
        memo: "중간고사 준비물 챙기기"
      }
    ]
  },
  {
    title: dates[1],
    data: [
      {
        id: "2",
        key: "class_schedule",
        hour: "14:00",
        duration: "1h",
        title: "수학 수업",
        date: dates[1],
        dayOfWeek: getDayOfWeek(dates[1]),
        color: "#8A7EFF",
        memo: "수학 문제집 풀어오기"
      },
      {
        id: "3",
        key: "personal_event",
        hour: "16:00",
        duration: "1h",
        title: "과학 실험",
        date: dates[1],
        dayOfWeek: getDayOfWeek(dates[1]),
        color: "#A6E7DF",
        memo: "실험 도구 준비"
      }
    ]
  },
  {
    title: dates[2],
    data: [
      {
        id: "4",
        key: "class_schedule",
        hour: "10:00",
        duration: "1h",
        title: "영어 회화",
        date: dates[2],
        dayOfWeek: getDayOfWeek(dates[2]),
        color: "#8A7EFF",
        memo: "영어 회화 연습하기"
      },
      {
        id: "5",
        key: "school_event",
        hour: "13:00",
        duration: "하루종일",
        title: "체육 대회",
        date: dates[2],
        dayOfWeek: getDayOfWeek(dates[2]),
        color: "#E199F0",
        memo: "체육복 챙기기"
      },
      {
        id: "6",
        key: "personal_event",
        hour: "15:00",
        duration: "1h",
        title: "역사 토론",
        date: dates[2],
        dayOfWeek: getDayOfWeek(dates[2]),
        color: "#A6E7DF",
        memo: "토론 주제 준비"
      }
    ]
  },
  {
    title: dates[3],
    data: [
      {
        id: "7",
        key: "school_event",
        hour: "09:00",
        duration: "1h",
        title: "국어 시험",
        date: dates[3],
        dayOfWeek: getDayOfWeek(dates[3]),
        color: "#E199F0",
        memo: "시험 준비물 챙기기"
      }
    ]
  },
  {
    title: dates[4],
    data: [
      {
        id: "8",
        key: "class_schedule",
        hour: "10:00",
        duration: "1h",
        title: "음악 수업",
        date: dates[4],
        dayOfWeek: getDayOfWeek(dates[4]),
        color: "#8A7EFF",
        memo: "악기 준비"
      }
    ]
  },
  {
    title: dates[5],
    data: [
      {
        id: "9",
        key: "personal_event",
        hour: "09:00",
        duration: "1h",
        title: "음악 수업",
        date: dates[5],
        dayOfWeek: getDayOfWeek(dates[5]),
        color: "#A6E7DF",
        memo: "노래 연습"
      },
      {
        id: "10",
        key: "school_event",
        hour: "10:00",
        duration: "1h",
        title: "미술 시간",
        date: dates[5],
        dayOfWeek: getDayOfWeek(dates[5]),
        color: "#E199F0",
        memo: "그림 도구 준비"
      },
      {
        id: "11",
        key: "class_schedule",
        hour: "11:00",
        duration: "1h",
        title: "도서관 방문",
        date: dates[5],
        dayOfWeek: getDayOfWeek(dates[5]),
        color: "#8A7EFF",
        memo: "도서 목록 준비"
      },
      {
        id: "12",
        key: "personal_event",
        hour: "13:00",
        duration: "1h",
        title: "창작 글쓰기",
        date: dates[5],
        dayOfWeek: getDayOfWeek(dates[5]),
        color: "#A6E7DF",
        memo: "글쓰기 주제 정하기"
      }
    ]
  },
  {
    title: dates[6],
    data: [
      {
        id: "13",
        key: "school_event",
        hour: "09:00",
        duration: "1h",
        title: "체육 수업",
        date: dates[6],
        dayOfWeek: getDayOfWeek(dates[6]),
        color: "#E199F0",
        memo: "운동복 챙기기"
      }
    ]
  },
  {
    title: dates[7],
    data: [
      {
        id: "14",
        key: "class_schedule",
        hour: "09:00",
        duration: "1h",
        title: "필라테스",
        date: dates[7],
        dayOfWeek: getDayOfWeek(dates[7]),
        color: "#8A7EFF",
        memo: "필라테스 매트 준비"
      }
    ]
  },
  {
    title: dates[8],
    data: [
      {
        id: "15",
        key: "personal_event",
        hour: "09:00",
        duration: "1h",
        title: "필라테스",
        date: dates[8],
        dayOfWeek: getDayOfWeek(dates[8]),
        color: "#A6E7DF",
        memo: "필라테스 매트 준비"
      },
      {
        id: "16",
        key: "school_event",
        hour: "10:00",
        duration: "1h",
        title: "요가",
        date: dates[8],
        dayOfWeek: getDayOfWeek(dates[8]),
        color: "#E199F0",
        memo: "요가복 준비"
      },
      {
        id: "17",
        key: "class_schedule",
        hour: "11:00",
        duration: "1h",
        title: "TRX 운동",
        date: dates[8],
        dayOfWeek: getDayOfWeek(dates[8]),
        color: "#8A7EFF",
        memo: "TRX 도구 준비"
      },
      {
        id: "18",
        key: "personal_event",
        hour: "13:00",
        duration: "1h",
        title: "달리기 모임",
        date: dates[8],
        dayOfWeek: getDayOfWeek(dates[8]),
        color: "#A6E7DF",
        memo: "달리기 신발 준비"
      }
    ]
  },
  {
    title: dates[9],
    data: [
      {
        id: "19",
        key: "school_event",
        hour: "13:00",
        duration: "1h",
        title: "수학 시험",
        date: dates[9],
        dayOfWeek: getDayOfWeek(dates[9]),
        color: "#E199F0",
        memo: "수학 문제집 복습"
      },
      {
        id: "20",
        key: "class_schedule",
        hour: "15:00",
        duration: "1h",
        title: "체육 시간",
        date: dates[9],
        dayOfWeek: getDayOfWeek(dates[9]),
        color: "#8A7EFF",
        memo: "운동복 준비"
      },
      {
        id: "21",
        key: "personal_event",
        hour: "17:00",
        duration: "1h",
        title: "독서 모임",
        date: dates[9],
        dayOfWeek: getDayOfWeek(dates[9]),
        color: "#A6E7DF",
        memo: "책 읽기"
      }
    ]
  },
  {
    title: dates[10],
    data: [
      {
        id: "22",
        key: "school_event",
        hour: "09:00",
        duration: "1h",
        title: "마지막 수업",
        date: dates[10],
        dayOfWeek: getDayOfWeek(dates[10]),
        color: "#E199F0",
        memo: "수업 준비물 챙기기"
      }
    ]
  },
  {
    title: dates[11],
    data: [
      {
        id: "23",
        key: "class_schedule",
        hour: "10:00",
        duration: "1h",
        title: "한국사",
        date: dates[11],
        dayOfWeek: getDayOfWeek(dates[11]),
        color: "#8A7EFF",
        memo: "한국사 노트 준비"
      },
      {
        id: "24",
        key: "personal_event",
        hour: "14:00",
        duration: "1h",
        title: "미적분학",
        date: dates[11],
        dayOfWeek: getDayOfWeek(dates[11]),
        color: "#A6E7DF",
        memo: "미적분학 문제집 풀기"
      },
      {
        id: "25",
        key: "school_event",
        hour: "16:00",
        duration: "1h",
        title: "생물학 실험",
        date: dates[11],
        dayOfWeek: getDayOfWeek(dates[11]),
        color: "#E199F0",
        memo: "실험 도구 챙기기"
      }
    ]
  },
  {
    title: dates[12],
    data: [
      {
        id: "26",
        key: "school_event",
        hour: "09:00",
        duration: "1h",
        title: "한국어 문법",
        date: dates[12],
        dayOfWeek: getDayOfWeek(dates[12]),
        color: "#E199F0",
        memo: "문법 책 읽기"
      }
    ]
  },
  {
    title: dates[13],
    data: [
      {
        id: "27",
        key: "class_schedule",
        hour: "09:00",
        duration: "1h",
        title: "프로그래밍 수업",
        date: dates[13],
        dayOfWeek: getDayOfWeek(dates[13]),
        color: "#8A7EFF",
        memo: "프로그래밍 노트 준비"
      }
    ]
  }
];

export function getMarkedDates() {
  const marked: MarkedDates = {};

  agendaItems.forEach((item) => {
    const dots = item.data.map((event) => {
      return { key: event.key, color: getDotColor(event.key) };
    });

    if (item.data && item.data.length > 0 && !isEmpty(item.data[0])) {
      marked[item.title] = {
        marked: true,
        dots: dots.slice(0, 3)
      };
    } else {
      marked[item.title] = { disabled: true };
    }
  });

  return marked;
}

function getDotColor(key: string) {
  switch (key) {
    case "school_event":
      return "#E199F0";
    case "class_schedule":
      return "#8A7EFF";
    case "personal_event":
      return "#A6E7DF";
    default:
      return "grey";
  }
}
