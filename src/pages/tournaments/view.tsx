import { Flex, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link, useParams } from "wouter";

export const TournamentView = () => {
  const params = useParams();
  const tournamentId = Number(params.id);

  const getMatches = async (id: number) => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/matches/tournament/${id}`
    );
    return data;
  };

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["tournamentMatches", tournamentId],
    queryFn: () => getMatches(tournamentId),
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <>Something has gone wrong. {error.message}</>;
  }

  return (
    <Flex className="rounds">
      {data.map((round, index: number) => (
        <Flex className="roundContainer">
          <Flex className="round">
            <Text>Round {index + 1}</Text>
            {data[index].map((match) => (
              <Link to={`/view/match/${match.id}`} className="match">
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
              </Link>
            ))}
          </Flex>
        </Flex>
      ))}
      <Flex className="roundContainer">
        <Flex className="round">
          <Text>Champion</Text>
          <Flex className="match">
            <Flex className="team" bg="gray.400" _dark={{ bg: "gray.600" }}>
              {data[data.length - 1][0].winner || "TBD"}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
