import React from "react";
import { Box } from "grommet";
import LocaltionFiler from "../components/localtionFiler";
import DateFiler from "../components/dateFilter";
import CategoryFilter from "../components/categoryFilter";
function EventFilter() {
  return (
    <>
      <Box flex="false" className="eventBox">
        <LocaltionFiler />
        <DateFiler />
        <CategoryFilter />
      </Box>
    </>
  );
}

export default EventFilter;
