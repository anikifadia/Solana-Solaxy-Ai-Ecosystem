import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Coins, ShieldCheck, Zap, History, Wallet, ChevronRight, TrendingUp } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface PurchaseRecord {
  id: string;
  address: string;
  amountSol: number;
  amountSlx: number;
  timeAgo: string;
  isNew?: boolean;
}

const INITIAL_PURCHASES: PurchaseRecord[] = [
  { id: '1', address: '4a8v...K9p1', amountSol: 15.5, amountSlx: 103333, timeAgo: '2m' },
  { id: '2', address: 'D3xj...pL2o', amountSol: 8.0, amountSlx: 53333, timeAgo: '5m' },
  { id: '3', address: 'Solf...8zKq', amountSol: 25.0, amountSlx: 166666, timeAgo: '12m' },
  { id: '4', address: '9a2f...1x8p', amountSol: 4.5, amountSlx: 30000, timeAgo: '18m' },
  { id: '5', address: 'Phan...w4eR', amountSol: 42.0, amountSlx: 280000, timeAgo: '24m' },
];

export const PresaleSection: React.FC = () => {
  const { t, language } = useLanguage();

  // --- Countdown State ---
  // Count down to some date 3 days, 14 hours, 28 minutes, 42 seconds from initial mount
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 14,
    minutes: 28,
    seconds: 42,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        } else {
          // Reset timer for simulated endless presale countdown
          return { days: 3, hours: 14, minutes: 28, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // --- Purchase Ledger Simulation State ---
  const [purchases, setPurchases] = useState<PurchaseRecord[]>(INITIAL_PURCHASES);

  useEffect(() => {
    // Periodically add a new simulated buy to the ledger
    const interval = setInterval(() => {
      const addresses = [
        'H8yT...k9zP', 'B6vX...pL1w', 'G9vM...qE3s', 'K2rF...vN8m', 
        'X4zW...tY7u', 'C1uQ...aF4g', 'Y8pT...sK2j', 'Z3hL...oP9q'
      ];
      const randomAddress = addresses[Math.floor(Math.random() * addresses.length)];
      const randomSol = parseFloat((Math.random() * 25 + 0.5).toFixed(1));
      const rate = 6666.67; // 1 SOL = ~6666.67 $SLX
      const randomSlx = Math.round(randomSol * rate);
      
      const newPurchase: PurchaseRecord = {
        id: Math.random().toString(),
        address: randomAddress,
        amountSol: randomSol,
        amountSlx: randomSlx,
        timeAgo: '1s',
        isNew: true
      };

      setPurchases((prev) => {
        const updated = [newPurchase, ...prev.map(p => ({
          ...p,
          isNew: false,
          // Increment simulated time ago
          timeAgo: p.timeAgo.endsWith('s') 
            ? '1m' 
            : p.timeAgo.endsWith('m') 
              ? `${parseInt(p.timeAgo) + 1}m` 
              : p.timeAgo
        }))];
        return updated.slice(0, 5); // Limit to top 5
      });
    }, 12000); // add new buy every 12s

    return () => clearInterval(interval);
  }, []);

  // --- Presale Stats ---
  const [solRaised, setSolRaised] = useState(14960.50);
  const targetSol = 20000;
  const progressPercent = (solRaised / targetSol) * 100;
  
  // --- Form & Wallet State ---
  const [walletConnected, setWalletConnected] = useState(false);
  const [payAmount, setPayAmount] = useState('2.5');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rate = 6666.67; // 1 SOL = ~6666.67 $SLX ($0.027 @ $180 SOL)
  const tokensReceived = parseFloat(payAmount) ? Math.round(parseFloat(payAmount) * rate) : 0;

  const handleConnectWallet = () => {
    setWalletConnected(true);
    setSuccessMsg(t('Portfel połączony pomyślnie!', 'Wallet connected successfully!'));
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleBuy = () => {
    if (!walletConnected) {
      setErrorMsg(t('Proszę najpierw połączyć portfel.', 'Please connect your wallet first.'));
      setTimeout(() => setErrorMsg(null), 4000);
      return;
    }

    const sol = parseFloat(payAmount);
    if (isNaN(sol) || sol <= 0) {
      setErrorMsg(t('Wprowadź prawidłową kwotę SOL.', 'Enter a valid SOL amount.'));
      setTimeout(() => setErrorMsg(null), 4000);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    setTimeout(() => {
      setIsSubmitting(false);
      setSolRaised(prev => prev + sol);
      
      const newPurchase: PurchaseRecord = {
        id: Math.random().toString(),
        address: 'You (Phantom)',
        amountSol: sol,
        amountSlx: tokensReceived,
        timeAgo: '1s',
        isNew: true
      };

      setPurchases(prev => [newPurchase, ...prev].slice(0, 5));

      setSuccessMsg(
        t(
          `Zakup udany! Otrzymałeś ${tokensReceived.toLocaleString()} $SLX. Transakcja została przetworzona na Solana SVM.`,
          `Purchase successful! Received ${tokensReceived.toLocaleString()} $SLX. The transaction has been settled on Solana SVM.`
        )
      );
      setPayAmount('2.5');
    }, 2000);
  };

  // Helper formatting for single digits
  const formatTimeStr = (val: number) => {
    return val.toString().padStart(2, '0');
  };

  return (
    <section id="presale" className="relative z-[5] py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto border-t border-g/10">
      
      {/* Decorative side markings */}
      <div className="absolute top-0 right-0 w-32 h-[1px] bg-gradient-to-r from-transparent to-g shadow-[0_0_8px_#00ff88]" />
      <div className="absolute bottom-0 left-0 w-32 h-[1px] bg-gradient-to-r from-g to-transparent shadow-[0_0_8px_#00ff88]" />

      <div className="text-center mb-16 select-none">
        <div className="flex items-center justify-center gap-2 text-[10px] tracking-[5px] text-g/50 uppercase mb-4">
          <span className="w-6 h-[1px] bg-g shadow-[0_0_6px_#00ff88]" /> {t('URUCHOMIONO ETAP DRUGI', 'STAGE TWO ACTIVE')}
        </div>
        <h2 className="font-display text-3xl md:text-5xl tracking-[2px] text-white uppercase">
          {t('ZABEZPIECZONY ', 'SECURE ')}
          <span className="text-g text-shadow-[0_0_8px_rgba(0,255,136,0.4)]">{t('LAUNCHPAD PRZEDSPRZEDAŻY', 'PRESALE LAUNCHPAD')}</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#c8e6d2]/50 max-w-[620px] mx-auto mt-4 leading-relaxed">
          {t(
            'Zdobądź tokeny $SLX po najniższej możliwej cenie przed publicznym notowaniem na DEX. Środki z przedsprzedaży zabezpieczają bezpośrednie pule płynności AMM.',
            'Acquire $SLX tokens at the lowest possible tier before the public DEX launch. Presale funds directly bootstrap the AMM liquidity pools.'
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
                {t('KONSTRUKCJA LICZNIKA CYFROWEGO', 'DIGITAL CLOCK METRIC')}
              </span>
              <span className="text-[8px] text-white/30 font-mono">SYS_CLOCK // PRE-02</span>
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
                      {/* Grid overlay for digital effect */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none" />
                      
                      {/* Reactive Glow trigger using motion key value */}
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
                  {solRaised.toLocaleString(undefined, { minimumFractionDigits: 2 })} / {targetSol.toLocaleString()} SOL ({progressPercent.toFixed(1)}%)
                </span>
              </div>

              {/* Progress Track */}
              <div className="h-6 bg-black border border-g/20 p-[3px] relative overflow-hidden flex items-center">
                {/* Visual grid inside bar */}
                <div className="absolute inset-0 bg-[radial-gradient(rgba(0,255,136,0.03)_1px,transparent_1px)] bg-[size:8px_8px] z-0" />
                
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-g via-[#00f8b8] to-cyan shadow-[0_0_15px_#00ff88] relative z-10 flex items-center justify-end"
                >
                  {/* Glare effect moving across the bar */}
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
                <span className="text-[8px] text-white/20 mt-1 block">~ $0.027 USD</span>
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
              {t('Zabezpieczone przez Solana Multisig', 'Secured via Solana Multisig')}
            </span>
            <span className="text-white/20">|</span>
            <span className="uppercase font-bold text-g">
              {t('BRAK PODATKÓW (0% TAX)', '0% TRANSACTION TAX')}
            </span>
          </div>

        </div>

        {/* RIGHT PANEL: BUY WIDGET & TRANSACTION FEED (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          
          {/* BUY CARD */}
          <div className="border border-cyan/15 bg-[#00050e]/95 p-6 relative overflow-hidden rounded flex-1">
            <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-cyan" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-cyan" />
            <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-cyan" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-cyan" />

            <div className="flex items-center justify-between border-b border-cyan/10 pb-4 mb-6 select-none">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan" />
                <span className="font-display text-xs tracking-[2px] text-cyan uppercase">{t('KUP TERAZ $SLX', 'PRESALE SWAP')}</span>
              </div>
              <span className="text-[8px] text-white/30 uppercase">SVM_DIRECT</span>
            </div>

            <div className="flex flex-col gap-5">
              {/* Wallet connector */}
              {!walletConnected ? (
                <button
                  onClick={handleConnectWallet}
                  className="w-full flex items-center justify-center gap-2.5 p-3.5 border border-cyan/30 bg-cyan/5 hover:bg-cyan/15 hover:border-cyan text-cyan text-xs font-bold tracking-[1.5px] uppercase transition-all duration-300 rounded cursor-pointer"
                >
                  <Wallet className="w-4 h-4" />
                  {t('POŁĄCZ PORTFEL', 'CONNECT PORTAL WALLET')}
                </button>
              ) : (
                <div className="flex items-center justify-between p-3 bg-cyan/5 border border-cyan/20 rounded">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-g" />
                    <span className="text-[10px] font-mono text-white/80 font-bold uppercase">{t('Portfel połączony', 'Wallet online')}</span>
                  </div>
                  <span className="text-[10px] font-mono text-g font-bold px-2 py-0.5 bg-g/5 border border-g/30">
                    Phan...8zKq
                  </span>
                </div>
              )}

              {/* Input field */}
              <div>
                <label className="block text-[10px] text-white/40 uppercase tracking-[1px] mb-2 font-bold font-mono">
                  {t('Ilość wpłacanego SOL:', 'Pay Amount in SOL:')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="0.1"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    placeholder="0.0"
                    className="w-full bg-[#04080f]/90 border border-cyan/20 px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-cyan transition-colors rounded"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono text-cyan font-bold">SOL</span>
                </div>
              </div>

              {/* Estimate exchange received */}
              <div className="p-3.5 bg-white/5 border border-white/5 rounded">
                <div className="flex justify-between text-[9px] text-white/40 uppercase tracking-[1px] mb-1 font-bold">
                  <span>{t('Otrzymasz szacunkowo:', 'Estimated yield:')}</span>
                  <span>{t('Przelicznik:', 'Preset Rate:')}</span>
                </div>
                <div className="flex justify-between items-baseline font-mono">
                  <span className="text-sm text-g font-bold">
                    {tokensReceived.toLocaleString()} $SLX
                  </span>
                  <span className="text-[9.5px] text-white/60">
                    1 SOL = 6,666.67 $SLX
                  </span>
                </div>
              </div>

              {/* Notification messaging state */}
              <AnimatePresence mode="wait">
                {errorMsg && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[10.5px] text-r bg-r/10 border border-r/20 p-3 leading-relaxed font-mono rounded"
                  >
                    ❌ {errorMsg}
                  </motion.div>
                )}

                {successMsg && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[10.5px] text-g bg-g/10 border border-g/20 p-3 leading-relaxed font-mono rounded"
                  >
                    ✅ {successMsg}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Button */}
              <button
                onClick={handleBuy}
                disabled={isSubmitting}
                className="w-full btn-neon cyan text-xs py-4 text-center font-display tracking-[2px] mt-2 flex items-center justify-center gap-2 cursor-pointer"
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
                    <Zap className="w-4 h-4 text-cyan" />
                    {t('KUP $SLX (SOLANA SVM)', 'EXECUTE PRESALE BUY')}
                  </>
                )}
              </button>
            </div>
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
                {t('STALE AKTUALIZOWANE', 'SYNCED')}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <AnimatePresence initial={false}>
                {purchases.map((pub) => (
                  <motion.div
                    key={pub.id}
                    initial={pub.isNew ? { opacity: 0, x: -10, backgroundColor: 'rgba(0, 255, 136, 0.15)' } : { opacity: 1 }}
                    animate={{ opacity: 1, x: 0, backgroundColor: 'rgba(0,0,0,0)' }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-between py-1.5 border-b border-white/[0.03] text-[10px] font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-white/40">{pub.address}</span>
                      <span className="text-g font-bold font-mono">
                        +{pub.amountSol.toFixed(1)} SOL
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-white/60">{pub.amountSlx.toLocaleString()} $SLX</span>
                      <span className="text-[8px] text-white/20 ml-2">{pub.timeAgo}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
