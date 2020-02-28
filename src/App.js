import React from "react";

import { Box, Header, Button, Layer, Footer, TextInput, Text } from "grommet";
import {
  Menu,
  Ticket,
  Close,
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
import AppMenu from "./pages/AppMenu";
import EventFIlter from "./pages/EventFilter";
import Loader from "./components/loader";
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
  const moveToAppContent = () => {
    let appContentTop = appContent.current.offsetTop;
    window.scrollTo({ top: appContentTop });
  };
  const setModalShow = state => {
    setCssAnim(state);
    setTimeout(() => {
      setShow(state);
    }, 0);
  };
  const popUpRef = React.useRef();
  const [show, setShow] = React.useState();
  const [cssAnim, setCssAnim] = React.useState();
  const appContent = React.useRef();
  const { loading, error, data } = useQuery(CURRENT_USER, {
    fetchPolicy: "no-cache"
  });

  if (loading) return <Loader />;
  if (error) return `Error! ${error.message}`;
  return (
    <>
      <Box className="appFirstPageBackgroundImage">
        {/* <Mutation mutation={POST_MUTATION}>
          {postMutation => <button onClick={postMutation}>Submit</button>}
        </Mutation> */}
        <Header>
          <Box pad="small" direction="row" align="center">
            <Button icon={<Ticket color="#ffffff" />} hoverIndicator />
            Sell Ticket
          </Box>
          <Button
            icon={<Menu color="#ffffff" />}
            onClick={() => setModalShow(true)}
            hoverIndicator
          />
          {show && (
            <Layer
              ref={popUpRef}
              className={cssAnim ? "appMenuPage" : ""}
              onEsc={() => setModalShow(false)}
              onClickOutside={() => setModalShow(false)}
            >
              <Header className="appMenuHeader">
                <Box direction="row" align="center">
                  <Button
                    icon={<Ticket color="rgb(0, 182, 240)" />}
                    hoverIndicator
                  />
                  Sell Ticket
                </Box>
                <Button icon={<Close />} onClick={() => setModalShow(false)} />
              </Header>
              <AppMenu userData={data.currentUser} />
            </Layer>
          )}
        </Header>
        <Box height="100%">
          <Box pad="large" className="appDesc">
            The Safest way to buy and sell e-tickets.
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
      <Box className="appContentBox" ref={appContent}>
        <EventFIlter />
        <Box pad="large">
          <Text size="large" weight="bold">
            Browse By Category
          </Text>
          <Text>Find the right event</Text>
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
          />
        </Box>
      </Box>
    </>
  );
}

export default App;
