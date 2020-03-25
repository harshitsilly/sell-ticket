import React from "react";
import { Box, Text } from "grommet";
import { useParams } from "react-router-dom";
import AppHeader from "../components/appHeader";

function EventFilter() {
  const { id } = useParams();
  return (
    <>
      <Box height="70vh" flex="false">
        <AppHeader data={{}} />
        <Box className="eventDetailHeaderParent" flex="false">
          <Box pad="medium" className="eventDetailHeader">
            <Text size="large" weight="bold">
              {id}
            </Text>
          </Box>
        </Box>

        <div className="eventDetailBackground" />
      </Box>
    </>
  );
}

export default EventFilter;
