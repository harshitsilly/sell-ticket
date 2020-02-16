import React from "react";
import { Grommet, Box, Header, Button, Layer, Footer } from "grommet";
import { Menu, Ticket, Close, Down } from "grommet-icons";
import AppMenu from "./pages/AppMenu";
import EventFIlter from "./pages/EventFilter";
import "./css/app.css";

const theme = {
  global: {
    font: {
      family: "Roboto",
      size: "18px",
      height: "20px"
    }
  }
};

function App() {
  const moveToAppContent = () => {
    let appContentTop = appContent.current.offsetTop;
    window.scrollTo({ top: appContentTop });
  };
  const [show, setShow] = React.useState();
  const appContent = React.useRef();
  return (
    <Grommet theme={theme}>
      <Box className="appFirstPageBackgroundImage">
        <Header>
          <Box direction="row" align="center">
            <Button icon={<Ticket color="#ffffff" />} hoverIndicator />
            Sell Ticket
          </Box>
          <Button
            icon={<Menu color="#ffffff" />}
            onClick={() => setShow(true)}
            hoverIndicator
          />
          {show && (
            <Layer
              onEsc={() => setShow(false)}
              onClickOutside={() => setShow(false)}
            >
              <Header className="appMenuHeader">
                <Box direction="row" align="center">
                  <Button
                    icon={<Ticket color="rgb(0, 182, 240)" />}
                    hoverIndicator
                  />
                  Sell Ticket
                </Box>
                <Button icon={<Close />} onClick={() => setShow(false)} />
              </Header>
              <AppMenu />
            </Layer>
          )}
        </Header>
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
