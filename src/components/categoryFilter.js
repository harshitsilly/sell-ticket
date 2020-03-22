import React from "react";
import { Box, DropButton, Button } from "grommet";
import { CatalogOption, CaretDown } from "grommet-icons";

const categoryData = [
  "All",
  "Festivals",
  "Concerts",
  "Club Nights",
  "Sports",
  "Theatre & Comedy",
  "vouchers & Days out"
];
export default function() {
  const dropref = React.useRef(null);
  const [category, setCategory] = React.useState("All");
  const onPressCategoryButton = (event, element) => {
    setCategory(element);
    dropref.current.click();
  };
  return (
    <>
      <Box direction="row" className="filterBoxBorder" pad="none">
        <DropButton
          ref={dropref}
          className="filterButton"
          icon={
            <Box
              width="2.5rem"
              pad="small"
              round="medium"
              background="status-error"
            >
              <CatalogOption />
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
              <Box direction="column" className="filterHeader">
                Category<Box className="filterSubHeader">{category}</Box>
              </Box>
              <Box>
                <CaretDown size="15px" className="caretDown" />
              </Box>
            </Box>
          }
          dropAlign={{ top: "bottom", right: "right" }}
          dropContent={
            <Box pad="medium">
              {categoryData.map(element => (
                <Button
                  className={
                    category === element
                      ? "selectButton dropDownButton"
                      : "dropDownButton"
                  }
                  plain
                  label={element}
                  onClick={event => onPressCategoryButton(event, element)}
                />
              ))}
            </Box>
          }
        />
      </Box>
    </>
  );
}
