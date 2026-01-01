## Announcement

> Effective **December 13, 2023**, Netflix will discontinue maintenance of Conductor OSS on GitHub. This strategic decision, while difficult, is essential for realigning our resources to better serve our business objectives with our internal Conductor fork.
>
> We are _deeply grateful_ for your support and contributions over the years. While Netflix will no longer be maintaining this repo, members of the Conductor community have been active in promoting alternative forks of this project, we’ll leave the code as is and trust that the health of the community will remain strong and continue to develop moving forward.

## Conductor UI

The UI is a standard `create-react-app` React Single Page Application (SPA). To get started, with Node 14 and `yarn` installed, first run `yarn install` from within the `/ui` directory to retrieve package dependencies.

For more information regarding CRA configuration and usage, see the official [doc site](https://create-react-app.dev/).

> ### For upgrading users
>
> The UI is designed to operate directly with the Conductor Server API. A Node `express` backend is no longer required.

### Development Server

To run the UI on the bundled development server, run `yarn run start`. Navigate your browser to `http://localhost:5000`.

#### Reverse Proxy configuration

The default setup expects that the Conductor Server API will be available at `localhost:8080/api`. You may select an alternate port and hostname, or rewrite the API path by editing `setupProxy.js`. Note that `setupProxy.js` is used ONLY by the development server.

### Hosting for Production

There is no need to "build" the project unless you require compiled assets to host on a production web server. In this case, the project can be built with the command `yarn build`. The assets will be produced to `/build`.

Your hosting environment should make the Conductor Server API available on the same domain. This avoids complexities regarding cross-origin data fetching. The default path prefix is `/api`. If a different prefix is desired, `plugins/fetch.js` can be modified to customize the API fetch behavior.

See `docker/serverAndUI` for an `nginx` based example.

### Customization Hooks

For ease of maintanence, a number of touch points for customization have been removed to `/plugins`.

- `AppBarModules.jsx`
- `AppLogo.jsx`
- `env.js`
- `fetch.js`

### Authentication

We recommend that authentication & authorization be de-coupled from the UI and handled at the web server/access gateway.

#### Examples (WIP)

- Basic Auth (username/password) with `nginx`
- Commercial IAM Vendor
- Node `express` server with `passport.js`

### Microsoft Azure AD (MSAL) integration

This project includes a minimal MSAL integration that you can enable to authenticate users via Azure AD.

- **Install deps:** After modifying `package.json`, run:

```powershell
yarn install
```

- **Environment variables:** set these in your environment or `.env` file at project root:

  - `REACT_APP_AZURE_CLIENT_ID` — your Azure AD app (client) ID
  - `REACT_APP_AZURE_AUTHORITY` — optional, defaults to `https://login.microsoftonline.com/common`
  - `REACT_APP_AZURE_REDIRECT_URI` — optional, defaults to the app origin

- **Files added:**

  - `src/auth/msalConfig.js` — msal configuration and `loginRequest` scopes
  - `src/auth/AuthProvider.jsx` — creates `PublicClientApplication` and provides `MsalProvider`
  - `src/components/LoginButton.jsx` — sign-in button (uses redirect)
  - `src/components/LogoutButton.jsx` — sign-out button (redirect)

Wrap or use the `LoginButton` / `LogoutButton` components where you want to trigger authentication flows. The app root is already wrapped with the `AuthProvider` so MSAL hooks (`useMsal`, `useIsAuthenticated`, etc.) are available throughout the app.

For production, configure your Azure AD app's redirect URIs and consider `cacheLocation` and `storeAuthStateInCookie` settings in `src/auth/msalConfig.js` according to your requirements.

#### Token usage and local API testing

We include a small token helper and an example component to demonstrate silent token acquisition and calling a protected API.

- **Files added:**

  - `src/auth/tokenService.js` — helpers `acquireToken` (uses `acquireTokenSilent` with `acquireTokenRedirect` fallback) and `fetchWithToken`.
  - `src/components/TokenExample.jsx` — UI to acquire a token silently and call a protected endpoint.

- **Scopes:** edit `loginRequest.scopes` in `src/auth/msalConfig.js` to request additional scopes (for example, `openid`, `profile`, or API scopes). The default example uses `User.Read`.

- **Local fake API:** for quick local testing without a backend, you can enable a fake protected endpoint that returns JSON at `/api/protected` by setting in `.env`:

```text
REACT_APP_USE_FAKE_API=true
```

When enabled, the development proxy will respond to `GET /api/protected` with a small JSON payload — the `TokenExample` component calls `/api/protected` by default. For real APIs, point the example to your backend endpoint and ensure the backend validates the token.

**Security note:** the fake API is for local development only and should not be used in production.
