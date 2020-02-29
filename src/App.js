import React from "react";

import { Box, Button, Footer, TextInput, Text, Video } from "grommet";
import {
  Down,
  Search,
  Attraction,
  Music,
  PlayFill,
  Trophy,
  Multimedia
} from "grommet-icons";

import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import AppHeader from "./components/appHeader";
import EventFIlter from "./pages/EventFilter";
import Loader from "./components/loader";
import { Redirect } from "react-router-dom";
import "./css/app.scss";

const CURRENT_USER = gql`
  {
    currentUser {
      id
      firstName
      lastName
      email
    }
  }
`;
const appHeight = () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};
window.addEventListener("resize", appHeight);
// appHeight();

function App() {
  const [value, setValue] = React.useState("");
  const [redirect, setRedirect] = React.useState("");
  const moveToAppContent = () => {
    let appContentTop = appContent.current.offsetTop;
    window.scrollTo({ top: appContentTop });
  };

  const appContent = React.useRef();
  const { loading, error, data } = useQuery(CURRENT_USER, {
    fetchPolicy: "no-cache"
  });
  if (redirect) return <Redirect push="true" to={`/${redirect}`} />;
  if (loading) return <Loader />;
  if (error) return `Error! ${error.message}`;
  return (
    <>
      <Box className="appFirstPageBackgroundImage">
        {/* <Mutation mutation={POST_MUTATION}>
          {postMutation => <button onClick={postMutation}>Submit</button>}
        </Mutation> */}
        <AppHeader data={data} />
        <Box height="100%">
          <Box pad="large" className="appDesc">
            <Text size="x-large" weight="bold">
              The Safest way to buy and sell e-tickets.
            </Text>
          </Box>
          <Box direction="row" align="center" pad="medium">
            <Search className="appSearchIcon" />
            <TextInput
              className="appSearch"
              placeholder="Search for events,venues and cities"
              value={value}
              onChange={event => setValue(event.target.value)}
            />
          </Box>
        </Box>
        <Footer height="20vh">
          <Box width="100%" direction="row" justify="center">
            <Button
              onClick={moveToAppContent}
              icon={<Down color="#ffffff" />}
              hoverIndicator
            />
          </Box>
        </Footer>
      </Box>
      <Box flex="false" className="appContentBox" ref={appContent}>
        <EventFIlter />
        <Box flex="false" pad="large">
          <Box>
            <Text size="large" weight="bold">
              Browse By Category
            </Text>

            <Text>Find the right event</Text>
          </Box>
          <Box flex="false">
            <Button
              className="categoryButton"
              icon={
                <Box
                  width="2.4rem"
                  pad="small"
                  round="medium"
                  background="accent-4"
                >
                  <Attraction />
                </Box>
              }
              label="Festivals"
              onClick={() => {
                setRedirect("festivals");
              }}
            />
            <Button
              className="categoryButton"
              icon={
                <Box
                  width="2.4rem"
                  pad="small"
                  round="medium"
                  background="neutral-3"
                >
                  <Music />
                </Box>
              }
              label="Concerts"
              onClick={() => {
                setRedirect("Concerts");
              }}
            />
            <Button
              className="categoryButton"
              icon={
                <Box
                  width="2.4rem"
                  pad="small"
                  round="medium"
                  background="dark-1"
                >
                  <PlayFill />
                </Box>
              }
              label="Club Nights"
              onClick={() => {
                setRedirect("Club Nights");
              }}
            />
            <Button
              className="categoryButton"
              icon={
                <Box
                  width="2.4rem"
                  pad="small"
                  round="medium"
                  background="status-ok"
                >
                  <Trophy />
                </Box>
              }
              label="Sports"
              onClick={() => {
                setRedirect("Sports");
              }}
            />
            <Button
              className="categoryButton"
              icon={
                <Box
                  width="2.4rem"
                  pad="small"
                  round="medium"
                  background="status-critical"
                >
                  <Multimedia />
                </Box>
              }
              label="Theatre & Comedy"
              onClick={() => {
                setRedirect("Theatre & Comedy");
              }}
            />
            <Button
              className="categoryButton"
              icon={
                <Box
                  width="2.4rem"
                  pad="small"
                  round="medium"
                  background="accent-4"
                >
                  <Attraction />
                </Box>
              }
              label="Vouchers & Day Out"
              onClick={() => {
                setRedirect("Vouchers & Days Out");
              }}
            />
          </Box>
        </Box>
        <Box flex="false" width="100%" className="marginTopBox" align="center">
          <Text textAlign="center" size="large" weight="bold">
            Get the best out of sellTicket
          </Text>{" "}
          <Box width="100%" align="center" pad="small">
            <Text>Access your tickets offline,anytime</Text>
            <Text> Sell your tickets in just a few steps</Text>
          </Box>
        </Box>
        <Box width="100%" pad="large" className="marginTopBox">
          <Text size="medium">How It Works</Text>
          <video
            width="100%"
            height="240"
            controls="over"
            fit="cover"
            preload="metadata"
          >
            <source key="video" src="about.mp4#t=0.5" type="video/mp4" />
          </video>
        </Box>
      </Box>
    </>
  );
}

export default App;
