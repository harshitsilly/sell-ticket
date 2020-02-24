import React from "react";
import {Box,DropButton} from "grommet";
import {Calendar,Down} from "grommet-icons";

function DateFilter() {
    const [location,setLocation] = React.useState("AnyTime");
  return(<>
  <Box
  direction="row"
  pad="small"
className="filterBox"
>
<DropButton  className="filterButton"
icon={<Box width="2.5rem" pad="small" round="medium" background="accent-1"><Calendar/></Box>}
  label={<Box  direction="row" align="center" width="100%" justify="between" pad="none" ><Box direction="column" className="filterHeader"  direction="column">Date<Box className="filterSubHeader">{location}</Box></Box>
  <Box  ><Down/></Box></Box>}
  dropAlign={{ top: 'bottom', right: 'right' }}
  dropContent={
    <Box pad="large" ></Box>
  }
/>
</Box>
  </>);
}

export default DateFilter;
