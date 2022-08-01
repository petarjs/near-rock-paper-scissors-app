import { Card } from "@nextui-org/react";
import { Game } from "../context/NearContext";

interface Props {
  game: Game;
}

export default function GameItem({ game }: Props) {
  return (
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
  );
}
