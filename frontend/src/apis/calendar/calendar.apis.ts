import { customAxios } from "../instance";
import { AddAgendaData, AgendaData } from "./calendar.type";

// 등록한 일정 가져오는 API
export const getAgenda = async ({ year, month }: AgendaData) => {
  const response = await customAxios.get(`/calendar/${year}/${month}`);
  return response.data.list;
};

// 일정 등록 API
export const addAgenda = async (data: AddAgendaData) => {
  const response = await customAxios.post("/calendar/event", data);
  return response.data;
};

// 일정 수정 API
export const updateAgenda = async (id: string, data: AddAgendaData) => {
  const response = await customAxios.patch(`/calendar/${id}`, data);
  return response.data;
};

// 일정 삭제 API
export const deleteAgenda = async (id: string) => {
  const response = await customAxios.delete(`/calendar/${id}`);
  return response.data;
};

// 수강 과목 조회 API
export const getSubject = async () => {
  const response = await customAxios.get("timetable/subjects");
  return response.data;
};
