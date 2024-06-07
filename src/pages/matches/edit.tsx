import { useAuth0 } from "@auth0/auth0-react";
import {
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  List,
  ListItem,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Text,
} from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Link, useParams } from "wouter";

export const MatchView = () => {
  const params = useParams();
  const matchId = Number(params.id);
  const [match, setMatch] = useState<object | null>({});
  const [action, setAction] = useState("view");
  const [players, setPlayers] = useState<string[]>([]);
  const [home_player_1, sethome_player_1] = useState("");
  const [away_player_1, setaway_player_1] = useState("");
  const [home_player_2, sethome_player_2] = useState("");
  const [away_player_2, setaway_player_2] = useState("");
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);

  const { getAccessTokenSilently } = useAuth0();

  const getMatch = async (matchId: number) => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/matches/${matchId}`
    );
    setMatch(data);
    return data;
  };

  const getLeaguePlayerList = async (matchLeagueId: number) => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/leagues/users/${matchLeagueId}`,
      {
        headers: {
          Authorization: `Bearer ${await getAccessTokenSilently()}`,
        },
      }
    );
    return data;
  };

  const {
    data: matchData,
    isPending: isMatchPending,
    isError: isMatchError,
    error: matchError,
    refetch: refetchMatch,
  } = useQuery({
    queryKey: ["match", matchId],
    queryFn: () => getMatch(Number(matchId)),
    staleTime: Infinity,
  });

  const {
    data: playerListData,
    isPending: isPlayerListPending,
    isError: isPlayerListError,
    error: playerListError,
  } = useQuery({
    queryKey: ["leaguePlayerList", matchData?.league],
    queryFn: () => getLeaguePlayerList(matchData.league),
    enabled: !!matchData?.league,
  });

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
    mutateMatch.mutate(body);
  };

  const mutateMatch = useMutation({
    mutationFn: async (editedMatch) => {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/matches/tournament/match/${matchData.id}`,
        editedMatch,
        {
          headers: {
            Authorization: `Bearer ${await getAccessTokenSilently()}`,
          },
        }
      );
      return data;
    },
    onSuccess: () => {
      setAction("view");
      refetchMatch();
    },
    onError: () => {
      console.log("Oops.");
    },
  });

  if (isPlayerListPending || isMatchPending) {
    return <>Loading...</>;
  }

  if (isPlayerListError || isMatchError) {
    return <>Something has gone wrong.</>;
  }

  return (
    <div>
      {matchData && action === "view" && (
        <Flex flexDir="column" p={4} gap={4}>
          <Heading>
            {matchData.home_team_name} {matchData.home_result || ""} -{" "}
            {matchData.away_result || ""} {matchData.away_team_name}
          </Heading>
          {matchData.played ? (
            <Flex flexDir="column" className={"statsContainer"} gap={4}>
              <Heading size="md">Players</Heading>
              <Flex
                className="playersContainer"
                fontSize={"xl"}
                fontWeight="bold"
                w="100%"
              >
                <Flex flexDir="column" w="50%" borderRight="1px">
                  <List>
                    <ListItem>
                      <Link to={`~/players/view/${matchData.home_player_1}`}>
                        {matchData.home_player_1}
                      </Link>
                    </ListItem>
                    <ListItem>
                      <Link to={`~/players/view/${matchData.home_player_2}`}>
                        {matchData.home_player_2}
                      </Link>
                    </ListItem>
                  </List>
                </Flex>
                <Flex flexDir="column" w="50%">
                  <List>
                    <ListItem>
                      <Link to={`~/players/view/${matchData.away_player_1}`}>
                        {matchData.away_player_1}
                      </Link>
                    </ListItem>
                    <ListItem>
                      <Link to={`~/players/view/${matchData.away_player_2}`}>
                        {matchData.away_player_2}
                      </Link>
                    </ListItem>
                  </List>
                </Flex>
              </Flex>
            </Flex>
          ) : (
            <Text fontWeight={600}>Not played</Text>
          )}
          <Button onClick={() => setAction("edit")}>Edit</Button>
        </Flex>
      )}
      {matchData && action === "edit" && (
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
                defaultValue={match.home_result}
                min={0}
                onChange={(valueString) => setHomeScore(parseInt(valueString))}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

              <FormLabel>Result {match.away_team_name}</FormLabel>
              <NumberInput
                defaultValue={match.away_result}
                min={0}
                onChange={(valueString) => setAwayScore(parseInt(valueString))}
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
                defaultValue={match.home_player_1}
                onChange={(e) => {
                  sethome_player_1(e.target.value);
                }}
              >
                {playerListData.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </Select>
              <Select
                placeholder="Select player"
                defaultValue={match.home_player_2}
                onChange={(e) => {
                  sethome_player_2(e.target.value);
                }}
              >
                {playerListData.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </Select>

              <FormLabel>{match.away_team_name} Players</FormLabel>
              <Select
                placeholder="Select player"
                defaultValue={match.away_player_1}
                onChange={(e) => {
                  setaway_player_1(e.target.value);
                }}
              >
                {playerListData.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </Select>
              <Select
                placeholder="Select player"
                defaultValue={match.away_player_2}
                onChange={(e) => {
                  setaway_player_2(e.target.value);
                }}
              >
                {playerListData.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
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
