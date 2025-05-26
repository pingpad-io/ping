import { AnyClient, PublicClient, mainnet } from "@lens-protocol/client";
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

type SignFn = (message: string) => Promise<string>;

const loginWith = async (request: Parameters<typeof publicClient.login>[0], signMessage: SignFn) => {
  const authenticated = await publicClient.login({ ...request, signMessage });
  if (authenticated.isErr()) {
    console.error(authenticated.error);
    return null;
  }
  return authenticated.value;
};

export const getBuilderClient = async (address: string, signMessage: SignFn) => {
  if (!address) return null;
  return loginWith({ builder: { address } }, signMessage);
};

export const getOnboardingClient = async (address: string, signMessage: SignFn) => {
  if (!address) return null;
  return loginWith(
    {
      onboardingUser: {
        app: "0x30d66188F860374cF8AC8A4354E7f537532ed13b",
        wallet: address,
      },
    },
    signMessage,
  );
};

export const getAccountOwnerClient = async (ownerAddress: string, accountAddress: string, signMessage: SignFn) => {
  if (!ownerAddress || !accountAddress) return null;
  return loginWith(
    {
      accountOwner: {
        account: accountAddress,
        app: "0x30d66188F860374cF8AC8A4354E7f537532ed13b",
        owner: ownerAddress,
      },
    },
    signMessage,
  );
};

export const getLensClient = async (): Promise<AnyClient> => {
  const resumed = await publicClient.resumeSession();
  if (resumed.isErr()) {
    // console.error(resumed.error);
    return publicClient;
  }

  return resumed.value;
};
