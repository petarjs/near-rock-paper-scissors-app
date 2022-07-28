import {
  Button,
  Card,
  Col,
  Row,
  Spacer,
  Spinner,
  Text,
} from "@nextui-org/react";
import { utils } from "near-api-js";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import Layout from "../../../components/layout/Layout";
import useNearContext, { Game } from "../../../context/NearContext";
import useInterval from "../../../hooks/useInterval";
import useGameQuery from "../../../queries/useGameQuery";
import usePlayGameMutation from "../../../queries/usePlayGameMutation";
import useRevealGameMutation from "../../../queries/useRevealGameMutation";
import sha256 from "../../../util/sha256";

const Play: NextPage = () => {
  const { push, query } = useRouter();
  const { accountId } = useNearContext();
  const [savedMove, setSavedMove] = useState("");
  const savedMoveParsed = savedMove?.split("-")[0];
  const [savedMoveValid, setSavedMoveValid] = useState(false);

  const gameIndex = query.gameId as string;
  const { data: game, isLoading } = useGameQuery(gameIndex, {
    refetchInterval: 1000,
  });
  const playMutation = usePlayGameMutation();
  const revealMutation = useRevealGameMutation();

  console.log({ game });

  const [move, setMove] = useState("");

  useEffect(() => {
    setSavedMove(
      localStorage[`${accountId}/game/${query.gameId as string}/move`]
    );
  }, [query.gameId]);

  useEffect(() => {
    async function main() {
      const hash = await sha256(savedMove);
      if (hash === game?.p1Hash || hash === game?.p2Hash) {
        setSavedMoveValid(true);
        setMove(savedMoveParsed);
      }
    }

    main();
  }, [savedMove, game]);

  useEffect(() => {
    const hashesSubmitted = game?.p1Hash && game?.p2Hash;
    const revealedMyMove =
      accountId === game?.p1 ? !!game?.p1Raw : !!game?.p2Raw;

    if (hashesSubmitted && !revealedMyMove) {
      revealMove();
    }
  }, [game, accountId]);

  const participatingInGame = (game?: Game) => {
    if (!game) {
      return false;
    }

    return game.p1 === accountId || game.p2 === accountId;
  };

  async function makeMove(move: string) {
    if (
      (game?.p1 === accountId && !!game?.p1Hash) ||
      (game?.p2 === accountId && !!game?.p2Hash)
    ) {
      return;
    }

    setMove(move);
  }

  async function playMove() {
    try {
      if (!savedMoveValid) {
        return;
      }

      const salt = Math.floor(Math.random() * 10 ** 10);
      const moveRaw = `${move}-${salt}`;
      localStorage[`${accountId}/game/${query.gameId as string}/move`] =
        moveRaw;
      const moveHash = await sha256(moveRaw);

      playMutation.mutate({ moveHash, gameIndex });
    } catch (error) {
      console.log({ error });
    }
  }

  async function revealMove() {
    const moveRaw =
      localStorage[`${accountId}/game/${query.gameId as string}/move`];
    revealMutation.mutate({ gameIndex, moveRaw });
  }

  const showPlay =
    !!move &&
    !(game?.p1 === accountId && !!game?.p1Hash) &&
    !(game?.p2 === accountId && !!game?.p2Hash);

  //   useEffect(() => {
  //     const nftFilter = [
  //       {
  //         account_id: "nft.nearapps.near",
  //         status: "SUCCESS",
  //         event: {
  //           standard: "nep171",
  //           event: "nft_mint",
  //         },
  //       },
  //       {
  //         account_id: "nft.nearapps.near",
  //         status: "SUCCESS",
  //         event: {
  //           standard: "nep171",
  //           event: "nft_transfer",
  //         },
  //       },
  //     ];

  //     const ws = new WebSocket("wss://events.near.stream/ws");
  //     ws.onopen = () => {
  //       console.log(`Connection to WS has been established`);
  //       ws.send(
  //         JSON.stringify({
  //           secret: "asdfasdf",
  //           filter: nftFilter,
  //           fetch_past_events: 20,
  //         })
  //       );
  //     };
  //     ws.onclose = () => {
  //       console.log(`WS Connection has been closed`);
  //     };
  //     ws.onmessage = (e) => {
  //       const data = JSON.parse(e.data);
  //       console.log(data);
  //     };
  //     ws.onerror = (err) => {
  //       console.log("WebSocket error", err);
  //     };
  //   }, []);

  const emojiMap = {
    rock: "🪨",
    paper: "📄",
    scissors: "✂️",
  };
  if (!isLoading && !participatingInGame(game)) {
    push("/");
    return null;
  }

  return (
    <Layout>
      <Row justify="center" align="center">
        <Col>
          <Card>
            <Card.Body>
              <Row justify="space-between">
                {isLoading && <Spinner />}
                {!isLoading && !!game && (
                  <Text
                    span
                    h3
                    b
                    css={{
                      textGradient: "45deg, $blue600 -20%, $pink600 50%",
                    }}
                  >
                    {accountId}
                  </Text>
                )}

                {!!game?.winner && accountId === game?.[game?.winner] && (
                  <Text b>WINNER</Text>
                )}

                {showPlay && (
                  <Button
                    auto
                    color="gradient"
                    css={{ ml: "$8" }}
                    onPress={() => playMove()}
                  >
                    {playMutation.isLoading && <Spinner />}
                    Play
                  </Button>
                )}
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col span={2}>
          <Text span h3 b css={{ mx: "$4", textAlign: "center" }}>
            VS
          </Text>
        </Col>

        <Col>
          <Card>
            <Card.Body>
              <Row justify="space-between">
                {isLoading && <Spinner />}
                {!isLoading && !!game && (
                  <Text
                    span
                    h3
                    b
                    css={{
                      textGradient: "45deg, $blue600 -20%, $pink600 50%",
                    }}
                  >
                    {game.p1 === accountId ? game.p2 : game.p1}
                  </Text>
                )}
                {!!game?.winner &&
                  (game.p1 === accountId ? game.p2 : game.p1) ===
                    game?.[game?.winner] && <Text b>WINNER</Text>}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Spacer y={1} />

      {!isLoading && (
        <Row align="center">
          <Col>
            <Row>
              <Col>
                <Card
                  isPressable
                  onPress={() => makeMove("rock")}
                  css={{
                    background: move === "rock" ? "$gradient" : undefined,
                  }}
                >
                  <Card.Body css={{ textAlign: "center" }}>
                    <Text span h1 size={90}>
                      🪨
                    </Text>
                    <Text>Rock</Text>
                  </Card.Body>
                </Card>
              </Col>
              <Spacer x={1} />
              <Col>
                <Card
                  isPressable
                  onPress={() => makeMove("paper")}
                  css={{
                    background: move === "paper" ? "$gradient" : undefined,
                  }}
                >
                  <Card.Body css={{ textAlign: "center" }}>
                    <Text span h1 size={90}>
                      📄
                    </Text>
                    <Text>Paper</Text>
                  </Card.Body>
                </Card>
              </Col>
              <Spacer x={1} />
              <Col>
                <Card
                  isPressable
                  onPress={() => makeMove("scissors")}
                  css={{
                    background: move === "scissors" ? "$gradient" : undefined,
                  }}
                >
                  <Card.Body css={{ textAlign: "center" }}>
                    <Text span h1 size={90}>
                      ✂️
                    </Text>
                    <Text>Scissors</Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
          <Col span={2}>
            <Card css={{ background: "transparent" }}>
              <Card.Body css={{ textAlign: "center" }}>
                <Text span h1 size={50}>
                  ⚔️
                </Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Body css={{ textAlign: "center" }}>
                <Text span h1 size={90}>
                  {(accountId === game?.p1 && !game?.p2Raw) ||
                    (accountId === game?.p2 && !game?.p1Raw && "🧐")}

                  {accountId === game?.p1 &&
                    !!game?.p2Raw &&
                    emojiMap[game.p2Raw.split("-")[0]]}

                  {accountId === game?.p2 &&
                    !!game?.p1Raw &&
                    emojiMap[game.p1Raw.split("-")[0]]}
                </Text>
                <Text>Thinking...</Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Layout>
  );
};

export default Play;
