import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../auth/msalConfig";
import Button from "@material-ui/core/Button";

export default function LoginButton() {
  const { instance } = useMsal();

  const handleLogin = () => {
    // Prefer redirect in SPAs by default; fall back to popup if desired
    instance.loginRedirect(loginRequest).catch((e) => console.error(e));
  };

  return (
    <Button color="inherit" size="small" onClick={handleLogin}>
      Sign in
    </Button>
  );
}
