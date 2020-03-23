import Loader from "react-loader-spinner";
import { Box } from "grommet";
import React from "react";

function EventCalendar({ date }) {
  return (
    //   TODO- date iso to month
    <>
      <Box className="eventCalendar" justify="center" align="center">
        <div>{date.split(" ")[1].substring(0, 3)}</div>
        <div>{date.split(" ")[0]}</div>
      </Box>
    </>
  );
}

export default EventCalendar;
