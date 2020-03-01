import Loader from "react-loader-spinner";
import { Box } from "grommet";
import React from "react";

const Colors = [
  "#7d4cdb",
  "#F44336",
  "#5C6BC0",
  "#26A69A",
  "#81C784",
  "#FFA726",
  "#FF7043",
  "#8D6E63",
  "#9E9E9E",
  "#607D8B"
];
function randomGeneratedColor(props) {
  return props.render({
    ...props,
    styleColor: Colors[Math.floor(Math.random() * Colors.length)]
  });
}

export default randomGeneratedColor;
