'use client';

import dynamic from 'next/dynamic';

// Dynamically import wallet button to avoid SSR issues with wallet adapter
const WalletMultiButton = dynamic(
  () =>
    import('@solana/wallet-adapter-react-ui').then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

/**
 * Cyberpunk-styled wallet connect button.
 * Overrides the default Solana wallet adapter purple theme.
 */
export function WalletButton() {
  return (
    <div className="wallet-button-wrapper">
      <WalletMultiButton
        style={{
          background: 'rgba(57, 255, 20, 0.1)',
          border: '1px solid rgba(57, 255, 20, 0.3)',
          borderRadius: '12px',
          color: '#39ff14',
          fontSize: '13px',
          fontWeight: 600,
          height: '36px',
          padding: '0 16px',
          transition: 'all 0.2s',
          fontFamily: 'inherit',
        }}
      />
    </div>
  );
}
