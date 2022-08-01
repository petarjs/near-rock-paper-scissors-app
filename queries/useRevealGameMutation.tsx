import { useMutation } from "@tanstack/react-query";
import useAuthContext from "../context/AuthContext";
import useNearContext from "../context/NearContext";

export default function useRevealGameMutation() {
  const { contract } = useNearContext();
  const { isSignedIn } = useAuthContext();

  async function playGame({
    gamePin,
    moveRaw,
  }: {
    gamePin: string;
    moveRaw: string;
  }) {
    if (!isSignedIn()) {
      console.log("not signed in");
      throw Error("Not signed in");
    }

    return contract?.reveal?.({
      args: { moveRaw, gamePin },
    });
  }

  return useMutation(playGame);
}
