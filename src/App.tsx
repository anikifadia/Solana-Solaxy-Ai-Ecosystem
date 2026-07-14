import React, { useEffect, useRef, useState } from 'react';
import { 
  Globe2, 
  Menu,
  X,
  ShieldCheck,
  Palette
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import BackgroundEffects from './components/BackgroundEffects';
import QuantumLightningCursor from './components/QuantumLightningCursor';
import SlicedAsset from './components/SlicedAsset';
import { useLanguage } from './LanguageContext';
import { SolaxyLogo, SolaxyEmoticon } from './components/SolaxyLogo';
import { useWallet } from './WalletContext';
import ConnectWalletModal from './components/ConnectWalletModal';

// Subpages
import HomePage from './components/HomePage';
import GeneratorPage from './components/GeneratorPage';
import PresalePage from './components/PresalePage';
import SwapPage from './components/SwapPage';
import NetworkPage from './components/NetworkPage';
import ForgePage from './components/ForgePage';
import StatusPage from './components/StatusPage';

// Live Ticker items structure
interface TickerItem {
  n: string; // Name
  p: number; // Price
  c: number; // Change
}

const INITIAL_TICKER_DATA: TickerItem[] = [
  { n: 'BTC', p: 97432, c: 2.14 },
  { n: 'ETH', p: 3841, c: -1.23 },
  { n: 'SOL', p: 182.74, c: 4.87 },
  { n: 'SLX', p: 0.0482, c: 12.4 },
  { n: 'BNB', p: 612, c: 0.88 },
  { n: 'AVAX', p: 38.91, c: -2.11 },
  { n: 'RAY', p: 4.19, c: 7.66 },
  { n: 'JTO', p: 2.84, c: 5.44 },
  { n: 'JUP', p: 1.12, c: 3.88 },
  { n: 'BONK', p: 0.0000312, c: 8.22 },
  { n: 'WIF', p: 2.18, c: -4.1 }
];

export default function App() {
  const { t, language, setLanguage } = useLanguage();
  const { walletAddress, isConnected } = useWallet();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [tickerData, setTickerData] = useState<TickerItem[]>(INITIAL_TICKER_DATA);
  const [solPrice, setSolPrice] = useState<number>(182.74);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'generator' | 'presale' | 'swap' | 'network' | 'forge' | 'status'>('home');

  // Theme Customizer State
  const [theme, setTheme] = useState<'deep-black' | 'midnight-blue'>(() => {
    return (localStorage.getItem('solaxy-theme') as 'deep-black' | 'midnight-blue') || 'deep-black';
  });

  useEffect(() => {
    localStorage.setItem('solaxy-theme', theme);
    const root = document.documentElement;
    if (theme === 'midnight-blue') {
      root.classList.add('theme-midnight');
    } else {
      root.classList.remove('theme-midnight');
    }
  }, [theme]);
  
  // Stats Counters
  const [tvl, setTvl] = useState<number>(0);
  const [trades, setTrades] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0);
  const [tps, setTps] = useState<number>(64821);

  // Real-time Liquidity Pools & Trading state
  const [tokens, setTokens] = useState<any[]>([]);
  const [activeUsersCount, setActiveUsersCount] = useState<number>(1);
  const [selectedTokenForTrade, setSelectedTokenForTrade] = useState<any>(null);
  const [tradeAmount, setTradeAmount] = useState<string>('1.0');
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [tradeError, setTradeError] = useState<string | null>(null);
  const [tradeSuccess, setTradeSuccess] = useState<string | null>(null);
  const [isTrading, setIsTrading] = useState<boolean>(false);
  const [walletBalances, setWalletBalances] = useState<Record<string, number>>({});
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMetricMouseEnter = (metric: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setExpandedMetric(metric);
    }, 100); // 100ms hover delay to prevent accidental flickering
  };

  const handleMetricMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setExpandedMetric(null);
  };

  // Cleanup hover timer on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Listen for custom start-ai-generation events from landing page prompter
  useEffect(() => {
    const handleStartRealGen = (e: Event) => {
      setCurrentPage('generator');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    };
    window.addEventListener('start-ai-generation', handleStartRealGen);
    return () => {
      window.removeEventListener('start-ai-generation', handleStartRealGen);
    };
  }, []);

  // Listen for custom navigation events (e.g. from the admin panel to the DEX or Forge)
  useEffect(() => {
    const handleNavigation = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setCurrentPage(customEvent.detail);
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 50);
      }
    };
    window.addEventListener('solaxy-navigate', handleNavigation);
    return () => {
      window.removeEventListener('solaxy-navigate', handleNavigation);
    };
  }, []);

  // Custom cursor DOM refs
  const cursorDotRef = useRef<HTMLDivElement | null>(null);
  const cursorRingRef = useRef<HTMLDivElement | null>(null);
  const flashOverlayRef = useRef<HTMLDivElement | null>(null);

  // Format Helper for Prices
  const formatPrice = (p: number): string => {
    if (p < 0.001) return '$' + p.toFixed(6);
    if (p < 1) return '$' + p.toFixed(4);
    if (p < 1000) return '$' + p.toFixed(2);
    return '$' + p.toLocaleString('en-US', { maximumFractionDigits: 0 });
  };

  // 1. Live price fetcher and simulator
  useEffect(() => {
    const fetchRealPrices = async () => {
      try {
        const res = await fetch('/api/market/prices');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length) {
            setTickerData((prev) => {
              const newData = [...prev];
              data.forEach((item: any) => {
                let symbol = '';
                if (item.symbol === 'SOLUSDT') symbol = 'SOL';
                if (item.symbol === 'BTCUSDT') symbol = 'BTC';
                if (item.symbol === 'ETHUSDT') symbol = 'ETH';
                
                if (symbol) {
                  const idx = newData.findIndex(t => t.n === symbol);
                  if (idx !== -1) {
                    newData[idx].p = parseFloat(item.lastPrice);
                    newData[idx].c = parseFloat(item.priceChangePercent);
                  }
                }
                
                if (item.symbol === 'SOLUSDT') {
                  setSolPrice(parseFloat(item.lastPrice));
                }
              });
              return newData;
            });
          }
        }
      } catch (e) {}
    };

    fetchRealPrices(); // Initial fetch
    
    // Refresh prices and fluctuate TPS dynamically
    const interval = setInterval(() => {
      fetchRealPrices();
      setTps(Math.round(64200 + Math.random() * 1400));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // 2. Custom Cursor trail loop (Highly optimized with direct ref updates - 0% React state re-renders)
  useEffect(() => {
    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;
    let frameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;

      // Update pointer dot directly
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      }

      // Update cursor ambient flash overlay directly (translate3d is fully GPU accelerated!)
      if (flashOverlayRef.current) {
        flashOverlayRef.current.style.transform = `translate3d(${mx - 300}px, ${my - 300}px, 0)`;
      }
    };

    // Interpolation loop for the outer cursor ring (elastic follow)
    const animRing = () => {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;

      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      }

      frameId = requestAnimationFrame(animRing);
    };

    // Hover event delegation at document-level (Prevents memory leaks from multiple binders)
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.closest('a, button, [role="button"], .interactive-cursor')) {
        if (cursorRingRef.current) {
          cursorRingRef.current.style.width = '52px';
          cursorRingRef.current.style.height = '52px';
          cursorRingRef.current.style.borderColor = 'rgba(0, 255, 136, 0.95)';
          cursorRingRef.current.style.backgroundColor = 'rgba(0, 255, 136, 0.04)';
        }
      } else {
        if (cursorRingRef.current) {
          cursorRingRef.current.style.width = '34px';
          cursorRingRef.current.style.height = '34px';
          cursorRingRef.current.style.borderColor = 'rgba(0, 255, 136, 0.5)';
          cursorRingRef.current.style.backgroundColor = 'transparent';
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });
    frameId = requestAnimationFrame(animRing);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      cancelAnimationFrame(frameId);
    };
  }, []);

  // 3. Periodic Flash overlay trigger (simulating warp flash bursts)
  useEffect(() => {
    const flashTimer = setInterval(() => {
      if (flashOverlayRef.current) {
        flashOverlayRef.current.style.opacity = '1';
        setTimeout(() => {
          if (flashOverlayRef.current) {
            flashOverlayRef.current.style.opacity = '0';
          }
        }, 150);
      }
    }, 9000);

    return () => clearInterval(flashTimer);
  }, []);

  // 4. Fetch real stats and pools from the server (Real User data & Pool remaining balances)
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const res = await fetch('/api/mining/status');
        if (res.ok) {
          const data = await res.json();
          setTokens(data.tokens || []);
          setActiveUsersCount(data.stats?.activeUsersCount || 1);
          
          if (data.stats) {
            // Convert to Billions for TVL and Millions for Volume/Trades
            setTvl(Number((data.stats.tvlUsd / 1e9).toFixed(2)));
            setVolume(Math.round(data.stats.volumeUsd / 1e6));
            setTrades(Number(data.stats.trades24h.toFixed(2)));
          }
        }
      } catch (err) {
        console.warn("Unable to fetch live data from backend (retrying...):", err);
      }
    };

    fetchRealData();
    const interval = setInterval(fetchRealData, 4000);

    // Listen for customized token deployment events to reload immediately
    const handleDeployed = () => fetchRealData();
    window.addEventListener('token-deployed', handleDeployed);

    return () => {
      clearInterval(interval);
      window.removeEventListener('token-deployed', handleDeployed);
    };
  }, []);

  const reloadBalances = () => {
    if (isConnected && walletAddress) {
      const key = `solaxy_wallet_balances_${walletAddress}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          setWalletBalances(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse balances:", e);
        }
      } else {
        const initialBalances: Record<string, number> = {
          '$SLX': 5000,
        };
        setWalletBalances(initialBalances);
        localStorage.setItem(key, JSON.stringify(initialBalances));
      }
    } else {
      setWalletBalances({});
    }
  };

  useEffect(() => {
    reloadBalances();
    
    const handleUpdate = () => {
      reloadBalances();
    };
    
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('solaxy-balance-updated', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('solaxy-balance-updated', handleUpdate);
    };
  }, [isConnected, walletAddress]);

  const handleExecuteTrade = async (ticker: string) => {
    setTradeError(null);
    setTradeSuccess(null);
    setIsTrading(true);

    if (!isConnected || !walletAddress) {
      setTradeError(language === 'pl' ? 'Najpierw połącz swój portfel w prawym górnym rogu!' : 'Connect your wallet in the top-right first!');
      setIsTrading(false);
      return;
    }

    const enteredAmount = parseFloat(tradeAmount);
    if (isNaN(enteredAmount) || enteredAmount <= 0) {
      setTradeError(language === 'pl' ? 'Podaj prawidłową ilość!' : 'Enter a valid amount!');
      setIsTrading(false);
      return;
    }

    // Balance checks before submitting
    const key = `solaxy_wallet_balances_${walletAddress}`;
    if (tradeType === 'BUY') {
      const userSlxBalance = walletBalances['$SLX'] || 0;
      if (userSlxBalance < enteredAmount) {
        setTradeError(language === 'pl' 
          ? `Niewystarczające saldo $SLX w portfelu! Posiadasz tylko ${userSlxBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })} $SLX. Dokonaj zakupu w przedsprzedaży, aby zdobyć więcej $SLX.` 
          : `Insufficient $SLX balance in wallet! You only have ${userSlxBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })} $SLX. Purchase in presale to acquire more $SLX.`
        );
        setIsTrading(false);
        return;
      }
    } else {
      const tokenTicker = ticker.toUpperCase();
      const userTokenBalance = walletBalances[tokenTicker] || 0;
      if (userTokenBalance < enteredAmount) {
        setTradeError(language === 'pl' 
          ? `Niewystarczające saldo ${ticker} w portfelu! Posiadasz tylko ${userTokenBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${ticker}.` 
          : `Insufficient ${ticker} balance in wallet! You only have ${userTokenBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${ticker}.`
        );
        setIsTrading(false);
        return;
      }
    }

    try {
      const response = await fetch('/api/tokens/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker,
          type: tradeType,
          amount: enteredAmount,
          user: walletAddress
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || (language === 'pl' ? 'Błąd podczas realizacji transakcji.' : 'Error executing trade.'));
      }

      // Update local wallet balances on success
      const updatedBals = { ...walletBalances };
      if (tradeType === 'BUY') {
        updatedBals['$SLX'] = (updatedBals['$SLX'] || 0) - enteredAmount;
        updatedBals[ticker.toUpperCase()] = (updatedBals[ticker.toUpperCase()] || 0) + data.tokenAmount;
      } else {
        updatedBals[ticker.toUpperCase()] = (updatedBals[ticker.toUpperCase()] || 0) - enteredAmount;
        updatedBals['$SLX'] = (updatedBals['$SLX'] || 0) + (data.slxValue || 0);
      }
      setWalletBalances(updatedBals);
      localStorage.setItem(key, JSON.stringify(updatedBals));
      window.dispatchEvent(new Event('solaxy-balance-updated'));

      setTradeSuccess(
        language === 'pl' 
          ? `Transakcja zakończona sukcesem! Wymieniono na: ${data.tokenAmount.toLocaleString(undefined, {maximumFractionDigits: 2})} ${ticker}.` 
          : `Trade executed successfully! Swapped: ${data.tokenAmount.toLocaleString(undefined, {maximumFractionDigits: 2})} ${ticker}.`
      );
      
      // Update our token lists and parent counters immediately by reloading
      const res = await fetch('/api/mining/status');
      if (res.ok) {
        const updated = await res.json();
        setTokens(updated.tokens || []);
        if (updated.stats) {
          setTvl(Number((updated.stats.tvlUsd / 1e9).toFixed(2)));
          setVolume(Math.round(updated.stats.volumeUsd / 1e6));
          setTrades(Number(updated.stats.trades24h.toFixed(2)));
        }
      }
    } catch (err: any) {
      setTradeError(err.message || 'Error');
    } finally {
      setIsTrading(false);
    }
  };

  // Smooth scroll with header + ticker height offset and page routing awareness
  const scrollToSection = (id: string) => {
    if (id === 'presale' || id === 'token' || id === 'sentinel-hub') {
      setCurrentPage('presale');
    } else if (id === 'generator' || id === 'ai-generator-hub') {
      setCurrentPage('generator');
    } else if (id === 'pools') {
      setCurrentPage('swap');
    } else if (id === 'forge' || id === 'mining-staking-hub') {
      setCurrentPage('forge');
    } else if (id === 'network' || id === 'mempool-hub' || id === 'router-hub') {
      setCurrentPage('network');
    } else if (id === 'features' || id === 'roadmap' || id === 'trade-hero') {
      setCurrentPage('home');
    }

    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const offset = 110; // offset in pixels
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      } else {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }, 120);
  };

  // Tech sector navigator data
  const sectors = [
    {
      id: 'pools',
      code: 'SEC-01',
      name: t('PULPIT SWAP AMM', 'AMM SWAP CENTER'),
      desc: t('Błyskawiczna wymiana i aktywne pule płynności.', 'Instant swap and active liquidity pools.'),
      icon: SlicedAsset, // using standard SlicedAsset layout
      color: 'text-g',
      glowColor: 'rgba(0, 255, 136, 0.4)',
      status: t('PŁYNNA', 'LIQUID'),
      pulse: true
    },
    {
      id: 'mempool-hub',
      code: 'SEC-02',
      name: t('MONITOR TRANSAKCJI', 'TRANSACTION STREAM'),
      desc: t('Strumień bloków transakcyjnych Solany na żywo.', 'Live stream of Solana transaction blocks.'),
      icon: SlicedAsset,
      color: 'text-cyan',
      glowColor: 'rgba(0, 238, 255, 0.4)',
      status: t('NA ŻYWO', 'LIVE FEED'),
      pulse: true
    },
    {
      id: 'router-hub',
      code: 'SEC-03',
      name: t('OPTYMALIZATOR ŚCIEŻEK', 'SMART ROUTER'),
      desc: t('Automatyczna optymalizacja slippage w DeFi.', 'Automated slippage and routing optimization.'),
      icon: SlicedAsset,
      color: 'text-purple',
      glowColor: 'rgba(123, 45, 255, 0.4)',
      status: t('OPTYMALNY', 'OPTIMAL'),
      pulse: false
    },
    {
      id: 'network',
      code: 'SEC-04',
      name: t('WIZUALIZATOR SIECI', 'NETWORK VISUALIZER'),
      desc: t('Model powiązań DeFi z ekosystemem Solana.', 'Ecosystem graph of Solana DeFi integrations.'),
      icon: SlicedAsset,
      color: 'text-g',
      glowColor: 'rgba(0, 255, 136, 0.4)',
      status: t('ZSYNCHRONIZOWANY', 'SYNCED'),
      pulse: true
    },
    {
      id: 'features',
      code: 'SEC-05',
      name: t('FUNKCJE DEFI i BENTO', 'DEFI FEATURES'),
      desc: t('Płynność, mosty i szczegóły silnika SOLAX.', 'Bridges, non-custody and engine details.'),
      icon: SlicedAsset,
      color: 'text-cyan',
      glowColor: 'rgba(0, 238, 255, 0.4)',
      status: 'ONLINE',
      pulse: true
    },
    {
      id: 'token',
      code: 'SEC-06',
      name: t('TOKENOMIKA $SLX', '$SLX TOKENOMICS'),
      desc: t('Podział podaży, nagrody stakingu i DAO.', 'Supply allocation, staking yield & DAO.'),
      icon: SlicedAsset,
      color: 'text-amber-400',
      glowColor: 'rgba(251, 191, 36, 0.4)',
      status: t('ZWERYFIKOWANY', 'VERIFIED'),
      pulse: false
    },
    {
      id: 'generator',
      code: 'SEC-07',
      name: t('KREATOR AI TOKENÓW', 'AI TOKEN CREATOR'),
      desc: t('Generowanie i natychmiastowe wdrażanie tokenów.', 'Generate and auto-deploy assets with AI.'),
      icon: SlicedAsset,
      color: 'text-g',
      glowColor: 'rgba(0, 255, 136, 0.4)',
      status: t('AI GOTOWE', 'AI READY'),
      pulse: true
    },
    {
      id: 'forge',
      code: 'SEC-08',
      name: t('KUŹNIA I STAKING', 'FORGE & STAKING'),
      desc: t('Deflacyjne kopalnie oraz pule APY.', 'Deflationary token forge and earning pools.'),
      icon: SlicedAsset,
      color: 'text-r',
      glowColor: 'rgba(255, 26, 74, 0.4)',
      status: t('AKTYWNE', 'ACTIVE'),
      pulse: true
    },
    {
      id: 'cta',
      code: 'SEC-09',
      name: t('BRAMA PORTFELA', 'DEFI GATEWAY'),
      desc: t('Bezpieczna autoryzacja i White Paper.', 'Secure wallet connection & documentation.'),
      icon: SlicedAsset,
      color: 'text-cyan',
      glowColor: 'rgba(0, 238, 255, 0.4)',
      status: t('BEZPIECZNA', 'SECURE'),
      pulse: false
    }
  ];

  // Duplicate data to guarantee smooth endless scroll in HTML
  const duplicatedTickerData = [...tickerData, ...tickerData];

  return (
    <div className="relative min-h-screen bg-[#000208] text-[#e0ffe8] font-mono select-none overflow-x-hidden">
      
      {/* ══ QUANTUM LIGHTNING PLASMA OVERLAY ══ */}
      <QuantumLightningCursor />

      {/* ══ HARDWARE CURSOR ELEMENTS ══ */}
      <div 
        ref={cursorDotRef} 
        id="cur" 
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[99999] mix-blend-screen hidden md:block" 
      />
      <div 
        ref={cursorRingRef} 
        id="cur-ring" 
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[99998] hidden md:block" 
      />

      {/* ══ OPTIMIZED LIGHTWEIGHT MOUSE FLASH (0% full screen repaints!) ══ */}
      <div 
        ref={flashOverlayRef} 
        id="flash-cursor"
        className="fixed top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none z-[9990] opacity-0 mix-blend-screen transition-opacity duration-150"
        style={{
          background: 'radial-gradient(circle, rgba(0, 255, 136, 0.14) 0%, transparent 65%)',
          willChange: 'transform',
        }}
      />

      {/* ══ PERSISTENT HIGH-PERFORMANCE BACKGROUND LAYERS ══ */}
      <BackgroundEffects />

      {/* ══ SYNTHETIC GRID FLOOR LAYER ══ */}
      <div className="grid-floor">
        <div className="gfi" />
      </div>

      {/* ══ NAVIGATION BAR ══ */}
      <nav className="fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between px-4 md:px-12 h-[66px] bg-[#000208]/75 backdrop-blur-xl border-b border-g/10">
        <button 
          onClick={() => { setCurrentPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
          className="flex items-center gap-3 decoration-none group interactive-cursor bg-transparent border-none cursor-pointer p-0 text-left"
        >
          <SolaxyLogo className="w-10 h-10" />
          <span className="logo font-display text-2xl md:text-3xl tracking-[4px] text-white text-shadow-[0_0_10px_rgba(255,255,255,0.1)] group-hover:text-g group-hover:text-shadow-[0_0_12px_#00ff88] transition-all duration-300">
            SOLAXY
          </span>
          <span className="logo-tag text-[9px] tracking-[3px] text-g border border-g/40 px-2 py-0.5 bg-g/5 font-bold rounded">
            DEX
          </span>
        </button>

        <ul className="hidden lg:flex gap-6 xl:gap-8 list-none items-center h-full">
          <li>
            <button 
              onClick={() => { setCurrentPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className={`text-[10px] tracking-[2px] transition-all bg-transparent border-none cursor-pointer p-0 font-mono uppercase ${currentPage === 'home' ? 'text-g text-shadow-[0_0_8px_#00ff88] font-extrabold' : 'text-white/45 hover:text-white'}`}
            >
              {t('GŁÓWNA', 'HOME')}
            </button>
          </li>
          <li>
            <button 
              onClick={() => { setCurrentPage('generator'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className={`text-[10px] tracking-[2px] transition-all bg-transparent border-none cursor-pointer p-0 font-mono uppercase ${currentPage === 'generator' ? 'text-g text-shadow-[0_0_8px_#00ff88] font-extrabold' : 'text-white/45 hover:text-white'}`}
            >
              {t('FABRYKA AI', 'AI FACTORY')}
            </button>
          </li>
          <li>
            <button 
              onClick={() => { setCurrentPage('presale'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className={`text-[10px] tracking-[2px] transition-all bg-transparent border-none cursor-pointer p-0 font-mono uppercase ${currentPage === 'presale' ? 'text-g text-shadow-[0_0_8px_#00ff88] font-extrabold' : 'text-white/45 hover:text-white'}`}
            >
              {t('PRZEDSPRZEDAŻ', 'PRESALE')}
            </button>
          </li>
          <li>
            <button 
              onClick={() => { setCurrentPage('swap'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className={`text-[10px] tracking-[2px] transition-all bg-transparent border-none cursor-pointer p-0 font-mono uppercase ${currentPage === 'swap' ? 'text-g text-shadow-[0_0_8px_#00ff88] font-extrabold' : 'text-white/45 hover:text-white'}`}
            >
              {t('SWAP AMM', 'DEX SWAP')}
            </button>
          </li>
          <li>
            <button 
              onClick={() => { setCurrentPage('network'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className={`text-[10px] tracking-[2px] transition-all bg-transparent border-none cursor-pointer p-0 font-mono uppercase ${currentPage === 'network' ? 'text-g text-shadow-[0_0_8px_#00ff88] font-extrabold' : 'text-white/45 hover:text-white'}`}
            >
              {t('OGNIWO SVM', 'SVM NEXUS')}
            </button>
          </li>
          <li>
            <button 
              onClick={() => { setCurrentPage('forge'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className={`text-[10px] tracking-[2px] transition-all bg-transparent border-none cursor-pointer p-0 font-mono uppercase ${currentPage === 'forge' ? 'text-g text-shadow-[0_0_8px_#00ff88] font-extrabold' : 'text-white/45 hover:text-white'}`}
            >
              {t('KUŹNIA & STAKING', 'FORGE & EARN')}
            </button>
          </li>
          <li>
            <button 
              onClick={() => { setCurrentPage('status'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className={`text-[10px] tracking-[2px] transition-all bg-transparent border-none cursor-pointer p-0 font-mono uppercase ${currentPage === 'status' ? 'text-g text-shadow-[0_0_8px_#00ff88] font-extrabold' : 'text-white/45 hover:text-white'}`}
            >
              {t('STATUS & O NAS', 'STATUS & ABOUT')}
            </button>
          </li>
        </ul>

        <div className="flex items-center gap-3 md:gap-4">
          {/* ══ LANGUAGE SELECTOR SWITCHER ══ */}
          <button 
            onClick={() => setLanguage(language === 'pl' ? 'en' : 'pl')}
            className="text-[9px] md:text-[10px] tracking-[2px] uppercase border border-g/30 px-2.5 py-1 bg-g/5 hover:bg-g/15 text-g font-bold interactive-cursor flex items-center gap-1.5 transition-all duration-300 cursor-pointer"
            title={language === 'pl' ? 'Switch to English' : 'Przełącz na Polski'}
          >
            <Globe2 className="w-3.5 h-3.5 text-g animate-[spin_10s_linear_infinite]" />
            <span>{language === 'pl' ? 'EN' : 'PL'}</span>
          </button>

          {/* ══ THEME SELECTOR SWITCHER ══ */}
          <button 
            onClick={() => setTheme(theme === 'deep-black' ? 'midnight-blue' : 'deep-black')}
            className="text-[9px] md:text-[10px] tracking-[2px] uppercase border border-g/30 px-2.5 py-1 bg-g/5 hover:bg-g/15 text-g font-bold interactive-cursor flex items-center gap-1.5 transition-all duration-300 cursor-pointer"
            title={theme === 'deep-black' ? t('Włącz motyw Midnight Blue', 'Enable Midnight Blue Theme') : t('Włącz motyw Deep Black', 'Enable Deep Black Theme')}
          >
            <Palette className="w-3.5 h-3.5 text-g" />
            <span>{theme === 'deep-black' ? t('BLACK', 'BLACK') : t('MIDNIGHT', 'MIDNIGHT')}</span>
          </button>

          <span className="text-[10px] md:text-xs tracking-[2px] text-g/60 hidden sm:inline">
            SOL: <span className="text-g font-bold">{formatPrice(solPrice)}</span>
          </span>
          <button 
            onClick={() => setIsWalletModalOpen(true)} 
            className={`text-[9px] md:text-[10px] tracking-[2px] uppercase px-4 py-2 border relative overflow-hidden transition-all duration-300 cursor-pointer font-mono flex items-center gap-2 rounded-sm ${
              isConnected 
                ? 'border-g bg-g/5 text-g hover:bg-g/15 hover:shadow-[0_0_15px_rgba(0,255,136,0.3)]' 
                : 'border-cyan bg-cyan/5 text-cyan hover:bg-cyan/15 hover:shadow-[0_0_15px_rgba(0,238,255,0.3)]'
            }`}
          >
            {isConnected ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-g animate-pulse shrink-0" />
                <span>{walletAddress?.slice(0, 4)}...{walletAddress?.slice(-4)}</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>{t('POŁĄCZ PORTFEL', 'CONNECT WALLET')}</span>
              </>
            )}
          </button>

          {/* Hamburger Menu Toggle Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-g border border-g/30 p-2 bg-g/5 hover:bg-g/15 hover:border-g transition-all duration-300 interactive-cursor flex items-center justify-center cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* ══ MOBILE NAVIGATION DROPDOWN ══ */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-[66px] left-0 right-0 z-[998] bg-[#000208]/95 backdrop-blur-xl border-b border-g/20 overflow-hidden lg:hidden"
          >
            <ul className="flex flex-col gap-1.5 p-4 list-none font-mono m-0">
              <li>
                <button 
                  onClick={() => { setCurrentPage('home'); setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`w-full flex items-center justify-between text-sm sm:text-base font-bold tracking-[3px] py-4 px-6 border-b border-white/5 bg-transparent border-none cursor-pointer text-left font-mono ${currentPage === 'home' ? 'text-g text-shadow-[0_0_6px_rgba(0,255,136,0.35)]' : 'text-white/60 hover:text-white'}`}
                >
                  <span>{t('GŁÓWNA', 'HOME')}</span>
                  <span className="text-[12px]">➔</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentPage('generator'); setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`w-full flex items-center justify-between text-sm sm:text-base font-bold tracking-[3px] py-4 px-6 border-b border-white/5 bg-transparent border-none cursor-pointer text-left font-mono ${currentPage === 'generator' ? 'text-g text-shadow-[0_0_6px_rgba(0,255,136,0.35)]' : 'text-white/60 hover:text-white'}`}
                >
                  <span>{t('FABRYKA AI', 'AI FACTORY')}</span>
                  <span className="text-[12px]">➔</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentPage('presale'); setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`w-full flex items-center justify-between text-sm sm:text-base font-bold tracking-[3px] py-4 px-6 border-b border-white/5 bg-transparent border-none cursor-pointer text-left font-mono ${currentPage === 'presale' ? 'text-g text-shadow-[0_0_6px_rgba(0,255,136,0.35)]' : 'text-white/60 hover:text-white'}`}
                >
                  <span>{t('PRZEDSPRZEDAŻ', 'PRESALE')}</span>
                  <span className="text-[12px]">➔</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentPage('swap'); setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`w-full flex items-center justify-between text-sm sm:text-base font-bold tracking-[3px] py-4 px-6 border-b border-white/5 bg-transparent border-none cursor-pointer text-left font-mono ${currentPage === 'swap' ? 'text-g text-shadow-[0_0_6px_rgba(0,255,136,0.35)]' : 'text-white/60 hover:text-white'}`}
                >
                  <span>{t('SWAP AMM', 'DEX SWAP')}</span>
                  <span className="text-[12px]">➔</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentPage('network'); setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`w-full flex items-center justify-between text-sm sm:text-base font-bold tracking-[3px] py-4 px-6 border-b border-white/5 bg-transparent border-none cursor-pointer text-left font-mono ${currentPage === 'network' ? 'text-g text-shadow-[0_0_6px_rgba(0,255,136,0.35)]' : 'text-white/60 hover:text-white'}`}
                >
                  <span>{t('OGNIWO SVM', 'SVM NEXUS')}</span>
                  <span className="text-[12px]">➔</span>
                </button>
              </li>
              <li>
                  <button 
                    onClick={() => { setCurrentPage('forge'); setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className={`w-full flex items-center justify-between text-sm sm:text-base font-bold tracking-[3px] py-4 px-6 border-b border-white/5 bg-transparent border-none cursor-pointer text-left font-mono ${currentPage === 'forge' ? 'text-g text-shadow-[0_0_6px_rgba(0,255,136,0.35)]' : 'text-white/60 hover:text-white'}`}
                  >
                    <span>{t('KUŹNIA & STAKING', 'FORGE & EARN')}</span>
                    <span className="text-[12px]">➔</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setCurrentPage('status'); setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className={`w-full flex items-center justify-between text-sm sm:text-base font-bold tracking-[3px] py-4 px-6 border-b border-white/5 bg-transparent border-none cursor-pointer text-left font-mono ${currentPage === 'status' ? 'text-g text-shadow-[0_0_6px_rgba(0,255,136,0.35)]' : 'text-white/60 hover:text-white'}`}
                  >
                    <span>{t('STATUS & O NAS', 'STATUS & ABOUT')}</span>
                    <span className="text-[12px]">➔</span>
                  </button>
                </li>
              <li>
                <button 
                  onClick={() => { setIsWalletModalOpen(true); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-between text-sm sm:text-base font-bold tracking-[3px] py-4 px-6 text-cyan hover:text-white hover:bg-cyan/10 bg-transparent border-none cursor-pointer text-left font-mono"
                >
                  <span>{isConnected ? `${walletAddress?.slice(0, 6)}...${walletAddress?.slice(-6)}` : t('POŁĄCZ PORTFEL', 'CONNECT WALLET')}</span>
                  <span className="text-[12px] text-cyan">➔</span>
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ REAL-TIME DATA TICKER ══ */}
      <div className="fixed top-[66px] left-0 right-0 z-[999] h-[30px] bg-[#000208]/95 border-b border-g/5 flex items-center overflow-hidden">
        <div className="flex-shrink-0 px-4 text-[9px] tracking-[3px] text-g border-r border-g/15 h-full flex items-center gap-2 font-bold bg-[#000208]">
          <span className="lpulse" /> {t('STRUMIEŃ LIVE', 'LIVE FEED')}
        </div>
        <div className="ticker-track">
          {duplicatedTickerData.map((item, idx) => {
            const isUp = item.c >= 0;
            return (
              <div 
                key={`${item.n}-${idx}`} 
                className="flex items-center gap-2 px-6 border-r border-white/5 text-[10px] whitespace-nowrap"
              >
                <span className="text-white font-bold">{item.n}</span>
                <span className="text-white/50">{formatPrice(item.p)}</span>
                <span className={isUp ? 'text-g text-shadow-[0_0_4px_#00ff88]' : 'text-r text-shadow-[0_0_4px_#ff1a4a]'}>
                  {isUp ? '▲' : '▼'} {Math.abs(item.c).toFixed(2)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══ DYNAMIC PAGES ROUTER ══ */}
      <AnimatePresence mode="wait">
        {currentPage === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <HomePage
              t={t}
              scrollToSection={scrollToSection}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              tvl={tvl}
              trades={trades}
              tps={tps}
              volume={volume}
              isConnected={isConnected}
              walletAddress={walletAddress}
              setIsWalletModalOpen={setIsWalletModalOpen}
              expandedMetric={expandedMetric}
              setExpandedMetric={setExpandedMetric}
              handleMetricMouseEnter={handleMetricMouseEnter}
              handleMetricMouseLeave={handleMetricMouseLeave}
              sectors={sectors}
            />
          </motion.div>
        )}

        {currentPage === 'generator' && (
          <motion.div
            key="generator"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <GeneratorPage t={t} />
          </motion.div>
        )}

        {currentPage === 'presale' && (
          <motion.div
            key="presale"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <PresalePage t={t} />
          </motion.div>
        )}

        {currentPage === 'swap' && (
          <motion.div
            key="swap"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <SwapPage
              t={t}
              tokens={tokens}
              solPrice={solPrice}
              selectedTokenForTrade={selectedTokenForTrade}
              setSelectedTokenForTrade={setSelectedTokenForTrade}
              tradeAmount={tradeAmount}
              setTradeAmount={setTradeAmount}
              tradeType={tradeType}
              setTradeType={setTradeType}
              tradeSuccess={tradeSuccess}
              setTradeSuccess={setTradeSuccess}
              tradeError={tradeError}
              setTradeError={setTradeError}
              isTrading={isTrading}
              handleExecuteTrade={handleExecuteTrade}
              walletBalances={walletBalances}
            />
          </motion.div>
        )}

        {currentPage === 'network' && (
          <motion.div
            key="network"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <NetworkPage t={t} />
          </motion.div>
        )}

        {currentPage === 'forge' && (
          <motion.div
            key="forge"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <ForgePage t={t} />
          </motion.div>
        )}

        {currentPage === 'status' && (
          <motion.div
            key="status"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <StatusPage t={t} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ FOOTER ══ */}
      <footer className="relative z-[5] py-8 px-6 md:px-12 border-t border-g/10 bg-[#000208]/90 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <SolaxyEmoticon className="w-8 h-8" />
          <div className="logo font-display text-xl md:text-2xl tracking-[5px] text-g text-shadow-[0_0_10px_rgba(0,255,136,0.4)]">
            SOLA<span className="text-r text-shadow-[0_0_8px_rgba(255,26,74,0.4)]">X</span>
          </div>
        </div>

        <div className="text-[9px] tracking-[2px] text-white/30 text-center sm:text-left">
          © 2026 SOLAX PROTOCOL · {t('WSZELKIE PRAWA ZASTRZEŻONE', 'ALL RIGHTS RESERVED')}
        </div>

        <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
          <button 
            onClick={() => { setCurrentPage('status'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="text-white/40 hover:text-g text-[10px] tracking-[2px] font-mono bg-transparent border-none cursor-pointer transition-colors uppercase"
          >
            {t('STATUS SIECI', 'SYSTEM STATUS')}
          </button>
          <button 
            onClick={() => { setCurrentPage('status'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="text-white/40 hover:text-g text-[10px] tracking-[2px] font-mono bg-transparent border-none cursor-pointer transition-colors uppercase"
          >
            {t('O NAS & KONTAKT', 'ABOUT & CONTACT')}
          </button>
          <a href="https://github.com/solaxy-protocol" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-g text-[10px] tracking-[2px] font-mono decoration-none transition-colors">
            GITHUB
          </a>
          <a href="https://x.com/solaxy_protocol" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-g text-[10px] tracking-[2px] font-mono decoration-none transition-colors">
            X / TWITTER
          </a>
          <a href="https://t.me/solaxy_protocol" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-g text-[10px] tracking-[2px] font-mono decoration-none transition-colors">
            TELEGRAM
          </a>
        </div>
      </footer>

      {/* ══ CONNECT WALLET MODAL ══ */}
      <ConnectWalletModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} />
    </div>
  );
}
