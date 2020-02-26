import React from "react";
import {Box,TextInput} from "grommet";
import {Search,Down} from "grommet-icons";

function LocaltionContent() {
    const [location,setLocation] = React.useState("nearby");
    const [value, setValue] = React.useState('');
  return(<>
  <Box 
  direction="row"
  pad="small"
className="dropDownContent"
>
<Box direction="row" align="center" pad="medium" >
              <Search className="appSearchIcon"/>
          <TextInput className="appSearch"
      placeholder="Search for Location"
      value={value}
      onChange={event => setValue(event.target.value)}/>
          </Box>
</Box>
  </>);
}

export default LocaltionContent;
