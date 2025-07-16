import { create } from "zustand";

interface StepsState {
    steps: number;
    setSteps: (steps: number) => void;
}

export const useStepsStore = create<StepsState>((set) => ({
    steps: 0,
    setSteps: (steps) => set({ steps })
}));
