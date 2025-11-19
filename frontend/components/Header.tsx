"use client";

import { ConnectKitButton } from "connectkit";

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Nexus Protocol</h1>

        <ConnectKitButton />
      </div>
    </header>
  );
}
