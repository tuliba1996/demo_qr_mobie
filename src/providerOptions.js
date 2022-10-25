import WalletConnectProvider from "@walletconnect/web3-provider";
import { DEFAULD_NETWORK } from "./web3/constants/blockchain";

export const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        [DEFAULD_NETWORK]:
          "https://rinkeby.infura.io/v3/a62e5a1bde9a4ad198f1c6f16dd43f86",
      },
    },
  },
};
