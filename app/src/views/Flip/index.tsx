import { FC, useState } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import styles from "./index.module.css";
import {
  Alert,
  Box,
  Button,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import FlipCoinScreen from "./flipCoin";

export const FlipView: FC = ({}) => {
  const { connection } = useConnection();
  const [isAirDropped, setIsAirDropped] = useState(false);
  const wallet = useAnchorWallet();
  const [message, setMessage] = useState<string>("");

  const airdropToWallet = async () => {
    if (wallet) {
      setIsAirDropped(false);
      const signature = await connection.requestAirdrop(
        wallet.publicKey,
        1000000000
      );

      console.log("signature: ", signature);
      const tx = await connection.confirmTransaction(signature);
      console.log(tx);
      setIsAirDropped(true);
      setMessage("Airdrop Successful");
    }
  };

  const handleClose = () => {
    setIsAirDropped(false);
  };

  return (
    <div className="container mx-auto max-w-6xl p-8 2xl:px-0">
      <div className={styles.container}>
        <div className="flex mb-16">
          <div className="mr-4">
            <button
              className="btn btn-primary normal-case btn-xs"
              onClick={airdropToWallet}
            >
              Airdrop 1 RENEC
            </button>
          </div>
        </div>
        <h1 className="mb-5 pb-8 text-5xl">Flip Coin</h1>

        <div>
          {!wallet ? (
            <h1> Please connect wallet to view the flip coin screen</h1>
          ) : (
            <FlipCoinScreen />
          )}
        </div>
      </div>
      <Snackbar
        open={isAirDropped}
        autoHideDuration={5000}
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
