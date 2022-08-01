import { useQuery } from "@tanstack/react-query";
import useNearContext from "../context/NearContext";

export default function useGameQuery(gamePin?: string, opts?: any) {
  const { contract } = useNearContext();

  return useQuery(
    ["games", gamePin],
    () => {
      if (!gamePin) {
        return;
      }

      return contract?.getGameByPin?.({ gamePin });
    },
    {
      enabled: !!contract && !!gamePin,
      ...opts,
    }
  );
}
