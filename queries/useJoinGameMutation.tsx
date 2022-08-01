import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthContext from "../context/AuthContext";
import useNearContext from "../context/NearContext";

export default function useJoinGameMutation() {
  const queryClient = useQueryClient();
  const { contract, accountId } = useNearContext();
  const { isSignedIn } = useAuthContext();

  async function joinGame({
    gamePin,
    amount,
  }: {
    gamePin: string;
    amount: string;
  }) {
    if (!isSignedIn()) {
      console.log("not signed in");
      throw Error("Not signed in");
    }

    return contract?.joinGame?.({
      args: { gamePin },
      amount,
    });
  }

  return useMutation(joinGame, {
    onSuccess() {
      queryClient.invalidateQueries(["games", "all"]);
      queryClient.invalidateQueries(["games", "my", accountId]);
    },
  });
}
