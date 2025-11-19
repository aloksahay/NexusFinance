import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { raylsTestnet } from "./networks";

export const config = createConfig({
  chains: [raylsTestnet],
  connectors: [injected()],
  transports: {
    [raylsTestnet.id]: http(),
  },
  ssr: true,
});
