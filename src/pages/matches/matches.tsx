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

export const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [, setTournaments] = useState([]);
  const [action] = useState("view");

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
