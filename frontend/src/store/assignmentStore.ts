import { create } from 'zustand';
import { Assignment, Status } from '@/types/assignment';

type State = {
  current?: Assignment;
  status: Status | 'idle';
  setCurrent: (assignment: Assignment) => void;
  setStatus: (status: Status | 'idle') => void;
};

export const useAssignmentStore = create<State>(set => ({
  status: 'idle',
  setCurrent: current => set({ current, status: current.status }),
  setStatus: status => set({ status })
}));
