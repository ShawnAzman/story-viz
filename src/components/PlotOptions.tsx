import { Switch, Select, Divider } from "@mantine/core";
import { storyStore } from "../store";

function PlotOptions() {
  const {
    showCharacterEmotions,
    setShowCharacterEmotions,
    showConflict,
    setShowConflict,
    colorBy,
    setColorBy,
    sizeBy,
    setSizeBy,
    stylize,
    setStylize,
  } = storyStore();
  const colorByOptions = ["conflict", "emotion", "importance", "none"];
  const sizeByOptions = ["conflict", "importance", "none"];
  return (
    <div id="options">
      <div className="options-contain">
        <b>Plot</b>
        <div className="options-inner">
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
      </div>
      <Divider orientation="vertical" />
      <div className="options-contain">
        <b>Scenes</b>
        <div className="options-inner">
          <Switch
            size="xs"
            label="Stylize"
            labelPosition="left"
            checked={stylize}
            onChange={(event) => setStylize(event.currentTarget.checked)}
          />
          <Select
            disabled={!stylize}
            size="xs"
            label="Size by"
            data={sizeByOptions}
            value={sizeBy}
            onChange={(value) => {
              if (value) setSizeBy(value);
            }}
          />
          <Select
            disabled={!stylize}
            size="xs"
            label="Color by"
            data={colorByOptions}
            value={colorBy}
            onChange={(value) => {
              if (value) setColorBy(value);
            }}
          />
        </div>
      </div>
      <Divider orientation="vertical" />
      <div className="options-contain">
        <b>Characters</b>
        <Switch
          size="xs"
          label="Color by emotion"
          labelPosition="left"
          checked={showCharacterEmotions}
          onChange={(event) =>
            setShowCharacterEmotions(event.currentTarget.checked)
          }
        />
      </div>
    </div>
  );
}
export default PlotOptions;
