import { useAuth0 } from "@auth0/auth0-react";
import { Flex, Table, Text, Th, Thead, Tr } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

interface IMatch {
  id: number;
  tournament: string;
  team1: string;
  team2: string;
  date: string;
  time: string;
  player1: string;
  player2: string;
  player3?: string;
  player4?: string;
}

interface ITournament {
  id: number;
  name: string;
  league: string;
  teams: string[];
  type: string;
}

export const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [tournament, setTournament] = useState("");
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [player3, setPlayer3] = useState("");
  const [player4, setPlayer4] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [action, setAction] = useState("view");

  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const loadMatches = async () => {
    try {
      axios
        .get(`${import.meta.env.VITE_API_URL}/matches`, {
          // headers: {
          //   Authorization: `Bearer ${await getAccessTokenSilently()}`,
          // },
        })
        .then((response) => {
          setMatches(response.data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const loadTournaments = async () => {
    try {
      axios
        .get(`${import.meta.env.VITE_API_URL}/tournaments`, {
          // headers: {
          //   Authorization: `Bearer ${await getAccessTokenSilently()}`,
          // },
        })
        .then((response) => {
          setTournaments(response.data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadMatches();
    loadTournaments();
  }, []);

  return (
    <Flex flexDir="column">
      <h1>Matches</h1>
      {action === "view" && (
        <Flex flexDir="column">
          <Table>
            <Thead>
              <Tr>
                <Th>League</Th>
                <Th>Tournament</Th>
                <Th>Home Team</Th>
                <Th>HG</Th>
                <Th>AG</Th>
                <Th>Away Team</Th>
                <Th>Date</Th>
                <Th>Time</Th>
                <Th>P1</Th>
                <Th>P3</Th>
                <Th>P2</Th>
                <Th>P4</Th>
                <Th></Th>
              </Tr>
            </Thead>

            {matches.length > 0 &&
              matches.map((match: IMatch) => (
                <Tr key={match.id}>
                  <Th>{match.tournament}</Th>
                  <Th>{match.team1}</Th>
                  <Th>{match.team2}</Th>
                  <Th>{match.date}</Th>
                  <Th>{match.time}</Th>
                  <Th>{match.player1}</Th>
                  <Th>{match.player2}</Th>
                  <Th>{match.player3}</Th>
                  <Th>{match.player4}</Th>
                </Tr>
              ))}
          </Table>
          {matches.length === 0 && <Text>No matches yet</Text>}
        </Flex>
      )}
    </Flex>
  );
};
