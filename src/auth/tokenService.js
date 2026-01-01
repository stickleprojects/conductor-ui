import { InteractionRequiredAuthError } from "@azure/msal-browser";

export async function acquireToken(
  msalInstance,
  account,
  scopes = ["User.Read"]
) {
  if (!msalInstance || !account)
    throw new Error("msalInstance and account are required");

  const request = {
    account,
    scopes,
  };

  try {
    const response = await msalInstance.acquireTokenSilent(request);
    return response.accessToken;
  } catch (error) {
    // If interaction is required, trigger an interactive request (redirect fallback)
    if (error instanceof InteractionRequiredAuthError) {
      try {
        await msalInstance.acquireTokenRedirect(request);
        // redirect will navigate away; we won't get a token here
        return null;
      } catch (e) {
        console.error("acquireTokenRedirect failed", e);
        throw e;
      }
    }

    // For other errors, rethrow so caller can handle
    console.error("acquireTokenSilent failed", error);
    throw error;
  }
}

export async function fetchWithToken(
  msalInstance,
  account,
  scopes,
  url,
  options = {}
) {
  const token = await acquireToken(msalInstance, account, scopes);
  if (!token) return null; // interactive redirect started

  const headers = options.headers ? { ...options.headers } : {};
  headers["Authorization"] = `Bearer ${token}`;

  const fetchOptions = { ...options, headers };
  const resp = await fetch(url, fetchOptions);
  return resp;
}

export default { acquireToken, fetchWithToken };
