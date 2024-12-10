import { Button } from "@mantine/core";
import { storyStore } from "../../stores/storyStore";
import SceneDivInner from "./SceneDivInner";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { dataStore } from "../../stores/dataStore";

function ChapterSidebar() {
  const { chapter_data } = dataStore();
  const { storyMarginTop, detailView, chapterHover, setChapterHover } =
    storyStore();

  const isFirstChapter =
    chapter_data && chapter_data[0] && chapterHover === chapter_data[0].name;
  const isLastChapter =
    chapter_data &&
    chapter_data[chapter_data.length - 1] &&
    chapterHover === chapter_data[chapter_data.length - 1].name;

  const goToPrevChapter = () => {
    if (chapter_data) {
      const index = chapter_data.findIndex(
        (chapter) => chapter.name === chapterHover
      );
      if (index > 0) {
        const prevChapter = chapter_data[index - 1];
        setChapterHover(prevChapter.name);
      }
    }
  };

  const goToNextChapter = () => {
    if (chapter_data) {
      const index = chapter_data.findIndex(
        (chapter) => chapter.name === chapterHover
      );
      if (index < chapter_data.length - 1) {
        const nextChapter = chapter_data[index + 1];
        setChapterHover(nextChapter.name);
      }
    }
  };

  return (
    <div
      id="chapter-sidebar"
      className={detailView ? "" : "hidden"}
      style={{ top: `calc(${storyMarginTop}px +  1rem)` }}
    >
      <div className="buttons">
        <Button
          size="xs"
          variant="transparent"
          disabled={chapterHover === "" || isFirstChapter}
          leftSection={<FaArrowLeftLong />}
          onClick={goToPrevChapter}
        >
          prev chapter
        </Button>
        <Button
          size="xs"
          variant="transparent"
          disabled={chapterHover === "" || isLastChapter}
          rightSection={<FaArrowRightLong />}
          onClick={goToNextChapter}
        >
          next chapter
        </Button>
      </div>
      <div id="scene-overlay">
        <SceneDivInner inSidebar={true} />
      </div>
    </div>
  );
}

export default ChapterSidebar;
