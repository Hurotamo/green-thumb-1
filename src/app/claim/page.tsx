"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";
import BackgroundImage from "../../app/background/background";
import * as splToken from "@solana/spl-token";
import * as web3 from "@solana/web3.js";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
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
  // const { publicKey, connect, signTransaction } = useWallet();
  const [pubKey, setPubkey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const connectedWallet = async () => {
    if (window.solana && window.solana.isPhantom) {
      try {
        // Connect the Phantom wallet
        const { publicKey } = await window.solana.connect({
          onlyIfTrusted: false,
        });
        setPubkey(publicKey.toString());
        // Log the public key to console
        console.log("Connected public key:", publicKey.toString());
      } catch (error) {
        console.error("Failed to connect Phantom wallet:", error);
      }
    } else {
      console.log("Phantom wallet is not installed.");
    }
  };
  useEffect(() => {
    connectedWallet();
  }, []);

  // REPLACE YOUR PRIVATE KEY IN (.env) file
  const mintAuthorityString = process.env.NEXT_PUBLIC_SOLANA_PRIVATE_KEY;
  if (!mintAuthorityString) {
    throw new Error("Private key not found in environment variables");
  }
  const privateKey = Uint8Array.from(JSON.parse(mintAuthorityString));

  const handleClaim = async () => {
    if (!pubKey) {
      alert("Please connect your wallet to claim rewards.");
      // console.log("Please connect your wallet to claim rewards.");
      return;
    }

    setIsLoading(true);
    try {
      const connection = new web3.Connection(web3.clusterApiUrl("devnet")); // Replace with 'mainnet-beta' if needed
      const fromWallet = web3.Keypair.fromSecretKey(privateKey);

      // mint address
      const mint = new web3.PublicKey("replace your mint token address");
      const toWallet = new web3.PublicKey(pubKey);

      const fromTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet, // Fee payer
        mint, // Token mint
        fromWallet.publicKey // Sender address
      );
      // Find or create associated token account for the recipient (claimer)
      const toTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet, // Fee payer
        mint, // Token mint
        toWallet // Claimer's wallet address
      );

      // Create transaction to send 3 tokens (adjust decimals accordingly)
      const tx = new web3.Transaction().add(
        splToken.createTransferInstruction(
          fromTokenAccount.address,
          toTokenAccount.address,
          fromWallet.publicKey,
          3 * 10 ** 9 // Assuming the token has 9 decimals
        )
      );

      // Send transaction
      const signature = await web3.sendAndConfirmTransaction(connection, tx, [
        fromWallet,
      ]);
      console.log({ signature });
      setMessage(`Transaction successful! Signature: ${signature}`);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BackgroundImage>
      <div>
        <div className="flex justify-end w-full">
          <div className="w-full text-center flex justify-center items-center mt-12 text-green-700">
            HELLO WORLD
          </div>
        </div>
        <div
          className="flex items-center justify-between  bg-white/40 border border-gray-300 text-black px-4 py-3 mt-5"
          role="alert"
        >
          <p className="text-green-800 text-center md:text-2xl max-w-md mb-8 mt-5 text-2xl font-medium mx-auto">
            PLANT
          </p>
        </div>

        <div>
          <button
            onClick={handleClaim}
            disabled={isLoading || !setWalletAddress}
            className="bg-green-600 text-center mt-5 text-white px-4 py-2 rounded disabled:opacity-50 mx-auto block"
            type="button"
          >
            {isLoading ? "Claiming..." : "Claim Rewards"}
          </button>

          {message ? (
            <div className="w-80 text-center mt-4 p-4 rounded-md bg-gray-400">
              <span className="text-[12px] text-slate-950 w-60 break-words">
                {message}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </BackgroundImage>
  );
}
