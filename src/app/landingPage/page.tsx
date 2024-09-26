"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./landingPage.module.css";
import BackgroundImage from "../background/background";
import WalletMdal from "./wallets";
import FormMdal from "./form";
import Alert from "@mui/material/Alert";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import ClearIcon from "@mui/icons-material/Clear";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import { truncateText } from "../utils/utils";

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
  const [showForm, setShowForm] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connection, setConnection] = useState<Connection | null>(null);
  // const [FormMdal, setFormMdal] = useState

  const handleShowWallet = () => {
    setShowWallets(true);
    setShowButton(false);
  };

  const handleShowForm = () => {
    setShowForm(true);
    setShowButton(false);
  };

  useEffect(() => {
    if (window.solana && window.solana.isPhantom) {
      const { solana } = window;

      solana
        .connect({ onlyIfTrusted: true })
        .then(({ publicKey }) => {
          setWalletAddress(publicKey.toString());
          console.log("Wallet connected with address:", publicKey.toString());
          const conn = new Connection(clusterApiUrl("devnet"));
          setConnection(conn);
          // Automatically hide the wallet modal after connecting
          setShowWallets(false);
          // setShowAlert(true);
        })
        .catch((err) => {
          console.error("Connection attempt failed:", err);
        });
    }
  }, []);

  return (
    <BackgroundImage>
      <div>
        <div className="flex justify-end w-full">
          <div className="w-full items-center mt-12 flex justify-end">
            {showButton ? (
              <button
                onClick={handleShowWallet}
                className="bg-green-700 text-black font-light py-1 px-4 rounded-full cursor-pointer"
              >
                {walletAddress
                  ? truncateText(walletAddress, 10)
                  : "Connect Wallet"}
              </button>
            ) : null}
          </div>
        </div>
        {/* <Alert icon={<VolumeUpIcon fontSize="inherit" />} severity="success">
          Succesfully Connected <ClearIcon fontSize="inherit" />
        </Alert> */}

        {showAlert ? (
          <div
            className="flex items-center justify-between  bg-white/40 border border-gray-300 text-black px-4 py-3 mt-5"
            role="alert"
          >
            <div className="flex items-center">
              <VolumeUpIcon className="mr-2" fontSize="inherit" />
              <span>Successfully Connected</span>
            </div>
            <ClearIcon className="cursor-pointer" fontSize="inherit" />
          </div>
        ) : null}

        <div className="flex justify-center">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={300}
            height={200}
            style={{ marginTop: -60 }}
          />
        </div>
        {!showWallets && !showForm ? (
          <>
            <div className=" bg-white/40 border text-center mx-4 border-gray-300 p-4 rounded-2xl -mt-12 shadow-lg  ">
              <p className="text-4xl  text-black font-extrabold">
                Grow, Earn, and Make a Difference with GreenThumb!
              </p>
              <p className="text-black md:text-2xl max-w-md mb-8 mt-5 text-2xl font-medium ">
                Join our community of urban gardeners and earn rewards for your
                green efforts.
              </p>
            </div>
            <div className="text-center">
              {/* <button className="bg-green-700  text-black font-medium py-1 px-4 rounded-full mt-6">
                Get Started
              </button> */}
              <button
                onClick={handleShowForm}
                className="bg-green-700 text-black font-medium py-1 px-4 rounded-full cursor-pointer mt-6"
              >
                Get Started
              </button>
            </div>
          </>
        ) : null}
        {showWallets ? (
          <WalletMdal
            setWalletAddress={setWalletAddress}
            walletAddress={walletAddress}
          />
        ) : null}
        {showForm ? <FormMdal /> : null}
        <div>
          <h1 className={styles.right}>All Rights Reserved 2024</h1>
        </div>
      </div>
    </BackgroundImage>
  );
}
