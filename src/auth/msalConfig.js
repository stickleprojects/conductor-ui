export const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_AZURE_CLIENT_ID || "<YOUR_CLIENT_ID>",
    authority:
      process.env.REACT_APP_AZURE_AUTHORITY ||
      "https://login.microsoftonline.com/common",
    redirectUri:
      process.env.REACT_APP_AZURE_REDIRECT_URI || window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage", // or 'localStorage'
    storeAuthStateInCookie: true,
  },
};

export const loginRequest = {
  scopes: ["User.Read"],
};

export default msalConfig;
