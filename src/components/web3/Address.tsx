"use client";

import { truncateEthAddress } from "~/utils/truncateEthAddress";

export const Address = ({ address }: { address: string }) => {
  const truncatedAddress = truncateEthAddress(address);

  return <span className="">{truncatedAddress}</span>;
};
