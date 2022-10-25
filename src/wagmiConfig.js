import { configureChains, chain, createClient } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { InjectedConnector } from "wagmi/connectors/injected";

const { chains, provider, webSocketProvider } = configureChains(
  [chain.mainnet, chain.polygon],
  [publicProvider()]
);

const WagmiClient = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains: [chain.mainnet, chain.optimism] }),
    new WalletConnectConnector({
      chains: [chain.mainnet, chain.optimism],
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains: [chain.mainnet, chain.optimism],
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
});

export default WagmiClient;
