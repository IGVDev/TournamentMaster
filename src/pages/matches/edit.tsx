import { useAuth0 } from "@auth0/auth0-react";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useParams } from "wouter";

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
  } = useQuery({
    queryKey: ["match", matchId],
    queryFn: () => getMatch(Number(matchId)),
  });

  const queryEnabled = matchData?.league;

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
    axios.put(
      `${import.meta.env.VITE_API_URL}/matches/tournament/match/${matchData.id}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${await getAccessTokenSilently()}`,
        },
      }
    );
  };

  if (isPlayerListPending || isMatchPending) {
    return <>Loading...</>;
  }

  if (isPlayerListError || isMatchError) {
    return <>Something has gone wrong.</>;
  }

  return (
    <div>
      {matchData && action === "view" && (
        <Flex flexDir="column" p={4}>
          <Text
            fontSize={{
              base: "md",
              sm: "lg",
              md: "xl",
            }}
          >
            {matchData.home_team_name} vs {matchData.away_team_name}
            {matchData.played ? (
              <Flex flexDir="column">
                <Text fontWeight={600}>
                  {matchData.home_result} - {matchData.away_result}
                </Text>
                <Text>
                  {matchData.home_player_1} and {matchData.home_player_2} vs{" "}
                  {matchData.away_player_1} and {matchData.away_player_2}
                </Text>
                <Text>
                  Winners:{" "}
                  {matchData.winner === matchData.home_team_name ? (
                    <Text>
                      {matchData.home_player_1} and {matchData.home_player_2}
                    </Text>
                  ) : (
                    <Text>
                      {matchData.away_player_1} and {matchData.away_player_2}
                    </Text>
                  )}{" "}
                  {matchData.winner}
                </Text>
              </Flex>
            ) : (
              <Text fontWeight={600}>Not played</Text>
            )}
          </Text>
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
              <FormLabel>Result {matchData.home_team_name}</FormLabel>
              <NumberInput
                defaultValue={0}
                min={0}
                onChange={(valueString) => setHomeScore(parseInt(valueString))}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

              <FormLabel>Result {matchData.away_team_name}</FormLabel>
              <NumberInput
                defaultValue={0}
                min={0}
                onChange={(valueString) => setAwayScore(parseInt(valueString))}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

              <FormLabel>{matchData.home_team_name} Players</FormLabel>
              <Select
                placeholder="Select player"
                onChange={(e) => {
                  sethome_player_1(e.target.value);
                }}
              >
                {playerListData.map((player) => (
                  <option key={player.id} value={player.name}>
                    {player.name}
                  </option>
                ))}
              </Select>
              <Select
                placeholder="Select player"
                onChange={(e) => {
                  sethome_player_2(e.target.value);
                }}
              >
                {playerListData.map((player) => (
                  <option key={player.id} value={player.name}>
                    {player.name}
                  </option>
                ))}
              </Select>

              <FormLabel>{matchData.away_team_name} Players</FormLabel>
              <Select
                placeholder="Select player"
                onChange={(e) => {
                  setaway_player_1(e.target.value);
                }}
              >
                {playerListData.map((player) => (
                  <option key={player} value={player}>
                    {player.name}
                  </option>
                ))}
              </Select>
              <Select
                placeholder="Select player"
                onChange={(e) => {
                  setaway_player_2(e.target.value);
                }}
              >
                {playerListData.map((player) => (
                  <option key={player} value={player}>
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