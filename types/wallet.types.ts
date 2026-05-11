export type WalletStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

export type NetworkType = 'devnet' | 'mainnet-beta' | 'testnet';

export interface WalletInfo {
  address: string;
  balance: number; // in SOL
  status: WalletStatus;
  network: NetworkType;
  lastUpdated: string;
}
