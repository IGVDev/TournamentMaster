import {
  Button,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "wouter";

export const PlayerList = () => {
  const getPlayerList = async () => {
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/players`);
    return data;
  };

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["playerList"],
    queryFn: () => getPlayerList(),
  });

  if (isPending) {
    return <>Loading...</>;
  }

  if (isError) {
    return <>Something has gone wrong. {error.message}</>;
  }

  return (
    <div>
      <Heading>Players</Heading>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Player Name</Th>
              <Th>League</Th>
              <Th>Edit</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((player) => (
              <Tr>
                <Td>{player.name}</Td>
                <Td>{player.league}</Td>
                <Td>
                  <Link to={`/${player.id}`}>
                    <Button>Edit</Button>
                  </Link>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
};
