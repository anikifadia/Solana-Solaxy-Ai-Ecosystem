import React, { createContext, useContext, useState, useEffect } from 'react';

export type WalletType = 'phantom' | 'solflare';

interface WalletContextType {
  walletAddress: string | null;
  walletType: WalletType | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: (type: WalletType) => Promise<boolean>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<WalletType | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  // Load from localStorage on init
  useEffect(() => {
    const savedAddress = localStorage.getItem('solaxy_wallet_address');
    const savedType = localStorage.getItem('solaxy_wallet_type');
    if (savedAddress && (savedType === 'phantom' || savedType === 'solflare')) {
      setWalletAddress(savedAddress);
      setWalletType(savedType as WalletType);
    }
  }, []);

  const connect = async (type: WalletType): Promise<boolean> => {
    setIsConnecting(true);
    
    try {
      // 1. Attempt Real connection if extension is injected
      if (type === 'phantom' && (window as any).solana?.isPhantom) {
        try {
          const resp = await (window as any).solana.connect();
          const pubKey = resp.publicKey.toString();
          setWalletAddress(pubKey);
          setWalletType('phantom');
          localStorage.setItem('solaxy_wallet_address', pubKey);
          localStorage.setItem('solaxy_wallet_type', 'phantom');
          setIsConnecting(false);
          return true;
        } catch (err) {
          console.warn("Phantom extension connection rejected/failed, falling back to simulated connection:", err);
        }
      } else if (type === 'solflare' && (window as any).solflare) {
        try {
          await (window as any).solflare.connect();
          const pubKey = (window as any).solflare.publicKey.toString();
          setWalletAddress(pubKey);
          setWalletType('solflare');
          localStorage.setItem('solaxy_wallet_address', pubKey);
          localStorage.setItem('solaxy_wallet_type', 'solflare');
          setIsConnecting(false);
          return true;
        } catch (err) {
          console.warn("Solflare extension connection rejected/failed, falling back to simulated connection:", err);
        }
      }

      // 2. Simulated Connection Fallback
      // Introduce an elegant delay to simulate blockchain/extension handshaking
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate a mock address matching the style of the chosen wallet
      let mockAddress = '';
      if (type === 'phantom') {
        mockAddress = 'PhanG7xR' + Array.from({ length: 24 }, () => 
          '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'[Math.floor(Math.random() * 58)]
        ).join('') + 'SolX';
      } else {
        mockAddress = 'SolfH8yS' + Array.from({ length: 24 }, () => 
          '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'[Math.floor(Math.random() * 58)]
        ).join('') + 'SolX';
      }

      setWalletAddress(mockAddress);
      setWalletType(type);
      localStorage.setItem('solaxy_wallet_address', mockAddress);
      localStorage.setItem('solaxy_wallet_type', type);
      setIsConnecting(false);
      return true;

    } catch (error) {
      console.error("Wallet connection failed:", error);
      setIsConnecting(false);
      return false;
    }
  };

  const disconnect = () => {
    setWalletAddress(null);
    setWalletType(null);
    localStorage.removeItem('solaxy_wallet_address');
    localStorage.removeItem('solaxy_wallet_type');
    
    // Also disconnect real wallets if possible
    try {
      if ((window as any).solana?.isPhantom) {
        (window as any).solana.disconnect();
      }
      if ((window as any).solflare) {
        (window as any).solflare.disconnect();
      }
    } catch (e) {
      // Ignored
    }
  };

  const isConnected = !!walletAddress;

  return (
    <WalletContext.Provider value={{ walletAddress, walletType, isConnected, isConnecting, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
