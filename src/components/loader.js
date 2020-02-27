import Loader from "react-loader-spinner";
import { Box } from "grommet";
import React from "react";

function appLoader() {
  return (
    <>
      <Box width="100vw" height="100vh" justify="center" align="center">
        <Loader type="ThreeDots" color="#7D4CDB" height="100" width="100" />
      </Box>
    </>
  );
}

export default appLoader;
