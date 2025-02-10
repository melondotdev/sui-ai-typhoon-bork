export interface IAttachment {
  url: string;
  contentType: string;
  title: string;
}

export interface Transaction {
  timestamp: number;
  amount: number[];
  coinType: string[];
  prices: (number | "N/A")[];
}

export interface Balance {
  [token: string]: {
    coinType: string;
    coinName: string;
    coinSymbol: string;
    balance: number;
    balanceUsd: number | "N/A";
  };
}

export interface NFTItem {
  objectId: string;
  collectionId: string;
  latestPrice: number | null;
  floorPrice: number | null;
  imgUrl: string | null;
}

export interface NFTKiosk {
  kioskIndex: number;
  items: NFTItem[];
}

export interface Nft {
  walletAddress: string;
  kiosks: NFTKiosk[];
}

export interface Props {
  transactions: Transaction[];
  balances: Balance;
  // The raw NFT data coming from the agent’s kioskInfo
  nfts: Nft | null;
}

export interface DashboardSummaryProps {
  totalNFTValue: number;
  totalPortfolioValue: number;
  totalStakedValue: number;
}

export interface CumulativeNetWorthChartProps {
  data: {
    formattedDate: string;
    cumulativeAmountUsd: number;
  }[];
}

export interface NFTGalleryModalProps {
  processedNFTs: (NFTItem & { netPnl: number | null })[];
  onClose: () => void;
}

export interface StakedCoinsTableProps {
  data: { token: string; amountUsd: number }[];
  tableRowLimit?: number;
}

export interface TopBalancesTableProps {
  data: {
    token: string;
    coinType: string;
    displayName: string;
    balance: number;
    balanceUsd: number | null;
  }[];
  tableRowLimit?: number;
}

export interface TopNFTDisplayProps {
  topNFT: NFTItem | null;
}

export interface TransactionVolumeChartProps {
  data: {
    formattedDate: string;
    amountUsd: number;
  }[];
}

/**
 * Represents a UUID string in the format "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
 */
export type UUID = `${string}-${string}-${string}-${string}-${string}`;

/**
 * Represents the content of a message or communication
 */
export interface Content {
    /** The main text content */
    text: string;

    /** Optional action associated with the message */
    action?: string;

    /** Optional source/origin of the content */
    source?: string;

    /** URL of the original message/post (e.g. tweet URL, Discord message link) */
    url?: string;

    /** UUID of parent message if this is a reply/thread */
    inReplyTo?: UUID;

    /** Array of media attachments */
    attachments?: Media[];

    /** Additional dynamic properties */
    [key: string]: unknown;
}

/**
 * Represents a media attachment
 */
export type Media = {
  /** Unique identifier */
  id: string;

  /** Media URL */
  url: string;

  /** Media title */
  title: string;

  /** Media source */
  source: string;

  /** Media description */
  description: string;

  /** Text content */
  text: string;
  
  /** Content type */
  contentType?: string;
};

// types.ts
export type WidgetType = 
  | 'summary'
  | 'topNft'
  | 'volumeChart'
  | 'netWorth'
  | 'balancesTable'
  | 'stakedTable';

export type GridCell = {
  type: WidgetType | 'empty';
  wallet?: string;
  isLoading?: boolean;
};

export type WidgetConfig = {
  type: WidgetType;
  wallet: string;
};