import React, { useState } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import Button from "@material-ui/core/Button";
import { loginRequest } from "../auth/msalConfig";
import { acquireToken, fetchWithToken } from "../auth/tokenService";

export default function TokenExample() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const account = accounts && accounts.length > 0 ? accounts[0] : null;
  const [status, setStatus] = useState(null);
  const [responseText, setResponseText] = useState(null);

  const handleCallApi = async () => {
    setStatus("Acquiring token...");
    try {
      const token = await acquireToken(instance, account, loginRequest.scopes);
      if (!token) {
        setStatus("Interactive login started (redirect). Complete sign-in and try again.");
        return;
      }

      setStatus("Calling protected API...");
      // Example protected endpoint; change to your API URL
      const resp = await fetchWithToken(instance, account, loginRequest.scopes, "/api/protected");
      if (!resp) {
        setStatus("No response (likely redirect occurred).");
        return;
      }

      const text = await resp.text();
      setResponseText(text);
      setStatus(`HTTP ${resp.status}`);
    } catch (e) {
      console.error(e);
      setStatus(`Error: ${e.message}`);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Silent Token Example</h2>
      <p>
        {isAuthenticated
          ? `Signed in as ${account && account.username}`
          : "Not signed in. Use the sign-in button in the header."}
      </p>
      <div style={{ marginTop: 12 }}>
        <Button variant="contained" color="primary" onClick={handleCallApi} disabled={!isAuthenticated}>
          Call Protected API
        </Button>
      </div>
      {status && (
        <div style={{ marginTop: 12 }}>
          <strong>Status:</strong> {status}
        </div>
      )}
      {responseText && (
        <pre style={{ marginTop: 12, maxWidth: "80%", whiteSpace: "pre-wrap" }}>{responseText}</pre>
      )}
    </div>
  );
}
