import { useState } from "react";

import {
  locations,
  location_quotes,
  location_chunks,
  scenes,
  sceneChunks,
  characterScenes,
  character_quotes,
  colors,
  sceneLocations,
  sceneCharacters,
  svgPath,
  bezierCommand,
} from "../data";

// consts
const location_height = 100;
const location_offset = location_height / 4;
const scene_width = 100;
const scene_offset = 2.75 * scene_width - location_offset;
const character_height = 10;
const character_offset = 1.5 * character_height;

const plot_width = scene_width * (scenes.length + 1.75) + location_offset;
const plot_height = location_height * (locations.length + 3) + location_offset;

const line_length = scene_width * (scenes.length + 1);
const fade_in = scene_width / line_length / 2;

// convert to percent
const fade_in_percent = fade_in * 100;
const fade_out_percent = 100 - fade_in_percent;

// compute locations of locations labels
const locationPos = locations.map((_, i) => {
  return location_height * i + location_offset;
});

// compute locations of scene labels
const scenePos = scenes.map((_, i) => {
  return {
    x: scene_width * i + scene_offset,
    y: location_height * (locations.length + 0.25),
  };
});

// compute character positions
const characterPos = characterScenes.map((character) => {
  return character.scenes.map((scene) => {
    return {
      x: scenePos[scene].x - character_height,
      y:
        locationPos[locations.indexOf(sceneLocations[scene])] -
        0.6 * location_offset +
        character_offset *
          sceneCharacters[scene].characters.indexOf(character.character),
    };
  });
});

// compute character paths
let max_y = 0;
const characterPaths = characterScenes.map((character, c) => {
  const paths = [];

  const character_coords = characterPos[characterScenes.indexOf(character)];
  // convert to array of arrays, adjust for character height
  const character_coords_arr = character_coords.map((pos: any) => [
    pos.x + character_height / 2,
    pos.y + character_height / 2,
  ]);

  // add point to the character's path at the start of the story
  character_coords_arr.unshift([
    character_coords_arr[0][0] - scene_width / 2,
    character_coords_arr[0][1],
  ]);

  // add point to the character's path at the end of the story
  character_coords_arr.push([
    character_coords_arr[character_coords_arr.length - 1][0] + scene_width / 2,
    character_coords_arr[character_coords_arr.length - 1][1],
  ]);

  // add intermediate points if there is a gap of 3+ scenes
  for (let i = 1; i < character_coords_arr.length; i++) {
    const cur_x = character_coords_arr[i][0];
    const prev_x = character_coords_arr[i - 1][0];
    const cur_y = character_coords_arr[i][1];
    const prev_y = character_coords_arr[i - 1][1];

    if (cur_x - prev_x > scene_width) {
      if (cur_x - prev_x > scene_width * 2) {
        const max_cur_y =
          cur_y +
          Math.ceil(
            (location_height * (locations.length - 1) - cur_y) / location_height
          ) *
            location_height;
        const max_prev_y =
          prev_y +
          Math.ceil(
            (location_height * (locations.length - 1) - prev_y) /
              location_height
          ) *
            location_height;

        const new_y = Math.max(max_cur_y, max_prev_y) + c * character_offset;

        // big gap so add two points
        character_coords_arr.splice(i, 0, [prev_x + scene_width, new_y]);
        character_coords_arr.splice(i + 1, 0, [cur_x - scene_width, new_y]);
        i += 3;
      } else {
        if (cur_y > prev_y) {
          // if character is moving down
          character_coords_arr.splice(i, 0, [cur_x - scene_width, prev_y]);
          i += 2;
        } else if (cur_y < prev_y) {
          // if character is moving up
          character_coords_arr.splice(i, 0, [prev_x + scene_width, cur_y]);
          i += 2;
        } else {
          const max_cur_y =
            cur_y +
            Math.ceil(
              (location_height * (locations.length - 1) - cur_y) /
                location_height
            ) *
              location_height;
          const max_prev_y =
            prev_y +
            Math.ceil(
              (location_height * (locations.length - 1) - prev_y) /
                location_height
            ) *
              location_height;

          const new_y = Math.max(max_cur_y, max_prev_y) + c * character_offset;

          // big gap so add two points
          character_coords_arr.splice(i, 0, [prev_x + scene_width / 2, new_y]);
          character_coords_arr.splice(i + 1, 0, [
            cur_x - scene_width / 2,
            new_y,
          ]);
          i += 3;
        }
      }
    }
  }
  // update max_y based on character_coords_arr
  max_y = Math.max(
    max_y,
    ...character_coords_arr.map((pos) => {
      return pos[1];
    })
  );
  paths.push(svgPath(character_coords_arr, bezierCommand));
  return paths;
});

