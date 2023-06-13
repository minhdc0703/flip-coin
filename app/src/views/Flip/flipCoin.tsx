import { FC, useCallback, useEffect, useState } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import { useProgram } from "./useProgram";
import { Box, Button, Stack, TextField } from "@mui/material";

const FlipCoinScreen: FC = () => {
  const { connection } = useConnection();
  const wallet: any = useAnchorWallet();
  const [prices, setPrices] = useState<string[]>([]);
  const [input, setInput] = useState("1");

  const addValueFlip = useCallback(() => {
    if (input && Number(input) > 0 && !prices.includes(input)) {
      setPrices([...prices, input]);
      setInput("");
    }
  }, [prices, input]);

  return (
    <div
      className="container mx-auto max-w-6xl p-8 2xl:px-0"
      style={{ backgroundColor: "white" }}
    >
      <div className="mr-4" style={{ color: "gray", marginLeft: 10 }}>
        The coin you want to flip
      </div>
      <Stack direction={"row"} spacing={3} sx={{ mx: 2, my: 2 }}>
        {prices.map((price, index) => {
          return (
            <Button
              variant="outlined"
              key={index}
              sx={{ width: 100, height: 50 }}
            >
              {price}
            </Button>
          );
        })}
      </Stack>
      <Stack direction={"column"} sx={{ p: 2 }}>
        <TextField
          error={(input && Number(input) < 0) || false}
          id="outlined-error"
          label="The renec flip"
          defaultValue="1"
          onChange={(e) => {
            console.log(e.target.value);
            setInput(e.target.value);
          }}
          sx={{ backgroundColor: "white", width: 200 }}
        />

        <Button
          sx={{ width: 200, height: 50, my: 2 }}
          variant="outlined"
          onClick={addValueFlip}
        >
          Create flip coin
        </Button>
      </Stack>
    </div>
  );
};

export default FlipCoinScreen;
