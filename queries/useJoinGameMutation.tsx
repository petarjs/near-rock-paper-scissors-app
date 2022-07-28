import { useMutation } from "@tanstack/react-query";
import useAuthContext from "../context/AuthContext";
import useNearContext from "../context/NearContext";

export default function useJoinGameMutation() {
  const { contract } = useNearContext();
  const { isSignedIn } = useAuthContext();

  async function joinGame({
    gameIndex,
    amount,
  }: {
    gameIndex: number;
    amount: string;
  }) {
    if (!isSignedIn) {
      console.log("not signed in");
      throw Error("Not signed in");
    }

    return contract?.joinGame?.({
      args: { gameIndex },
      amount,
    });
  }

  return useMutation(joinGame);
}
