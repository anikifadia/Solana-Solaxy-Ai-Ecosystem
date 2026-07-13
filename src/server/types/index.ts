export interface GeneratedToken {
  name: string;
  ticker: string;
  description: string;
  supply: number;
  iconType: string;
  colorGradient: string;
  anchorCode: string;
  initialPool?: number;
  remainingPool?: number;
  priceSol?: number;
  createdAt?: number;
}

export interface Contribution {
  id: string;
  address: string;
  amountSol: number;
  amountSlx: number;
  timestamp: number;
  signature: string;
}

export interface PresaleData {
  solRaisedBase: number;
  targetSol: number;
  receiverAddress: string;
  contributions: Contribution[];
}

export interface Miner {
  username: string;
  hashRate: number;
  balance: number;
  lastSeen: number;
  isOnline: boolean;
  totalMined: number;
}

export interface MiningActivity {
  id: string;
  username: string;
  action: string;
  amount: number;
  timestamp: string;
  details?: string;
}

export interface Withdrawal {
  id: string;
  username: string;
  amount: number;
  timestamp: string;
  wallet: string;
  status: string;
}
