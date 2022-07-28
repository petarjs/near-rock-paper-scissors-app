import { Button, Input, Modal, Row, Text } from "@nextui-org/react";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose(): void;
  onCreate(deposit: string): void;
}

export default function CreateGameModal({ open, onClose, onCreate }: Props) {
  const [deposit, setDeposit] = useState("0.000001");

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
          labelRight="N"
          bordered
          fullWidth
          color="primary"
          size="lg"
          placeholder="Deposit (in N)"
          value={deposit}
          onChange={(e) => setDeposit(e.target.value)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button auto flat color="error" onClick={onClose}>
          Close
        </Button>
        <Button auto onClick={() => onCreate?.(deposit)}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
