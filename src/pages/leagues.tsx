import { useAuth0 } from "@auth0/auth0-react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Progress,
  Spinner,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { ClipLoader, PacmanLoader, SyncLoader } from "react-spinners";

interface League {
  id: number;
  name: string;
  players: string[];
}

export const Leagues = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [players, setPlayers] = useState("");
  const [action, setAction] = useState("view");
  const [leagues, setLeagues] = useState([]);

  const color = useColorModeValue("black", "white");

  const getLeagues = async () => {
    try {
      setIsLoading(true);
      axios
        .get(`${import.meta.env.VITE_API_URL}/leagues`, {})
        .then((response) => {
          setLeagues(response.data);
          setIsLoading(false);
        });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
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
    <Flex flexDir="column" w="100%" align="center">
      <Heading fontSize={{ base: "md", sm: "lg", md: "xl" }}>Leagues</Heading>
      {action === "view" && (
        <Flex flexDir="column" p={4} alignItems={"center"}>
          <Button
            bgColor={"purple.700"}
            borderRadius={12}
            onClick={() => setAction("create")}
          >
            Create new league
          </Button>
          {isLoading && <SyncLoader color={color} />}
          {!isLoading && leagues.length > 0 && (
            <TableContainer>
              <Table variant="striped" colorScheme="purple" w="100%">
                <Thead>
                  <Tr>
                    <Th>League Name</Th>
                    <Th>Edit</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {leagues.map((league: League) => {
                    return (
                      <Tr key={league.id}>
                        <Td>
                          <Text>{league.name}</Text>
                        </Td>
                        <Td>
                          <button>Edit</button>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          )}
          {!isLoading && leagues.length === 0 && (
            <Box>
              <Text>You haven't created any leagues yet.</Text>
            </Box>
          )}
        </Flex>
      )}
      {action === "create" && (
        <Flex flexDir="column" justifyContent="center" w="50%">
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

              <Flex mt={4} gap={4}>
                <Button w="50%">Cancel</Button>
                <Button w="50%" onClick={handleSubmit} bgColor={"purple.700"}>
                  Create
                </Button>
              </Flex>
            </Flex>
          </FormControl>
        </Flex>
      )}
    </Flex>
  );
};
