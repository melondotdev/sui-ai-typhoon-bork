import React, { useMemo, useState } from "react";
import { Props, NFTItem } from "../types";
import { 
  TopNFTDisplay,
  DashboardSummary,
  StakedCoinsTable,
  TopBalancesTable,
  NFTGalleryModal,
  TransactionVolumeChart,
  CumulativeNetWorthChart
} from "./dashboard/widgets";

const Dashboard: React.FC<Props> = ({ transactions, balances, nfts }) => {
  const TABLE_ROW_LIMIT = 10;
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  
  // Transform balances:
  // GraphQL now returns an array of balance objects that include:
  // {
  //   coinType: { repr: "0x...::sui::SUI" },
  //   coinObjectCount: 1,
  //   totalBalance: "4504862384",
  //   price: 3.23
  // }
  // We parse totalBalance into a number, divide by 1e9, extract a short display name,
  // and compute balanceUsd as: (scaled balance) * (price)
  const balanceArray = useMemo(() => {
    if (!Array.isArray(balances)) return [];
    return balances
      .map((b: any) => {
        const rawBalance = Number(b.totalBalance);
        const scaledBalance = rawBalance / 1e9;
        const segments = b.coinType.repr.split("::");
        const shortDisplayName = segments.length >= 3 ? segments[2] : b.coinType.repr;
        return {
          token: b.coinType.repr,
          coinType: b.coinType.repr,
          displayName: shortDisplayName,
          balance: scaledBalance,
          balanceUsd: scaledBalance * (b.price || 0),
        };
      })
      .sort((a, b) => b.balanceUsd - a.balanceUsd);
  }, [balances]);

  const totalPortfolioValue = useMemo(() => {
    return balanceArray.reduce((acc, { balanceUsd }) => acc + (balanceUsd || 0), 0);
  }, [balanceArray]);

  // Aggregate transactions in USD for all events.
  // IMPORTANT: Each raw transaction amount is divided by 1e9 before being multiplied by its price.
  const transactionsWithUSD = useMemo(() => {
    return transactions.flatMap((tx) =>
      tx.coinType.map((token, index) => ({
        formattedDate: new Date(tx.timestamp).toLocaleDateString(),
        amountUsd:
          typeof tx.prices[index] === "number"
            ? (tx.prices[index] as number) * (tx.amount[index] / 1e9)
            : 0,
      }))
    );
  }, [transactions]);

  // Calculate cumulative net worth changes over time.
  const cumulativeNetWorth = useMemo(() => {
    let cumulativeSum = 0;
    return transactionsWithUSD.map((tx) => {
      cumulativeSum += tx.amountUsd;
      return {
        ...tx,
        cumulativeAmountUsd: cumulativeSum,
      };
    });
  }, [transactionsWithUSD]);

  // Process NFT data (assuming GET_NFTS returns kioskInfo with a kiosks array).
  const processedNFTs: (NFTItem & { netPnl: number | null })[] = useMemo(() => {
    if (nfts && Array.isArray(nfts.kiosks)) {
      const items = nfts.kiosks.reduce<(NFTItem & { netPnl: number | null })[]>((acc, kiosk) => {
        if (Array.isArray(kiosk.items)) {
          const enrichedItems = kiosk.items.map((item) => ({
            ...item,
            netPnl:
              item.floorPrice != null && item.latestPrice != null
                ? item.floorPrice - item.latestPrice
                : null,
          }));
          return acc.concat(enrichedItems);
        }
        return acc;
      }, []);
      return items;
    }
    return [];
  }, [nfts]);

  // Calculate total NFT value.
  const totalNFTValue = useMemo(() => {
    return processedNFTs.reduce((acc, nft) => {
      const price = nft.latestPrice || 0;
      return (acc + price) / 1e9;
    }, 0);
  }, [processedNFTs]);

  // Determine Top NFT (by highest latestPrice)
  const topNFT = useMemo(() => {
    if (processedNFTs.length > 0) {
      const sorted = [...processedNFTs].sort((a, b) => (b.latestPrice || 0) - (a.latestPrice || 0));
      return sorted[0];
    }
    return null;
  }, [processedNFTs]);

  // --- Staked Coins Calculations ---
  // Since the updated transactions no longer include a "type" field, we cannot identify staking events.
  const stakedTransactions = useMemo(() => {
    return [];
  }, [transactions]);

  const stakedByToken = useMemo(() => {
    const map: { [token: string]: number } = {};
    stakedTransactions.forEach(({ token, amountUsd }) => {
      map[token] = (map[token] || 0) + amountUsd;
    });
    return Object.entries(map).map(([token, amountUsd]) => ({
      token,
      amountUsd: amountUsd < 0 ? -amountUsd : amountUsd,
    }));
  }, [stakedTransactions]);

  const totalStakedValue = useMemo(() => {
    return stakedByToken.reduce((acc, { amountUsd }) => acc + amountUsd, 0);
  }, [stakedByToken]);
  // --- End of Staked Coins Calculations ---

  return (
    <div className="min-h-screen bg-gray-900 text-white p-2">
      <DashboardSummary
        totalNFTValue={totalNFTValue}
        totalPortfolioValue={totalPortfolioValue}
        totalStakedValue={totalStakedValue}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <TopNFTDisplay topNFT={topNFT} />
        <TransactionVolumeChart data={transactionsWithUSD} />
        <CumulativeNetWorthChart data={cumulativeNetWorth} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <StakedCoinsTable data={stakedByToken} tableRowLimit={TABLE_ROW_LIMIT} />
        <TopBalancesTable data={balanceArray} tableRowLimit={TABLE_ROW_LIMIT} />
      </div>
      
      {showGalleryModal && (
        <NFTGalleryModal
          processedNFTs={processedNFTs}
          onClose={() => setShowGalleryModal(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
