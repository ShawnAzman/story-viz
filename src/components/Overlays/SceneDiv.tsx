import { useEffect, useState } from "react";
import { dataStore } from "../../stores/dataStore";
import { storyStore } from "../../stores/storyStore";
import {
  scene_overlay_width,
  scene_overlay_width_wide,
} from "../../utils/consts";
import SceneDivInner from "./SceneDivInner";

function SceneDiv() {
  const { scene_data } = dataStore();
  const { sceneHover, chapterView, detailView, verboseMode } = storyStore();

  const scene = scene_data.find((scene) => scene.name === sceneHover);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const buffer = 30;

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      // get max x position
      const max_x = window.innerWidth;
      let curX = event.clientX;

      const overlay = document.getElementById("scene-overlay");
      const overlayHeight = overlay ? overlay.clientHeight : 0;

      const overlayWidth =
        scene && scene.characters && scene.characters.length > 8 && !chapterView
          ? scene_overlay_width_wide
          : scene_overlay_width;
      const maxRight = overlayWidth + 2 * buffer;

      if (curX + maxRight > max_x) {
        curX = curX - maxRight;
      }

      // get window height
      const max_y = window.innerHeight;
      let curY = event.clientY;

      if (curY + overlayHeight + buffer > max_y) {
        curY = max_y - overlayHeight - buffer;
      }
      setMousePosition({ x: curX, y: curY });
    };

    // Add event listener to track mouse movement
    window.addEventListener("mousemove", handleMouseMove);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [sceneHover]);

  return (
    <div
      id="scene-overlay"
      className={
        sceneHover === "" || (chapterView && detailView)
          ? "hidden"
          : "show-msg" +
            (scene &&
            scene.characters &&
            scene.characters.length > 8 &&
            !chapterView
              ? " wide"
              : "") +
            (!verboseMode && !chapterView
              ? " verbose-off"
              : !chapterView
              ? " verbose-on"
              : "")
      }
      style={{
        left: mousePosition.x + buffer + "px", // Offset slightly from cursor
        top: mousePosition.y - buffer + "px",
      }}
    >
      <SceneDivInner />
    </div>
  );
}

export default SceneDiv;
