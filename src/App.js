import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import {
  Grommet,
  Box,
  Header,
  Button,
  Layer,
  Footer,
  TextInput
} from "grommet";
import { Menu, Ticket, Close, Down, Search } from "grommet-icons";
import AppMenu from "./pages/AppMenu";
import EventFIlter from "./pages/EventFilter";
import "./css/app.scss";

const POST_MUTATION = gql`
  mutation {
    login(email: "maurice@moss.com", password: "abcdefg") {
      user {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

const theme = {
  global: {
    font: {
      family: "Roboto",
      size: "18px",
      height: "20px"
    },

    colors: {
      focus: "#ffffff" // added focus color,
    }
  }
};
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
  return (
    <Grommet theme={theme}>
      <Box className="appFirstPageBackgroundImage">
        <Mutation mutation={POST_MUTATION}>
          {postMutation => <button onClick={postMutation}>Submit</button>}
        </Mutation>
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
              <AppMenu />
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
      </Box>
    </Grommet>
  );
}

export default App;
