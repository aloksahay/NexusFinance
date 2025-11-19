import { useWatchContractEvent } from "wagmi";
import { POOL_ABI } from "@/lib/contracts/poolAbi";
import { RAYLS_CONTRACTS } from "@/lib/networks";

export function useOrderRouted(onOrderRouted: (orderId: string, amount: bigint) => void) {
  useWatchContractEvent({
    address: RAYLS_CONTRACTS.POOL as `0x${string}`,
    abi: POOL_ABI,
    eventName: "OrderRouted",
    onLogs(logs) {
      logs.forEach((log) => {
        if (log.args.orderId && log.args.amount) {
          console.log("OrderRouted event:", {
            orderId: log.args.orderId,
            amount: log.args.amount.toString(),
          });
          onOrderRouted(log.args.orderId as string, log.args.amount as bigint);
        }
      });
    },
  });
}
