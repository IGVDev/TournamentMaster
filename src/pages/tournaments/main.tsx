import { useAuth0 } from "@auth0/auth0-react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, Route, Switch, useParams } from "wouter";
import "./styles.css";
import { SyncLoader } from "react-spinners";

interface League {
  _id: number;
  name: string;
  players: string[];
}

interface Tournament {
  _id: number;
  id: number;
  name: string;
  league: object;
  teams: string[];
  type: string;
  finished: boolean;
  matches: object[];
}

interface IMatch {
  league: number;
  tournament: number;
  home_team_name: string;
  away_team_name: string;
  round: number;
}

export const Tournaments = () => {
  const [tournamentListArray, setTournamentListArray] = useState([]);
  const [leagueList, setLeagueList] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [league, setLeague] = useState("");
  const [teams, setTeams] = useState("");
  const [type, setType] = useState("knockout");
  const [action, setAction] = useState("view");

  const color = useColorModeValue("black", "white");

  const { getAccessTokenSilently } = useAuth0();

  const loadTournaments = async () => {
    try {
      setIsLoading(true);
      axios
        .get(`${import.meta.env.VITE_API_URL}/tournaments`, {
          // headers: {
          //   Authorization: `Bearer ${await getAccessTokenSilently()}`,
          // },
        })
        .then((response) => {
          setTournamentListArray(response.data);
          setIsLoading(false);
        });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const loadLeagues = async () => {
    try {
      setIsLoading(true);
      axios
        .get(`${import.meta.env.VITE_API_URL}/leagues/user`, {
          headers: {
            Authorization: `Bearer ${await getAccessTokenSilently()}`,
          },
        })
        .then((response) => {
          setLeagueList(response.data);
          setIsLoading(false);
        });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTournaments();
    loadLeagues();
  }, []);

  const handleSubmit = async () => {
    const teamNames = teams.trim().split("\n");

    if (teamNames.length % 2 !== 0) {
      alert("Number of teams must be even");
      return;
    }

    const body = {
      name,
      league: league,
      teams: teamNames,
      type,
    };
    axios
      .post(`${import.meta.env.VITE_API_URL}/tournaments/create`, body, {
        headers: {
          Authorization: `Bearer ${await getAccessTokenSilently()}`,
        },
      })
      .then(() => {
        setName("");
        setLeague("");
        setTeams("");
        setType("knockout");
        setAction("view");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <Heading>Tournaments</Heading>
      <Switch>
        <Route path="/match/view/:id" component={MatchView} />
        <Route path="/" component={TournamentList} />
        {/* <Route
          path={"/create"}
          component={() => (
            <Flex flexDir="column">
              <Box>Create a new tournament</Box>
              <FormControl>
                <Flex flexDir="column">
                  <FormLabel>Name</FormLabel>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <FormLabel>League</FormLabel>
                  <Select
                    placeholder="Select league"
                    onChange={(e) => {
                      setLeague(e.target.value);
                    }}
                  >
                    {leagueList.map((league: League) => (
                      <option key={league._id} value={league._id}>
                        {league.name}
                      </option>
                    ))}
                  </Select>
                  <FormLabel>Teams</FormLabel>
                  <Textarea
                    value={teams}
                    onChange={(e) => setTeams(e.target.value)}
                  />
                  <FormLabel>Type</FormLabel>
                  <Select onChange={(e) => setType(e.target.value)}>
                    <option value="knockout">Knockout</option>
                    <option value="league">League</option>
                  </Select>
                  <Button onClick={handleSubmit}>Create</Button>
                  <Link to={"/tournaments"} asChild>
                    <Button>Cancel</Button>
                  </Link>
                </Flex>
              </FormControl>
            </Flex>
          )}
        /> */}
      </Switch>

      {action === "create" && (
        <Box>
          Create a new tournament
          <FormControl>
            <Flex flexDir="column">
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <FormLabel>League</FormLabel>
              <Select
                placeholder="Select league"
                onChange={(e) => {
                  setLeague(e.target.value);
                }}
              >
                {leagueList.map((league: League) => (
                  <option key={league.id} value={league.name}>
                    {league.name}
                  </option>
                ))}
              </Select>

              <FormLabel>Teams</FormLabel>
              <Textarea
                value={teams}
                onChange={(e) => setTeams(e.target.value)}
              />

              <FormLabel>Type</FormLabel>
              <Select onChange={(e) => setType(e.target.value)}>
                <option value="knockout">Knockout</option>
                <option value="league">League</option>
              </Select>
              <Button onClick={handleSubmit}>Create</Button>
              <Link to={"/"} asChild>
                <Button>Cancel</Button>
              </Link>
            </Flex>
          </FormControl>
        </Box>
      )}
    </div>
  );
};
