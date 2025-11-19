export interface OrderForm {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  maxSlippage: number;
  deadline: number;
}

export interface OrderStatus {
  orderId: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  immediateExecution: {
    amount: string;
    received: string;
    txHash: string;
  };
  aiRoute: 'dark_pool' | 'twap_vault' | null;
  twapProgress?: {
    currentChunk: number;
    totalChunks: number;
    nextExecutionTime: number;
  };
  yieldEarned: string;
  remainingAmount: string;
}

export interface EstimateData {
  immediatePercentage: number;
  aiRoutedPercentage: number;
  estimatedRoute: string;
  estimatedYield: string;
}

export type OrderSize = 'small' | 'large';

export interface Token {
  symbol: string;
  address: string;
  decimals: number;
}
