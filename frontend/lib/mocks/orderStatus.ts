import { OrderStatus } from "@/types/order";

export const MOCK_ORDER_STATUS: OrderStatus = {
  orderId: "12345",
  status: "executing",
  immediateExecution: {
    amount: "1250",
    received: "0.49",
    txHash: "0xabc123def456...",
  },
  aiRoute: "twap_vault",
  twapProgress: {
    currentChunk: 3,
    totalChunks: 5,
    nextExecutionTime: Date.now() + 480000, // 8 minutes
  },
  yieldEarned: "1.82",
  remainingAmount: "28500",
};

export const MOCK_COMPLETED_ORDER: OrderStatus = {
  orderId: "12346",
  status: "completed",
  immediateExecution: {
    amount: "1250",
    received: "0.49",
    txHash: "0xabc123def456...",
  },
  aiRoute: "twap_vault",
  twapProgress: {
    currentChunk: 5,
    totalChunks: 5,
    nextExecutionTime: 0,
  },
  yieldEarned: "4.75",
  remainingAmount: "0",
};
