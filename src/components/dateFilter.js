import React from "react";
import {
  Box,
  DropButton,
  Button,
  Calendar as CalendarComponent
} from "grommet";
import { Calendar, CaretDown } from "grommet-icons";

const dateData = [
  "Today",
  "Tomorrow",
  "This Weekend",
  "This Week",
  "Next Week",
  "This Month",
  "Any Time",
  "Pick a day"
];

function DateFilter() {
  const dropref = React.useRef(null);
  const [time, setTime] = React.useState("Any Time");
  const [showCalendar, setShowCalendar] = React.useState(false);

  const onPressDateButton = (event, element) => {
    setTime(element);
    if (element === "Pick a day") {
      setShowCalendar(true);

      // TODO: Add logic for frop doen comtent close
    } else {
      dropref.current.click();
    }
  };
  return (
    <>
      <Box direction="row" pad="none" className="filterBoxBorder">
        <DropButton
          ref={dropref}
          className="filterButton"
          icon={
            <Box
              width="2.5rem"
              pad="small"
              round="medium"
              background="accent-1"
            >
              <Calendar />
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
                Date<Box className="filterSubHeader">{time}</Box>
              </Box>
              <Box>
                <CaretDown size="15px" className="caretDown" />
              </Box>
            </Box>
          }
          dropAlign={{ top: "bottom", right: "right" }}
          dropContent={
            <Box pad="medium">
              {showCalendar && (
                <CalendarComponent
                  alignSelf="center"
                  size="small"
                  date={new Date().toISOString()}
                  onSelect={date => {
                    setShowCalendar(false);
                    date = new Date(date);

                    setTime(date.toISOString().substring(0, 10));
                    dropref.current.click();
                  }}
                />
              )}
              {!showCalendar &&
                dateData.map(element => (
                  <Button
                    className={
                      time === element
                        ? "selectButton dropDownButton"
                        : "dropDownButton"
                    }
                    plain
                    label={element}
                    onClick={event => onPressDateButton(event, element)}
                  />
                ))}
            </Box>
          }
        />
      </Box>
    </>
  );
}

export default DateFilter;
