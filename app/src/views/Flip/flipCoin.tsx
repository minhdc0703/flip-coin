import { FC, useCallback, useEffect, useState } from "react";
import {
  useAnchorWallet,
  useConnection,
  useLocalStorage,
} from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import { createFlip, getFlipOrder, flip } from "./methods";
import { useProgram } from "./useProgram";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";

const FlipCoinScreen: FC = () => {
  const { connection } = useConnection();
  const wallet: any = useAnchorWallet();
  const [prices, setPrices] = useState<string[]>([]);
  const [input, setInput] = useState("1");
  const { program } = useProgram({ connection, wallet });
  const [orders, setOrders] = useState<{ creator: string; value: number }[]>(
    []
  );
  const [txFlip, setTxFlip] = useState<string>("");

  // const [isLoading, setLoading] = useState<boolean>(false);

  // const [configPubkey, setConfigPubkey] =
  //   useLocalStorage<anchor.web3.PublicKey | null>("configPubkey", null);
  useEffect(() => {
    fetchFlipOrder();
  }, [wallet]);

  const fetchFlipOrder = async () => {
    if (!program) {
      return "program undefined";
    }
    if (!wallet.publicKey) {
      return "config pubkey undefined";
    }
    let orders = await getFlipOrder(program);
    setOrders(orders);
  };

  const createFlipCoin = async (value: string) => {
    if (!program) {
      return "program undefined";
    }
    if (!wallet.publicKey) {
      return "config pubkey undefined";
    }
    await createFlip(program, wallet.publicKey, Number(value));
    await getFlipOrder(program);
  };

  const flipCoin = async (value: number, creator: string) => {
    if (!program) {
      return "program undefined";
    }
    if (!wallet.publicKey) {
      return "config pubkey undefined";
    }

    const tx = await flip(
      program,
      new anchor.web3.PublicKey(creator),
      wallet.publicKey,
      value
    );
    setTxFlip(tx);
  };

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
              onClick={() => createFlipCoin(price)}
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

      <Stack direction={"column"} sx={{ p: 2 }}>
        <Button
          sx={{ color: "gray", border: "none", justifyContent: "flex-start" }}
        >
          {"Flip orders"}
        </Button>
        <Stack direction={"column"} spacing={3}>
          {orders.map((order, index) => {
            return (
              <Stack direction={"row"} spacing={3} key={index}>
                <Typography sx={{ color: "gray", py: 2 }}>
                  {order.creator}
                </Typography>
                <Button
                  sx={{ width: 200, height: 50, my: 1 }}
                  variant="outlined"
                  onClick={async () =>
                    await flipCoin(order.value, order.creator)
                  }
                >
                  {order.value} Renec
                </Button>
              </Stack>
            );
          })}

          <Typography sx={{ color: "gray", py: 2 }}>{"Flip result"}</Typography>
          <Typography sx={{ color: "gray", py: 2 }}>{txFlip}</Typography>
        </Stack>
      </Stack>
    </div>
  );
};

export default FlipCoinScreen;
