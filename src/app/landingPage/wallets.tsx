"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./landingPage.module.css";
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

interface WalletMdalProps {
  setWalletAddress: (address: string | null) => void;
  walletAddress: string | null;
}

export default function WalletMdal({
  setWalletAddress,
  walletAddress,
}: WalletMdalProps) {
  const [connection, setConnection] = useState<Connection | null>(null);

  const connectWallet = async () => {
    if (window.solana) {
      try {
        const { publicKey } = await window.solana.connect();
        console.log("Wallet connected with address:", publicKey.toString());
        setWalletAddress(publicKey.toString());
        const conn = new Connection(clusterApiUrl("devnet"));
        setConnection(conn);
      } catch (err) {
        console.error("Failed to connect wallet:", err);
      }
    } else {
      alert("Please install the Phantom Wallet extension.");
    }
  };

  return (
    <div className={styles.walletContainer}>
      <div>
        <h1 className={styles.title}>Connect with your Wallet</h1>
      </div>
      <div className={styles.buttons}>
        {/* Phantom Wallet */}
        <div className={styles.walletOption}>
          <button className={styles.walletBtn} onClick={connectWallet}>
            Phantom Wallet
          </button>
          <Image
            src="/images/phantom logo.jpg" // Replace with your Phantom Wallet image path
            alt="phantom logo.jpg"
            width={24}
            height={24}
            className={styles.walletIcon}
          />
        </div>

        {/* Metamask Wallet */}
        <div className={styles.walletOption}>
          <button className={styles.walletBtn}>Metamask Wallet</button>
          <Image
            src="/images/MetaMask.png" // Replace with your Metamask Wallet image path
            alt="MetaMask.png"
            width={24}
            height={24}
            className={styles.walletIcon}
          />
        </div>

        {/* Wallet Connect */}
        <div className={styles.walletOption}>
          <button className={styles.walletBtn}>Wallet Connect</button>
          <Image
            src="/images/Wallet Logo.png" // Replace with your Wallet Connect image path
            alt="Wallet Logo.png"
            width={24}
            height={24}
            className={styles.walletIcon}
          />
        </div>
      </div>
    </div>
  );
}
