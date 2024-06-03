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
import "./tournaments.css";
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

  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

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

  // const loadTournament = async (id: string) => {
  //   try {
  //     axios
  //       .get(`${import.meta.env.VITE_API_URL}/tournaments/${id}`, {
  //         // headers: {
  //         //   Authorization: `Bearer ${await getAccessTokenSilently()}`,
  //         // },
  //       })
  //       .then((response) => {
  //         console.log("here", response.data);
  //         setTournament(response.data);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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

  const TournamentList = () => {
    const colors = useColorModeValue("gray.200", "gray.700");
    return (
      <Flex justify={"center"} w="100%">
        <Flex flexDir="column" w="100%">
          {isLoading && (
            <Box alignSelf={"center"} margin="1em">
              <SyncLoader color={color} />
            </Box>
          )}
          {!isLoading && isAuthenticated && (
            <Button
              onClick={() => setAction("create")}
              p={2}
              fontWeight={700}
              bgColor={colors}
              alignContent={"center"}
              justifyContent={"center"}
            >
              Create new tournament
            </Button>
          )}
          {!isLoading && (
            <TableContainer>
              <Table variant="striped" w="100%">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>League</Th>
                    <Th>Type</Th>
                    <Th>Finished</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {!isLoading && tournamentListArray.length > 0 ? (
                    tournamentListArray.map((tournament: Tournament) => {
                      return (
                        <Link to={`/view/${tournament.id}`} asChild>
                          <Tr key={league}>
                            <Td>{tournament.name}</Td>
                            <Td>{tournament.league}</Td>
                            <Td>{tournament.type}</Td>
                            <Td>{tournament.finished || "false"}</Td>
                          </Tr>
                        </Link>
                      );
                    })
                  ) : (
                    <p>No tournaments created yet</p>
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </Flex>
      </Flex>
    );
  };

  const TournamentView = () => {
    const params = useParams();
    const [tournament, setTournament] = useState<Tournament | null>(null); // Initialize state for tournament data
    const [matches, setMatches] = useState<Match[]>([]); // Initialize state for matches data

    useEffect(() => {
      const fetchTournament = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/tournaments/${params.id}`
          );
          setTournament(response.data); // Set the fetched tournament data to state
        } catch (error) {
          console.error("Error fetching tournament data:", error);
        }
      };

      fetchTournament(); // Fetch tournament data when params.id changes
    }, [params.id]); // Add params.id as a dependency

    useEffect(() => {
      if (tournament) {
        const fetchMatches = async (tournament: Tournament) => {
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_API_URL}/matches/tournament/${tournament.id}`
            );
            setMatches(response.data);
          } catch (error) {
            console.error("Error fetching tournament matches:", error);
          }
        };

        fetchMatches(tournament);
      }
    }, [tournament]);

    return (
      <Flex className="rounds">
        {Object.keys(matches).map((round, index) => (
          <Flex className="roundContainer">
            <Flex className="round">
              <Text>Round {index + 1}</Text>
              {matches[round].map((match) => (
                <Flex className="match">
                  <Flex
                    className="team"
                    bg="gray.400"
                    _dark={{ bg: "gray.600" }}
                  >
                    {match.home_team_name}
                  </Flex>
                  <Flex
                    className="team"
                    bg="gray.500"
                    _dark={{ bg: "gray.700" }}
                  >
                    {match.away_team_name}
                  </Flex>
                </Flex>
              ))}
            </Flex>
          </Flex>
        ))}
        <Flex className="roundContainer">
          <Flex className="round">
            <Text>Champion</Text>
            <Flex className="match">
              <Flex className="team" bg="gray.400" _dark={{ bg: "gray.600" }}>
                {tournament?.champion || "TBD"}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    );
  };

  const MatchView = () => {
    const params = useParams();
    const [match, setMatch] = useState<object | null>(null);
    const [action, setAction] = useState("view");
    const [players, setPlayers] = useState<string[]>([]);
    const [home_player_1, sethome_player_1] = useState("");
    const [away_player_1, setaway_player_1] = useState("");
    const [home_player_2, sethome_player_2] = useState("");
    const [away_player_2, setaway_player_2] = useState("");
    const [homeScore, setHomeScore] = useState(0);
    const [awayScore, setAwayScore] = useState(0);

    useEffect(() => {
      const fetchMatch = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/matches/${params.id}`
          );
          setMatch(response.data);
        } catch (error) {
          console.error("Error fetching match data:", error);
        }
      };

      fetchMatch();
    }, [params.id]);

    useEffect(() => {
      if (match) {
        const fetchPlayers = async () => {
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_API_URL}/leagues/${match.league.id}`
            );
            setPlayers(response.data.players);
          } catch (error) {
            console.error("Error fetching players:", error);
          }
        };
        fetchPlayers();
      }
    }, [match]);

    const handleSubmit = async () => {
      const body = {
        ...match,
        played: true,
        home_result: homeScore,
        away_result: awayScore,
        home_player_1: home_player_1,
        away_player_1: away_player_1,
        home_player_2: home_player_2 ? home_player_2 : null,
        away_player_2: away_player_2 ? away_player_2 : null,
      };
      axios
        .put(
          `${import.meta.env.VITE_API_URL}/matches/tournament/match/${match.id}`,
          body,
          {
            headers: {
              Authorization: `Bearer ${await getAccessTokenSilently()}`,
            },
          }
        )
        .then(() => {
          setAction("view");
        })
        .catch((error) => {
          console.log(error);
        });
    };

    return (
      <div>
        {match && action === "view" && (
          <Flex flexDir="column" p={4}>
            <Text
              fontSize={{
                base: "md",
                sm: "lg",
                md: "xl",
              }}
            >
              {match.home_team_name} vs {match.away_team_name}
              {match.played ? (
                <Flex flexDir="column">
                  <Text fontWeight={600}>
                    {match.home_result} - {match.away_result}
                  </Text>
                  <Text>
                    {match.home_player_1} and {match.home_player_2} vs{" "}
                    {match.away_player_1} and {match.away_player_2}
                  </Text>
                  <Text>
                    Winners:{" "}
                    {match.winner === match.home_team_name ? (
                      <Text>
                        {match.home_player_1} and {match.home_player_2}
                      </Text>
                    ) : (
                      <Text>
                        {match.away_player_1} and {match.away_player_2}
                      </Text>
                    )}{" "}
                    {match.winner}
                  </Text>
                </Flex>
              ) : (
                <Text fontWeight={600}>Not played</Text>
              )}
            </Text>
            <Button onClick={() => setAction("edit")}>Edit</Button>
          </Flex>
        )}
        {match && action === "edit" && (
          <Flex flexDir="column" p={4}>
            <Text
              fontSize={{
                base: "md",
                sm: "lg",
                md: "xl",
              }}
            >
              <Input
                type="text"
                value={match.home_team_name}
                onChange={(e) => {
                  setMatch({ ...match, home_team_name: e.target.value });
                }}
              />{" "}
              vs{" "}
              <Input
                type="text"
                value={match.away_team_name}
                onChange={(e) => {
                  setMatch({ ...match, away_team_name: e.target.value });
                }}
              />
            </Text>
            <FormControl>
              <Flex flexDir="column">
                <FormLabel>Result {match.home_team_name}</FormLabel>
                <NumberInput
                  defaultValue={0}
                  min={0}
                  onChange={(valueString) =>
                    setHomeScore(parseInt(valueString))
                  }
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>

                <FormLabel>Result {match.away_team_name}</FormLabel>
                <NumberInput
                  defaultValue={0}
                  min={0}
                  onChange={(valueString) =>
                    setAwayScore(parseInt(valueString))
                  }
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>

                <FormLabel>{match.home_team_name} Players</FormLabel>
                <Select
                  placeholder="Select player"
                  onChange={(e) => {
                    sethome_player_1(e.target.value);
                  }}
                >
                  {players.map((player) => (
                    <option key={player} value={player}>
                      {player}
                    </option>
                  ))}
                </Select>
                <Select
                  placeholder="Select player"
                  onChange={(e) => {
                    sethome_player_2(e.target.value);
                  }}
                >
                  {players.map((player) => (
                    <option key={player} value={player}>
                      {player}
                    </option>
                  ))}
                </Select>

                <FormLabel>{match.away_team_name} Players</FormLabel>
                <Select
                  placeholder="Select player"
                  onChange={(e) => {
                    setaway_player_1(e.target.value);
                  }}
                >
                  {players.map((player) => (
                    <option key={player} value={player}>
                      {player}
                    </option>
                  ))}
                </Select>
                <Select
                  placeholder="Select player"
                  onChange={(e) => {
                    setaway_player_2(e.target.value);
                  }}
                >
                  {players.map((player) => (
                    <option key={player} value={player}>
                      {player}
                    </option>
                  ))}
                </Select>
              </Flex>
            </FormControl>
            <Button onClick={handleSubmit}>Save</Button>
            <Button onClick={() => setAction("view")}>Cancel</Button>
          </Flex>
        )}
      </div>
    );
  };

  return (
    <div>
      <Heading>Tournaments</Heading>
      <Switch>
        <Route path="/match/view/:id" component={MatchView} />
        <Route path="/view/:id" component={TournamentView} />
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
