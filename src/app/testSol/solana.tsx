import React, { useState, useEffect } from "react";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  clusterApiUrl,
} from "@solana/web3.js";
import { Grid, TextField, Typography } from "@mui/material";

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

const SolanaWallet = () => {
  const [amount, setAmount] = useState("");
  const [customerWallet, setCustomerWallet] = useState("");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connection, setConnection] = useState<Connection | null>(null);
  const [balance, setBalance] = useState<number>(0);

  const fetchBalance = async (address: string, conn: Connection) => {
    try {
      const publicKey = new PublicKey(address);
      const lamports = await conn.getBalance(publicKey);
      const sol = lamports / 1e9; // Convert lamports to SOL
      setBalance(sol);
      console.log("Balance fetched:", sol);
    } catch (err) {
      console.error("Failed to fetch balance", err);
    }
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const handleCustomerWalletChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomerWallet(event.target.value);
  };

  const transferSol = async () => {
    if (walletAddress && connection) {
      try {
        const fromPublicKey = new PublicKey(walletAddress);
        const toPublicKey = new PublicKey(customerWallet);
        const transferAmount = parseFloat(amount) * 1e9; // Convert SOL to lamports

        if (isNaN(transferAmount) || transferAmount <= 0) {
          alert("Invalid amount");
          return;
        }

        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: fromPublicKey,
            toPubkey: toPublicKey,
            lamports: transferAmount,
          })
        );

        // Fetch the recent blockhash
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = fromPublicKey; // Set the fee payer

        // Send the transaction to Phantom Wallet for signing
        if (window.solana && window.solana.isPhantom) {
          try {
            if (window.solana.signTransaction) {
              const signedTransaction = await window.solana.signTransaction(
                transaction
              );

              // Send the signed transaction to the Solana network
              const txId = await connection.sendRawTransaction(
                signedTransaction.serialize(),
                {
                  skipPreflight: false,
                  preflightCommitment: "confirmed",
                }
              );

              console.log("Transaction ID:", txId);

              // Confirm the transaction
              await connection.confirmTransaction(txId, "confirmed");
              console.log("Transaction confirmed:", txId);

              // Fetch the new balance
              fetchBalance(walletAddress, connection);
            } else {
              console.error(
                "signTransaction method not available on solana object"
              );
            }
          } catch (err) {
            console.error("Failed to sign or send transaction", err);
          }
        } else {
          alert("Phantom Wallet not detected.");
        }
      } catch (err) {
        console.error("Failed to transfer SOL", err);
      }
    } else {
      alert("Wallet not connected or connection not established.");
    }
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
          fetchBalance(publicKey.toString(), conn); // Fetch balance when connected
        })
        .catch((err) => {
          console.error("Connection attempt failed:", err);
        });
    }
  }, []);

  const connectWallet = async () => {
    if (window.solana) {
      try {
        const { publicKey } = await window.solana.connect();
        console.log("Wallet connected with address:", publicKey.toString());
        setWalletAddress(publicKey.toString());
        const conn = new Connection(clusterApiUrl("devnet"));
        setConnection(conn);
        fetchBalance(publicKey.toString(), conn);
      } catch (err) {
        console.error("Failed to connect wallet:", err);
      }
    } else {
      alert("Please install the Phantom Wallet extension.");
    }
  };

  return (
    <Grid container justifyContent="center" height="100vh">
      <div>
        <button onClick={connectWallet}>Connect Wallet</button>
        {walletAddress && <p>Connected Wallet: {walletAddress}</p>}
        <h1 style={{ color: "red" }}>Balance: {balance}</h1>

        <div style={{ marginBottom: 50 }}>
          <div className="input-group">
            <Typography variant="body1" className="label">
              To
            </Typography>
            <TextField
              value={customerWallet}
              placeholder="To Address"
              variant="outlined"
              name="customerWallet"
              onChange={handleCustomerWalletChange}
              size="small"
              fullWidth
            />
          </div>
          <div className="input-group">
            <Typography variant="body1" className="label">
              Amount
            </Typography>
            <TextField
              value={amount}
              placeholder="Amount in SOL"
              variant="outlined"
              name="amount"
              onChange={handleAmountChange}
              size="small"
              fullWidth
            />
          </div>
          <button onClick={transferSol}>Send SOL</button>
        </div>
      </div>
    </Grid>
  );
};

export default SolanaWallet;
