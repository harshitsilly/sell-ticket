import Loader from "react-loader-spinner";
import { Box } from "grommet";
import React from "react";

function EventCalendar({ date }) {
  date = new Date(date);
  date = date.toDateString();
  return (
   
    <>
      <Box className="eventCalendar" justify="center" align="center">
        <div>{date.split(" ")[1].substring(0, 3)}</div>
        <div>{date.split(" ")[2]}</div>
      </Box>
    </>
  );
}

export default EventCalendar;
