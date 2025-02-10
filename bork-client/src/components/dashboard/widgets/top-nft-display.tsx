import { TopNFTDisplayProps } from "@/types";

export const TopNFTDisplay: React.FC<TopNFTDisplayProps> = ({ topNFT }) => (
  <div className="bg-gray-800 p-3 rounded-lg flex flex-col items-center">
    {topNFT ? (
      <>
        <h2 className="text-base font-semibold mb-2">Top NFT</h2>
        <div className="flex items-center">
          <a
            href={`https://suiscan.xyz/mainnet/object/${topNFT.objectId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <img
              src={topNFT.imgUrl || "/placeholder.png"}
              alt={`NFT ${topNFT.objectId}`}
              className="object-cover w-48 h-48 rounded hover:opacity-75 transition-opacity"
            />
          </a>
        </div>
      </>
    ) : (
      <p>No NFT found.</p>
    )}
  </div>
);