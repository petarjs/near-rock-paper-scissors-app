import { Card, Text } from "@nextui-org/react";
import { emojiMap } from "../../config/emoji";

interface Props {
  move: string;
  isSelected: boolean;
  onSelect(move: string): void;
}

export default function Move({ move, onSelect, isSelected }: Props) {
  return (
    <Card
      isPressable
      onPress={() => onSelect(move)}
      css={{
        background: isSelected ? "$gradient" : undefined,
      }}
    >
      <Card.Body css={{ textAlign: "center" }}>
        <Text
          span
          css={{ "@xsMax": { fontSize: "$xl7" }, "@xs": { fontSize: "$xl8" } }}
        >
          {emojiMap[move]}
        </Text>
        <Text>{move}</Text>
      </Card.Body>
    </Card>
  );
}
