import { useMutation } from "@tanstack/react-query";
import useAuthContext from "../context/AuthContext";
import useNearContext from "../context/NearContext";

export default function usePlayGameMutation() {
  const { contract } = useNearContext();
  const { isSignedIn } = useAuthContext();

  async function playGame({
    gameIndex,
    moveHash,
  }: {
    gameIndex: string;
    moveHash: string;
  }) {
    if (!isSignedIn) {
      console.log("not signed in");
      throw Error("Not signed in");
    }

    return contract?.play?.({
      args: { moveHash, gameIndex: parseInt(gameIndex, 10) },
    });
  }

  return useMutation(playGame);
}
