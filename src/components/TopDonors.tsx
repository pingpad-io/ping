import { ethers } from "ethers";
import Link from "next/link";
import { env } from "~/env.mjs";

interface Donor {
  address: string;
  totalAmount: string;
}

interface NetworkConfig {
  apiUrl: string;
  PolToEthRate?: number;
}

const DONOR_WALLET = env.DONOR_WALLET;
const ETHERSCAN_API_KEY = env.ETHERSCAN_API_KEY;

const NETWORKS = {
  ethereum: {
    apiUrl: "https://api.etherscan.io/api",
  },
} satisfies Record<string, NetworkConfig>;

export const revalidate = 3600;

async function fetchNetworkTransactions(network: keyof typeof NETWORKS, apiKey: string): Promise<any[]> {
  const config = NETWORKS[network];
  const response = await fetch(
    `${config.apiUrl}?module=account&action=txlist&address=${DONOR_WALLET}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`,
    { next: { revalidate: 3600 } },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.result || [];
}

async function fetchTopDonors(): Promise<Donor[]> {
  try {
    const [ethereumTxs] = await Promise.all([
      fetchNetworkTransactions("ethereum", ETHERSCAN_API_KEY),
    ]);

    const donorMap = new Map<string, ethers.BigNumber>();

    const processTransactions = (transactions: any[], network: keyof typeof NETWORKS) => {
      for (const tx of transactions) {
        if (tx.to.toLowerCase() === DONOR_WALLET.toLowerCase()) {
          const amount = ethers.BigNumber.from(tx.value);
          const currentTotal = donorMap.get(tx.from) || ethers.BigNumber.from(0);
          donorMap.set(tx.from, currentTotal.add(amount));
        }
      }
    };

    processTransactions(ethereumTxs, "ethereum");

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
        Pingpad is an{" "}
        <Link className="underline" href="https://github.com/pingpad-io/ping">
          open source
        </Link>{" "}
        project, and is ran by our kind donors:{" "}
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
