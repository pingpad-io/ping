import { AnyClient, mainnet, PublicClient } from "@lens-protocol/client";
import { clientCookieStorage, cookieStorage } from "./storage";

const isServer = typeof window === "undefined";

const publicClient = PublicClient.create({
  environment: mainnet,
  origin: "https://pingpad.io",
  storage: isServer ? cookieStorage : clientCookieStorage,
});

export const getPublicClient = () => {
  return publicClient;
};

export const getBuilderClient = async (address: string, signMessage: (message: string) => Promise<string>) => {
  if (!address) return null;

  const authenticated = await publicClient.login({
    builder: {
      address: address,
    },
    signMessage,
  });

  if (authenticated.isErr()) {
    throw authenticated.error;
  }

  return authenticated.value;
};

export const getOnboardingClient = async (address: string, signMessage: (message: string) => Promise<string>) => {
  if (!address) return null;

  const { env } = await import("~/env.mjs");
  const appAddress = env.NEXT_PUBLIC_NODE_ENV === "development" 
    ? env.NEXT_PUBLIC_APP_ADDRESS_TESTNET 
    : env.NEXT_PUBLIC_APP_ADDRESS;

  const authenticated = await publicClient.login({
    onboardingUser: {
      app: appAddress || "0x30d66188F860374cF8AC8A4354E7f537532ed13b",
      wallet: address,
    },
    signMessage,
  });

  if (authenticated.isErr()) {
    console.error(authenticated.error);
    return null;
  }

  return authenticated.value;
};

export const getAccountOwnerClient = async (
  ownerAddress: string,
  accountAddress: string,
  signMessage: (message: string) => Promise<string>,
) => {
  if (!ownerAddress || !accountAddress) return null;

  const authenticated = await publicClient.login({
    accountOwner: {
      account: accountAddress,
      app: "0x30d66188F860374cF8AC8A4354E7f537532ed13b",
      owner: ownerAddress,
    },
    signMessage,
  });

  if (authenticated.isErr()) {
    console.error(authenticated.error);
    return null;
  }

  return authenticated.value;
};

export const getLensClient = async (): Promise<AnyClient> => {
  const resumed = await publicClient.resumeSession();
  if (resumed.isErr()) {
    // console.error(resumed.error);
    return publicClient;
  }

  return resumed.value;
};