// update scenePos y coords if max_y is greater than the current max
if (max_y >= scenePos[0].y - 1.25 * location_offset) {
  scenePos.forEach((pos) => {
    pos.y = max_y + 1.25 * location_offset;
  });
}

// compute gray rect positions
const sceneBoxes = sceneCharacters.map((scene, i) => {
  return {
    x: scenePos[i].x - (scene_width / character_height) * 1.5,
    y:
      location_height * locations.indexOf(sceneLocations[i]) +
      character_height * (1 / (2 * scene.characters.length)),
    width: 2 * character_height,
    height: character_height * scene.characters.length * 2,
  };
});

// compute white rect positions behind text
const whiteBoxes = characterScenes.map((character, i) => {
  return {
    x:
      characterPos[i][0].x -
      character.character.length * character_height * 0.68,
    y: characterPos[i][0].y,
    width: character.character.length * 0.65 * character_height,
    height: character_height * 1.25,
  };
});

// compute pos of legend items
// put in 2 rows
const reverseCharacterNames = characterScenes.slice().reverse();
// let legend_offset = 0;
let legend_offset =
  3.5 *
  character_height *
  reverseCharacterNames[reverseCharacterNames.length - 1].character.length;
const legendPos = reverseCharacterNames.map((character, i) => {
  let y_offset = location_offset * 0.6;

  const my_offset = legend_offset;
  if (i % 2 === 1) {
    y_offset += character_height * 2;
  } else {
    legend_offset +=
      character_height * character.character.length + character_offset;
  }

  return {
    x: plot_width - my_offset,
    y: y_offset,
  };
});

// legend box pos
const legend_box_pos = {
  x: plot_width - legend_offset + 1.5 * location_offset,
  y: 0,
  width: legend_offset - 2.25 * location_offset,
  height: character_height * 6,
};

// location quote box positions
const location_quote_boxes = locations.map((_, i) => {
  return {
    x: scene_offset - 1.25 * location_offset,
    y: locationPos[locationPos.length - 2] - location_offset,
    width: scene_width * 5,
    height: (location_quotes[i].quote.length + 3) * character_offset,
  };
});

// location quote text positions
const location_quote_texts = locations.map((_, i) => {
  return location_quotes[i].quote.map((_, j) => {
    return {
      x: scene_offset - 0.5 * location_offset,
      y: locationPos[locationPos.length - 2] + (j + 1.2) * character_offset,
    };
  });
});

// character quote box positions
const character_quote_boxes = characterScenes.map((_, i) => {
  return {
    x: legend_box_pos.x,
    y: location_height + location_offset - 2 * character_offset,
    width: scene_width * 5.5 + character_offset,
    height:
      (Math.max(character_quotes[i].quote.length, 2) + 3) * character_offset,
  };
});

// character quote text positions
const character_quote_texts = characterScenes.map((_, i) => {
  return character_quotes[i].quote.map((_, j) => {
    return {
      x: legend_box_pos.x + 0.75 * location_offset + 0.55 * location_height,
      y: character_quote_boxes[i].y + (j + 2.8) * character_offset,
    };
  });
});

