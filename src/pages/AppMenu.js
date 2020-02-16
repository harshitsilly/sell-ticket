import React from "react";
import { Button } from "grommet";
import { Login, Help } from "grommet-icons";

function AppMenu() {
  return (
    <>
      <Button plain label="Sell Tickets" onClick={() => {}} />
      <Button
        reverse
        active
        icon={<Login />}
        label="Login"
        onClick={() => {}}
      />
      <Button
        reverse
        active
        icon={<Login />}
        label="Login"
        onClick={() => {}}
      />
      <Button reverse active icon={<Help />} label="Help" onClick={() => {}} />
    </>
  );
}

export default AppMenu;
