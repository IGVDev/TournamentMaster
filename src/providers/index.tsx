import { ChakraBaseProvider } from "@chakra-ui/react";
import { Auth0Provider } from "@auth0/auth0-react";

function Providers(children) {
  console.log(children);
  return (
    <Auth0Provider
      domain="dev-xid45skghrg8eqi3.us.auth0.com"
      clientId="wrv4gbSkBgHDMq7ZbxitGfCStPdFU1mQ"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <ChakraBaseProvider>{children}</ChakraBaseProvider>
    </Auth0Provider>
  );
}

export default Providers;
