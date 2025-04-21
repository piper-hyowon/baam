import { create } from "zustand";

type Agenda = {
  datetime: string;
  id: number;
  memo: string | null;
  title: string;
  type: string;
  subjectName: string | null;
};

interface CalendarStore {
  agenda: Agenda[];
  setAgenda: (obj: Agenda[]) => void;
}

const useCalendarStore = create<CalendarStore>((set) => ({
  agenda: [],
  setAgenda: (newAgenda) =>
    set((state) => ({
      agenda: [...state.agenda, ...newAgenda]
    }))
}));

export default useCalendarStore;
