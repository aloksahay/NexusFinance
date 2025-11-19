"use client";

import { useState } from "react";
import { OrderForm as OrderFormType } from "@/types/order";
import {
  TOKENS_IN,
  TOKENS_OUT,
  SLIPPAGE_OPTIONS,
  DEADLINE_OPTIONS,
  LARGE_ORDER_THRESHOLD,
} from "@/lib/constants";
import { formatCurrency, formatNumber } from "@/lib/utils/formatters";

export function OrderForm() {
  const [formData, setFormData] = useState<OrderFormType>({
    tokenIn: "USDC",
    tokenOut: "ETH",
    amountIn: "",
    maxSlippage: 0.5,
    deadline: 60,
  });

  const amountNum = parseFloat(formData.amountIn) || 0;
  const isLargeOrder = amountNum >= LARGE_ORDER_THRESHOLD;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting order:", formData);
    // TODO: Implement order submission
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Submit Large Swap Order</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* From Token */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            From
          </label>
          <div className="flex gap-4">
            <select
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              value={formData.amountIn}
              onChange={(e) =>
                setFormData({ ...formData, amountIn: e.target.value })
              }
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">Balance: 50,000 USDC</p>
        </div>

        {/* To Token */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            To
          </label>
          <div className="flex gap-4">
            <select
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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

            <div className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600">
              ~19.8 ETH
            </div>
          </div>
        </div>

        {/* Slippage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0.1%</span>
            <span>2%</span>
          </div>
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deadline
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
        </div>

        {/* Order Size Indicator */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                isLargeOrder ? "bg-success" : "bg-gray-400"
              }`}
            />
            <span className="font-medium">
              {isLargeOrder ? "Large" : "Small"} Order
            </span>
            <span className="text-sm text-gray-600">
              {isLargeOrder
                ? `(≥${formatCurrency(LARGE_ORDER_THRESHOLD)}) - Smart routing ✓`
                : `(<${formatCurrency(LARGE_ORDER_THRESHOLD)}) - Direct execution`}
            </span>
          </div>
        </div>

        {/* Estimation Panel (only for large orders) */}
        {isLargeOrder && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              Estimated Execution:
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>• Immediate:</span>
                <span className="font-medium">
                  2.5% (~{formatCurrency(amountNum * 0.025)})
                </span>
              </li>
              <li className="flex justify-between">
                <span>• AI Routed:</span>
                <span className="font-medium">
                  97.5% (~{formatCurrency(amountNum * 0.975)})
                </span>
              </li>
              <li className="flex justify-between">
                <span>• Est. Route:</span>
                <span className="font-medium">Dark Pool / TWAP</span>
              </li>
              <li className="flex justify-between">
                <span>• Est. Yield:</span>
                <span className="font-medium text-success">
                  +{formatCurrency(2.15)} while waiting
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 px-6 bg-primary text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={!formData.amountIn || amountNum <= 0}
        >
          {!formData.amountIn
            ? "Enter Amount"
            : amountNum <= 0
            ? "Invalid Amount"
            : "Submit Order"}
        </button>
      </form>
    </div>
  );
}
