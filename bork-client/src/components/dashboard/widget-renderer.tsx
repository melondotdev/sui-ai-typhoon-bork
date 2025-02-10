import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { 
  TopNFTDisplay,
  DashboardSummary,
  StakedCoinsTable,
  TopBalancesTable,
  NFTGalleryModal,
  TransactionVolumeChart,
  CumulativeNetWorthChart
} from "./widgets";

const AGENT_ID = "7e8bb798-a9e2-03e2-86aa-e0f9a8ae5baf";

type WidgetRendererProps = {
  type: string;
  wallet: string;
  actions: string[];
  onLoaded: () => void;
};

export default function WidgetRenderer({
  type,
  wallet,
  actions,
  onLoaded
}: WidgetRendererProps) {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: [type, wallet, actions],
    queryFn: async () => {
      // Build the query string using the actions array and wallet address.
      // The resulting string will be like: "{action1, action2, action3} walletAddress"
      const queryString = `{${actions.join(", ")}} ${wallet}`;
      const response = await apiClient.sendMessage(
        AGENT_ID,
        queryString
      );
      return response[1]?.content;
    },
    enabled: !!wallet,
  });
  
  useEffect(() => {
    if (isSuccess) {
      onLoaded();
    }
  }, [isSuccess, onLoaded]);

  if (isLoading) return null;

  switch (type) {
    case 'summary':
      return <DashboardSummary {...data} />;
    case 'topNft':
      return <TopNFTDisplay {...data} />;
    case 'nftGallery':
      return <NFTGalleryModal {...data} />;
    case 'volumeChart':
      return <TransactionVolumeChart {...data} />;
    case 'netWorth':
      return <CumulativeNetWorthChart {...data} />;
    case 'balancesTable':
      return <TopBalancesTable {...data} />;
    case 'stakedTable':
      return <StakedCoinsTable {...data} />;
    default:
      return null;
  }
}
