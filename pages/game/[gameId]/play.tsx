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
import Move from "../../../components/Play/Move";
import OpponentMove from "../../../components/Play/OpponentMove";
import PlayerHeader from "../../../components/Play/PlayerHeader";
import useAuthContext from "../../../context/AuthContext";
import useNearContext, { Game } from "../../../context/NearContext";
import useGameQuery from "../../../queries/useGameQuery";
import usePlayGameMutation from "../../../queries/usePlayGameMutation";
import useRevealGameMutation from "../../../queries/useRevealGameMutation";
import sha256 from "../../../util/sha256";

const Play: NextPage = () => {
  const { push, query } = useRouter();
  const { accountId, nearLoading } = useNearContext();
  const { isSignedIn } = useAuthContext();
  const [savedMove, setSavedMove] = useState("");
  const savedMoveParsed = savedMove?.split("-")[0];
  const [savedMoveValid, setSavedMoveValid] = useState(false);

  const gamePin = query.gameId as string;
  const { data: game, isLoading } = useGameQuery(gamePin, {
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
    const hashesSubmitted = !!game?.p1Hash && !!game?.p2Hash;
    const revealedMyMove =
      accountId === game?.p1 ? !!game?.p1Raw : !!game?.p2Raw;

    if (hashesSubmitted && !revealedMyMove) {
      revealMove();
    }
  }, [game, accountId, savedMoveValid]);

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
      const salt = Math.floor(Math.random() * 10 ** 10);
      const moveRaw = `${move}-${salt}`;
      localStorage[`${accountId}/game/${query.gameId as string}/move`] =
        moveRaw;
      const moveHash = await sha256(moveRaw);

      playMutation.mutate({ moveHash, gamePin });
    } catch (error) {
      console.log({ error });
    }
  }

  async function revealMove() {
    if (!savedMoveValid) {
      console.log("Saved move not valid");
      //   localStorage[`${accountId}/game/${query.gameId as string}/move`] = "";
      return;
    }

    const moveRaw =
      localStorage[`${accountId}/game/${query.gameId as string}/move`];
    revealMutation.mutate({ gamePin, moveRaw });
  }

  const showPlay =
    !!move &&
    !(game?.p1 === accountId && !!game?.p1Hash) &&
    !(game?.p2 === accountId && !!game?.p2Hash);

  const playerWon = !!game?.winner && accountId === game?.[game?.winner];

  const secondPlayer = game?.p1 === accountId ? game?.p2 : game?.p1;

  const hasSecondPlayerWon =
    !!game?.winner &&
    (game.p1 === accountId ? game.p2 : game.p1) === game?.[game?.winner];

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

  useEffect(() => {
    if (
      (!isLoading && !participatingInGame(game)) ||
      (!nearLoading && !isSignedIn())
    ) {
      push("/");
    }
  }, [isLoading, nearLoading]);

  return (
    <Layout>
      <Row
        justify="center"
        align="center"
        css={{ "@xsMax": { flexDirection: "column" } }}
      >
        <Col>
          <PlayerHeader
            player={accountId}
            isLoading={isLoading}
            hasWon={playerWon}
            showPlay={showPlay}
            onPlay={playMove}
            playLoading={playMutation.isLoading}
          />
        </Col>

        <Col span={2}>
          <Text span h3 b css={{ mx: "$4", textAlign: "center" }}>
            VS
          </Text>
        </Col>

        <Col>
          <PlayerHeader
            player={secondPlayer || "Waiting for player to join..."}
            isLoading={isLoading}
            hasWon={hasSecondPlayerWon}
            showPlay={false}
            playLoading={false}
          />
        </Col>
      </Row>

      <Spacer y={1} />

      {!isLoading && (
        <Row align="center" css={{ "@xsMax": { flexDirection: "column" } }}>
          <Col>
            <Row>
              <Col>
                <Move
                  move="rock"
                  isSelected={move === "rock"}
                  onSelect={makeMove}
                />
              </Col>
              <Spacer x={1} />
              <Col>
                <Move
                  move="paper"
                  isSelected={move === "paper"}
                  onSelect={makeMove}
                />
              </Col>
              <Spacer x={1} />
              <Col>
                <Move
                  move="scissors"
                  isSelected={move === "scissors"}
                  onSelect={makeMove}
                />
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
          <Col>{!!game && <OpponentMove game={game} />}</Col>
        </Row>
      )}
    </Layout>
  );
};

export default Play;
