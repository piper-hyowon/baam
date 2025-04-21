export type Agenda = {
  id: string;
  color: string;
  date: string;
  memo: string;
  dayOfWeek: string;
  duration: string;
  hour: string;
  type: "school" | "class" | "personal";
  title: string;
  subjectName: string;
  time: string;
};
