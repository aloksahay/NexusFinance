import { defineChain } from "viem";

export const raylsTestnet = defineChain({
  id: 123123,
  name: "Rayls Testnet",
  nativeCurrency: {
    name: "USDgas",
    symbol: "USDgas",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://devnet-rpc.rayls.com"],
    },
    public: {
      http: ["https://devnet-rpc.rayls.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Rayls Explorer",
      url: "https://rayls-test-chain.explorer.caldera.xyz",
    },
  },
  testnet: true,
});
