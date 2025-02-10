// src/components/dashboard/dashboard-summary.tsx
import React from "react";
import { motion } from "framer-motion";
import { DashboardSummaryProps } from "@/types";

export const DashboardSummary: React.FC<DashboardSummaryProps> = ({ totalNFTValue, totalPortfolioValue, totalStakedValue }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      <motion.div className="bg-gray-800 p-3 rounded-lg flex justify-between items-center" whileHover={{ scale: 1.05 }}>
        <span className="text-xs">Total Portfolio:</span>
        <span className="text-lg font-bold">
          ${(totalNFTValue + totalPortfolioValue + totalStakedValue).toFixed(2)}
        </span>
      </motion.div>
      <motion.div 
        className="bg-gray-800 p-3 rounded-lg flex justify-between items-center" 
        whileHover={{ scale: 1.05 }} 
      >
        <span className="text-xs">NFTs:</span>
        <span className="text-lg font-bold">${totalNFTValue.toFixed(2)}</span>
      </motion.div>
      <motion.div className="bg-gray-800 p-3 rounded-lg flex justify-between items-center" whileHover={{ scale: 1.05 }}>
        <span className="text-xs">Wallet:</span>
        <span className="text-lg font-bold">${totalPortfolioValue.toFixed(2)}</span>
      </motion.div>
      <motion.div className="bg-gray-800 p-3 rounded-lg flex justify-between items-center" whileHover={{ scale: 1.05 }}>
        <span className="text-xs">Staked:</span>
        <span className="text-lg font-bold">${totalStakedValue.toFixed(2)}</span>
      </motion.div>
    </div>
  );
};