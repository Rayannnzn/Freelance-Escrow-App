import { getSolanaNetwork } from './connection';

type ExplorerEntity = 'address' | 'tx' | 'block';

/**
 * Get a Solana Explorer URL for any entity type.
 */
export function getExplorerUrl(
  value: string,
  type: ExplorerEntity = 'address'
): string {
  const network = getSolanaNetwork();
  const cluster = network === 'mainnet-beta' ? '' : `?cluster=${network}`;
  return `https://explorer.solana.com/${type}/${value}${cluster}`;
}

export function getExplorerTxUrl(signature: string): string {
  return getExplorerUrl(signature, 'tx');
}

export function getExplorerAddressUrl(address: string): string {
  return getExplorerUrl(address, 'address');
}
