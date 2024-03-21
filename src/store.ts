import { create } from "zustand";

// values that don't need to persist across sessions
export interface IStore {
  locationHover: string;
  setLocationHover: (val: string) => void;
  characterHover: string;
  setCharacterHover: (val: string) => void;
  sceneHover: string;
  setSceneHover: (val: string) => void;
}

const initialState = {
  locationHover: "",
  characterHover: "",
  sceneHover: "",
};

export const storyStore = create<IStore>()((set) => ({
  ...initialState,
  setLocationHover: (val: string) => set({ locationHover: val }),
  setCharacterHover: (val: string) => set({ characterHover: val }),
  setSceneHover: (val: string) => set({ sceneHover: val }),
}));
