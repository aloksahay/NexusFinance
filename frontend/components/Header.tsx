"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { formatAddress } from "@/lib/utils/formatters";
import { LogoMark } from "@/components/LogoMark";

export function Header() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <header className="border-b border-gray-800 bg-black">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <LogoMark />
          <h1 className="text-2xl font-bold text-white">Nexus Finance</h1>
        </div>

        {isConnected ? (
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-lime-500/20 text-lime-400 text-xs font-medium rounded-full border border-lime-500/30">
              Rayls Testnet
            </span>
            <span className="text-sm text-gray-400">{formatAddress(address || "")}</span>
            <button
              onClick={() => disconnect()}
              className="px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={() => connect({ connector: connectors[0] })}
            className="px-4 py-2 bg-lime-500 text-black font-semibold rounded-lg hover:bg-lime-400 transition-colors"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
}
