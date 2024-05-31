import { LogOutIcon } from "lucide-react";
import { useAccount } from "wagmi";
import { Button } from "../ui/button";
import { Address } from "./Address";

export default function ConnectedWalletLabel() {
  const { isConnected: walletConnected, address } = useAccount();

  if (!walletConnected) {
    return null;
  }

  return (
    <div className="flex flex-row gap-2 items-center">
      Connected wallet: <Address address={address} />
      <Button size="icon" className="w-4 h-4" variant="ghost" onClick={(_e) => {}}>
        <LogOutIcon />
      </Button>
    </div>
  );
}