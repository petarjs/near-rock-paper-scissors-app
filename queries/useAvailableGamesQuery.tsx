import { useQuery } from "@tanstack/react-query";
import useNearContext from "../context/NearContext";

export default function useAvailableGamesQuery() {
  const { contract } = useNearContext();

  return useQuery(
    ["games", "available"],
    () => contract?.getAvailableGames?.(),
    {
      enabled: !!contract,
    }
  );
}
