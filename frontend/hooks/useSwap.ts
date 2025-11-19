import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";
import { POOL_ABI } from "@/lib/contracts/poolAbi";
import { RAYLS_CONTRACTS } from "@/lib/networks";

export function useSwap() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const swap = async (
    tokenIn: string,
    tokenOut: string,
    amountIn: string
  ) => {
    // Determine swap direction (USDC -> NXX is true, NXX -> USDC is false)
    const zeroForOne = tokenIn === "USDC" && tokenOut === "NXX";

    // Convert amount to the proper unit (both USDC and NXX are 18 decimals)
    const decimals = 18;
    const amountSpecified = parseUnits(amountIn, decimals);

    // Default sqrtPriceLimitX96 (essentially no limit)
    // For zeroForOne=true, use MIN_SQRT_RATIO + 1
    // For zeroForOne=false, use MAX_SQRT_RATIO - 1
    const sqrtPriceLimitX96 = zeroForOne
      ? BigInt("4295128740") // MIN_SQRT_RATIO + 1
      : BigInt("1461446703485210103287273052203988822378723970341"); // MAX_SQRT_RATIO - 1

    const params = {
      zeroForOne,
      amountSpecified: -BigInt(amountSpecified.toString()), // Negative for exact input
      sqrtPriceLimitX96,
    };

    try {
      writeContract({
        address: RAYLS_CONTRACTS.POOL as `0x${string}`,
        abi: POOL_ABI,
        functionName: "swap",
        args: [params, "0x"], // Empty bytes for hookData
      });
    } catch (err) {
      console.error("Swap error:", err);
      throw err;
    }
  };

  return {
    swap,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}
