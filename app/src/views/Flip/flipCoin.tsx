import { FC, useCallback, useEffect, useState } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import { createFlip, getFlipOrder, flip } from "./methods";
import { useProgram } from "./useProgram";
import {
  Alert,
  Box,
  Button,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const FlipCoinScreen: FC = () => {
  const { connection } = useConnection();
  const wallet: any = useAnchorWallet();
  const [input, setInput] = useState("1");
  const { program } = useProgram({ connection, wallet });
  const [orders, setOrders] = useState<{ creator: string; value: number }[]>(
    []
  );
  const [txFlip, setTxFlip] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const [isOpenNotification, setOpenNotification] = useState<boolean>(false);

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
    const tx = await createFlip(program, wallet.publicKey, Number(value));
    if (tx) {
      await fetchFlipOrder();
    }
    setMessage("The transaction successfully created.");
    setOpenNotification(true);
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

    // define message win or lose
    setOpenNotification(true);
  };

  const addValueFlip = useCallback(async () => {
    if (input && Number(input) > 0) {
      await createFlipCoin(input);
    }
  }, [input]);

  const handleClose = () => {
    setOpenNotification(false);
  };

  return (
    <div
      className="container mx-auto max-w-6xl p-8 2xl:px-0"
      style={{ backgroundColor: "white" }}
    >
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
          onClick={async () => await fetchFlipOrder()}
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

      <Snackbar
        open={isOpenNotification}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={handleClose}
          severity="success"
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default FlipCoinScreen;
