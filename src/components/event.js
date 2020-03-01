import Loader from "react-loader-spinner";
import { Box } from "grommet";
import React from "react";

function Event(props) {
  return (
    <>
      <Box flex="false">
        <Box
          flex="false"
          className="eventBox"
          style={{ backgroundColor: props.styleColor }}
        ></Box>
      </Box>
    </>
  );
}

export default Event;
