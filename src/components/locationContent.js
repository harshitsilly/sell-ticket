import React from "react";
import { Box, TextInput } from "grommet";
import { Search, Down } from "grommet-icons";
import Geosuggest from 'react-geosuggest';
 


function LocaltionContent() {
  return (
    <>
      <Box direction="row" pad="small" className="dropDownContent">
      <Geosuggest />
      </Box>
    </>
  );
}

export default LocaltionContent;
