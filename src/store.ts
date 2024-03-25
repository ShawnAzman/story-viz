import { create } from "zustand";

// values that don't need to persist across sessions
export interface IStore {
  showCharacterEmotions: boolean;
  setShowCharacterEmotions: (val: boolean) => void;
  showConflict: boolean;
  setShowConflict: (val: boolean) => void;
  colorBy: string;
  setColorBy: (val: string) => void;
  sizeBy: string;
  setSizeBy: (val: string) => void;
  stylize: boolean;
  setStylize: (val: boolean) => void;

  locationHover: string;
  setLocationHover: (val: string) => void;
  characterHover: string;
  setCharacterHover: (val: string) => void;
  sceneHover: string;
  setSceneHover: (val: string) => void;
  hidden: string[];
  setHidden: (val: string[]) => void;
}

const initialState = {
  showCharacterEmotions: false,
  showConflict: false,
  colorBy: "emotion",
  sizeBy: "conflict",
  stylize: true,

  locationHover: "",
  characterHover: "",
  sceneHover: "",
  hidden: [],
};

export const storyStore = create<IStore>()((set) => ({
  ...initialState,
  setShowCharacterEmotions: (val: boolean) =>
    set({ showCharacterEmotions: val }),
  setShowConflict: (val: boolean) => set({ showConflict: val }),
  setColorBy: (val: string) => set({ colorBy: val }),
  setSizeBy: (val: string) => set({ sizeBy: val }),
  setStylize: (val: boolean) => set({ stylize: val }),

  setLocationHover: (val: string) => set({ locationHover: val }),
  setCharacterHover: (val: string) => set({ characterHover: val }),
  setSceneHover: (val: string) => set({ sceneHover: val }),
  setHidden: (val: string[]) => set({ hidden: val }),
}));
