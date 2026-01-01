import React from "react";
import { useMsal } from "@azure/msal-react";
import Button from "@material-ui/core/Button";

export default function LogoutButton() {
  const { instance } = useMsal();

  const handleLogout = () => {
    instance.logoutRedirect().catch((e) => console.error(e));
  };

  return (
    <Button color="inherit" size="small" onClick={handleLogout}>
      Sign out
    </Button>
  );
}