function StoryVis() {
  // Initialize hidden array with useState
  const [hidden, setHidden] = useState<string[]>([]);
  const [locationHover, setLocationHover] = useState<string>("");
  const [characterHover, setCharacterHover] = useState<string>("");
  const [sceneHover, setSceneHover] = useState<string>("");

  const updateHidden = (name: string) => {
    setHidden((currentHidden) => {
      // Check if the name is already in the hidden array
      if (currentHidden.includes(name)) {
        // Return a new array without the name
        return currentHidden.filter((item) => item !== name);
      } else {
        // Return a new array with the name added
        return [...currentHidden, name];
      }
    });
  };

  return (
    <svg
      id="story"
      width="100%"
      viewBox={`0 0 ${plot_width} ${plot_height}`} // Maintain your calculated dimensions here for correct scaling
      preserveAspectRatio="xMidYMid meet" // This helps in maintaining the aspect ratio
    >
      <defs>
        {colors.map((color, i) => (
          <linearGradient
            id={"linear" + i}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
            key={"linear" + i}
          >
            <stop offset="0%" stopColor="rgb(255,255,255,0)" />
            <stop offset={fade_in_percent + "%"} stopColor={color} />
            <stop offset={fade_out_percent + "%"} stopColor={color} />
            <stop offset="100%" stopColor="rgb(255,255,255,0)" />
          </linearGradient>
        ))}
        {/* adapted from: https://jsfiddle.net/jxtfeqag/ */}
        <marker
          id="head"
          orient="auto"
          markerWidth="6"
          markerHeight="6"
          refX="0.1"
          refY="3"
        >
          <path d="M0,0 V6 L4.5,3 Z" fill="#000000" />
        </marker>
      </defs>
      {/* add locations to y axis */}
      <g id="y-axis">
        {locations.map((location, i) => (
          <g
            key={"location-group " + i}
            className={
              "location-group " +
              ((locationHover === "" &&
                sceneHover === "" &&
                characterHover === "") ||
              locationHover === location ||
              sceneLocations[scenes.indexOf(sceneHover)] === location ||
              // check if character is in location
              characterScenes.find(
                (char) =>
                  char.locations.includes(location) &&
                  char.character === characterHover
              )
                ? ""
                : "faded")
            }
            onMouseEnter={() => setLocationHover(location)}
            onMouseLeave={() => setLocationHover("")}
          >
            {/* add img from assets for each location */}
            <image
              x={location_height}
              y={
                locationPos[i] +
                (location_chunks[i].length - 1) * character_offset
              }
              width={location_height * 0.75}
              height={location_height * 0.75}
              href={"/locations/location_" + (i + 1) + ".png"}
              key={"location image" + i}
            />
            <g className="location-name-group">
              {location_chunks[i].map((chunk, j) => (
                <text
                  className="location-name"
                  x={location_height * 1.75}
                  y={locationPos[i] + j * character_offset}
                  key={"location" + i + j}
                  textAnchor="end"
                >
                  {chunk}
                </text>
              ))}
            </g>
          </g>
        ))}
      </g>
      <g id="x-axis">
        {/* add scene names to x axis */}
        <g id="scenes">
          {scenes.map((scene, i) => (
            <g
              key={"scene-group" + i}
              className={
                "scene-name " +
                ((locationHover === "" &&
                  sceneHover === "" &&
                  characterHover === "") ||
                locationHover === sceneLocations[i] ||
                sceneHover === scene ||
                sceneCharacters[i].characters.includes(characterHover)
                  ? ""
                  : "faded")
              }
            >
              {sceneChunks[i].map((chunk, j) => (
                <text
                  x={scenePos[i].x + j * character_offset * 1.5}
                  y={scenePos[i].y}
                  textAnchor="end"
                  key={"scene" + i + j}
                  transform={
                    "rotate(-45," +
                    (scenePos[i].x + j * character_offset * 1.5) +
                    ", " +
                    scenePos[i].y +
                    ")"
                  }
                  onMouseEnter={() => setSceneHover(scene)}
                  onMouseLeave={() => setSceneHover("")}
                >
                  {chunk}
                </text>
              ))}
            </g>
          ))}
        </g>
        {/* add arrow showing time at bottom of plot */}
        <g id="time-arrow">
          <path
            id="arrow-line"
            markerEnd="url(#head)"
            strokeWidth="2"
            fill="none"
            stroke="black"
            d={`M${scenePos[0].x},${scenePos[0].y - 0.75 * location_offset}, ${
              scenePos[scenePos.length - 1].x
            },${scenePos[0].y - 0.75 * location_offset}`}
          />
          {/* add label to arrow */}
          <text
            x={scenePos[0].x}
            y={scenePos[0].y - 1.1 * location_offset}
            textAnchor="start"
            fill="black"
            className="time-label"
          >
            Time
          </text>
        </g>
      </g>
      {/* add characters to each scene */}
      {characterScenes.map((character, i) => (
        <g
          key={"chargroup" + i}
          className={
            "character-path " +
            character.character +
            " " +
            (hidden.includes(character.character) ? "hidden" : "") +
            " " +
            (characterHover !== "" && characterHover !== character.character
              ? "faded"
              : "")
          }
        >
          {/* add paths between scenes */}
          <g
            className={
              "path-group " +
              (locationHover !== "" ||
              sceneHover !== "" ||
              (characterHover !== "" && characterHover !== character.character)
                ? "faded"
                : "")
            }
          >
            {characterPaths[i].map((path, j) => (
              <path
                d={path}
                fill="none"
                stroke={"url(#linear" + i + ")"}
                //   stroke={colors[i]}
                key={"charpath" + j}
                strokeWidth={2}
                onMouseEnter={() => setCharacterHover(character.character)}
                onMouseLeave={() => setCharacterHover("")}
              />
            ))}
          </g>
          {/* add squares at each scene the character appears in */}
          <g className="character-squares">
            {character.scenes.map((scene, j) => (
              <rect
                x={characterPos[i][j].x}
                y={characterPos[i][j].y}
                width={character_height}
                height={character_height}
                fill={colors[i]}
                key={"charsq" + j}
                className={
                  "character-square " +
                  ((locationHover === "" && sceneHover === "") ||
                  locationHover === sceneLocations[scene] ||
                  scenes.indexOf(sceneHover) === scene
                    ? ""
                    : "faded")
                }
              />
            ))}
          </g>
          {/* add white rect behind character name */}
          <g
            className="char-name-label"
            onMouseEnter={() => setCharacterHover(character.character)}
            onMouseLeave={() => setCharacterHover("")}
          >
            <rect
              x={whiteBoxes[i].x}
              y={whiteBoxes[i].y}
              width={whiteBoxes[i].width}
              height={whiteBoxes[i].height}
              fill="white"
              opacity={0.8}
              key={"namebox" + i}
            />
            {/* add character name to the first scene they show up in */}
            <text
              x={characterPos[i][0].x - character_height / 2}
              y={characterPos[i][0].y + character_height}
              textAnchor="end"
              fill={colors[i]}
              className="character-name"
            >
              {character.character}
            </text>
          </g>
        </g>
      ))}
      {/* add gray rect behind each scene based on how many characters */}
      <g id="scene-boxes">
        {sceneCharacters.map((scene, i) => (
          <rect
            className={
              "scene-box " +
              (locationHover === sceneLocations[i] ||
              sceneHover === scene.scene ||
              scene.characters.includes(characterHover)
                ? "highlight"
                : "")
            }
            x={sceneBoxes[i].x}
            y={sceneBoxes[i].y}
            width={sceneBoxes[i].width}
            height={sceneBoxes[i].height}
            fillOpacity={0}
            strokeOpacity={0}
            stroke={"rgb(0,0,0,0.7)"}
            strokeWidth={2}
            key={"scenegroup" + i}
            onMouseEnter={() => setSceneHover(scene.scene)}
            onMouseLeave={() => setSceneHover("")}
          />
        ))}
      </g>
      {/* add box with quote from each location */}
      <g id="location-quotes">
        {locations.map((location, i) => (
          <g
            key={"location quotebox" + i}
            className={
              "quote-box " + (locationHover !== location ? "" : "highlight")
            }
            fillOpacity={0}
            strokeOpacity={0}
          >
            <rect
              x={location_quote_boxes[i].x}
              y={location_quote_boxes[i].y}
              width={location_quote_boxes[i].width}
              height={location_quote_boxes[i].height}
              fill="white"
              strokeWidth={2}
              stroke="#eee"
              opacity={0.8}
            />
            <text
              x={location_quote_texts[i][0].x}
              y={location_quote_texts[i][0].y - 1.2 * character_offset}
              textAnchor="start"
              className="quote-text bold"
            >
              {location}
            </text>
            {location_quotes[i].quote.map((quote, j) => (
              <text
                key={"location quote" + i + j}
                x={location_quote_texts[i][j].x}
                y={location_quote_texts[i][j].y}
                textAnchor="start"
                className="quote-text"
              >
                {quote}
              </text>
            ))}
          </g>
        ))}
      </g>
      {/* add legend */}
      <g id="legend">
        {/* draw legend box */}
        <rect
          x={legend_box_pos.x}
          y={legend_box_pos.y}
          width={legend_box_pos.width}
          height={legend_box_pos.height}
          //   fill="white"
          fillOpacity={0}
          stroke="#eee"
          strokeWidth={2}
          opacity={0.8}
        />
        {reverseCharacterNames.map((character, i) => (
          <g
            key={"legendbox" + i}
            transform={`translate(${legendPos[i].x}, ${legendPos[i].y})`}
            className={
              "legend-item " +
              (hidden.includes(character.character) ? "faded" : "")
            }
            onClick={() => updateHidden(character.character)}
            onMouseEnter={() => setCharacterHover(character.character)}
            onMouseLeave={() => setCharacterHover("")}
          >
            <rect
              x={0}
              y={0}
              width={character_height}
              height={character_height}
              fill={colors[reverseCharacterNames.length - 1 - i]}
            />
            <text
              x={character_offset}
              y={character_height}
              textAnchor="start"
              className="legend-name"
            >
              {character.character}
            </text>
          </g>
        ))}
      </g>
      {/* add box with quote from each character */}
      <g id="character-quotes">
        {characterScenes.map((character, i) => (
          <g
            key={"character quotebox" + i}
            className={
              "character quote-box " +
              (characterHover !== character.character ? "" : "highlight")
            }
            fillOpacity={0}
            strokeOpacity={0}
          >
            <g>
              <rect
                x={character_quote_boxes[i].x}
                y={character_quote_boxes[i].y}
                width={character_quote_boxes[i].width}
                height={character_quote_boxes[i].height}
                fill="white"
                strokeWidth={2}
                stroke={colors[i]}
                opacity={0.8}
              />
              <text
                x={character_quote_texts[i][0].x}
                y={
                  character_quote_texts[i][0].y -
                  1.2 * character_offset +
                  +(character_quote_texts[i].length < 2
                    ? 0.5 * character_offset
                    : 0)
                }
                textAnchor="start"
                className="quote-text bold"
                fill={colors[i]}
              >
                {character.character}
              </text>
              {character_quotes[i].quote.map((quote, j) => (
                <text
                  key={"character quote" + i + j}
                  x={character_quote_texts[i][j].x}
                  y={
                    character_quote_texts[i][j].y +
                    (character_quote_texts[i].length < 2
                      ? 0.5 * character_offset
                      : 0)
                  }
                  textAnchor="start"
                  className="quote-text"
                >
                  {quote}
                </text>
              ))}
            </g>
            <image
              className="character-image"
              x={character_quote_texts[i][0].x - 0.6 * location_height}
              y={
                character_quote_texts[i][0].y -
                2 * character_offset +
                (character_quote_texts[i].length <= 2
                  ? 0
                  : character_quote_boxes[i].height / 2 -
                    2.5 * character_offset)
              }
              width={location_height * 0.5}
              height={location_height * 0.5}
              key={"character image" + i}
              href={
                "/characters/" +
                character.character.split(" ")[0].toLowerCase() +
                ".png"
              }
            />
          </g>
        ))}
      </g>
    </svg>
  );
}

export default StoryVis;
