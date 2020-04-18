import React, { useContext } from "react";

import { Box, Header, Button, Layer, Text } from "grommet";
import { Ticket, Close, Menu } from "grommet-icons";
import { Redirect } from "react-router-dom";

import AppMenu from "../pages/AppMenu";
import { UserContext } from "../context/user";

function AppHeader({ className, style, header }) {
  const data = useContext(UserContext);
  const [redirectToApp, setRedirectToApp] = React.useState(false);
  const setModalShow = state => {
    setCssAnim(state);
    setTimeout(() => {
      setShow(state);
    }, 0);
  };
  const popUpRef = React.useRef();
  const [show, setShow] = React.useState();
  const [cssAnim, setCssAnim] = React.useState();
  if (redirectToApp) {
    return <Redirect push="true" to="/" />;
  } else {
    return (
      <>
        <Header
          style={style}
          className={className ? `${className} appMenuHeader` : "appMenuHeader"}
        >
          <Box pad="small" direction="row" align="center">
            <Button
              icon={<Ticket className="svgFillWhite" color="#ffffff" />}
              hoverIndicator
              onClick={() => {
                setRedirectToApp(true);
              }}
            />
            <Button
              plain
              onClick={() => {
                setRedirectToApp(true);
              }}
              color="white"
              weight="bold"
              size="20px"
            >
              {className === "positionFixed" ? header : "sellTicket"}
            </Button>
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
}

export default AppHeader;
