import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useWallet, WalletType } from '../WalletContext';
import { useLanguage } from '../LanguageContext';
import { X, Check, Copy, Power, ShieldCheck, HelpCircle, ArrowRight, Loader2, Info } from 'lucide-react';

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConnectWalletModal({ isOpen, onClose }: ConnectWalletModalProps) {
  const { walletAddress, walletType, isConnected, isConnecting, connect, disconnect } = useWallet();
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'connect' | 'info'>(isConnected ? 'info' : 'connect');
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null);
  const [connectionStep, setConnectionStep] = useState<string>('');
  const [walletBalances, setWalletBalances] = useState<Record<string, number>>({});
  const [solPrice, setSolPrice] = useState(182.50);

  // Sync wallet balances
  React.useEffect(() => {
    const fetchBalances = () => {
      if (isConnected && walletAddress) {
        const key = `solaxy_wallet_balances_${walletAddress}`;
        const saved = localStorage.getItem(key);
        let parsed = { '$SLX': 5000, 'SOL': 12.45 }; // Default with some SOL
        if (saved) {
          try {
            parsed = { ...parsed, ...JSON.parse(saved) };
          } catch (e) {}
        }
        setWalletBalances(parsed);
      } else {
        setWalletBalances({});
      }
    };
    
    const fetchPrices = async () => {
      try {
        const res = await fetch('/api/market/prices');
        if (res.ok) {
          const data = await res.json();
          const solData = data.find((item: any) => item.symbol === 'SOLUSDT');
          if (solData) {
            setSolPrice(parseFloat(solData.lastPrice));
          }
        }
      } catch (e) {}
    };

    fetchBalances();
    fetchPrices();
    window.addEventListener('solaxy-balance-updated', fetchBalances);
    return () => window.removeEventListener('solaxy-balance-updated', fetchBalances);
  }, [isConnected, walletAddress]);

  // Automatically switch tabs if connection status changes
  React.useEffect(() => {
    if (isConnected) {
      setActiveTab('info');
    } else {
      setActiveTab('connect');
    }
  }, [isConnected]);

  const handleConnect = async (type: WalletType) => {
    setSelectedWallet(type);
    
    // Step by step status simulation
    const steps = [
      t('Inicjowanie sesji portfela...', 'Initializing wallet session...'),
      t('Oczekiwanie na autoryzację podpisu...', 'Waiting for signature authorization...'),
      t('Synchronizacja z Solana Mainnet-Beta...', 'Synchronizing with Solana Mainnet-Beta...'),
      t('Połączono pomyślnie!', 'Successfully connected!')
    ];

    let currentStep = 0;
    setConnectionStep(steps[0]);

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setConnectionStep(steps[currentStep]);
      }
    }, 450);

    const success = await connect(type);
    clearInterval(interval);
    
    if (success) {
      setConnectionStep(steps[3]);
      setTimeout(() => {
        onClose();
        setSelectedWallet(null);
        setConnectionStep('');
      }, 500);
    } else {
      setSelectedWallet(null);
      setConnectionStep('');
    }
  };

  const handleCopyAddress = () => {
    if (!walletAddress) return;
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Shorten address helper
  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-6)}`;
  };

  // Phantom SVG path (The ghost)
  const PhantomIcon = () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13.5 16.5C11.57 16.5 10 14.93 10 13C10 11.07 11.57 9.5 13.5 9.5C15.43 9.5 17 11.07 17 13C17 14.93 15.43 16.5 13.5 16.5Z" fill="#AB9FF2"/>
      <path d="M13.5 11C12.4 11 11.5 11.9 11.5 13C11.5 14.1 12.4 15 13.5 15C14.6 15 15.5 14.1 15.5 13C15.5 11.9 14.6 11 13.5 11Z" fill="#1F1D2C"/>
      <circle cx="13.5" cy="13" r="1" fill="#FFFFFF"/>
      <path d="M7 11C6.45 11 6 11.45 6 12C6 12.55 6.45 13 7 13H8C8.55 13 9 12.55 9 12C9 11.45 8.55 11 8 11H7Z" fill="#AB9FF2"/>
    </svg>
  );

  // Solflare SVG path (The flare)
  const SolflareIcon = () => (
    <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.16 0 0 7.16 0 16C0 24.84 7.16 32 16 32C24.84 32 32 24.84 32 16C32 7.16 24.84 0 16 0ZM24.2 13.5H19.5L16.5 7.5L13.5 13.5H8.8L12.5 17.2L9.5 24.2L16 20.3L22.5 24.2L19.5 17.2L24.2 13.5Z" fill="url(#solflare_grad)"/>
      <defs>
        <linearGradient id="solflare_grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FC6238"/>
          <stop offset="100%" stopColor="#F9A01B"/>
        </linearGradient>
      </defs>
    </svg>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isConnecting ? undefined : onClose}
            className="absolute inset-0 bg-[#000208]/90 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-[440px] border border-g/15 bg-[#030712] p-6 shadow-[0_0_50px_rgba(0,255,136,0.15)] rounded overflow-hidden z-10 font-mono"
          >
            {/* Ambient background glows */}
            <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-g/5 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-cyan/5 blur-3xl pointer-events-none" />

            {/* Corner retro details */}
            <span className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-g/40" />
            <span className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-g/40" />
            <span className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-g/40" />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-g/40" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-g" />
                <span className="text-[11px] tracking-[3px] text-white font-extrabold uppercase">
                  {isConnected ? t('ZARZĄDZANIE PORTFELEM', 'WALLET MANAGEMENT') : t('AUTORYZACJA PORTFELA', 'CONNECT WALLET')}
                </span>
              </div>
              <button
                onClick={onClose}
                disabled={isConnecting}
                className="text-white/40 hover:text-white transition-colors cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed bg-transparent border-none p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Tabs */}
            {activeTab === 'connect' ? (
              <div className="space-y-4">
                <p className="text-[11px] text-white/50 leading-relaxed mb-4">
                  {t(
                    'Wybierz zaufanego dostawcę portfela Solana, aby autoryzować sesję handlową na platformie Solaxy.',
                    'Select a trusted Solana wallet provider to authorize your trading session on the Solaxy platform.'
                  )}
                </p>

                {isConnecting ? (
                  /* Connecting Loading State */
                  <div className="py-8 flex flex-col items-center justify-center space-y-4 border border-g/10 bg-g/5 rounded">
                    <Loader2 className="w-10 h-10 text-g animate-spin" />
                    <div className="text-center space-y-1.5">
                      <span className="text-[11px] font-bold text-g uppercase tracking-[1px] block">
                        {selectedWallet === 'phantom' ? 'Phantom Secure Connect' : 'Solflare Safe Connect'}
                      </span>
                      <span className="text-[9px] text-white/50 font-mono animate-pulse block">
                        {connectionStep}
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Wallets List */
                  <div className="space-y-3">
                    {/* Phantom Wallet */}
                    <button
                      onClick={() => handleConnect('phantom')}
                      className="w-full flex items-center justify-between p-3.5 border border-white/5 bg-black/40 hover:border-[#AB9FF2]/50 hover:bg-[#AB9FF2]/5 hover:shadow-[0_0_15px_rgba(171,159,242,0.1)] transition-all duration-300 rounded group text-left cursor-pointer font-mono"
                    >
                      <div className="flex items-center gap-3">
                        <PhantomIcon />
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-[#AB9FF2] transition-colors">
                            Phantom Wallet
                          </div>
                          <div className="text-[8px] text-white/30 uppercase tracking-[1px] mt-0.5">
                            {t('DLA SOLANA SVM', 'FOR SOLANA SVM')}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-[#AB9FF2] group-hover:translate-x-1 transition-all" />
                    </button>

                    {/* Solflare Wallet */}
                    <button
                      onClick={() => handleConnect('solflare')}
                      className="w-full flex items-center justify-between p-3.5 border border-white/5 bg-black/40 hover:border-[#FC6238]/50 hover:bg-[#FC6238]/5 hover:shadow-[0_0_15px_rgba(252,98,56,0.1)] transition-all duration-300 rounded group text-left cursor-pointer font-mono"
                    >
                      <div className="flex items-center gap-3">
                        <SolflareIcon />
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-[#FC6238] transition-colors">
                            Solflare Wallet
                          </div>
                          <div className="text-[8px] text-white/30 uppercase tracking-[1px] mt-0.5">
                            {t('ZAAWANSOWANE DEFI', 'ADVANCED DEFI')}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-[#FC6238] group-hover:translate-x-1 transition-all" />
                    </button>
                  </div>
                )}

                {/* Secure Badge Info */}
                <div className="mt-6 flex items-start gap-2.5 p-3 border border-cyan/10 bg-[#04080f] rounded">
                  <Info className="w-4 h-4 text-cyan shrink-0 mt-0.5" />
                  <div className="text-[9px] text-cyan/70 leading-relaxed">
                    <span className="font-bold text-white block mb-0.5 uppercase tracking-[0.5px]">
                      {t('BEZPIECZEŃSTWO KONTRAKTÓW', 'CONTRACT SECURITY')}
                    </span>
                    {t(
                      'Solaxy wykorzystuje algorytm non-custodial. Żadne klucze prywatne nie są przechowywane u nas. Twoje transakcje są podpisywane lokalnie w portfelu.',
                      'Solaxy utilizes a non-custodial algorithm. No private keys are stored with us. Your transactions are signed locally within your wallet.'
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Connected Wallet Account Info Tab */
              <div className="space-y-5 animate-fadeIn">
                <div className="flex items-center justify-between p-3 border border-g/10 bg-g/5 rounded relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-g animate-ping inline-block mr-1" />
                    <span className="text-[7.5px] font-bold text-g uppercase tracking-[0.5px]">ACTIVE</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {walletType === 'phantom' ? <PhantomIcon /> : <SolflareIcon />}
                    <div>
                      <div className="text-xs font-bold text-white uppercase tracking-[1px]">
                        {walletType === 'phantom' ? 'Phantom Session' : 'Solflare Session'}
                      </div>
                      <div className="text-[9.5px] text-white/60 font-mono mt-1 select-all font-semibold">
                        {formatAddress(walletAddress || '')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Wallet Balances Section */}
                <div className="space-y-2">
                  <div className="text-[10px] text-white/50 font-bold uppercase tracking-[1px] mb-2 flex justify-between items-center">
                    <span>{t('Twoje Salda', 'Your Balances')}</span>
                    <span className="text-g text-[9px]">{t('LIVE PORTFOLIO', 'LIVE PORTFOLIO')}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(walletBalances).map(([token, amount]) => {
                      const isSol = token === 'SOL';
                      const tokenPrice = isSol ? solPrice : 1.50; // $SLX presale price
                      const numAmount = Number(amount) || 0;
                      const totalValue = numAmount * Number(tokenPrice);
                      
                      return (
                        <div key={token} className="p-3 border border-white/5 bg-black/40 hover:bg-white/5 transition-colors rounded flex items-center justify-between group cursor-default">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] border ${isSol ? 'bg-[#9945FF]/10 text-[#14F195] border-[#14F195]/20' : 'bg-g/10 text-g border-g/20'}`}>
                              {token.substring(0, 4).replace('$', '')}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white font-mono">{token}</div>
                              <div className="text-[9px] text-white/50 font-mono mt-0.5">
                                ${Number(tokenPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-sm text-white font-bold font-mono">
                              {numAmount.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                            </div>
                            <div className="text-[10px] text-g font-bold font-mono mt-0.5 group-hover:text-cyan transition-colors">
                              ~${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    {Object.keys(walletBalances).length === 0 && (
                      <div className="p-4 border border-white/5 bg-black/40 rounded text-center text-[10px] text-white/40">
                        {t('Portfel jest pusty', 'Wallet is empty')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleCopyAddress}
                    className="flex items-center justify-center gap-2 py-2 px-3 border border-white/5 bg-black/40 hover:bg-white/5 hover:border-white/25 text-[10px] text-white font-bold transition-all rounded cursor-pointer uppercase"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-g" />
                        <span className="text-g">{t('SKOPIOWANO', 'COPIED')}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-white/50" />
                        <span>{t('KOPIUJ ADRES', 'COPY ADDRESS')}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      disconnect();
                      onClose();
                    }}
                    className="flex items-center justify-center gap-2 py-2 px-3 border border-r/20 bg-r/5 hover:bg-r/15 hover:border-r text-[10px] text-r font-bold transition-all rounded cursor-pointer uppercase"
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{t('ROZŁĄCZ', 'DISCONNECT')}</span>
                  </button>
                </div>

                {/* Additional Network Sync stats */}
                <div className="space-y-2 pt-3 border-t border-white/5 text-[9px]">
                  <div className="flex justify-between items-center text-white/40">
                    <span>{t('Sieć Blockchain', 'Blockchain Network')}</span>
                    <span className="text-g font-bold uppercase">Solana Mainnet SVM</span>
                  </div>
                  <div className="flex justify-between items-center text-white/40">
                    <span>{t('Status Synchronizacji', 'Sync Status')}</span>
                    <span className="text-cyan font-semibold">100% SECURE_SYNC</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
