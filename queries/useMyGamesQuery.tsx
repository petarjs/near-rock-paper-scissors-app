import { useQuery } from "@tanstack/react-query";
import useNearContext from "../context/NearContext";

export default function useMyGamesQuery() {
  const { accountId, contract } = useNearContext();

  return useQuery(
    ["games", "my", accountId],
    () => contract?.getMyGamesInProgress?.({ accountId }),
    {
      enabled: !!contract,
    }
  );
}
