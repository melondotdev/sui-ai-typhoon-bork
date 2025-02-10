import { TopBalancesTableProps } from "@/types";

export const TopBalancesTable: React.FC<TopBalancesTableProps> = ({ data, tableRowLimit = 10 }) => (
  <div className="bg-gray-800 p-3 rounded-lg">
    <h2 className="text-base font-semibold mb-2">Top Balances</h2>
    <div className="max-h-40 overflow-y-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left py-1 px-2">Token</th>
            <th className="text-right py-1 px-2">Balance</th>
            <th className="text-right py-1 px-2">Balance (USD)</th>
          </tr>
        </thead>
        <tbody>
          {data.slice(0, tableRowLimit).map(({ token, coinType, displayName, balance, balanceUsd }) => {
            // Split coinType on "::" and get the third segment.
            const segments = coinType.split("::");
            const shortName = segments.length >= 3 ? segments[2] : displayName;
            return (
              <tr key={token} className="border-b border-gray-700">
                <td className="py-1 px-2">
                  <a
                    href={`https://suiscan.xyz/mainnet/coin/${coinType}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-gray-300"
                  >
                    {shortName}
                  </a>
                </td>
                <td className="py-1 px-2 text-right">{(balance ?? 0).toFixed(4)}</td>
                <td className="py-1 px-2 text-right">
                  ${typeof balanceUsd === "number" ? balanceUsd.toFixed(2) : "N/A"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export default TopBalancesTable;
