import {
  Box,
  Flex,
  Heading,
  List,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "wouter";

export const PlayerView = () => {
  const params = useParams();
  const playerId = Number(params.id);

  const getPlayer = async (id: number) => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/players/${id}`
    );
    return data[0];
  };

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["player", playerId],
    queryFn: () => getPlayer(playerId),
  });

  if (isPending) {
    return <>Loading...</>;
  }

  if (isError) {
    return <>Something has gone wrong. {error.message}</>;
  }

  return (
    <Flex alignItems="start" flexDirection="column">
      <Heading size="3xl">{data.name}</Heading>
      <Heading size="lg">Matches</Heading>
      <Text>Played: {data.matches_played}</Text>
      <Heading size="lg">Goals</Heading>
      <Text>For: {data.goals_scored}</Text>
      <Text>Against: {data.goals_against}</Text>
    </Flex>
  );
};
