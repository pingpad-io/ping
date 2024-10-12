import { ethers } from "ethers";
import Link from "next/link";
import { env } from "~/env.mjs";

interface Donor {
  address: string;
  totalAmount: string;
}

const DONOR_WALLET = env.DONOR_WALLET;
const ETHERSCAN_API_KEY = env.ETHERSCAN_API_KEY;

export const revalidate = 3600;

async function fetchTopDonors(): Promise<Donor[]> {
  try {
    const response = await fetch(
      `https://api.etherscan.io/api?module=account&action=txlist&address=${DONOR_WALLET}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`,
      { next: { revalidate: 3600 } },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const transactions = data.result;

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

    return sortedDonors;
  } catch (error) {
    console.error("Error fetching top donors:", error);
    return [];
  }
}

export async function TopDonors() {
  const topDonors = await fetchTopDonors();

  return (
    <div className="rounded-lg">
      <p className="pb-2">
        Pingpad is an <Link href="https://github.com/pingpad-io/ping">open source</Link> project, and we are being
        supported by our kind donors:{" "}
      </p>
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
}
