import { useMutation } from "@tanstack/react-query";
import useAuthContext from "../context/AuthContext";
import useNearContext from "../context/NearContext";

export default function usePlayGameMutation() {
  const { contract } = useNearContext();
  const { isSignedIn } = useAuthContext();

  async function playGame({
    gamePin,
    moveHash,
  }: {
    gamePin: string;
    moveHash: string;
  }) {
    if (!isSignedIn()) {
      console.log("not signed in");
      throw Error("Not signed in");
    }

    return contract?.play?.({
      args: { moveHash, gamePin },
    });
  }

  return useMutation(playGame);
}
