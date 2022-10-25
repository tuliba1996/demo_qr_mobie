import { configureChains, chain, createClient } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider, webSocketProvider } = configureChains(
  [chain.mainnet, chain.polygon],
  [publicProvider()]
);

const WagmiClient = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

export default WagmiClient;
