import "./App.css";
import {
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Route, Switch } from "wouter";
import { Tournaments } from "./pages/tournaments";
import { Leagues } from "./pages/leagues";
import Navigation from "./components/sidebar";
import { Matches } from "./pages/matches";
import { PlayerList } from "./pages/players/list";
import { PlayerView } from "./pages/players/view";

function App() {
  return (
    <Flex
      minH="100vh"
      width="100vw"
      // flexDir="column"
      bg={useColorModeValue("gray.100", "gray.900")}
    >
      <Navigation />
      <Flex flexDir="column" alignItems="center" w="100%" p={8}>
        <Switch>
          <Route path="/tournaments" component={Tournaments} nest />
          <Route path="/leagues" component={Leagues} />
          <Route path="/matches" component={Matches} />
          <Route path="/players" nest>
            <Route path="/view" nest>
              <Route path="/" component={PlayerList} />
              <Route path="/:id" component={PlayerView} />
            </Route>
          </Route>
          <Route path="/">
            <Stack spacing="4" alignItems="center" w="100%">
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
