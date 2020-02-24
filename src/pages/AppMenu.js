import React from "react";
import { Button ,Box} from "grommet";
import { Next } from "grommet-icons";

function AppMenu() {
  return (
    <>
    <Box pad="medium">
      <Button primary className="sellTicket" color="status-ok" label="Sell Tickets" onClick={() => {}} />
      <Button
        reverse
        className="appMenuButton"
        icon={<Next />}
        label="Login"
        onClick={() => {}}
      />
      <Button
        reverse
        className="appMenuButton"
        icon={<Next />}
        label="How It Works"
        onClick={() => {}}
      />
      <Button reverse  className="appMenuButton" icon={<Next />} label="Help" onClick={() => {}} />
      </Box>
    </>
  );
}

export default AppMenu;
