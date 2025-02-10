import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { apiClient } from "../lib/api";
import Dashboard from "@/components/dashboard";
import { Nft, Balance, Transaction } from "../types";
import Chat from "@/components/chat/chat";

const AGENT_ID = "7e8bb798-a9e2-03e2-86aa-e0f9a8ae5baf";

function Home() {
  const [walletAddress, setWalletAddress] = useState("");
  const [isFetched, setIsFetched] = useState(false);
  const [roastResponse, setRoastResponse] = useState<{ text: string }[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Transactions now have only { timestamp, coinType, amount, prices } fields.
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balances, setBalances] = useState<Balance>({});
  const [nfts, setNfts] = useState<Nft | null>(null);
  
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress.trim()) return;

    setLoading(true);
    setError(null);
    setIsFetched(false);
    setRoastResponse(null);

    try {
      // 1. Fetch NFTs
      const nftResponse = await apiClient.sendMessage(
        AGENT_ID,
        `GET_NFTS, FETCH_NFTS, LIST_NFTS, SHOW_NFTS, DISPLAY_NFTS ${walletAddress}`
      );
      
      // 2. Fetch Wallet Balances
      const balanceResponse = await apiClient.sendMessage(
        AGENT_ID,
        `OBTAIN_WALLET_BALANCES, GET_BALANCES, WALLET_BALANCES, OBTAIN_BALANCES ${walletAddress}`
      );

      // 3. Get Account Activity (returns transactions with { timestamp, coinType, amount, prices })
      const activityResponse = await apiClient.sendMessage(
        AGENT_ID,
        `GET_ACCOUNT_ACTIVITY, GET_ACTIVITY, WALLET_ACTIVITY, FETCH_ACTIVITY ${walletAddress}`
      );
      
      setIsFetched(true);
      
      // Process Activity Data
      if (activityResponse[1]?.content?.transactions) {
        setTransactions(activityResponse[1].content.transactions);
      }
      
      // Process Balance Data
      if (balanceResponse[1]?.content?.balances) {
        setBalances(balanceResponse[1].content.balances);
      }

      // Process NFT Data (if available)
      if (nftResponse[1]?.content?.kioskInfo) {
        setNfts(nftResponse[1].content.kioskInfo);
      }
      
      // Extract the first 10 transactions for the roast query.
      // (Since there's no longer a type field, simply use the new transaction objects.)
      const transactionsForRoast = activityResponse[1].content.transactions.slice(0, 10);
      
      // Send the roast command via API
      const roast = await apiClient.sendMessage(
        AGENT_ID,
        `roast the wallet owner's last 10 transactions in a comedic and mocking style and give it a score out of 10. Be specific and don't mention that you're looking at the last 10 transactions. \n\nwallet transactions: ${JSON.stringify(transactionsForRoast)}`
      );
      setRoastResponse(roast as { text: string }[]);
    } catch (err: any) {
      console.error("Analysis failed:", err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setWalletAddress("");
    setIsFetched(false);
    setRoastResponse(null);
    setTransactions([]);
    setBalances({});
    setNfts(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Initial Input Container */}
      {!isFetched && !loading && (
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-6">
              <h1 className="text-4xl font-bold text-center">Get Borked</h1>
              <p className="text-lg text-muted-foreground">
                Enter a Sui Wallet
              </p>
              <form onSubmit={handleAnalyze} className="w-full space-y-4">
                <Input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Enter wallet address"
                  className="w-full"
                />
                <Button type="submit" className="w-full">
                  Analyze Wallet
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin mb-2 text-gray-700" />
          <p className="text-lg text-gray-700">Analyzing wallet data...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle>Wallet Analysis Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">Failed: {error}</p>
          </CardContent>
        </Card>
      )}

      {/* Results Container */}
      {isFetched && roastResponse && (
        <div className="w-full">
          <div className="text-center">
            <div className="mt-4 text-sm text-gray-500 flex justify-between items-center">
              <p>Wallet: {walletAddress}</p>
              <Button
                variant="link"
                onClick={handleReset}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Analyze a new wallet
              </Button>
            </div>
            {/* Animated roast response */}
            <motion.div
              animate={{
                rotate: [-1, 1, -1],
                scale: [1, 1.05, 1],
                y: [0, -2, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-xl text-gray-50 p-2"
            >
              <span className="font-bold">Bork says: </span>
              {roastResponse.length > 0
                ? roastResponse[0].text
                : "No roast text found"}
            </motion.div>
          </div>
          <Dashboard
            transactions={transactions}
            balances={balances}
            nfts={nfts}
          />
        </div>
      )}

      {/* Chat Integration */}
      <Chat agentId={AGENT_ID} />
    </div>
  );
}

export default Home;
