import { useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { ERC20_ABI } from "@/lib/contracts/erc20Abi";

export function useTokenBalance(
  tokenAddress: string,
  userAddress: string | undefined,
  decimals: number = 18
) {
  const { data: balance, isLoading, refetch } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: userAddress ? [userAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!userAddress && !!tokenAddress,
    },
  });

  const formattedBalance = balance
    ? formatUnits(balance as bigint, decimals)
    : "0";

  return {
    balance,
    formattedBalance,
    isLoading,
    refetch,
  };
}
