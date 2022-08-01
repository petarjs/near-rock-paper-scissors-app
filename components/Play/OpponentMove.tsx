import { Card, Text } from "@nextui-org/react";
import { emojiMap } from "../../config/emoji";
import useNearContext, { Game } from "../../context/NearContext";

interface Props {
  game: Game;
}

export default function OpponentMove({ game }: Props) {
  const { accountId } = useNearContext();

  return (
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

          {((accountId === game?.p1 && !game?.p1Hash && !!game?.p2Hash) ||
            (accountId === game?.p2 && !game?.p2Hash && !!game?.p1Hash)) &&
            "💡"}
        </Text>

        {(accountId === game?.p1 && !game?.p2Raw) ||
          (accountId === game?.p2 && !game?.p1Raw && <Text>Thinking...</Text>)}

        {((accountId === game?.p1 && !game?.p1Hash && !!game?.p2Hash) ||
          (accountId === game?.p2 && !game?.p2Hash && !!game?.p1Hash)) && (
          <Text>Opponent made a move. Waiting for your move...</Text>
        )}
      </Card.Body>
    </Card>
  );
}
