import Loader from "react-loader-spinner";
import { Box, Text, Grid } from "grommet";
import { Ticket, Close, Menu } from "grommet-icons";
import React from "react";
import EventCalendar from "./eventCalendar";

function Event(props) {
  return (
    <>
      <Box onClick={props.onClick} justify="center" className="eventBox">
        <Grid className="eventGrid">
          <EventCalendar date={props.date} />
          <Box justify="center" className="eventNameBox" align="start">
            <Text size="1rem">{props.name}</Text>
            <Text size=".90rem">{props.location}</Text>
          </Box>

          <Box className="eventTicket" direction="row" align="center">
            <Ticket color="white" />
            <Text size="1rem">{props.ticketsAvailable}</Text>
          </Box>
        </Grid>
      </Box>
    </>
  );
}

export default Event;
