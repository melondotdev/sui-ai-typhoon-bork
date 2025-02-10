import { StakedCoinsTableProps } from "@/types";

export const StakedCoinsTable: React.FC<StakedCoinsTableProps> = ({ data, tableRowLimit = 10 }) => (
  <div className="bg-gray-800 p-3 rounded-lg">
    <h2 className="text-base font-semibold mb-2">Staked Coins</h2>
    <div className="max-h-40 overflow-y-auto">
      {data.length > 0 ? (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-1 px-2">Token</th>
              <th className="text-right py-1 px-2">Staked (USD)</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, tableRowLimit).map(({ token, amountUsd }) => (
              <tr key={token} className="border-b border-gray-700">
                <td className="py-1 px-2">
                  <a
                    href={`https://suiscan.xyz/mainnet/coin/${token}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-gray-300"
                  >
                    {token}
                  </a>
                </td>
                <td className="py-1 px-2 text-right">${amountUsd.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center">No staked coins found.</p>
      )}
    </div>
  </div>
);