"use client";

import { useState, useEffect } from "react";
import { OrderForm as OrderFormType } from "@/types/order";
import {
  TOKENS_IN,
  TOKENS_OUT,
  SLIPPAGE_OPTIONS,
  DEADLINE_OPTIONS,
  LARGE_ORDER_THRESHOLD,
} from "@/lib/constants";
import { formatCurrency, formatNumber } from "@/lib/utils/formatters";
import { useSwap } from "@/hooks/useSwap";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import { useAccount, useSwitchChain } from "wagmi";
import { RAYLS_CONTRACTS, raylsTestnet } from "@/lib/networks";

export function OrderForm() {
  const { isConnected, address, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const { swap, isPending, isConfirming, isSuccess, error, hash } = useSwap();

  // Check if user is on the correct network
  // If chain is undefined, assume we're on the correct network (connected state will handle this)
  const isCorrectNetwork = !chain || chain.id === raylsTestnet.id;

  // Fetch token balances
  const { formattedBalance: usdcBalance } = useTokenBalance(
    RAYLS_CONTRACTS.USDC,
    address,
    18
  );
  const { formattedBalance: nxxBalance } = useTokenBalance(
    RAYLS_CONTRACTS.NXX,
    address,
    18
  );

  const [formData, setFormData] = useState<OrderFormType>({
    tokenIn: "USDC",
    tokenOut: "NXX",
    amountIn: "",
    maxSlippage: 0.5,
    deadline: 60,
  });

  const amountNum = parseFloat(formData.amountIn) || 0;
  const isLargeOrder = amountNum >= LARGE_ORDER_THRESHOLD;

  // Calculate estimated output based on 1 NXX = 200 USDC
  const NXX_PRICE = 200;
  const calculateEstimatedOutput = () => {
    if (!amountNum || amountNum <= 0) return "0.0";

    if (formData.tokenIn === "USDC" && formData.tokenOut === "NXX") {
      // USDC to NXX: divide by price
      return formatNumber(amountNum / NXX_PRICE, 4);
    } else if (formData.tokenIn === "NXX" && formData.tokenOut === "USDC") {
      // NXX to USDC: multiply by price
      return formatNumber(amountNum * NXX_PRICE, 2);
    }
    return "0.0";
  };

  // Open monitor when transaction is submitted (hash available)
  useEffect(() => {
    if (hash) {
      console.log("Transaction submitted! Hash:", hash);
      console.log("Opening monitor window...");

      // Build URL with transaction data
      const params = new URLSearchParams({
        hash: hash,
        tokenIn: formData.tokenIn,
        tokenOut: formData.tokenOut,
        amountIn: formData.amountIn,
        estimatedOut: calculateEstimatedOutput(),
      });

      const monitorWindow = window.open(`/monitor?${params.toString()}`, "_blank", "noopener,noreferrer");
      if (!monitorWindow) {
        console.error("Failed to open monitor window - popup may be blocked");
        alert("Please allow popups for this site to see the transaction monitor");
      } else {
        console.log("Monitor window opened successfully");
      }
    }
  }, [hash]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    if (!formData.amountIn || amountNum <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      await swap(formData.tokenIn, formData.tokenOut, formData.amountIn);
    } catch (err) {
      console.error("Swap failed:", err);
    }
  };

  return (
    <div className="relative max-w-2xl mx-auto overflow-hidden rounded-2xl border border-lime-500/30 bg-gradient-to-br from-black via-gray-900 to-black p-6 shadow-[0_25px_80px_rgba(132,204,22,0.15)]">
      <div className="absolute inset-0 rounded-2xl border border-lime-500/10 blur-xl pointer-events-none" />
      <h2 className="text-2xl font-bold mb-6 text-white">Submit Swap Order</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* From Token */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            From
          </label>
          <div className="flex gap-4">
            <select
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
              value={formData.tokenIn}
              onChange={(e) =>
                setFormData({ ...formData, tokenIn: e.target.value })
              }
            >
              {TOKENS_IN.map((token) => (
                <option key={token.symbol} value={token.symbol}>
                  {token.symbol}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="0.0"
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
              value={formData.amountIn}
              onChange={(e) =>
                setFormData({ ...formData, amountIn: e.target.value })
              }
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Balance: {isConnected ? `${formatNumber(parseFloat(formData.tokenIn === "USDC" ? usdcBalance : nxxBalance), 2)} ${formData.tokenIn}` : "Connect wallet"}
          </p>
        </div>

        {/* To Token */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            To
          </label>
          <div className="flex gap-4">
            <select
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
              value={formData.tokenOut}
              onChange={(e) =>
                setFormData({ ...formData, tokenOut: e.target.value })
              }
            >
              {TOKENS_OUT.map((token) => (
                <option key={token.symbol} value={token.symbol}>
                  {token.symbol}
                </option>
              ))}
            </select>

            <div className="flex-1 px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-400">
              ~{calculateEstimatedOutput()} {formData.tokenOut}
            </div>
          </div>
        </div>

        {/* Slippage */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Max Slippage: {formData.maxSlippage}%
          </label>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={formData.maxSlippage}
            onChange={(e) =>
              setFormData({ ...formData, maxSlippage: parseFloat(e.target.value) })
            }
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-lime-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0.1%</span>
            <span>2%</span>
          </div>
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Deadline
          </label>
          <div className="relative">
            <select
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent appearance-none pr-10"
              value={formData.deadline}
              onChange={(e) =>
                setFormData({ ...formData, deadline: parseInt(e.target.value) })
              }
            >
              {DEADLINE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-lime-400">
              <svg
                className="h-3 w-3"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>

        {/* Order Size Indicator */}
        <div className="border-t border-gray-800 pt-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                isLargeOrder ? "bg-lime-500" : "bg-gray-600"
              }`}
            />
            <span className="font-medium text-white">
              {isLargeOrder ? "Smart Router" : "Direct Order"}
            </span>
            <span className="text-sm text-gray-400">
              {isLargeOrder
                ? `(≥${formatCurrency(LARGE_ORDER_THRESHOLD)}) - AI-optimized routing ✓`
                : `(<${formatCurrency(LARGE_ORDER_THRESHOLD)}) - Instant execution`}
            </span>
          </div>
        </div>

        {/* Estimation Panel (only for large orders) */}
        {isLargeOrder && (
          <div className="bg-gray-800 border border-lime-500/30 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-3">
              Estimated Execution:
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex justify-between">
                <span>• Immediate:</span>
                <span className="font-medium text-white">
                  2.5% (~{formatCurrency(amountNum * 0.025)})
                </span>
              </li>
              <li className="flex justify-between">
                <span>• AI Routed:</span>
                <span className="font-medium text-white">
                  97.5% (~{formatCurrency(amountNum * 0.975)})
                </span>
              </li>
              <li className="flex justify-between">
                <span>• Est. Route:</span>
                <span className="font-medium text-lime-400">Dark Pool / TWAP</span>
              </li>
              <li className="flex justify-between">
                <span>• Est. Yield:</span>
                <span className="font-medium text-lime-400">
                  +{formatCurrency(2.15)} while waiting
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 px-6 bg-lime-500 text-black font-semibold rounded-lg hover:bg-lime-400 transition-colors disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
          disabled={
            !isConnected ||
            isPending ||
            isConfirming ||
            !!hash ||
            !formData.amountIn ||
            amountNum <= 0
          }
        >
          {!isConnected
            ? "Connect Wallet"
            : isPending
            ? "Waiting for approval..."
            : isConfirming || hash
            ? "Processing..."
            : !formData.amountIn
            ? "Enter Amount"
            : amountNum <= 0
            ? "Invalid Amount"
            : "Submit Order"}
        </button>

        {/* Error message */}
        {error && (
          <div className="text-red-400 text-sm text-center">
            Error: {error.message}
          </div>
        )}
      </form>
    </div>
  );
}
