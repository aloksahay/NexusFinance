export const POOL_ABI = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "zeroForOne",
            type: "bool",
          },
          {
            internalType: "int256",
            name: "amountSpecified",
            type: "int256",
          },
          {
            internalType: "uint160",
            name: "sqrtPriceLimitX96",
            type: "uint160",
          },
        ],
        internalType: "struct SwapParams",
        name: "params",
        type: "tuple",
      },
      {
        internalType: "bytes",
        name: "hookData",
        type: "bytes",
      },
    ],
    name: "swap",
    outputs: [
      {
        internalType: "BalanceDelta",
        name: "",
        type: "int256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "orderId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "OrderRouted",
    type: "event",
  },
] as const;
