import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// import Providers from "./providers/index.tsx";
import { ChakraBaseProvider } from "@chakra-ui/react";
import { Auth0Provider } from "@auth0/auth0-react";
import { theme } from "./theme/index.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <Providers> */}
    <Auth0Provider
      domain="dev-xid45skghrg8eqi3.us.auth0.com"
      clientId="wrv4gbSkBgHDMq7ZbxitGfCStPdFU1mQ"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "http://tournamentmaster.com",
      }}
    >
      <ChakraBaseProvider theme={theme}>
        <App />
      </ChakraBaseProvider>
    </Auth0Provider>
    {/* </Providers> */}
  </React.StrictMode>
);
