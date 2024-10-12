import axios from "axios";
import { ethers } from "ethers";
import type React from "react";
import { useEffect, useState } from "react";
import { env } from "~/env.mjs";

interface Donor {
  address: string;
  totalAmount: string;
}

const DONOR_WALLET = env.DONOR_WALLET
const ETHERSCAN_API_KEY = env.ETHERSCAN_API_KEY

export const TopDonors = () => {
  const [topDonors, setTopDonors] = useState<Donor[]>([]);

  useEffect(() => {
    fetchTopDonors();
  }, []);

  const fetchTopDonors = async () => {
    try {
      const response = await axios.get(
        `https://api.etherscan.io/api?module=account&action=txlist&address=${DONOR_WALLET}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`,
      );

      const transactions = response.data.result;

      const donorMap = new Map<string, ethers.BigNumber>();

      for (const tx of transactions) {
        if (tx.to.toLowerCase() === DONOR_WALLET.toLowerCase()) {
          const amount = ethers.BigNumber.from(tx.value);
          const currentTotal = donorMap.get(tx.from) || ethers.BigNumber.from(0);
          donorMap.set(tx.from, currentTotal.add(amount));
        }
      }

      const sortedDonors = Array.from(donorMap.entries())
        .sort((a, b) => (b[1].gt(a[1]) ? 1 : -1))
        .slice(0, 5)
        .map(([address, amount]) => ({
          address,
          totalAmount: ethers.utils.formatEther(amount),
        }));

      setTopDonors(sortedDonors);
    } catch (error) {
      console.error("Error fetching top donors:", error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Top 5 Donors</h2>
      <ul>
        {topDonors.map((donor, index) => (
          <li key={donor.address} className="mb-2">
            <span className="font-semibold">{index + 1}. </span>
            {donor.address.slice(0, 6)}...{donor.address.slice(-4)}: {donor.totalAmount} ETH
          </li>
        ))}
      </ul>
    </div>
  );
};
