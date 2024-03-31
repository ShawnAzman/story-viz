import * as d3 from "d3";
import { CharacterData } from "./data";
import { normalize } from "./helpers";

// original colors
// const colors = [
//   "rgb(247, 113, 137, 1)",
//   "rgb(220, 137, 50, 1)",
//   "rgb(174, 157, 49, 1)",
//   "rgb(119, 171, 49, 1)",
//   "rgb(51, 176, 122, 1)",
//   "rgb(54, 173, 164, 1)",
//   "rgb(56, 169, 197, 1)",
//   "rgb(110, 155, 244, 1)",
//   "rgb(204, 122, 244, 1)",
//   "rgb(245, 101, 204, 1)",
// ];

// Custom interpolator to exclude the middle, lighter part of the spectral scale
function customSpectralInterpolator(t: any) {
  // Define thresholds to exclude the middle range
  const start = 0.4; // Starting point of the first part
  const end = 0.7; // Starting point of the second part

  if (t < 0.5) {
    // Map the first half to the 0 - start range of the original scale
    return d3.interpolateSpectral(start * 2 * t);
  } else {
    // Map the second half to the end - 1 range of the original scale
    return d3.interpolateSpectral(end + (2 * t - 1) * (1 - end));
  }
}

// color scales
export const characterColor = d3.scaleSequential(customSpectralInterpolator);
export const emotionColor = d3
  .scaleSequential(d3.interpolateRdBu)
  .domain([1, -1]);
export const conflictColor = d3.scaleSequential(d3.interpolateGreens);
export const importanceColor = d3.scaleSequential(d3.interpolatePurples);

export const groupColors = [
  d3.scaleSequential(d3.interpolateReds),
  d3.scaleSequential(d3.interpolatePurples),
  d3.scaleSequential(d3.interpolateBlues),
  d3.scaleSequential(d3.interpolateGreens),
  d3.scaleSequential(d3.interpolateOranges),
  d3.scaleSequential(d3.interpolateGreys),
];

// see if color is too dark --> if so, return white, else return black
export const textColor = (val: number, diverging: boolean) => {
  if (diverging) {
    return val < 0.6 && val > -0.6 ? "black" : "white";
  }
  return val < 0.6 ? "black" : "white";
};
// get 5 equally spaced colors between domain[0] and domain[1]
const color_increments = (color: any) => {
  const domain = color.domain();
  const increments = d3.range(
    domain[0],
    domain[1] + (domain[1] - domain[0]) / 4,
    (domain[1] - domain[0]) / 4
  );
  const sorted = increments.sort((a, b) => a - b);
  return sorted;
};

// create color_increments for each color scale
const emotion_increments = color_increments(emotionColor);
const conflict_increments = color_increments(conflictColor);
const importance_increments = color_increments(importanceColor);

// add all to dict
export const color_dict = {
  importance: importance_increments,
  conflict: conflict_increments,
  sentiment: emotion_increments,
};

// compute colorIndex
export const getColor = (
  character: string,
  sortedCharacters: CharacterData[]
) => {
  const characters = sortedCharacters.map((d) => d.character);
  const charIndex = characters.indexOf(character);

  // VARIATION 3
  // const allGroups = Array.from(new Set(sortedCharacters.map((d) => d.group)));
  // const groupNumber = sortedCharacters[charIndex].group;
  // const group = sortedCharacters.filter((d) => d.group === groupNumber);
  // const groupSize = group.length;
  // const groupIndex = allGroups.indexOf(groupNumber);
  // const charIndexInGroup = group.findIndex((d) => d.character === character);

  // const colorScale = groupColors[groupIndex];
  // const fracInGroup =
  //   groupSize === 1 ? 0.5 : charIndexInGroup / (groupSize - 1);
  // const mappedIndex = normalize(fracInGroup, 0, 1, 1, 0.3);

  // const finalColor = colorScale(mappedIndex);

  // VARIATION 2
  // const numRows = Math.round(sortedCharacters.length / 5);
  // const numCharsPerRow = Math.round(sortedCharacters.length / numRows);
  // const colorIndex =
  //   ((charIndex % numRows) * numCharsPerRow + charIndex / numRows) /
  //   (sortedCharacters.length - 1);

  // VARIATION 1
  const colorIndex =
    sortedCharacters.findIndex((d) => d.character === character) /
    (sortedCharacters.length - 1);

  const finalColor = characterColor(colorIndex);
  return finalColor;
};
