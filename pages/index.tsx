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
import useNearContext, { Game } from "../context/NearContext";
import useAvailableGamesQuery from "../queries/useAvailableGamesQuery";
import useCreateGameMutation from "../queries/useCreateGameMutation";
import useGamesQuery from "../queries/useGamesQuery";
import useJoinGameMutation from "../queries/useJoinGameMutation";

const Home: NextPage = () => {
  const { push } = useRouter();
  const { accountId } = useNearContext();
  const { data, isLoading } = useGamesQuery();

  const [createGameOpen, setCreateGameOpen] = useState(false);
  const onCreateGameClose = () => setCreateGameOpen(false);
  const onCreateGameOpen = () => setCreateGameOpen(true);

  const createGameMutation = useCreateGameMutation();
  const joinGameMutation = useJoinGameMutation();

  const participatingInGame = (game: Game) =>
    game.p1 === accountId || game.p2 === accountId;

  return (
    <Layout>
      {!isLoading && !data?.length && (
        <Card>
          <Card.Body>No available games.</Card.Body>
          <Card.Footer>
            <Row justify="flex-end">
              <Button size="sm" onClick={onCreateGameOpen}>
                Create a Game
              </Button>
            </Row>
          </Card.Footer>
        </Card>
      )}

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

      <Spacer y={1} />

      {!isLoading &&
        data?.reverse().map((game, index) => (
          <Fragment key={index}>
            <Card>
              <Card.Header>
                Game{" "}
                {!!game.winner ? (
                  "Finished"
                ) : (
                  <>{!!game.p1 && !!game.p2 ? "In progress" : "Available"}</>
                )}
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
                        gameIndex: index,
                        amount: game.deposit,
                      })
                    }
                    disabled={
                      accountId === game.p1 ||
                      (!!game.p1 && !!game.p2) ||
                      (joinGameMutation.isLoading &&
                        joinGameMutation.variables?.gameIndex === index)
                    }
                  >
                    {joinGameMutation.isLoading &&
                    joinGameMutation.variables?.gameIndex === index ? (
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
                    onClick={() => push(`/game/${index}/play`)}
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
        onCreate={(deposit) => createGameMutation.mutate(deposit)}
        open={createGameOpen}
        onClose={onCreateGameClose}
      />
    </Layout>
  );
};

export default Home;
