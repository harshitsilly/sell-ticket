import React from "react";
import { Box } from "grommet";
import { useParams } from "react-router-dom";

function EventFilter() {
  const { id } = useParams();
  return (
    <>
      <Box flex="false" className="filterBox">
        {id}
      </Box>
    </>
  );
}

export default EventFilter;
