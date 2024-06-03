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
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "wouter";

export const PlayerList = () => {
  const [playerList, setPlayerList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  const getPlayerList = async () => {
    try {
      setIsLoading(true);
      axios.get(`${import.meta.env.VITE_API_URL}/players`).then((response) => {
        setPlayerList(response.data);
        setIsLoading(false);
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPlayerList();
  }, [page]);

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
            {playerList.map((player) => (
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
