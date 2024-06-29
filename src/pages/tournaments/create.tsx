import { useAuth0 } from "@auth0/auth0-react";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { navigate } from "wouter/use-browser-location";

export const CreateTournament = () => {
  const [name, setName] = useState("");
  const [league, setLeague] = useState("");
  const [teams, setTeams] = useState("");
  const [type, setType] = useState("");

  const [leagueList, setLeagueList] = useState([]);
  const [tournamentListArray, setTournamentListArray] = useState([]);

  const { getAccessTokenSilently } = useAuth0();

  const loadLeagues = async () => {
    try {
      axios
        .get(`${import.meta.env.VITE_API_URL}/leagues/user`, {
          headers: {
            Authorization: `Bearer ${await getAccessTokenSilently()}`,
          },
        })
        .then((response) => {
          setLeagueList(response.data);
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
          setTournamentListArray(response.data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    const teamNames = teams.trim().split("\n");

    if (teamNames.length % 2 !== 0) {
      alert("Number of teams must be even");
      return;
    }

    const body = {
      name,
      league: league,
      teams: teamNames,
      type,
    };
    axios
      .post(`${import.meta.env.VITE_API_URL}/tournaments/create`, body, {
        headers: {
          Authorization: `Bearer ${await getAccessTokenSilently()}`,
        },
      })
      .then((res) => {
        setName("");
        setLeague("");
        setTeams("");
        setType("knockout");
        navigate(`/tournaments/view/${res.data.id}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    loadTournaments();
    loadLeagues();
  }, []);

  return (
    <Box>
      Create a new tournament
      <FormControl>
        <Flex flexDir="column">
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <FormLabel>League</FormLabel>
          <Select
            placeholder="Select league"
            onChange={(e) => {
              setLeague(e.target.value);
            }}
          >
            {leagueList.map((league: any) => (
              <option key={league._id} value={league._id}>
                {league.name}
              </option>
            ))}
          </Select>

          <FormLabel>Teams</FormLabel>
          <Textarea value={teams} onChange={(e) => setTeams(e.target.value)} />

          <FormLabel>Type</FormLabel>
          <Select onChange={(e) => setType(e.target.value)}>
            <option value="knockout">Knockout</option>
            <option value="league">League</option>
          </Select>
          <Button onClick={handleSubmit}>Create</Button>
          <Link to={"/"} asChild>
            <Button>Cancel</Button>
          </Link>
        </Flex>
      </FormControl>
    </Box>
  );
};
