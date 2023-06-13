import Link from "next/link";
import { FC } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

import styles from "./index.module.css";
import { FlipView } from "views";

export const HomeView: FC = ({}) => {
  const { publicKey } = useWallet();

  const onClick = () => {};

  return (
    <div className="container mx-auto max-w-6xl p-8 2xl:px-0">
      <div className={styles.container}>
        <div className="text-center pt-2">
          <div className="hero min-h-16 py-4">
            <div className="text-center hero-content">
              <div className="max-w-lg">
                <h1 className="mb-5 text-5xl font-bold">Flip Coin</h1>
                <p>
                  {publicKey ? <>Your address: {publicKey.toBase58()}</> : null}
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <ul className="text-left leading-10">
              <FlipView />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
