import React from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import Button from "@material-ui/core/Button";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import Typography from "@material-ui/core/Typography";
import usePermissions from "../auth/usePermissions";

export default function AuthStatus() {
  const isAuthenticated = useIsAuthenticated();
  const { account } = usePermissions();

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {isAuthenticated && account ? (
        <>
          <Typography variant="body2" style={{ color: "inherit" }}>
            {account.username}
          </Typography>
          <LogoutButton />
        </>
      ) : (
        <LoginButton />
      )}
    </div>
  );
}
