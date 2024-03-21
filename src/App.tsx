import { useEffect, useState } from "react";
import "./App.scss";
import StoryVis from "./components/StoryVis";
import { title } from "./data";

import { Select, Switch } from "@mantine/core";

function App() {
  const [showConflict, setShowConflict] = useState(false);
  const [colorBy, setColorBy] = useState("emotion");
  const colorByOptions = ["emotion", "importance"];

  useEffect(() => {
    console.log("colorBy", colorBy);
  }, [colorBy]);

  return (
    <div id="app">
      <header>
        <h1>{title}</h1>
        <div id="options">
          <Switch
            size="xs"
            label="Show conflict overlay"
            labelPosition="left"
            checked={showConflict}
            onChange={(event) => setShowConflict(event.currentTarget.checked)}
          />
          <Select
            disabled={!showConflict}
            size="xs"
            label="Color by"
            data={colorByOptions}
            value={colorBy}
            onChange={(value) => {
              if (value) setColorBy(value);
            }}
          />
        </div>
      </header>
      <div id="story-contain">
        <StoryVis />
      </div>
    </div>
  );
}

export default App;
