import { useMutation, useQueryClient } from "@tanstack/react-query";
import { utils } from "near-api-js";
import useAuthContext from "../context/AuthContext";
import useNearContext from "../context/NearContext";

export default function useCreateGameMutation() {
  const queryClient = useQueryClient();
  const { contract, accountId } = useNearContext();
  const { isSignedIn } = useAuthContext();

  async function createGame({
    deposit,
    pin,
  }: {
    deposit: string;
    pin: string;
  }) {
    if (!isSignedIn()) {
      console.log("not signed in");
      throw Error("Not signed in");
    }

    return contract?.createGame?.({
      amount: utils.format.parseNearAmount(deposit),
      args: { gamePin: pin },
    });
  }

  return useMutation(createGame, {
    onSuccess() {
      queryClient.invalidateQueries(["games", "my", accountId]);
    },
  });
}
