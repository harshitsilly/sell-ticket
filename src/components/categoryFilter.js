import React from "react";
import {Box,DropButton} from "grommet";
import {CatalogOption,CaretDown} from "grommet-icons";

export default function () {
    const [location,setLocation] = React.useState("All");
  return(<>
  <Box
  direction="row"
  pad="small"

>
<DropButton  className="filterButton"
icon={<Box width="2.5rem" pad="small" round="medium" background="status-error"><CatalogOption/></Box>}
  label={<Box  direction="row" align="center" width="100%" justify="between" pad="none" ><Box direction="column" className="filterHeader"  direction="column">Category<Box className="filterSubHeader">{location}</Box></Box>
  <Box  ><CaretDown/></Box></Box>}
  dropAlign={{ top: 'bottom', right: 'right' }}
  dropContent={
    <Box pad="large" ></Box>
  }
/>
</Box>
  </>);
}


