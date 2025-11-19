"use client";

import { OrderStatus } from "@/types/order";
import { formatCurrency, formatTimeRemaining } from "@/lib/utils/formatters";
import { useEffect, useState } from "react";

interface Props {
  orderStatus: OrderStatus;
}

export function ExecutionMonitor({ orderStatus }: Props) {
  const [yieldEarned, setYieldEarned] = useState(parseFloat(orderStatus.yieldEarned));

  // Simulate yield counter incrementing
  useEffect(() => {
    if (orderStatus.aiRoute === "twap_vault" && orderStatus.status === "executing") {
      const interval = setInterval(() => {
        setYieldEarned((prev) => prev + 0.01);
      }, 5000); // Update every 5 seconds

      return () => clearInterval(interval);
    }
  }, [orderStatus.aiRoute, orderStatus.status]);

  const progress =
    orderStatus.twapProgress
      ? (orderStatus.twapProgress.currentChunk / orderStatus.twapProgress.totalChunks) * 100
      : 0;

  const timeUntilNext = orderStatus.twapProgress
    ? Math.floor((orderStatus.twapProgress.nextExecutionTime - Date.now()) / 1000)
    : 0;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-lg p-6 max-w-2xl mx-auto mt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Order Execution Status</h2>
        <p className="text-gray-400">Order #{orderStatus.orderId}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium text-gray-300">Progress:</span>
          <span className="text-gray-400">{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-3">
          <div
            className="bg-lime-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Status Cards */}
      <div className="space-y-4">
        {/* Immediate Execution Card */}
        <div className="border border-lime-500/30 bg-lime-500/10 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-lime-400 text-xl">✓</span>
            <div className="flex-1">
              <h3 className="font-semibold text-white">COMPLETED</h3>
              <p className="text-gray-300 mt-1">Immediate Execution</p>
              <p className="text-sm text-gray-400 mt-2">
                {formatCurrency(orderStatus.immediateExecution.amount)} USDC →{" "}
                {orderStatus.immediateExecution.received} ETH
              </p>
              <p className="text-sm text-gray-400">
                Price: {formatCurrency(2551)}/ETH
              </p>
              <a
                href={`https://devnet-explorer.rayls.com/tx/${orderStatus.immediateExecution.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-lime-400 hover:underline mt-1 inline-block"
              >
                View Transaction →
              </a>
            </div>
          </div>
        </div>

        {/* AI Routing Card */}
        {orderStatus.aiRoute && (
          <div
            className={`border rounded-lg p-4 ${
              orderStatus.status === "completed"
                ? "border-lime-500/30 bg-lime-500/10"
                : "border-yellow-500/30 bg-yellow-500/10"
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl">
                {orderStatus.status === "completed" ? "✓" : "⏳"}
              </span>
              <div className="flex-1">
                <h3 className="font-semibold text-white">
                  {orderStatus.status === "completed" ? "COMPLETED" : "IN PROGRESS"}
                </h3>
                <p className="text-gray-300 mt-1">AI Routing Decision</p>
                <p className="text-sm text-gray-400 mt-2">
                  Route:{" "}
                  {orderStatus.aiRoute === "twap_vault"
                    ? "TWAP + Vault"
                    : "Dark Pool"}
                </p>
                {orderStatus.twapProgress && orderStatus.status === "executing" && (
                  <p className="text-sm text-gray-400">
                    Status: Executing chunk {orderStatus.twapProgress.currentChunk} of{" "}
                    {orderStatus.twapProgress.totalChunks}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Yield Card (TWAP only) */}
        {orderStatus.aiRoute === "twap_vault" && (
          <div className="border border-lime-500/30 bg-lime-500/10 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">💰</span>
              <div className="flex-1">
                <h3 className="font-semibold text-white">YIELD EARNED</h3>
                <p className="text-2xl font-bold text-lime-400 mt-2">
                  {formatCurrency(yieldEarned)} USDC
                  {orderStatus.status === "executing" && (
                    <span className="text-base font-normal text-gray-400">
                      {" "}
                      (and counting...)
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-400 mt-2">APY: 5.4% (Aave)</p>
                <p className="text-sm text-gray-400">Time in vault: 42 minutes</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Remaining Info */}
      {orderStatus.status === "executing" && (
        <div className="mt-6 p-4 bg-gray-800 border border-gray-700 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Remaining:</span>
            <span className="font-medium text-white">
              {formatCurrency(orderStatus.remainingAmount)} USDC
            </span>
          </div>
          {timeUntilNext > 0 && (
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-400">Next execution:</span>
              <span className="font-medium text-white">~{formatTimeRemaining(timeUntilNext)}</span>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6">
        <a
          href={`https://devnet-explorer.rayls.com/tx/${orderStatus.immediateExecution.txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors text-center"
        >
          View on Explorer
        </a>
        {orderStatus.status === "executing" && (
          <button className="flex-1 px-4 py-2 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors">
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
}
