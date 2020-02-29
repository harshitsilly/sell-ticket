import React from "react";

import { Box, Header, Button, Layer, Text } from "grommet";
import { Ticket, Close, Menu } from "grommet-icons";

import AppMenu from "../pages/AppMenu";

function AppHeader({ data }) {
  const setModalShow = state => {
    setCssAnim(state);
    setTimeout(() => {
      setShow(state);
    }, 0);
  };
  const popUpRef = React.useRef();
  const [show, setShow] = React.useState();
  const [cssAnim, setCssAnim] = React.useState();
  return (
    <>
      <Header className="appMenuHeader">
        <Box pad="small" direction="row" align="center">
          <Button icon={<Ticket color="#ffffff" />} hoverIndicator />
          <Text color="white" weight="bold" size="20px">
            sellTicket
          </Text>
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
                <Button icon={<Ticket color="brand" />} hoverIndicator />
                <Text color="brand" weight="bold" size="20px">
                  sellTicket
                </Text>
              </Box>
              <Button
                icon={<Close color="dark-1" />}
                onClick={() => setModalShow(false)}
              />
            </Header>
            <AppMenu userData={data.currentUser} />
          </Layer>
        )}
      </Header>
    </>
  );
}

export default AppHeader;
