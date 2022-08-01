import { Button, Card, Row, Spinner, Text } from "@nextui-org/react";

interface Props {
  player: string;
  isLoading: boolean;
  showPlay: boolean;
  hasWon: boolean;
  playLoading: boolean;
  onPlay?(): void;
}

export default function PlayerHeader({
  player,
  isLoading,
  showPlay,
  hasWon,
  onPlay,
  playLoading,
}: Props) {
  return (
    <Card>
      <Card.Body>
        <Row justify="space-between">
          {isLoading && <Spinner />}
          {!isLoading && (
            <Text
              span
              h3
              b
              css={{
                textGradient: "45deg, $blue600 -20%, $pink600 50%",
              }}
            >
              {player}
            </Text>
          )}

          {hasWon && <Text b>WINNER</Text>}

          {showPlay && (
            <Button
              auto
              color="gradient"
              css={{ ml: "$8" }}
              onPress={() => onPlay?.()}
            >
              {playLoading && <Spinner />}
              Play
            </Button>
          )}
        </Row>
      </Card.Body>
    </Card>
  );
}
