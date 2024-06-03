import {
  Button,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "wouter";
import "./styles.css";

export const TournamentList = () => {
  const colors = useColorModeValue("gray.200", "gray.700");

  const getTournamentList = async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/tournaments`
    );
    return data;
  };

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["tournaments"],
    queryFn: () => getTournamentList(),
  });

  if (isPending) {
    return <>Loading...</>;
  }

  if (isError) {
    return <>Something has gone wrong. {error.message}</>;
  }

  return (
    <Flex flexDir="column" maxW="50%">
      <Button
        p={2}
        fontWeight={700}
        bgColor={colors}
        alignContent={"center"}
        justifyContent={"center"}
      >
        Create new tournament
      </Button>
      {
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
              {data.map((tournament: any) => {
                return (
                  <Link to={`/view/${tournament.id}`} asChild>
                    <Tr key={tournament.id}>
                      <Td>{tournament.name}</Td>
                      <Td>{tournament.league}</Td>
                      <Td>{tournament.type}</Td>
                      <Td>{tournament.finished || "false"}</Td>
                    </Tr>
                  </Link>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      }
    </Flex>
  );
};
