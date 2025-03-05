import { Tooltip } from "@mantine/core";
import { IoInformationCircleOutline } from "react-icons/io5";

function InfoTooltip(props: any) {
  const tooltipType = props.type ? props.type : "default";
  return (
    <Tooltip
      className={"info-tooltip " + (props.smaller ? "smaller" : "")}
      label={
        <span
          style={{
            fontSize: "x-small",
            color: "black",
            fontFamily: "Shantell Sans",
          }}
        >
          {props.label}
        </span>
      }
      withArrow
      color={"rgb(255,255,255,0.95)"}
      style={{
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <span>
        {tooltipType === "default" ? (
          <IoInformationCircleOutline
            style={{
              marginBottom: -2,
              marginLeft: 5,
              opacity: 0.7,
            }}
          />
        ) : (
          " 💡"
        )}
      </span>
    </Tooltip>
  );
}

export default InfoTooltip;
