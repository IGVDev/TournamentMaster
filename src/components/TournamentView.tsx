import { Box, Flex, HStack, Heading, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";

export const TournamentView = () => {
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

  // Group matches by round
  const matchesByRound = matches.reduce((acc, match) => {
    const round = match.round;
    if (!acc[round]) {
      acc[round] = [match];
    } else {
      acc[round].push(match);
    }
    return acc;
  }, {});

  const TournamentTree = () => {
    return (
      <Flex justifyContent={"space-between"}>
        {Object.keys(matchesByRound)
          .sort()
          .map((round) => (
            <Flex key={round} alignItems={"center"} flexDir={"column"}>
              <h2>Round {round}</h2>
              <Flex id={"matches"} flexDir="column" alignItems={"center"}>
                {matchesByRound[round].map((match) => (
                  <Flex key={match.id} alignItems="center" margin-bottom={"20px"}>
                    <Box width={"100px"} textAlign={"center"}>
                      <Text>{match.home_team_name}</Text>
                    </Box>
                    <Box width={"100px"} textAlign={"center"}>
                      <Text>{match.away_team_name}</Text>
                    </Box>
                  </Flex>
                ))}
              </Flex>
            </Flex>
          ))}
      </Flex>
    );
  };

  return (
    <VStack>
      <Heading>{tournament?.name}</Heading>
      <TournamentTree />
    </VStack>
  );
};
