export interface WalletState {
  connected: boolean;
  address: string | null;
  balance: Record<string, string>;
  network: string | null;
}
