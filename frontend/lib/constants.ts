import { Token } from "@/types/order";

export const TOKENS_IN: Token[] = [
  { symbol: "USDC", address: "0x...", decimals: 6 },
  { symbol: "USDT", address: "0x...", decimals: 6 },
  { symbol: "DAI", address: "0x...", decimals: 18 },
];

export const TOKENS_OUT: Token[] = [
  { symbol: "ETH", address: "0x...", decimals: 18 },
  { symbol: "WETH", address: "0x...", decimals: 18 },
  { symbol: "WBTC", address: "0x...", decimals: 8 },
];

export const SLIPPAGE_OPTIONS = [0.1, 0.3, 0.5, 1.0, 2.0];
export const DEADLINE_OPTIONS = [
  { label: "30 min", value: 30 },
  { label: "1 hour", value: 60 },
  { label: "2 hours", value: 120 },
  { label: "4 hours", value: 240 },
];

export const LARGE_ORDER_THRESHOLD = 10000; // $10k
