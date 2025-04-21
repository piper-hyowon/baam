export interface AgendaData {
  year: number;
  month: number;
}

export interface AddAgendaData {
  subjectName?: string;
  type: "school" | "class" | "personal";
  datetime: string;
  title: string;
  memo: string;
}
