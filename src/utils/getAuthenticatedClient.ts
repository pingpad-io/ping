import { LensClient, development } from "@lens-protocol/client";
import { WalletClient } from "viem";

export async function getAuthenticatedClient(walletClient: WalletClient) {
  const lensClient = new LensClient({
    environment: development,
  });

  const address = walletClient.account.address;

  const { id, text } = await lensClient.authentication.generateChallenge({
    signedBy: address,
    for: "0x04359b",
  });
  const signature = await walletClient.signMessage({ account: address, message: text });

  lensClient.authentication.authenticate({ id, signature });

  return lensClient;
}
