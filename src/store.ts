import { create } from "zustand";

// values that don't need to persist across sessions
export interface IStore {
  showConflict: boolean;
  setShowConflict: (val: boolean) => void;
  colorBy: string;
  setColorBy: (val: string) => void;
  locationHover: string;
  setLocationHover: (val: string) => void;
  characterHover: string;
  setCharacterHover: (val: string) => void;
  sceneHover: string;
  setSceneHover: (val: string) => void;
}

const initialState = {
  showConflict: false,
  colorBy: "emotion",
  locationHover: "",
  characterHover: "",
  sceneHover: "",
};

export const storyStore = create<IStore>()((set) => ({
  ...initialState,
  setShowConflict: (val: boolean) => set({ showConflict: val }),
  setColorBy: (val: string) => set({ colorBy: val }),
  setLocationHover: (val: string) => set({ locationHover: val }),
  setCharacterHover: (val: string) => set({ characterHover: val }),
  setSceneHover: (val: string) => set({ sceneHover: val }),
}));
