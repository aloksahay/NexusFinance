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
      url: "https://devnet-explorer.rayls.com",
    },
  },
  testnet: true,
});

// Contract addresses on Rayls Testnet
export const RAYLS_CONTRACTS = {
  POOL: "0x71c34113a6A3E18C36db14D2D756dD6A7f08daC0",
  USDC: "0x613106b0cF1C765e877ae5cD8a8D40CfEE98EB62",
  NXX: "0x8e99D58dE0140e07331Fb388722906AE2499584c",
} as const;
