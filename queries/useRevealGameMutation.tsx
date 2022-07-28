import { useMutation } from "@tanstack/react-query";
import useAuthContext from "../context/AuthContext";
import useNearContext from "../context/NearContext";

export default function useRevealGameMutation() {
  const { contract } = useNearContext();
  const { isSignedIn } = useAuthContext();

  async function playGame({
    gameIndex,
    moveRaw,
  }: {
    gameIndex: string;
    moveRaw: string;
  }) {
    if (!isSignedIn) {
      console.log("not signed in");
      throw Error("Not signed in");
    }

    return contract?.reveal?.({
      args: { moveRaw, gameIndex: parseInt(gameIndex, 10) },
    });
  }

  return useMutation(playGame);
}
