import { Button, Divider } from "@mantine/core";
import { dataStore } from "../../stores/dataStore";
import { FiFileText } from "react-icons/fi";

function StoryInfo() {
  const { data } = dataStore();
  return (
    <div id="story-header">
      <a href={data["url"]} target="_blank" title={data["title"]}>
        <img src={data["image"]} alt={data["title"]} className="story-image" />
      </a>
      <div id="story-info">
        <h1>
          {data["title"]}
          {/* {story.includes("-themes") ? " (Themes)" : ""} */}
        </h1>
        <span>
          {data["author"] ? data["author"] : data["director"]}{" "}
          <Divider orientation="vertical" /> {data["year"]}{" "}
          {data["url"] && (
            <>
              <Divider orientation="vertical" />{" "}
              <a href={data["url"]} target="_blank" title={data["title"]}>
                <Button
                  size="xs compact"
                  variant="light"
                  id="info-button"
                  leftSection={<FiFileText />}
                >
                  Full {data["type"] === "Movie" ? "Script" : "Text"}
                </Button>
              </a>
            </>
          )}
        </span>
      </div>
    </div>
  );
}

export default StoryInfo;
