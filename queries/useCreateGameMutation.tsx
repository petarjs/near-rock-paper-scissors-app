import { useMutation } from "@tanstack/react-query";
import { utils } from "near-api-js";
import useAuthContext from "../context/AuthContext";
import useNearContext from "../context/NearContext";

export default function useCreateGameMutation() {
  const { contract } = useNearContext();
  const { isSignedIn } = useAuthContext();

  async function createGame(deposit: string) {
    if (!isSignedIn) {
      console.log("not signed in");
      throw Error("Not signed in");
    }

    return contract?.createGame?.({
      amount: utils.format.parseNearAmount(deposit),
      args: {},
    });
  }

  return useMutation(createGame);
}
