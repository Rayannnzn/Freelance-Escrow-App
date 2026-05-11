import { Metadata } from 'next';
import { CreateEscrowForm } from '@/components/forms/CreateEscrowForm';

export const metadata: Metadata = {
  title: 'Initialize New Escrow — KineTex',
  description: 'Deploy a trustless escrow smart contract on Solana Devnet.',
};

export default function CreateEscrowPage() {
  return <CreateEscrowForm />;
}
