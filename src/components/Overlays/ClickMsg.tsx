import { useEffect, useState } from "react";
import { storyStore } from "../../stores/storyStore";

function ClickMsg() {
  const { sceneHover, chapterView, detailView } = storyStore();

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const buffer = 20;
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      // get max x position
      //   const max_x = window.innerWidth;
      let curX = event.clientX;

      //   let overlay = document.getElementById("click-msg");
      //   let overlayHeight = overlay ? overlay.clientHeight : 0;
      //   let overlayWidth = overlay ? overlay.clientWidth : 0;
      //   const maxRight = overlayWidth + 2 * buffer;

      //   if (curX + maxRight > max_x) {
      //     curX = curX - maxRight;
      //   }

      // get window height
      //   const max_y = window.innerHeight;
      let curY = event.clientY;

      //   if (curY + overlayHeight + buffer > max_y) {
      //     curY = max_y - overlayHeight - buffer;
      //   }
      setMousePosition({ x: curX, y: curY });
    };

    // Add event listener to track mouse movement
    if (chapterView && detailView) {
      window.addEventListener("mousemove", handleMouseMove);

      // Cleanup listener on unmount
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [sceneHover, chapterView, detailView]);
  return (
    <div
      id="click-msg"
      className={
        sceneHover === "" || !chapterView || !detailView ? "hidden" : ""
      }
      style={{
        left: mousePosition.x + buffer + "px", // Offset slightly from cursor
        top: mousePosition.y + "px",
      }}
    >
      Click to lock!
    </div>
  );
}

export default ClickMsg;
