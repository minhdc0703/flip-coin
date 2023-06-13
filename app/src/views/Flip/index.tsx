import { FC, useState } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import styles from "./index.module.css";

import FlipCoinScreen from "./flipCoin";

export const FlipView: FC = ({}) => {
  const { connection } = useConnection();
  const [isAirDropped, setIsAirDropped] = useState(false);
  const wallet = useAnchorWallet();

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
    }
  };

  return (
    <div className="container mx-auto max-w-6xl p-8 2xl:px-0">
      <div className={styles.container}>
        <div className="flex mb-16">
          <div className="mr-4">Need some RENEC on test wallet?</div>
          <div className="mr-4">
            <button
              className="btn btn-primary normal-case btn-xs"
              onClick={airdropToWallet}
            >
              Airdrop 1 RENEC
            </button>
          </div>
          {isAirDropped ? <div className="opacity-50">Sent!</div> : null}
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
    </div>
  );
};