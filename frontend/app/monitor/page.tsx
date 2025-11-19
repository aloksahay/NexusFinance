"use client";

import { Header } from "@/components/Header";
import { ExecutionMonitor } from "@/components/ExecutionMonitor";
import { MOCK_ORDER_STATUS } from "@/lib/mocks/orderStatus";

export default function MonitorPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <ExecutionMonitor orderStatus={MOCK_ORDER_STATUS} />
      </main>
    </div>
  );
}

