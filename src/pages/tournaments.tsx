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
import { Link, Redirect, Route, Switch, useLocation, useParams } from "wouter";

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

export const Tournaments = () => {
  const [tournamentListArray, setTournamentListArray] = useState([]);
  const [leagueList, setLeagueList] = useState([]);
  const [tournament, setTournament] = useState<object | Tournament>({
    matches: [],
  });
  const [name, setName] = useState("");
  const [league, setLeague] = useState("");
  const [teams, setTeams] = useState("");
  const [type, setType] = useState("knockout");
  const [action, setAction] = useState("view");

  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [, setLocation] = useLocation();

  const loadTournaments = async () => {
    try {
      axios
        .get(`${import.meta.env.VITE_API_URL}/tournaments`, {
          // headers: {
          //   Authorization: `Bearer ${await getAccessTokenSilently()}`,
          // },
        })
        .then((response) => {
          setTournamentListArray(response.data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const loadLeagues = async () => {
    try {
      axios
        .get(`${import.meta.env.VITE_API_URL}/leagues/user`, {
          headers: {
            Authorization: `Bearer ${await getAccessTokenSilently()}`,
          },
        })
        .then((response) => {
          setLeagueList(response.data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const loadTournament = async (id: string) => {
    try {
      axios
        .get(`${import.meta.env.VITE_API_URL}/tournaments/${id}`, {
          // headers: {
          //   Authorization: `Bearer ${await getAccessTokenSilently()}`,
          // },
        })
        .then((response) => {
          console.log("here", response.data);
          setTournament(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
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
      .then((res) => {
        setName("");
        setLeague("");
        setTeams("");
        setType("knockout");
        setLocation(`/tournaments/view/${res.data.id}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const TournamentList = ({league, tournament}) => {
    const colors = useColorModeValue("gray.200", "gray.700");
    return (
      <Flex justify={"center"} w="100%">
        <Flex flexDir="column" w="100%">
          {isAuthenticated && action === "view" && (
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
                {tournamentListArray.length > 0 ? (
                  tournamentListArray.map((tournament: Tournament) => {
                    return (
                      <Link to={`/view/${tournament.id}`} asChild>
                        <Tr key={league.id}>
                          <Td>{tournament.name}</Td>
                          <Td>{tournament.league.name}</Td>
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
        </Flex>
      </Flex>
    );
  };

  const TournamentView = () => {
    const params = useParams();
    const [tournament, setTournament] = useState<Tournament | null>(null); // Initialize state for tournament data
    const [matches, setMatches] = useState<object[]>([]); // Initialize state for matches data

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

    const matchesByNextMatchId = {};

    // Group matches by next match ID
    matches &&
      matches.forEach((match) => {
        const nextMatchId = match.next_round_match_id;
        if (nextMatchId) {
          if (!matchesByNextMatchId[nextMatchId]) {
            matchesByNextMatchId[nextMatchId] = [match];
          } else {
            matchesByNextMatchId[nextMatchId].push(match);
          }
        }
      });

    const drawRound = (nextMatchId) => {
      const roundMatches = matchesByNextMatchId[nextMatchId];
      if (!roundMatches) return null;

      return (
        <HStack key={nextMatchId} spacing={2}>
          {roundMatches.map((match) => (
            <VStack key={match._id} alignItems="center" justify={"center"}>
              <Link to={`/match/view/${match.id}`} asChild>
                <Box
                  border="1px solid"
                  p={4}
                  borderRadius={4}
                  w="150px"
                  h="150px"
                >
                  <Text>
                    {match.home_team_name} vs {match.away_team_name}
                  </Text>
                  <Text>
                    {match.played ? (
                      <Text fontWeight={600}>
                        {match.home_result} - {match.away_result}
                      </Text>
                    ) : (
                      <Text fontWeight={600}>Not played</Text>
                    )}
                  </Text>
                </Box>
              </Link>
              {drawRound(match.id)}
            </VStack>
          ))}
        </HStack>
      );
    };

    return (
      <div>
        {/* <h3>Viewing {params.id}</h3> */}
        {tournament ? (
          <div>
            <Heading
              fontSize={{
                base: "md",
                sm: "lg",
                md: "xl",
              }}
            >
              {tournament.name}
            </Heading>
            {/* Render other tournament details here */}
            {matches.length > 0 ? (
              <VStack spacing={4} alignItems="flex-start">
                {matches
                  .filter((match) => !match.next_round_match_id)
                  .map((match) => (
                    <Flex
                      key={match._id}
                      alignItems="center"
                      justifyContent={"center"}
                      flexDir="column"
                    >
                      <Link to={`/match/view/${match.id}`} asChild>
                        <Box
                          border="1px solid"
                          p={4}
                          borderRadius={4}
                          width="150px"
                          h="200px"
                        >
                          <Text>
                            {match.home_team_name} vs {match.away_team_name}
                          </Text>
                          <Text>
                            {match.played ? (
                              <Text fontWeight={600}>
                                {match.home_team_result} -{" "}
                                {match.away_team_result}
                              </Text>
                            ) : (
                              <Text fontWeight={600}>Not played</Text>
                            )}
                          </Text>
                        </Box>
                      </Link>
                      {drawRound(match.id)}
                    </Flex>
                  ))}
              </VStack>
            ) : (
              <p>No matches created yet</p>
            )}
          </div>
        ) : (
          <p>Loading tournament data...</p>
        )}
      </div>
    );
  };

  const MatchView = () => {
    const params = useParams();
    const [match, setMatch] = useState<object | null>(null);
    const [action, setAction] = useState("view");
    const [players, setPlayers] = useState<string[]>([]);
    const [user1, setUser1] = useState("");
    const [user2, setUser2] = useState("");
    const [user3, setUser3] = useState("");
    const [user4, setUser4] = useState("");
    const [homeScore, setHomeScore] = useState(0);
    const [awayScore, setAwayScore] = useState(0);
    const [error, setError] = useState<string>("");

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
              `${import.meta.env.VITE_API_URL}/leagues/${match.league}`
            );
            setPlayers(response.data.players);
          } catch (error) {
            console.error("Error fetching players:", error);
            setError("Error in fetch");
          }
        };
        fetchPlayers();
      }
    }, [match]);

    const handleSubmit = async () => {
      const body = {
        ...match,
        played: true,
        result1: homeScore,
        result2: awayScore,
        home_player_1: user1,
        away_player_1: user2,
        home_player_2: user3 ? user3 : null,
        away_player_2: user4 ? user4 : null,
        winner:
          homeScore > awayScore ? match.home_team_name : match.away_team_name,
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
                    {match.home_team_result} - {match.away_team_result}
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
                    setUser1(e.target.value);
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
                    setUser3(e.target.value);
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
                    setUser2(e.target.value);
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
                    setUser4(e.target.value);
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
      <h1>Tournaments</h1>
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
