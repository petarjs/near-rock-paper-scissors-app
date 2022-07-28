import { useQuery } from "@tanstack/react-query";
import useNearContext from "../context/NearContext";

export default function useGamesQuery() {
  const { contract } = useNearContext();

  return useQuery(["games", "all"], () => contract?.getGames?.(), {
    enabled: !!contract,
  });
}
