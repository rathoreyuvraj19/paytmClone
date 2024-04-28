"use client";
import { Button } from "@repo/ui/button";
import { TextInput } from "@repo/ui/textinput";
import { useState } from "react";
import { P2Ptransfer } from "../../lib/actions/p2pTransfer";

export default function () {
  const [recieverMail, setRecieverEmail] = useState("");
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  async function handleTransfer() {
    setLoading(true);
    await P2Ptransfer(recieverMail, amount * 100);
    setLoading(false);
  }

  return (
    <div className="w-full h-[calc(100vh-200px)] flex justify-center items-center">
      <div className="border  p-4 flex  flex-col justify-center items-center">
        <TextInput
          placeholder="Receiver's Email"
          onChange={(val) => {
            setRecieverEmail(val);
          }}
          label="Email"
        ></TextInput>
        <TextInput
          placeholder="Amount"
          onChange={(val) => {
            setAmount(Number(val));
          }}
          label="Amount"
        ></TextInput>
        <Button onClick={handleTransfer}>
          {loading ? "loading..." : "Send"}
        </Button>
      </div>
    </div>
  );
}
