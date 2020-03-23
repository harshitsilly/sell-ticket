import React from "react";
import { Button, Box, Form, FormField, Text, Footer } from "grommet";
import LocaltionFiler from "../components/localtionFiler";
import DateFiler from "../components/dateFilter";
import CategoryFilter from "../components/categoryFilter";
import AppHeader from "../components/appHeader";
import RandomGeneratedColor from "../components/randomGeneratedColor";
import Event from "../components/event";

const dummyData = [
  {
    name: "CSK VS BLR",
    location: "Bangalore",
    date: "7 March 2020",
    ticketsAvailable: 20
  },
  {
    name: "CSK VS BLR",
    location: "Bangalore",
    date: "10 March 2020",
    ticketsAvailable: 10
  },
  {
    name: "CSK VS BLR",
    location: "Bangalore",
    date: "22 March 2020",
    ticketsAvailable: 2
  },
  {
    name: "CSK VS BLR",
    location: "Bangalore",
    date: "17 October 2020",
    ticketsAvailable: 34
  },
  {
    name: "CSK VS BLR",
    location: "Bangalore",
    date: "7 August 2020",
    ticketsAvailable: 3
  },
  {
    name: "CSK VS BLR",
    location: "Bangalore",
    date: "7 March 2020",
    ticketsAvailable: 20
  },
  {
    name: "CSK VS BLR",
    location: "Bangalore",
    date: "10 March 2020",
    ticketsAvailable: 10
  },
  {
    name: "CSK VS BLR",
    location: "Bangalore",
    date: "22 March 2020",
    ticketsAvailable: 2
  },
  {
    name: "CSK VS BLR",
    location: "Bangalore",
    date: "17 October 2020",
    ticketsAvailable: 34
  },
  {
    name: "CSK VS BLR",
    location: "Bangalore",
    date: "7 August 2020",
    ticketsAvailable: 3
  }
];
function Category(props) {
  let category = props.match.params[0];
  const [events, setEvents] = React.useState([]);
  const [headerClass, setHeaderClass] = React.useState("positionSticky");
  setTimeout(() => {
    setEvents(dummyData);
  }, 1000);
  category = category.charAt(0).toUpperCase() + category.slice(1);
  window.addEventListener("scroll", event => {
    if (window.pageYOffset + 60 > (window.screen.height / 100) * 25) {
      setHeaderClass("positionFixed");
    } else {
      setHeaderClass("positionSticky");
    }
  });
  return (
    <>
      <Box>
        <Box height="25vh">
          <AppHeader
            style={{ backgroundColor: props.styleColor }}
            className={headerClass}
            data={{ currentUser: null }}
            header={category}
          />
          <Box pad="medium" justify="center" align="center">
            <Text color="#fff" weight="bold" size="large">
              {category}
            </Text>
          </Box>

          <Box
            style={{ backgroundColor: props.styleColor }}
            className="categoryBackground"
          ></Box>
        </Box>
        <Box
          className={
            headerClass === "positionSticky" ? "filterBox" : "filterBoxRow"
          }
        >
          <LocaltionFiler />
          <DateFiler />
        </Box>
        <Box pad="medium">
          {events.length === 0 && <Text weight="bold">No Events Found</Text>}
          {events.length > 0 &&
            events.map(event => (
              <RandomGeneratedColor
                render={props => <Event {...props} {...event} />}
              />
            ))}
        </Box>
      </Box>
    </>
  );
}
export default Category;
