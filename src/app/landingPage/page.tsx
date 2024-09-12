"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./landingPage.module.css";
import BackgroundImage from "../background/background";
import WalletMdal from "./wallets";
import FormMdal from "./form";
import { text } from "stream/consumers";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

type PhantomWindow = {
  solana?: {
    isPhantom?: boolean;
    connect: (options?: {
      onlyIfTrusted: boolean;
    }) => Promise<{ publicKey: PublicKey }>;
    disconnect: () => Promise<void>;
    signTransaction?: (transaction: Transaction) => Promise<Transaction>;
    sendTransaction?: (
      transaction: Transaction,
      connection: Connection
    ) => Promise<string>;
  };
} & Window;
declare const window: PhantomWindow;
export default function LandingPage() {
  const [showWallets, setShowWallets] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const handleShowWallet = () => {
    setShowWallets(true);
  };

  return (
    <BackgroundImage>
      <div>
        <div className="flex justify-end w-full">
          <div className="w-full text-right mt-10">
            <button
              onClick={handleShowWallet}
              className="bg-green-700   text-black font-light py-1 px-4 rounded-full mt-2"
            >
              Connect Wallet
            </button>
          </div>
        </div>
        <div className="flex justify-center">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={300}
            height={200}
            style={{ marginTop: -60 }}
          />
        </div>
        {!showWallets ? (
          <>
            <div className=" bg-white/40 border text-center mx-4 border-gray-300 p-4 rounded-2xl -mt-12 ">
              <p className="text-4xl  text-black font-extrabold">
                Grow, Earn, and Make a Difference with GreenThumb!
              </p>
              <p className="text-black md:text-2xl max-w-md mb-8 mt-5 text-2xl font-medium ">
                Join our community of urban gardeners and earn rewards for your
                green efforts.
              </p>
            </div>
            <div className="text-center">
              <button className="bg-green-700  text-black font-medium py-1 px-4 rounded-full mt-6">
                Get Started
              </button>
            </div>
          </>
        ) : null}
        {/* {showWallets ? <WalletMdal /> : null} */}
        {showWallets ? <FormMdal /> : null}
        <div>
          <h1 className={styles.right}>All Rights Reserved 2024</h1>
        </div>
      </div>
    </BackgroundImage>
  );
}
