import { create } from "zustand";
import {
  Scene,
  CharacterData,
  getAllData,
  LocationData,
  LocationQuote,
  CharacterScene,
  CharacterQuote,
  SceneCharacter,
  SceneSummary,
  RatingDict,
  ChapterDivision,
} from "../utils/data";
import init_data from "../data/gatsby.json";
import { CustomColorDict, defaultCharacterColors } from "../utils/colors";

/* INITIAL VALUES */
const init_data_values = getAllData(init_data, false);

// values that don't need to persist across sessions

interface IStore {
  data: any;

  scene_data: Scene[];
  chapter_data: Scene[];
  location_data: LocationData[];
  character_data: CharacterData[];

  locations: string[];
  location_quotes: LocationQuote[];
  location_chunks: string[][];

  characters: string[];
  characterScenes: CharacterScene[];
  character_quotes: CharacterQuote[];
  sortedCharacters: CharacterData[];

  scenes: string[];
  sceneLocations: string[];
  sceneChunks: string[][];
  sceneCharacters: SceneCharacter[];
  sceneSummaries: SceneSummary[];

  ratingDict: RatingDict;
  minLines: number;
  maxLines: number;
  sceneMin: number;
  sceneMax: number;
  chapterMin: number;
  chapterMax: number;

  chapterDivisions: ChapterDivision[];
  num_chapters: number;
  activeChapters: [number, number];

  characterColorOptions: string[];
  customColorDict: CustomColorDict;

  setCharacterColorOptions: (val: string[]) => void;
  setCustomColorDict: (val: CustomColorDict, val2: string) => void;
  setCharacterData: (val: CharacterData[], val2: string) => void;
  setSortedCharacters: (val: CharacterData[]) => void;
  setData: (
    val: any,
    val1: string,
    val2: boolean,
    val3: string,
    val4: boolean
  ) => void;
  setActiveChapters: (val: [number, number]) => void;
  resetActiveChapters: (val: number) => void;
}

const initialState = {
  data: init_data,

  scene_data: init_data_values.scene_data,
  chapter_data: init_data_values.chapter_data,
  location_data: init_data_values.location_data,
  character_data: init_data_values.character_data,

  locations: init_data_values.locations,
  location_quotes: init_data_values.location_quotes,
  location_chunks: init_data_values.location_chunks,

  characters: init_data_values.characters,
  characterScenes: init_data_values.characterScenes,
  character_quotes: init_data_values.character_quotes,
  sortedCharacters: init_data_values.sortedCharacters,

  scenes: init_data_values.scenes,
  sceneLocations: init_data_values.sceneLocations,
  sceneChunks: init_data_values.sceneChunks,
  sceneCharacters: init_data_values.sceneCharacters,
  sceneSummaries: init_data_values.sceneSummaries,

  ratingDict: init_data_values.ratingDict,
  minLines: init_data_values.minLines,
  maxLines: init_data_values.maxLines,
  sceneMin: init_data_values.sceneMin,
  sceneMax: init_data_values.sceneMax,
  chapterMin: init_data_values.chapterMin,
  chapterMax: init_data_values.chapterMax,

  chapterDivisions: init_data_values.chapterDivisions,
  num_chapters: init_data_values.num_chapters,
  activeChapters: [1, init_data_values.num_chapters] as [number, number],

  characterColorOptions: defaultCharacterColors,
  customColorDict: {} as CustomColorDict,
};

export const dataStore = create<IStore>((set) => ({
  ...initialState,
  setCharacterColorOptions: (val: string[]) =>
    set({ characterColorOptions: val }),
  setCustomColorDict: (val: CustomColorDict, story: string) => {
    // update local storage
    const localStorageKey = `colorDict-${story}`;
    localStorage.setItem(localStorageKey, JSON.stringify(val));
    set({ customColorDict: val });
    console.log("Updated custom color dict");
  },
  setSortedCharacters: (val: CharacterData[]) => {
    set({ sortedCharacters: val });
  },
  setCharacterData: (val: CharacterData[], story: string) => {
    // update local storage
    const localStorageKey = `characterData-${story}`;
    localStorage.setItem(localStorageKey, JSON.stringify(val));
    set({ character_data: val });
    console.log("Updated character data");
  },
  setData: (
    init_data: any,
    story: string,
    chapterView: boolean = false,
    chapter: string = "",
    same_story: boolean = false
  ) => {
    const newData = getAllData(init_data, chapterView, chapter);

    // check if color_dict is in local storage
    const localStorageKey = `colorDict-${story}`;
    const storedDict = localStorage.getItem(localStorageKey);
    let colorDict = {} as CustomColorDict;
    let colorKeys = [...defaultCharacterColors];
    if (storedDict) {
      // if found, use the stored color_dict and convert it to an object
      colorDict = JSON.parse(storedDict);
      const newKeys = Object.keys(colorDict);
      colorKeys.push(...newKeys.filter((k) => !colorKeys.includes(k)));
      console.log("Loaded custom color dict from local storage");
    } else {
      console.log("No custom color dict found");
    }

    set((state) => {
      const updates: Partial<IStore> = {
        data: init_data,
        scene_data: newData.scene_data,
        location_data: newData.location_data,
        character_data: newData.character_data,
        locations: newData.locations,
        location_quotes: newData.location_quotes,
        location_chunks: newData.location_chunks,
        characters: newData.characters,
        characterScenes: newData.characterScenes,
        character_quotes: newData.character_quotes,
        sortedCharacters: newData.sortedCharacters,
        scenes: newData.scenes,
        sceneLocations: newData.sceneLocations,
        sceneChunks: newData.sceneChunks,
        sceneCharacters: newData.sceneCharacters,
        sceneSummaries: newData.sceneSummaries,
        ratingDict: newData.ratingDict,
        minLines: newData.minLines,
        maxLines: newData.maxLines,
        chapterDivisions: newData.chapterDivisions,
        num_chapters: newData.num_chapters,
        activeChapters: [1, newData.num_chapters],
        customColorDict: colorDict,
        characterColorOptions: colorKeys,
      };

      // Perform comparison logic only for chapter_data
      if (
        !same_story ||
        state.sceneMin !== newData.sceneMin ||
        state.sceneMax !== newData.sceneMax ||
        state.chapterMin !== newData.chapterMin ||
        state.chapterMax !== newData.chapterMax
      ) {
        console.log("updating chapter data");
        updates.chapter_data = newData.chapter_data;
        updates.sceneMin = newData.sceneMin;
        updates.sceneMax = newData.sceneMax;
        updates.chapterMin = newData.chapterMin;
        updates.chapterMax = newData.chapterMax;
      }

      return updates;
    });
  },
  setActiveChapters: (val: [number, number]) => set({ activeChapters: val }),
  resetActiveChapters: (maxChapter: number) =>
    set({
      activeChapters: [1, maxChapter] as [number, number],
    }),
}));
