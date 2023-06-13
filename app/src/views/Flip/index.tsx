import { FC, useEffect, useState } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";

import styles from "./index.module.css";
import { createFlip, getFlipOrder, flip } from "./methods";
import { useProgram } from "./useProgram";
import useLocalStorage from "hooks/useLocalStorage";
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

const DappStarterScreen = () => {
  const { connection } = useConnection();
  const wallet: any = useAnchorWallet();
  const { program } = useProgram({ connection, wallet });
  const [counter, setCounter] = useState<anchor.BN>();
  const [configPubkey, setConfigPubkey] =
    useLocalStorage<anchor.web3.PublicKey | null>("configPubkey", null);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<number>();

  useEffect(() => {
    fetchFlipOrder();
  }, [wallet, lastUpdatedTime]);

  const fetchFlipOrder = async () => {
    if (!program) {
      return "program undefined";
    }
    if (!configPubkey) {
      return "config pubkey undefined";
    }
    let order = await getFlipOrder(program);
    setCounter(counter);
  };


  const handleClickCreateFlip = async () => {
    try {
      let configAddr = await createFlip(program!);
      setConfigPubkey(configAddr);
      setCounter(new anchor.BN(0));
    } catch (error) {
      console.error("Error fail to initialize counter:", error);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl p-8 2xl:px-0">
      <div className="flex flex-col items-start">
        <div className="initialize flex items-center">
          <div className="mr-2">Counter Config:</div>

          {configPubkey ? (
            <div>{configPubkey.toString()}</div>
          ) : (
            <button
              className="btn btn-primary normal-case btn-xs"
              onClick={handleClickInitialize}
            >
              Initialize Config
            </button>
          )}
        </div>

        <div className="value">
          {counter !== undefined && (
            <p className="counter text-xl mb-4">
              Counter: {counter.toNumber()}
            </p>
          )}
        </div>
        <div className="increment flex items-center">
          <div className="mr-2">Increment counter:</div>
          {configPubkey ? (
            <button
              className="btn btn-primary normal-case btn-xs"
              onClick={handleIncrement}
            >
              Increment
            </button>
          ) : (
            <p>Please initialize the config first.</p>
          )}
        </div>

        {configPubkey && (
          <div>
            {" "}
            <button
              className="btn btn-primary normal-case btn-xs"
              onClick={handleClickInitialize}
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
