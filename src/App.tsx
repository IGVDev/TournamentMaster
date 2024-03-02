import "./App.css";
import {
  Button,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { Route, Switch } from "wouter";
import { Tournaments } from "./pages/tournaments";
import { Leagues } from "./pages/leagues";
import Navigation from "./components/sidebar";
import { Matches } from "./pages/matches";

function App() {
  const { colorMode, toggleColorMode } = useColorMode();
  const {
    loginWithRedirect,
    logout,
    user,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
  } = useAuth0();

  const fetchProtectedMessage = async () => {
    try {
      axios
        .get(`${import.meta.env.VITE_API_URL}/getProtectedTestMessage`, {
          headers: {
            Authorization: `Bearer ${await getAccessTokenSilently()}`,
          },
        })
        .then((response) => {
          alert(response.data);
        });
    } catch (error) {
      alert(error);
    }
  };

  return (
    <Flex
      minH="100vh"
      width="100vw"
      // flexDir="column"
      bg={useColorModeValue("gray.100", "gray.900")}
    >
      <Navigation />
      <Flex flexDir="column" alignItems={"center"} w="100%" p={8}>
        <Heading fontSize={{ base: "md", sm: "lg", md: "xl" }}>
          Tournament Master
        </Heading>
        <Switch>
          <Route path="/tournaments" component={Tournaments} nest />
          <Route path="/leagues" component={Leagues} />
          <Route path="/matches" component={Matches} />
          <Route path="/">
            <Stack spacing="4" alignItems="center">
              <Heading
                fontWeight={600}
                fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
                lineHeight={"110%"}
              >
                Tournament scheduling{" "}
                <Text as={"span"} color={"orange.400"}>
                  made easy
                </Text>
              </Heading>
              <Text color={"gray.500"} maxW={"3xl"}>
                Never lose track of your tournaments again. Schedule, manage and
                track your tournaments with ease.
              </Text>
            </Stack>
          </Route>
        </Switch>
      </Flex>
    </Flex>
  );
}

export default App;
