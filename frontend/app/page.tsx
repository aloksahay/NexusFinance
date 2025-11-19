"use client";

import { Header } from "@/components/Header";
import { OrderForm } from "@/components/OrderForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <OrderForm />
      </main>
    </div>
  );
}
