import { useMutation, useQuery } from "@tanstack/react-query";
import { addAgenda, deleteAgenda, getAgenda, getSubject, updateAgenda } from "./calendar.apis";
import { AddAgendaData, AgendaData } from "./calendar.type";

export const useGetAgenda = ({ year, month }: AgendaData) => {
  return useQuery({
    queryKey: ["agenda"],
    queryFn: () => getAgenda({ year, month })
  });
};

export const useAddAgenda = () => {
  return useMutation({
    mutationFn: (data: AddAgendaData) => addAgenda(data)
  });
};

export const useUpdateAgenda = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AddAgendaData }) => updateAgenda(id, data)
  });
};

export const useDeleteAgenda = () => {
  return useMutation({
    mutationFn: (data: string) => deleteAgenda(data)
  });
};

export const useGetSubject = () => {
  return useQuery({
    queryKey: ["getSubject"],
    queryFn: () => getSubject()
  });
};
