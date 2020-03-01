import Loader from "react-loader-spinner";
import { Box, Text, Grid } from "grommet";
import { Ticket, Close, Menu } from "grommet-icons";
import React from "react";

function Event(props) {
  return (
    <>
      <Box flex="false">
        <Box flex="false" className="eventBox">
          <Grid
            className="eventGrid"
            rows={["2fr", "1fr"]}
            columns={["1fr", "1fr"]}
            areas={[
              { name: "header", start: [0, 0], end: [1, 0] },
              { name: "main", start: [0, 1], end: [1, 1] }
            ]}
          >
            <Box
              gridArea="header"
              style={{ backgroundColor: props.styleColor }}
              justify="center"
              align="center"
            >
              <Text weight="bold">{props.name}</Text>
              <Text>{props.location}</Text>
            </Box>

            <Box
              gridArea="main"
              background="light-2"
              justify="center"
              align="center"
            >
              <Text weight="bold">{props.date}</Text>
              <Box direction="row" align="center">
                <Text>Tickets Available : {props.ticketsAvailable.length}</Text>
                {props.ticketsAvailable.length > 0 && <Ticket color="brand" />}
              </Box>
            </Box>
          </Grid>
        </Box>
      </Box>
    </>
  );
}

export default Event;
