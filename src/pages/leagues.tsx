import { useAuth0 } from "@auth0/auth0-react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

interface League {
  id: number;
  name: string;
  players: string[];
}

export const Leagues = () => {
  const [name, setName] = useState("");
  const [players, setPlayers] = useState("");
  const [action, setAction] = useState("view");
  const [leagues, setLeagues] = useState([]);

  const getLeagues = async () => {
    try {
      axios
        .get(`${import.meta.env.VITE_API_URL}/leagues`, {})
        .then((response) => {
          setLeagues(response.data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  // const getUserLeagues = async () => {
  //   try {
  //     axios
  //       .get(`${import.meta.env.VITE_API_URL}/leagues/user`, {
  //         headers: {
  //           Authorization: `Bearer ${await getAccessTokenSilently()}`,
  //         },
  //       })
  //       .then((response) => {
  //         setLeagues(response.data);
  //       });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    getLeagues();
  }, []);

  const { getAccessTokenSilently } = useAuth0();

  const handleSubmit = async () => {
    const names = players.split("\n");
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/leagues/create`,
        {
          name,
          players: names,
        },
        {
          headers: {
            Authorization: `Bearer ${await getAccessTokenSilently()}`,
          },
        }
      )
      .then(() => {
        setName("");
        setPlayers("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Flex flexDir="column" w="100%">
      <Heading fontSize={{ base: "md", sm: "lg", md: "xl" }}>Leagues</Heading>
      {action === "view" && (
        <Flex flexDir="column" p={4}>
          {leagues.length > 0 && (
            <TableContainer>
              <Table variant="striped" colorScheme="teal" w="100%">
                <Thead>
                  <Text>Your leagues</Text>
                  <Tr>
                    <Th>League Name</Th>
                    {/* <Th>Player Count</Th> */}
                    {/* <Th>Edit</Th> */}
                  </Tr>
                </Thead>
                <Tbody>
                  {leagues.map((league: League) => {
                    return (
                      <Tr key={league.id}>
                        <Td>
                          <Text>{league.name}</Text>
                        </Td>
                        <Td>{/* <button>Edit</button> */}</Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          )}
          {leagues.length === 0 && (
            <Box>
              <Text>You haven't created any leagues yet.</Text>
              <Button
                bgColor={"purple.700"}
                p={2}
                borderRadius={12}
                m={2}
                onClick={() => setAction("create")}
              >
                Create one now
              </Button>
            </Box>
          )}
        </Flex>
      )}
      {action === "create" && (
        <Flex flexDir="column">
          <Box>Create League</Box>
          <FormControl>
            <Flex flexDir="column">
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <FormLabel>Players</FormLabel>
              <Textarea
                value={players}
                onChange={(e) => setPlayers(e.target.value)}
              />

              <Flex>
                <button onClick={handleSubmit}>Create</button>

                <button>Cancel</button>
              </Flex>
            </Flex>
          </FormControl>
        </Flex>
      )}
    </Flex>
  );
};
