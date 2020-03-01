import React from "react";
import { Box, DropButton } from "grommet";
import { Location, CaretDown } from "grommet-icons";
import LocationContent from "./locationContent";

function LocaltionFiler() {
  const [location, setLocation] = React.useState("nearby");
  return (
    <>
      <Box direction="row" pad="small" className="filterBoxBorder">
        <DropButton
          className="filterButton"
          icon={
            <Box width="2.5rem" pad="small" round="medium" background="brand">
              <Location />
            </Box>
          }
          label={
            <Box
              direction="row"
              align="center"
              width="100%"
              justify="between"
              pad="none"
            >
              <Box
                direction="column"
                className="filterHeader"
                direction="column"
              >
                Location<Box className="filterSubHeader">{location}</Box>
              </Box>
              <Box>
                <CaretDown />
              </Box>
            </Box>
          }
          dropAlign={{ top: "bottom", right: "right" }}
          dropContent={<LocationContent />}
        />
      </Box>
    </>
  );
}

export default LocaltionFiler;
