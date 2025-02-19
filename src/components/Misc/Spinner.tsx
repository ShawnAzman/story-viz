import { ClipLoader } from "react-spinners";
import { storyStore } from "../../stores/storyStore";

function Spinner() {
  const { isUpdatingData } = storyStore();
  return (
    <div id="spinner" className={isUpdatingData ? "" : "hidden"}>
      <ClipLoader size={80} speedMultiplier={0.75} />
    </div>
  );
}

export default Spinner;
