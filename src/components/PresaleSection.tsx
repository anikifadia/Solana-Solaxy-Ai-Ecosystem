import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, Coins, ShieldCheck, Zap, History, Wallet, 
  ChevronRight, TrendingUp, Copy, Check, ExternalLink, QrCode, AlertTriangle 
} from 'lucide-react';
import { Connection, PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useLanguage } from '../LanguageContext';
import MASCOT_HERO from '../assets/images/solaxy_mascot_hero_1783437956325.jpg';

interface PurchaseRecord {
  id: string;
  address: string;
  amountSol: number;
  amountSlx: number;
  timeAgo: string;
  signature?: string;
}

export const PresaleSection: React.FC = () => {
  const { t } = useLanguage();

  // --- Countdown State & Real Presale Target Configuration ---
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [presaleStatus, setPresaleStatus] = useState<'UPCOMING' | 'LIVE' | 'ENDED'>('UPCOMING');

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      // Real start date: August 1st, 2026 00:00:00 (Local Time)
      const startDate = new Date('2026-08-01T00:00:00');
      // Real end date: 30 days after August 1st, i.e., August 31st, 2026 00:00:00 (Local Time)
      const endDate = new Date('2026-08-31T00:00:00');

      let targetDate = startDate;
      let status: 'UPCOMING' | 'LIVE' | 'ENDED' = 'UPCOMING';

      if (now < startDate) {
        targetDate = startDate;
        status = 'UPCOMING';
      } else if (now >= startDate && now < endDate) {
        targetDate = endDate;
        status = 'LIVE';
      } else {
        status = 'ENDED';
      }

      setPresaleStatus(status);

      if (status === 'ENDED') {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const diffMs = targetDate.getTime() - now.getTime();
      const diffSecs = Math.max(0, Math.floor(diffMs / 1000));

      const days = Math.floor(diffSecs / (3600 * 24));
      const hours = Math.floor((diffSecs % (3600 * 24)) / 3600);
      const minutes = Math.floor((diffSecs % 3600) / 60);
      const seconds = diffSecs % 60;

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Presale Live Stats ---
  const [solRaised, setSolRaised] = useState(0.00);
  const [targetSol, setTargetSol] = useState(20000);
  const [receiverAddress, setReceiverAddress] = useState('7KBXwNo6Jv2kGKoWui7TaKQL8TKHG780BPQNK39UXIQN');
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const progressPercent = Math.min(100, (solRaised / targetSol) * 100);

  // --- Wallet & Form State ---
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<'Phantom' | 'Solflare' | 'Demo' | 'Manual' | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const [payAmount, setPayAmount] = useState('2.5');
  const [isDemoMode, setIsDemoMode] = useState(true); // Default to Demo Mode for testing, can toggle
  const [manualSignature, setManualSignature] = useState('');
  const [manualAddressInput, setManualAddressInput] = useState('');
  
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const rate = 6666.67; // 1 SOL = 6666.67 $SLX
  const tokensReceived = parseFloat(payAmount) ? Math.round(parseFloat(payAmount) * rate) : 0;

  // Format single digits for the digital clock
  const formatTimeStr = (val: number) => {
    return val.toString().padStart(2, '0');
  };

  const formatTimeAgo = (timestamp: any) => {
    const elapsedMs = Date.now() - new Date(timestamp).getTime();
    const seconds = Math.floor(elapsedMs / 1000);
    if (seconds < 60) return `${Math.max(1, seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return new Date(timestamp).toLocaleDateString();
  };

  // Fetch real presale status from server
  const fetchPresaleStatus = async () => {
    try {
      const res = await fetch('/api/mining/status');
      if (res.ok) {
        const data = await res.json();
        if (data.presale) {
          setSolRaised(data.presale.solRaised);
          setTargetSol(data.presale.targetSol);
          setReceiverAddress(data.presale.receiverAddress);
          if (data.presale.contributions) {
            const formatted = data.presale.contributions.map((c: any) => ({
              id: c.id,
              address: c.address,
              amountSol: c.amountSol,
              amountSlx: c.amountSlx,
              timeAgo: formatTimeAgo(c.timestamp),
              signature: c.signature
            }));
            setPurchases(formatted);
          }
        }
      }
    } catch (e) {
      console.warn("Unable to fetch live presale stats:", e);
    }
  };

  useEffect(() => {
    fetchPresaleStatus();
    const interval = setInterval(fetchPresaleStatus, 8000);
    return () => clearInterval(interval);
  }, []);

  // --- Wallet Connection Flows ---
  const connectPhantom = async () => {
    setIsConnecting(true);
    setErrorMsg(null);
    try {
      const provider = (window as any).solana;
      if (provider && provider.isPhantom) {
        const resp = await provider.connect();
        const address = resp.publicKey.toString();
        setUserAddress(address);
        setWalletConnected(true);
        setWalletType('Phantom');
        setShowWalletModal(false);
        setSuccessMsg(t('Połączono pomyślnie z Phantom Wallet!', 'Connected successfully with Phantom Wallet!'));
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        // Fallback if extension not installed
        throw new Error(t(
          "Nie znaleziono wtyczki Phantom. Zainstaluj Phantom lub użyj trybu demo/manualnego.",
          "Phantom Wallet extension not found. Install it or use Demo/Manual mode."
        ));
      }
    } catch (e: any) {
      setErrorMsg(e.message || "Connection failed.");
      setTimeout(() => setErrorMsg(null), 5000);
    } finally {
      setIsConnecting(false);
    }
  };

  const connectSolflare = async () => {
    setIsConnecting(true);
    setErrorMsg(null);
    try {
      const provider = (window as any).solflare;
      if (provider) {
        await provider.connect();
        const address = provider.publicKey.toString();
        setUserAddress(address);
        setWalletConnected(true);
        setWalletType('Solflare');
        setShowWalletModal(false);
        setSuccessMsg(t('Połączono pomyślnie z Solflare!', 'Connected successfully with Solflare!'));
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        throw new Error(t(
          "Nie znaleziono wtyczki Solflare. Zainstaluj Solflare lub użyj trybu demo/manualnego.",
          "Solflare extension not found. Install it or use Demo/Manual mode."
        ));
      }
    } catch (e: any) {
      setErrorMsg(e.message || "Connection failed.");
      setTimeout(() => setErrorMsg(null), 5000);
    } finally {
      setIsConnecting(false);
    }
  };

  const connectDemoWallet = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setUserAddress("SolDeMo11119A2fZk9zPKoparkaSolaxy");
      setWalletConnected(true);
      setWalletType('Demo');
      setShowWalletModal(false);
      setIsConnecting(false);
      setSuccessMsg(t('Połączono pomyślnie z Sandbox Demo Wallet!', 'Connected successfully with Sandbox Demo Wallet!'));
      setTimeout(() => setSuccessMsg(null), 4000);
    }, 600);
  };

  const connectManualAddress = () => {
    const address = manualAddressInput.trim();
    if (address.length < 32 || address.length > 50) {
      setErrorMsg(t("Wprowadź poprawny adres Solana (32-50 znaków)!", "Enter a valid Solana address (32-50 chars)!"));
      return;
    }
    setUserAddress(address);
    setWalletConnected(true);
    setWalletType('Manual');
    setShowWalletModal(false);
    setManualAddressInput('');
    setSuccessMsg(t('Zarejestrowano adres płatności ręcznej!', 'Manual payment address registered!'));
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleDisconnect = () => {
    setWalletConnected(false);
    setUserAddress(null);
    setWalletType(null);
    setSuccessMsg(t("Portfel został rozłączony.", "Wallet disconnected."));
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // --- Copy Function ---
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(receiverAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- Purchase/Swap Execution ---
  const handleSwap = async () => {
    if (!walletConnected) {
      setErrorMsg(t('Najpierw połącz swój portfel!', 'Connect your wallet first!'));
      setShowWalletModal(true);
      return;
    }

    const sol = parseFloat(payAmount);
    if (isNaN(sol) || sol <= 0) {
      setErrorMsg(t('Wprowadź prawidłową kwotę SOL.', 'Enter a valid SOL amount.'));
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (isDemoMode || walletType === 'Demo' || walletType === 'Manual') {
        // Sandbox / Simulated purchase or manual tracking setup
        const fakeSignature = 'demo_tx_' + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
        
        const response = await fetch('/api/presale/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            signature: fakeSignature,
            userAddress: userAddress || 'SolDemo...Wallet',
            amountSol: sol,
            isDemo: true
          })
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Wystąpił błąd podczas symulacji.");
        }

        // Update local wallet balances
        if (userAddress) {
          const key = `solaxy_wallet_balances_${userAddress}`;
          const saved = localStorage.getItem(key);
          let currentBals: Record<string, number> = { '$SLX': 5000 };
          if (saved) {
            try {
              currentBals = JSON.parse(saved);
            } catch (e) {}
          }
          currentBals['$SLX'] = (currentBals['$SLX'] || 0) + tokensReceived;
          localStorage.setItem(key, JSON.stringify(currentBals));
          window.dispatchEvent(new Event('solaxy-balance-updated'));
        }

        setSuccessMsg(
          t(
            `Zakup udany (TRYB DEMO)! Otrzymałeś ${tokensReceived.toLocaleString()} $SLX. Transakcja została odnotowana w bazie.`,
            `Purchase successful (DEMO MODE)! Received ${tokensReceived.toLocaleString()} $SLX. Transaction logged in the database.`
          )
        );
        fetchPresaleStatus();
        setPayAmount('2.5');

      } else {
        // REAL SOLANA BLOCKCHAIN TRANSFER
        const provider = walletType === 'Phantom' ? (window as any).solana : (window as any).solflare;
        if (!provider || !provider.isConnected) {
          throw new Error(t("Twój portfel Web3 został rozłączony. Połącz ponownie.", "Your Web3 wallet has disconnected. Please reconnect."));
        }

        const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
        const fromPubkey = new PublicKey(userAddress!);
        const toPubkey = new PublicKey(receiverAddress);

        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey,
            toPubkey,
            lamports: Math.round(sol * LAMPORTS_PER_SOL),
          })
        );

        transaction.feePayer = fromPubkey;
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;

        // Sign and send
        const { signature } = await provider.signAndSendTransaction(transaction);

        setSuccessMsg(t(
          "Wysłano żądanie podpisu! Trwa weryfikacja transakcji na blockchainie...",
          "Signature request sent! Verifying transaction on the blockchain..."
        ));

        // Submit signature to backend
        const response = await fetch('/api/presale/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            signature,
            userAddress: userAddress!,
            amountSol: sol,
            isDemo: false
          })
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || t("Weryfikacja na blockchainie nie powiodła się. Sprawdź status za chwilę.", "Blockchain verification failed. Check status again shortly."));
        }

        // Update local wallet balances
        if (userAddress) {
          const key = `solaxy_wallet_balances_${userAddress}`;
          const saved = localStorage.getItem(key);
          let currentBals: Record<string, number> = { '$SLX': 5000 };
          if (saved) {
            try {
              currentBals = JSON.parse(saved);
            } catch (e) {}
          }
          currentBals['$SLX'] = (currentBals['$SLX'] || 0) + tokensReceived;
          localStorage.setItem(key, JSON.stringify(currentBals));
          window.dispatchEvent(new Event('solaxy-balance-updated'));
        }

        setSuccessMsg(
          t(
            `Zakup udany! Otrzymałeś ${tokensReceived.toLocaleString()} $SLX. Transakcja o podpisie ${signature.substring(0, 8)}... została potwierdzona na Solana.`,
            `Purchase successful! Received ${tokensReceived.toLocaleString()} $SLX. Transaction with signature ${signature.substring(0, 8)}... confirmed on Solana.`
          )
        );
        fetchPresaleStatus();
        setPayAmount('2.5');
      }
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e.message || t("Transakcja odrzucona lub błąd sieci Solana.", "Transaction rejected or Solana RPC error."));
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Manual Signature Submission ---
  const handleVerifyManualTx = async () => {
    const signature = manualSignature.trim();
    if (!signature) {
      setErrorMsg(t("Wklej poprawny ID transakcji (podpis)!", "Paste a valid transaction ID (signature)!"));
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const response = await fetch('/api/presale/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signature,
          userAddress: userAddress || 'ManualBuyer...Wallet',
          isDemo: isDemoMode // Respect the demo mode switch
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || t("Nie znaleziono transakcji o tym podpisie przesyłającej SOL do nas.", "No transaction with this signature transferring SOL to us was found."));
      }

      // Update local wallet balances
      const targetAddr = userAddress || 'ManualBuyer...Wallet';
      const key = `solaxy_wallet_balances_${targetAddr}`;
      const saved = localStorage.getItem(key);
      let currentBals: Record<string, number> = { '$SLX': 5000 };
      if (saved) {
        try {
          currentBals = JSON.parse(saved);
        } catch (e) {}
      }
      currentBals['$SLX'] = (currentBals['$SLX'] || 0) + data.contribution.amountSlx;
      localStorage.setItem(key, JSON.stringify(currentBals));
      window.dispatchEvent(new Event('solaxy-balance-updated'));

      setSuccessMsg(t(
        `Transakcja pomyślnie zweryfikowana! Przypisano ${data.contribution.amountSlx.toLocaleString()} $SLX do Twojego konta.`,
        `Transaction successfully verified! Assigned ${data.contribution.amountSlx.toLocaleString()} $SLX to your wallet.`
      ));
      setManualSignature('');
      fetchPresaleStatus();
    } catch (e: any) {
      setErrorMsg(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="presale" className="relative z-[5] py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto border-t border-g/10">
      
      {/* Decorative side markings */}
      <div className="absolute top-0 right-0 w-32 h-[1px] bg-gradient-to-r from-transparent to-g shadow-[0_0_8px_#00ff88]" />
      <div className="absolute bottom-0 left-0 w-32 h-[1px] bg-gradient-to-r from-g to-transparent shadow-[0_0_8px_#00ff88]" />

      <div className="text-center mb-16 select-none">
        {/* Beautiful responsive mascot image without modifications/cropping */}
        <div className="flex justify-center mb-8">
          <img 
            src={MASCOT_HERO} 
            alt="Solaxy Mascot" 
            className="w-full max-w-[280px] sm:max-w-[340px] h-auto rounded-2xl border border-g/20 shadow-[0_0_40px_rgba(0,255,136,0.25)] hover:border-g/40 transition-all duration-500 hover:scale-[1.02] select-none pointer-events-none"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="flex items-center justify-center gap-2 text-[10px] tracking-[5px] text-g/50 uppercase mb-4">
          <span className="w-6 h-[1px] bg-g shadow-[0_0_6px_#00ff88]" /> {
            presaleStatus === 'UPCOMING'
              ? t('PRZEDSPRZEDAŻ STARTUJE 1 SIERPNIA', 'PRESALE STARTS AUGUST 1ST')
              : presaleStatus === 'LIVE'
                ? t('URUCHOMIONO ETAP DRUGI PRZEDSPRZEDAŻY', 'PRESALE STAGE TWO IS ACTIVE')
                : t('PRZEDSPRZEDAŻ ZAKOŃCZONA', 'PRESALE HAS ENDED')
          }
        </div>
        <h2 className="font-display text-3xl md:text-5xl tracking-[2px] text-white uppercase">
          {t('ZABEZPIECZONY ', 'SECURE ')}
          <span className="text-g text-shadow-[0_0_8px_rgba(0,255,136,0.4)]">{t('LAUNCHPAD PRZEDSPRZEDAŻY', 'PRESALE LAUNCHPAD')}</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#c8e6d2]/50 max-w-[620px] mx-auto mt-4 leading-relaxed">
          {t(
            'Zdobądź tokeny $SLX po najniższej cenie przed uruchomieniem puli na DEX. Całość zebranych SOL zabezpiecza płynność na Solana AMM.',
            'Acquire $SLX tokens at the absolute lowest price before the DEX pool launches. 100% of collected SOL directly locks into the Solana AMM liquidity pool.'
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT PANEL: COUNTDOWN & PRESALE METRICS (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between border border-g/15 bg-[#04080f]/85 backdrop-blur-xl p-6 sm:p-8 relative overflow-hidden rounded">
          {/* Cyber accents */}
          <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-g" />
          <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-g" />
          <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-g" />
          <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-g" />

          <div>
            <div className="flex justify-between items-center border-b border-g/10 pb-4 mb-8">
              <span className="text-[10px] tracking-[3px] text-g font-bold uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-g rounded-full animate-pulse" />
                {
                  presaleStatus === 'UPCOMING'
                    ? t('ODLICZANIE DO ROZPOCZĘCIA', 'COUNTDOWN TO LAUNCH')
                    : presaleStatus === 'LIVE'
                      ? t('CYFROWY ZEGAR PRZEDSPRZEDAŻY', 'PRESALE SYSTEM CLOCK')
                      : t('PRZEDSPRZEDAŻ ZAKOŃCZONA', 'PRESALE COMPLETED')
                }
              </span>
              <span className="text-[8px] text-white/30 font-mono">
                {
                  presaleStatus === 'UPCOMING'
                    ? 'SYS_CLOCK // PRE_UPCOMING'
                    : presaleStatus === 'LIVE'
                      ? 'SYS_CLOCK // PRE_STAGE_02'
                      : 'SYS_CLOCK // PRE_ENDED'
                }
              </span>
            </div>

            {/* HIGH-END DIGITAL COUNTDOWN TIMER WITH GLOW */}
            <div className="grid grid-cols-4 gap-3 md:gap-4 mb-8 max-w-[480px] mx-auto">
              {[
                { label: t('DNI', 'DAYS'), value: timeLeft.days, keyVal: 'days' },
                { label: t('GODZINY', 'HOURS'), value: timeLeft.hours, keyVal: 'hours' },
                { label: t('MINUTY', 'MINUTES'), value: timeLeft.minutes, keyVal: 'minutes' },
                { label: t('SEKUNDY', 'SECONDS'), value: timeLeft.seconds, keyVal: 'seconds' },
              ].map((item) => {
                const formatted = formatTimeStr(item.value);
                return (
                  <div key={item.keyVal} className="flex flex-col items-center">
                    {/* The digital box */}
                    <div className="relative w-full aspect-square md:aspect-video flex items-center justify-center bg-black border border-g/25 rounded overflow-hidden shadow-[inset_0_0_15px_rgba(0,255,136,0.05)]">
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none" />
                      <motion.span
                        key={item.value}
                        initial={{ textShadow: '0 0 12px rgba(0, 255, 136, 0.95)', color: '#00ff88', scale: 1.04 }}
                        animate={{ textShadow: '0 0 4px rgba(0, 255, 136, 0.4)', color: '#e0ffe8', scale: 1 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="font-mono text-3xl sm:text-4xl md:text-5xl font-bold tracking-[2px] z-[2]"
                      >
                        {formatted}
                      </motion.span>
                    </div>
                    <span className="text-[9px] md:text-[10px] tracking-[2px] text-g/50 uppercase mt-2 font-bold font-mono">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* PROGRESS BAR & FUNDRAISING DETAILS */}
            <div className="mb-8">
              <div className="flex justify-between text-xs tracking-[1px] mb-2 font-mono">
                <span className="text-white/60 uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-g animate-ping" />
                  {t('Postęp zebranych środków', 'Presale Progress')}
                </span>
                <span className="text-g font-bold">
                  {solRaised.toLocaleString(undefined, { minimumFractionDigits: 2 })} / {targetSol.toLocaleString()} SOL ({progressPercent.toFixed(2)}%)
                </span>
              </div>

              {/* Progress Track */}
              <div className="h-6 bg-black border border-g/20 p-[3px] relative overflow-hidden flex items-center">
                <div className="absolute inset-0 bg-[radial-gradient(rgba(0,255,136,0.03)_1px,transparent_1px)] bg-[size:8px_8px] z-0" />
                
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-g via-[#00f8b8] to-cyan shadow-[0_0_15px_#00ff88] relative z-10 flex items-center justify-end"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                </motion.div>

                {/* Soft-cap & hard-cap indicator lines */}
                <div className="absolute left-[50%] top-0 bottom-0 w-[1px] bg-white/20 z-20 flex flex-col justify-between">
                  <span className="text-[7px] text-white/40 tracking-[1px] -translate-x-1/2 uppercase font-bold">{t('SOFT CAP', 'SOFT CAP')}</span>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-cyan/40 z-20" />
              </div>

              <div className="flex justify-between items-center mt-2.5 text-[8.5px] text-white/35 font-mono">
                <span>{t('SOFT CAP: 10,000 SOL (OSIĄGNIĘTO)', 'SOFT CAP: 10,000 SOL (REACHED)')}</span>
                <span className="text-cyan">{t('HARD CAP: 20,000 SOL', 'HARD CAP: 20,000 SOL')}</span>
              </div>
            </div>

            {/* STAGE TIER DETAILS */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-black/40 border border-white/5 p-3.5 rounded">
                <span className="text-[8.5px] text-white/35 uppercase tracking-[1.5px] block mb-1">{t('OBECNY ETAP (CENA)', 'CURRENT STAGE (PRICE)')}</span>
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-g" />
                  <span className="font-mono text-sm font-bold text-g">1 $SLX = 0.00015 SOL</span>
                </div>
                <span className="text-[8px] text-white/20 mt-1 block">~ $0.027 USD (SOL = $180)</span>
              </div>

              <div className="bg-black/40 border border-white/5 p-3.5 rounded">
                <span className="text-[8.5px] text-white/35 uppercase tracking-[1.5px] block mb-1">{t('NASTĘPNY ETAP (CENA)', 'NEXT STAGE (PRICE)')}</span>
                <div className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-cyan" />
                  <span className="font-mono text-sm font-bold text-cyan">1 $SLX = 0.00020 SOL</span>
                </div>
                <span className="text-[8px] text-white/20 mt-1 block">~ $0.036 USD (📈 +33.3%)</span>
              </div>
            </div>
          </div>

          <div className="border-t border-g/10 pt-4 mt-6 flex flex-wrap gap-4 justify-between items-center text-[9px] tracking-[1px] text-white/45">
            <span className="flex items-center gap-1.5 uppercase font-bold">
              <ShieldCheck className="w-4 h-4 text-g" />
              {t('Audytowane Kontrakty & Solana Multisig', 'Audited Contracts & Solana Multisig')}
            </span>
            <span className="text-white/20">|</span>
            <span className="uppercase font-bold text-g">
              {t('CENA STARTOWA DEX: 0.00025 SOL', 'DEX LAUNCH PRICE: 0.00025 SOL')}
            </span>
          </div>

        </div>

        {/* RIGHT PANEL: BUY WIDGET & TRANSACTION FEED (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          
          {/* BUY CARD */}
          <div className="border border-cyan/15 bg-[#00050e]/95 p-6 relative overflow-hidden rounded flex-1 flex flex-col justify-between">
            <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-cyan" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-cyan" />
            <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-cyan" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-cyan" />

            <div>
              <div className="flex items-center justify-between border-b border-cyan/10 pb-4 mb-4 select-none">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan" />
                  <span className="font-display text-xs tracking-[2px] text-cyan uppercase">{t('BŁYSKAWICZNA WYMIANA', 'PRESALE SWAP')}</span>
                </div>
                
                {/* Demo mode selector */}
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-yellow-500/5 border border-yellow-500/20 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                  <span className="text-[7.5px] font-mono text-yellow-400 uppercase tracking-[1px] font-bold">Demo</span>
                  <input 
                    type="checkbox" 
                    checked={isDemoMode}
                    onChange={(e) => setIsDemoMode(e.target.checked)}
                    className="w-3 h-3 rounded bg-black accent-yellow-400 border-white/20"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {/* Wallet connector / Status details */}
                {!walletConnected ? (
                  <button
                    onClick={() => setShowWalletModal(true)}
                    className="w-full flex items-center justify-center gap-2.5 p-3 border border-cyan/30 bg-cyan/5 hover:bg-cyan/15 hover:border-cyan text-cyan text-xs font-bold tracking-[1.5px] uppercase transition-all duration-300 rounded cursor-pointer"
                  >
                    <Wallet className="w-4 h-4 animate-bounce" />
                    {t('POŁĄCZ PORTFEL WEB3', 'CONNECT WEB3 WALLET')}
                  </button>
                ) : (
                  <div className="p-2.5 bg-cyan/5 border border-cyan/20 rounded flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-g" />
                      <span className="text-[9px] font-mono text-white/80 font-bold uppercase">{walletType} connected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono text-g font-bold px-1.5 py-0.5 bg-g/5 border border-g/30">
                        {userAddress?.substring(0, 6)}...{userAddress?.substring(userAddress.length - 4)}
                      </span>
                      <button 
                        onClick={handleDisconnect}
                        className="text-[8px] text-red-400/75 hover:text-red-400 hover:underline cursor-pointer"
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>
                )}

                {/* Input field */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[9px] text-white/40 uppercase tracking-[1px] font-bold font-mono">
                      {t('Wpłacasz SOL:', 'Pay Amount (SOL):')}
                    </label>
                    <span className="text-[8px] text-cyan/70 font-mono">
                      {t('Min: 0.1 SOL · Max: 100 SOL', 'Min: 0.1 SOL · Max: 100 SOL')}
                    </span>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="number"
                      step="0.5"
                      min="0.1"
                      value={payAmount}
                      onChange={(e) => setPayAmount(e.target.value)}
                      placeholder="2.5"
                      disabled={isSubmitting}
                      className="w-full bg-[#04080f]/90 border border-cyan/20 px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan transition-colors rounded"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono text-cyan font-bold">SOL</span>
                  </div>
                </div>

                {/* Swap Estimate Received */}
                <div className="p-3 bg-white/5 border border-white/5 rounded">
                  <div className="flex justify-between text-[8px] text-white/40 uppercase tracking-[1px] mb-1 font-bold">
                    <span>{t('Otrzymasz szacunkowo:', 'Estimated SLX Yield:')}</span>
                    <span>{t('Przelicznik:', 'Exchange Rate:')}</span>
                  </div>
                  <div className="flex justify-between items-baseline font-mono">
                    <span className="text-sm text-g font-bold text-shadow-[0_0_10px_rgba(0,255,136,0.2)]">
                      {tokensReceived.toLocaleString()} $SLX
                    </span>
                    <span className="text-[9px] text-white/55">
                      1 SOL = 6,666.67 $SLX
                    </span>
                  </div>
                </div>

                {/* Manual Transfer Expansion Details */}
                <div className="border border-white/5 bg-black/40 p-3 rounded text-[10px] space-y-2">
                  <div className="flex items-center justify-between text-white/40 border-b border-white/5 pb-1 mb-1">
                    <span className="text-[8px] uppercase tracking-[1px] font-bold">{t('Opcja 2: Przelew Bezpośredni', 'Option 2: Direct Transfer')}</span>
                    <span className="text-[8px] text-cyan font-mono">Any Wallet / Exchange</span>
                  </div>
                  <p className="text-[9px] text-white/50 leading-snug">
                    {t(
                      'Przelej SOL bezpośrednio ze swojego portfela (np. Binance, Kraken, Phantom Mobile) na adres przedsprzedaży:',
                      'Transfer SOL from any exchange or mobile wallet to the official presale vault address:'
                    )}
                  </p>
                  
                  <div className="flex items-center gap-1 bg-[#04080f] border border-cyan/15 p-2 rounded relative">
                    <span className="font-mono text-[8px] text-cyan break-all pr-8 select-all select-none">
                      {receiverAddress}
                    </span>
                    <button
                      onClick={handleCopyAddress}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-cyan transition-colors cursor-pointer"
                      title="Copy Address"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-g" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Transaction verification field */}
                  <div className="space-y-1 pt-1.5">
                    <span className="text-[8px] text-white/40 uppercase tracking-[1px] block font-bold">{t('ID Transakcji (Tx Signature) do weryfikacji:', 'Transaction ID (Tx Signature) to verify:')}</span>
                    <div className="flex gap-1.5">
                      <input 
                        type="text"
                        value={manualSignature}
                        onChange={(e) => setManualSignature(e.target.value)}
                        placeholder="Wklej podpis transakcji (np. 5fG49s...)"
                        disabled={isSubmitting}
                        className="flex-1 bg-[#04080f] border border-white/10 px-2 py-1.5 text-[9px] font-mono text-white focus:outline-none focus:border-cyan rounded"
                      />
                      <button 
                        onClick={handleVerifyManualTx}
                        disabled={isSubmitting}
                        className="bg-cyan/10 hover:bg-cyan/20 border border-cyan/20 text-cyan px-2.5 text-[9px] font-bold uppercase transition-colors rounded cursor-pointer"
                      >
                        {t('Zweryfikuj', 'Verify')}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <AnimatePresence mode="wait">
                  {errorMsg && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-[9.5px] text-red-400 bg-red-950/15 border border-red-900/30 p-2.5 leading-normal font-mono rounded flex items-start gap-1.5"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-400 mt-0.5" />
                      <span>{errorMsg}</span>
                    </motion.div>
                  )}

                  {successMsg && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-[9.5px] text-g bg-g/5 border border-g/20 p-2.5 leading-normal font-mono rounded"
                    >
                      ✅ {successMsg}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              onClick={handleSwap}
              disabled={isSubmitting}
              className="w-full btn-neon cyan text-[10px] py-3.5 text-center font-display tracking-[2px] mt-4 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="c tl" /><span className="c tr" />
              <span className="c bl" /><span className="c br" />
              {isSubmitting ? (
                <>
                  <motion.span 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="inline-block"
                  >
                    ⚡
                  </motion.span>
                  {t('ZATWIERDZANIE SYGNAŁU...', 'PROCESSING TRANSACTION...')}
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-cyan" />
                  {isDemoMode ? t('WYKONAJ TESTOWY SWAP (FREE)', 'EXECUTE TEST SWAP (FREE)') : t('ZATWIERDŹ SWAP (SOLANA)', 'EXECUTE PRESALE BUY')}
                </>
              )}
            </button>
          </div>

          {/* DYNAMIC LIVE PURCHASE HISTORY LEDGER */}
          <div className="border border-white/5 bg-[#04080f]/40 p-4 relative overflow-hidden rounded">
            <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
              <span className="text-[8.5px] tracking-[2px] text-white/50 uppercase font-mono flex items-center gap-1.5 font-bold">
                <History className="w-3.5 h-3.5 text-g" />
                {t('HISTORIA ZAKUPÓW LIVE', 'LIVE PURCHASE STREAM')}
              </span>
              <span className="text-[7.5px] text-white/20 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-g animate-pulse inline-block" />
                {t('STALE AKTUALIZOWANE', 'LIVE BLOCKS')}
              </span>
            </div>

            <div className="flex flex-col gap-1.5 max-h-[120px] overflow-y-auto pr-1">
              {purchases.length === 0 ? (
                <div className="text-[9px] text-white/20 font-mono text-center py-4">
                  {t('Oczekiwanie na nowe bloki...', 'Waiting for block settlements...')}
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {purchases.slice(0, 5).map((pub) => (
                    <motion.div
                      key={pub.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-between py-1 border-b border-white/[0.02] text-[9.5px] font-mono"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-white/40">{pub.address}</span>
                        {pub.signature && !pub.signature.startsWith('demo_') ? (
                          <a 
                            href={`https://solscan.io/tx/${pub.signature}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[8px] text-cyan hover:underline flex items-center gap-0.5"
                          >
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ) : null}
                        <span className="text-g font-bold font-mono">
                          +{pub.amountSol.toFixed(1)} SOL
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-white/60 font-semibold">{pub.amountSlx.toLocaleString()} $SLX</span>
                        <span className="text-[8px] text-white/20 ml-2">{pub.timeAgo}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* --- CHOOSE WALLET DIALOG MODAL --- */}
      <AnimatePresence>
        {showWalletModal && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWalletModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            {/* Box modal */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#02050b] border border-cyan/25 p-6 w-full max-w-[420px] rounded relative overflow-hidden z-10"
            >
              <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyan" />
              <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cyan" />
              <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cyan" />
              <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyan" />

              <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-5">
                <h3 className="font-display text-sm tracking-[2px] text-cyan uppercase flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-cyan" />
                  {t('POŁĄCZ PORTFEL', 'CONNECT PORTAL WALLET')}
                </h3>
                <button 
                  onClick={() => setShowWalletModal(false)}
                  className="text-white/30 hover:text-white text-xs font-mono"
                >
                  [ESC]
                </button>
              </div>

              {isConnecting ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4 font-mono text-xs">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                    className="w-8 h-8 border-t-2 border-r-2 border-cyan rounded-full"
                  />
                  <span className="text-white/60 animate-pulse uppercase tracking-[1px]">{t('Autoryzacja portfela...', 'Requesting wallet signature...')}</span>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  
                  {/* Phantom wallet connector */}
                  <button
                    onClick={connectPhantom}
                    className="flex items-center justify-between p-3 border border-white/10 bg-black/40 hover:bg-cyan/5 hover:border-cyan/50 transition-all rounded text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <img src="https://images.crunchbase.com/image/upload/c_pad,h_170,w_170,f_auto,g_faces,z_0.7/v1508215582/orlpxep7j0x8hicqas7e.png" alt="Phantom" className="w-6 h-6 rounded" referrerPolicy="no-referrer" />
                      <div>
                        <span className="text-xs font-bold text-white block group-hover:text-cyan transition-colors">Phantom Wallet</span>
                        <span className="text-[8.5px] text-white/30 block">Solana Browser Extension</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-cyan transition-colors" />
                  </button>

                  {/* Solflare connector */}
                  <button
                    onClick={connectSolflare}
                    className="flex items-center justify-between p-3 border border-white/10 bg-black/40 hover:bg-cyan/5 hover:border-cyan/50 transition-all rounded text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <img src="https://play-lh.googleusercontent.com/Iatb0O03eA44N9e7iA8x8gK_Tq_qRscNnJ5o1GvK0i3mIuF0zR3_vC9p8vA_vX_0Y_0" alt="Solflare" className="w-6 h-6 rounded" referrerPolicy="no-referrer" />
                      <div>
                        <span className="text-xs font-bold text-white block group-hover:text-cyan transition-colors">Solflare Wallet</span>
                        <span className="text-[8.5px] text-white/30 block">Solana Web/Extension</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-cyan transition-colors" />
                  </button>

                  {/* Sandbox Demo Connector */}
                  <button
                    onClick={connectDemoWallet}
                    className="flex items-center justify-between p-3 border border-yellow-500/10 bg-yellow-500/5 hover:bg-yellow-500/10 hover:border-yellow-500/50 transition-all rounded text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 text-yellow-500 text-[10px] font-bold">SOL</div>
                      <div>
                        <span className="text-xs font-bold text-yellow-400 block">{t('Demo Sandbox Wallet', 'Demo Sandbox Wallet')}</span>
                        <span className="text-[8.5px] text-yellow-500/60 block">{t('Bezpośrednia symulacja bez wtyczki', 'Direct simulation without any extension')}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-yellow-500/40 group-hover:text-yellow-400 transition-colors" />
                  </button>

                  {/* Manual Address Input */}
                  <div className="border-t border-white/5 pt-4 mt-1.5 space-y-2">
                    <span className="text-[8px] text-white/40 uppercase tracking-[1px] block font-bold">{t('Zarejestruj adres ręcznie (Opcja Manual):', 'Register Address Manually (Manual Option):')}</span>
                    <div className="flex gap-1.5">
                      <input 
                        type="text"
                        value={manualAddressInput}
                        onChange={(e) => setManualAddressInput(e.target.value)}
                        placeholder="Adres Solana (np. 7KBXwNo...)"
                        className="flex-1 bg-black border border-white/10 px-2.5 py-1.5 text-[10px] font-mono text-white focus:outline-none focus:border-cyan rounded"
                      />
                      <button 
                        onClick={connectManualAddress}
                        className="bg-cyan/15 hover:bg-cyan/25 border border-cyan/20 text-cyan px-3 text-[10px] font-bold uppercase rounded transition-colors cursor-pointer"
                      >
                        {t('Ok', 'Ok')}
                      </button>
                    </div>
                  </div>

                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
