import {
  Button,
  Card,
  Col,
  Grid,
  Loading,
  Progress,
  Row,
  Spacer,
  Spinner,
  Text,
} from "@nextui-org/react";
import { utils } from "near-api-js";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import CreateGameModal from "../components/CreateGameModal";
import Layout from "../components/layout/Layout";
import useAuthContext from "../context/AuthContext";
import useNearContext, { Game } from "../context/NearContext";
import useCreateGameMutation from "../queries/useCreateGameMutation";
import useGamesQuery from "../queries/useGamesQuery";
import useJoinGameMutation from "../queries/useJoinGameMutation";
import useMyGamesQuery from "../queries/useMyGamesQuery";

const Home: NextPage = () => {
  const { push } = useRouter();
  const { accountId } = useNearContext();
  const { isSignedIn, signIn } = useAuthContext();
  const { data: availableGames, isLoading } = useGamesQuery();
  const { data: myGames, isLoading: isLoadingMyGames } = useMyGamesQuery();

  const [gameFilter, setGameFilter] = useState<"available" | "my">("available");

  const [createGameOpen, setCreateGameOpen] = useState(false);
  const onCreateGameClose = () => setCreateGameOpen(false);
  const onCreateGameOpen = () => {
    if (!isSignedIn()) {
      signIn();
      return;
    }
    setCreateGameOpen(true);
  };

  const createGameMutation = useCreateGameMutation();
  const joinGameMutation = useJoinGameMutation();

  const games = gameFilter === "available" ? availableGames : myGames;

  console.log({ availableGames, myGames });

  const participatingInGame = (game: Game) =>
    game.p1 === accountId || game.p2 === accountId;

  return (
    <Layout>
      <Row css={{ "@xsMax": { flexDirection: "column" } }}>
        <Button
          ghost={gameFilter !== "available"}
          onClick={() => setGameFilter("available")}
          color="gradient"
        >
          Available Games
        </Button>
        <Spacer x={1} />
        <Button
          ghost={gameFilter !== "my"}
          onClick={() => setGameFilter("my")}
          color="gradient"
        >
          My Games
        </Button>
      </Row>

      {gameFilter === "available" && !isLoading && !availableGames?.length && (
        <>
          <Spacer y={1} />

          <Card>
            <Card.Body>No available games.</Card.Body>
            <Card.Footer>
              <Row justify="flex-end">
                <Button size="sm" onClick={onCreateGameOpen} color="gradient">
                  Create a Game
                </Button>
              </Row>
            </Card.Footer>
          </Card>
        </>
      )}

      {gameFilter === "my" && !isLoadingMyGames && !myGames?.length && (
        <>
          <Spacer y={1} />

          <Card>
            <Card.Body>No available games.</Card.Body>
            <Card.Footer>
              <Row justify="flex-end">
                <Button size="sm" onClick={onCreateGameOpen} color="gradient">
                  Create a Game
                </Button>
              </Row>
            </Card.Footer>
          </Card>
        </>
      )}

      {!isLoading && !!availableGames?.length && (
        <Card>
          <Card.Body>
            <Row justify="flex-end">
              {isLoading && <Spinner />}
              <Button size="sm" onClick={onCreateGameOpen} color="gradient">
                Create a Game
              </Button>
            </Row>
          </Card.Body>
        </Card>
      )}

      <Spacer y={1} />

      {games?.reverse().map((game) => (
        <Fragment key={game.pin}>
          <Card>
            <Card.Header>
              <Row justify="space-between">
                <Text b>
                  Game{" "}
                  {!!game.winner ? (
                    "Finished"
                  ) : (
                    <>{!!game.p1 && !!game.p2 ? "In progress" : "Available"}</>
                  )}
                </Text>

                <Text b>pin: {game.pin}</Text>
              </Row>
            </Card.Header>
            <Card.Body>
              <Text size={24}>
                Play against{" "}
                <Text
                  b
                  css={{
                    textGradient: "45deg, $blue600 -20%, $pink600 50%",
                  }}
                >
                  {game.p1}
                </Text>{" "}
                for{" "}
                <Text
                  b
                  css={{
                    textGradient: "45deg, $blue600 -20%, $pink600 50%",
                  }}
                >
                  {" "}
                  {utils.format.formatNearAmount(game.deposit)} N
                </Text>
              </Text>
            </Card.Body>
            <Card.Footer>
              {!participatingInGame(game) && (
                <Button
                  color="gradient"
                  onClick={() =>
                    joinGameMutation.mutate({
                      gamePin: game.pin,
                      amount: game.deposit,
                    })
                  }
                  disabled={
                    accountId === game.p1 ||
                    (!!game.p1 && !!game.p2) ||
                    (joinGameMutation.isLoading &&
                      joinGameMutation.variables?.gamePin === game.pin)
                  }
                >
                  {joinGameMutation.isLoading &&
                  joinGameMutation.variables?.gamePin === game.pin ? (
                    <Loading color="currentColor" size="sm" />
                  ) : (
                    "Join"
                  )}
                </Button>
              )}

              {participatingInGame(game) && (
                <Button
                  ghost
                  color="gradient"
                  onClick={() => push(`/game/${game.pin}/play`)}
                >
                  Play
                </Button>
              )}
            </Card.Footer>
          </Card>
          <Spacer y={1} />
        </Fragment>
      ))}

      <CreateGameModal
        onCreate={({ deposit, pin }) =>
          createGameMutation.mutate({ deposit, pin })
        }
        open={createGameOpen}
        onClose={onCreateGameClose}
      />
    </Layout>
  );
};

export default Home;
