"use client";

import { Header } from "@/components/Header";
import { OrderForm } from "@/components/OrderForm";
import { ExecutionMonitor } from "@/components/ExecutionMonitor";
import { MOCK_ORDER_STATUS } from "@/lib/mocks/orderStatus";
import { useState } from "react";

export default function Home() {
  const [showMonitor, setShowMonitor] = useState(false);

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <OrderForm />

        {/* Demo: Show monitor with mock data */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowMonitor(!showMonitor)}
            className="px-6 py-2 bg-gray-900 text-lime-400 border border-gray-800 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {showMonitor ? "Hide" : "Show"} Demo Execution Monitor
          </button>
        </div>

        {showMonitor && <ExecutionMonitor orderStatus={MOCK_ORDER_STATUS} />}
      </main>
    </div>
  );
}
