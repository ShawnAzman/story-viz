import "./App.scss";
import PlotOptions from "./components/PlotOptions";
import StoryVis from "./components/StoryVis";
import { dataStore } from "./stores/dataStore";

function App() {
  const { title } = dataStore();
  return (
    <div id="app">
      <header>
        <h1>{title}</h1>
        <PlotOptions />
      </header>
      <div id="story-contain">
        <StoryVis />
      </div>
    </div>
  );
}

export default App;
