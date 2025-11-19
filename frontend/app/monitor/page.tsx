"use client";

import { Header } from "@/components/Header";
import { ExecutionMonitor } from "@/components/ExecutionMonitor";
import { useSearchParams } from "next/navigation";
import { OrderStatus } from "@/types/order";
import { Suspense, useState } from "react";
import { useOrderRouted } from "@/hooks/useOrderRouted";

function MonitorContent() {
  const searchParams = useSearchParams();

  const hash = searchParams.get("hash") || "0x...";
  const tokenIn = searchParams.get("tokenIn") || "USDC";
  const tokenOut = searchParams.get("tokenOut") || "NXX";
  const amountIn = searchParams.get("amountIn") || "0";
  const estimatedOut = searchParams.get("estimatedOut") || "0";

  const [orderCompleted, setOrderCompleted] = useState(false);
  const [routedAmount, setRoutedAmount] = useState<string | null>(null);

  // Listen for OrderRouted event
  useOrderRouted((orderId, amount) => {
    console.log("Order routed!", orderId, amount.toString());
    setOrderCompleted(true);
    setRoutedAmount(amount.toString());
  });

  // Build order status from URL params
  const orderStatus: OrderStatus = {
    orderId: hash.substring(0, 10),
    status: orderCompleted ? "completed" : "executing",
    immediateExecution: {
      amount: amountIn,
      received: estimatedOut,
      txHash: hash,
    },
    aiRoute: parseFloat(amountIn) >= 10000 ? "twap_vault" : null,
    twapProgress: parseFloat(amountIn) >= 10000 && !orderCompleted ? {
      currentChunk: 1,
      totalChunks: 5,
      nextExecutionTime: Date.now() + 480000,
    } : undefined,
    yieldEarned: "0",
    remainingAmount: parseFloat(amountIn) >= 10000 && !orderCompleted ? (parseFloat(amountIn) * 0.975).toString() : "0",
  };

  return <ExecutionMonitor orderStatus={orderStatus} tokenIn={tokenIn} tokenOut={tokenOut} />;
}

export default function MonitorPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Suspense fallback={<div className="text-white text-center">Loading...</div>}>
          <MonitorContent />
        </Suspense>
      </main>
    </div>
  );
}

