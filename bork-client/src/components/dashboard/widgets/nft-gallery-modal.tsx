import { NFTGalleryModalProps } from "@/types";

export const NFTGalleryModal: React.FC<NFTGalleryModalProps> = ({ processedNFTs, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
    <div className="bg-gray-800 p-4 rounded-lg w-11/12 md:w-3/4 lg:w-1/2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">NFT Gallery</h2>
        <button onClick={onClose} className="text-xl font-bold">
          &times;
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {processedNFTs.length > 0 ? (
          processedNFTs.map((nft) => (
            <a
              key={nft.objectId}
              href={`https://suiscan.xyz/mainnet/object/${nft.objectId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <img
                src={nft.imgUrl || "/placeholder.png"}
                alt={`NFT ${nft.objectId}`}
                className="object-cover w-full aspect-square rounded hover:opacity-75 transition-opacity"
              />
            </a>
          ))
        ) : (
          <p className="text-center col-span-full">No NFTs found.</p>
        )}
      </div>
    </div>
  </div>
);