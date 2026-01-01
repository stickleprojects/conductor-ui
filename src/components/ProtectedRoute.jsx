import React from "react";
import { Route } from "react-router-dom";
import { useIsAuthenticated } from "@azure/msal-react";
import LoginButton from "./LoginButton";

export default function ProtectedRoute({ children, ...rest }) {
  const isAuthenticated = useIsAuthenticated();

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          children
        ) : (
          <div style={{ padding: 24 }}>
            <p>You must sign in to access this page.</p>
            <LoginButton />
          </div>
        )
      }
    />
  );
}
