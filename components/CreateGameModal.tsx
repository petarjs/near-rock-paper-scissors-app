import { Button, Input, Modal, Row, Text } from "@nextui-org/react";
import { nanoid } from "nanoid";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose(): void;
  onCreate({ deposit, pin }: { deposit: string; pin: string }): void;
}

export default function CreateGameModal({ open, onClose, onCreate }: Props) {
  const [deposit, setDeposit] = useState("1");
  const [pin, setPin] = useState(nanoid(4));

  return (
    <Modal
      closeButton
      aria-labelledby="create-game"
      open={open}
      onClose={onClose}
    >
      <Modal.Header>
        <Text id="modal-title" size={18}>
          Create a new Rock Paper Scissors Game
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Input
          label="Deposit (in N)"
          labelRight="N"
          bordered
          fullWidth
          color="primary"
          size="lg"
          placeholder="Deposit (in N)"
          value={deposit}
          onChange={(e) => setDeposit(e.target.value)}
        />

        <Input
          label="Game Pin"
          bordered
          fullWidth
          color="primary"
          size="lg"
          placeholder="Game Pin"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button auto flat color="error" onClick={onClose}>
          Close
        </Button>
        <Button auto onClick={() => onCreate?.({ deposit, pin })}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
