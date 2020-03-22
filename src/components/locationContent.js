import React, { useEffect } from "react";
import { Box, Button } from "grommet";
import { Search, Down } from "grommet-icons";
import Loader from "react-loader-spinner";

function LocaltionContent({ value, setLocationAndClose }) {
  let [locationData, setLocationdata] = React.useState(["Nearby"]);
  useEffect(() => {
    setTimeout(() => {
      setLocationdata(state => [
        ...state,
        ...["Bangalore", "Mumbai", "Pune", "Delhi", "Gurgaon"]
      ]);
    }, 2000);

    return () => {};
  });

  return (
    <>
      <Box pad="medium" className="dropDownContent">
        {locationData.map(element => {
          if (element === "Nearby" && locationData.length === 1) {
            return (
              <Box direction="row" align="center" justify="between">
                <Button className="dropDownButton" plain label="Nearby" />
                <Loader
                  type="Oval"
                  color="#7D4CDB"
                  width="20px"
                  height="20px"
                />
              </Box>
            );
          }
          return (
            element.toLowerCase().indexOf(value.toLowerCase()) > -1 && (
              <Button
                className="dropDownButton"
                onClick={event => setLocationAndClose(event.target.innerText)}
                plain
                label={element}
              />
            )
          );
        })}
      </Box>
    </>
  );
}

export default LocaltionContent;
