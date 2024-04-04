import { truncateEthAddress } from "~/utils/truncateEthAddress";

export const Address = (props: { address: string }) => {
  const { address } = props;
  const truncatedAddress = truncateEthAddress(address);

  return <span className="text-gray-800 text-sm font-semibold">{truncatedAddress}</span>;
};
