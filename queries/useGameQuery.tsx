import { useQuery } from "@tanstack/react-query";
import useNearContext from "../context/NearContext";

export default function useGameQuery(gameIndex?: string, opts?: any) {
  const { contract } = useNearContext();

  return useQuery(
    ["games", gameIndex],
    () => {
      if (!gameIndex) {
        return;
      }

      return contract?.getGameByIndex?.({ gameIndex: parseInt(gameIndex, 10) });
    },
    {
      enabled: !!contract && !!gameIndex,
      ...opts,
    }
  );
}
