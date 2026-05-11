import { EscrowErrorCode } from './types';

// ─── Custom error map ───────────────────────────────────────────────────────
interface ParsedError {
  code: number | null;
  title: string;
  description: string;
}

const ERROR_MAP: Record<number, { title: string; description: string }> = {
  [EscrowErrorCode.AmountTooSmall]: {
    title: 'Amount Too Small',
    description: 'Deposit amount must be at least 0.01 SOL.',
  },
  [EscrowErrorCode.InvalidTimeout]: {
    title: 'Invalid Timeout',
    description: 'The timeout must be a future Unix timestamp.',
  },
  [EscrowErrorCode.AlreadySubmitted]: {
    title: 'Already Submitted',
    description: 'Work has already been submitted for this escrow.',
  },
  [EscrowErrorCode.AlreadyApproved]: {
    title: 'Already Approved',
    description: 'This escrow work has already been approved and paid out.',
  },
  [EscrowErrorCode.WorkNotSubmitted]: {
    title: 'Work Not Submitted',
    description: 'The freelancer has not submitted work yet.',
  },
  [EscrowErrorCode.NoTimeoutSet]: {
    title: 'No Timeout Set',
    description: 'No timeout was configured on this escrow.',
  },
  [EscrowErrorCode.TimeoutNotReached]: {
    title: 'Timeout Not Reached',
    description: 'The timeout deadline has not been reached yet.',
  },
};

/**
 * Parse any error thrown by Anchor/Solana into a user-friendly message.
 */
export function parseEscrowError(error: unknown): ParsedError {
  // Handle user rejection
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (msg.includes('user rejected') || msg.includes('user denied') || msg.includes('user cancelled')) {
      return {
        code: null,
        title: 'Transaction Cancelled',
        description: 'You rejected the transaction in your wallet.',
      };
    }
  }

  // Try to extract Anchor error code
  const errorStr = String(error);

  // Match custom program error code
  const codeMatch = errorStr.match(/custom program error:\s*0x([0-9a-fA-F]+)/i)
    || errorStr.match(/Error Code:\s*(\w+)\.\s*Error Number:\s*(\d+)/i)
    || errorStr.match(/Error Number:\s*(\d+)/i);

  if (codeMatch) {
    let code: number;
    if (codeMatch[0].includes('0x')) {
      code = parseInt(codeMatch[1], 16);
    } else {
      code = parseInt(codeMatch[2] || codeMatch[1], 10);
    }

    const mapped = ERROR_MAP[code];
    if (mapped) {
      return { code, ...mapped };
    }
    return {
      code,
      title: 'Program Error',
      description: `The smart contract returned error code ${code}.`,
    };
  }

  // Insufficient funds
  if (errorStr.includes('insufficient funds') || errorStr.includes('Insufficient')) {
    return {
      code: null,
      title: 'Insufficient Funds',
      description: 'You do not have enough SOL in your wallet for this transaction.',
    };
  }

  // Blockhash expired
  if (errorStr.includes('block height exceeded') || errorStr.includes('Blockhash not found')) {
    return {
      code: null,
      title: 'Transaction Expired',
      description: 'The transaction expired. Please try again.',
    };
  }

  // Generic fallback
  return {
    code: null,
    title: 'Transaction Failed',
    description: error instanceof Error ? error.message : 'An unexpected error occurred.',
  };
}
