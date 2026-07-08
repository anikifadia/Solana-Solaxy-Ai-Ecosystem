import React, { useEffect, useRef, useState } from 'react';
import { 
  TrendingUp, 
  Layers, 
  Cpu, 
  Lock, 
  ShieldCheck, 
  Zap, 
  Coins, 
  ArrowUpRight, 
  Globe2, 
  Navigation,
  Info,
  Menu,
  X,
  RefreshCw,
  Flame,
  Hammer,
  Sparkles,
  ArrowDownUp,
  Palette
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import BackgroundEffects from './components/BackgroundEffects';
import NetworkViz from './components/NetworkViz';
import Wormhole from './components/Wormhole';
import TokenOrb from './components/TokenOrb';
import MempoolStream from './components/MempoolStream';
import SecuritySentinel from './components/SecuritySentinel';
import RouteOptimizer from './components/RouteOptimizer';
import MiningStakingForge from './components/MiningStakingForge';
import AITokenGenerator from './components/AITokenGenerator';
import AICoreReactor from './components/AICoreReactor';
import QuantumLightningCursor from './components/QuantumLightningCursor';
import MetricSparkline from './components/MetricSparkline';
import MascotShowcase from './components/MascotShowcase';
import SlicedAsset from './components/SlicedAsset';
import RoadmapTimeline from './components/RoadmapTimeline';
import { PresaleSection } from './components/PresaleSection';
import { useLanguage } from './LanguageContext';

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
  const [tickerData, setTickerData] = useState<TickerItem[]>(INITIAL_TICKER_DATA);
  const [solPrice, setSolPrice] = useState<number>(182.74);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
  const [expandedMetric, setExpandedMetric] = useState<'tvl' | 'trades' | 'tps' | 'volume' | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMetricMouseEnter = (metric: 'tvl' | 'trades' | 'tps' | 'volume') => {
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

  // Custom cursor DOM refs
  const cursorDotRef = useRef<HTMLDivElement | null>(null);
  const cursorRingRef = useRef<HTMLDivElement | null>(null);
  const flashOverlayRef = useRef<HTMLDivElement | null>(null);

  // Interactive reveal states via IntersectionObserver
  const [revealElements, setRevealElements] = useState<string[]>([]);

  // Format Helper for Prices
  const formatPrice = (p: number): string => {
    if (p < 0.001) return '$' + p.toFixed(6);
    if (p < 1) return '$' + p.toFixed(4);
    if (p < 1000) return '$' + p.toFixed(2);
    return '$' + p.toLocaleString('en-US', { maximumFractionDigits: 0 });
  };

  // 1. Live price simulator (low frequency interval to avoid blocking rendering)
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerData((prev) => 
        prev.map((item) => {
          const delta = (Math.random() - 0.495) * 0.0025; // slight positive bias
          const newPrice = item.p * (1 + delta);
          const newChange = item.c + (Math.random() - 0.5) * 0.12;
          
          if (item.n === 'SOL') {
            setSolPrice(newPrice);
          }

          return {
            ...item,
            p: newPrice,
            c: newChange,
          };
        })
      );
      // Fluctuate Solana TPS dynamically
      setTps(Math.round(64200 + Math.random() * 1400));
    }, 3200);

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

  const handleExecuteTrade = async (ticker: string) => {
    setTradeError(null);
    setTradeSuccess(null);
    setIsTrading(true);

    const solAmount = parseFloat(tradeAmount);
    if (isNaN(solAmount) || solAmount <= 0) {
      setTradeError(language === 'pl' ? 'Podaj prawidłową ilość SOL!' : 'Enter a valid SOL amount!');
      setIsTrading(false);
      return;
    }

    try {
      const response = await fetch('/api/tokens/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker,
          type: tradeType,
          amountSol: solAmount
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || (language === 'pl' ? 'Błąd podczas realizacji transakcji.' : 'Error executing trade.'));
      }

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

  // 5. Lightweight Scroll Reveal Observer (Tracks element visibility)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id') || '';
            setRevealElements((prev) => [...prev, id]);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    const targets = document.querySelectorAll('.reveal-trigger');
    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, []);

  // Smooth scroll with header + ticker height offset
  const scrollToSection = (id: string) => {
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
    }
  };

  // Tech sector navigator data
  const sectors = [
    {
      id: 'pools',
      code: 'SEC-01',
      name: t('PULPIT SWAP AMM', 'AMM SWAP CENTER'),
      desc: t('Błyskawiczna wymiana i aktywne pule płynności.', 'Instant swap and active liquidity pools.'),
      icon: ArrowDownUp,
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
      icon: Cpu,
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
      icon: Navigation,
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
      icon: Globe2,
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
      icon: Layers,
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
      icon: Coins,
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
      icon: Sparkles,
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
      icon: Hammer,
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
      icon: ShieldCheck,
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
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          className="flex items-center gap-3 decoration-none group interactive-cursor bg-transparent border-none cursor-pointer p-0 text-left"
        >
          <SlicedAsset asset="app-icon" className="w-8 h-8 rounded border border-g/20 animate-[pulse_3s_ease-in-out_infinite]" />
          <span className="logo font-display text-2xl md:text-3xl tracking-[4px] text-white text-shadow-[0_0_10px_rgba(255,255,255,0.1)] group-hover:text-g group-hover:text-shadow-[0_0_12px_#00ff88] transition-all duration-300">
            SOLAXY
          </span>
          <span className="logo-tag text-[9px] tracking-[3px] text-g border border-g/40 px-2 py-0.5 bg-g/5 font-bold rounded">
            DEX
          </span>
        </button>

        <ul className="hidden lg:flex gap-8 list-none">
          <li>
            <button 
              onClick={() => scrollToSection('presale')} 
              className="text-[10px] tracking-[3px] text-shadow-[0_0_6px_rgba(0,255,136,0.3)] text-g hover:text-white hover:text-shadow-[0_0_8px_#00ff88] transition-all duration-200 bg-transparent border-none cursor-pointer p-0 font-mono uppercase font-bold"
            >
              {t('PRZEDSPRZEDAŻ', 'PRESALE')}
            </button>
          </li>
          <li>
            <button 
              onClick={() => scrollToSection('pools')} 
              className="text-[10px] tracking-[3px] text-g/45 hover:text-g hover:text-shadow-[0_0_8px_#00ff88] transition-all duration-200 bg-transparent border-none cursor-pointer p-0 font-mono uppercase"
            >
              {t('HANDEL', 'TRADE')}
            </button>
          </li>
          <li>
            <button 
              onClick={() => scrollToSection('network')} 
              className="text-[10px] tracking-[3px] text-g/45 hover:text-g hover:text-shadow-[0_0_8px_#00ff88] transition-all duration-200 bg-transparent border-none cursor-pointer p-0 font-mono uppercase"
            >
              SOLANA
            </button>
          </li>
          <li>
            <button 
              onClick={() => scrollToSection('token')} 
              className="text-[10px] tracking-[3px] text-g/45 hover:text-g hover:text-shadow-[0_0_8px_#00ff88] transition-all duration-200 bg-transparent border-none cursor-pointer p-0 font-mono uppercase"
            >
              {t('TOKEN $SLX', '$SLX TOKEN')}
            </button>
          </li>
          <li>
            <button 
              onClick={() => scrollToSection('generator')} 
              className="text-[10px] tracking-[3px] text-g/45 hover:text-g hover:text-shadow-[0_0_8px_#00ff88] transition-all duration-200 bg-transparent border-none cursor-pointer p-0 font-mono uppercase"
            >
              {t('KREATOR AI', 'AI CREATOR')}
            </button>
          </li>
          <li>
            <button 
              onClick={() => scrollToSection('forge')} 
              className="text-[10px] tracking-[3px] text-g/45 hover:text-g hover:text-shadow-[0_0_8px_#00ff88] transition-all duration-200 bg-transparent border-none cursor-pointer p-0 font-mono uppercase"
            >
              {t('KUŹNIA & STAKING', 'FORGE & STAKING')}
            </button>
          </li>
          <li>
            <button 
              onClick={() => scrollToSection('features')} 
              className="text-[10px] tracking-[3px] text-g/45 hover:text-g hover:text-shadow-[0_0_8px_#00ff88] transition-all duration-200 bg-transparent border-none cursor-pointer p-0 font-mono uppercase"
            >
              {t('FUNKCJE', 'FEATURES')}
            </button>
          </li>
          <li>
            <button 
              onClick={() => scrollToSection('roadmap')} 
              className="text-[10px] tracking-[3px] text-g/45 hover:text-g hover:text-shadow-[0_0_8px_#00ff88] transition-all duration-200 bg-transparent border-none cursor-pointer p-0 font-mono uppercase"
            >
              ROADMAP
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
            onClick={() => scrollToSection('cta')} 
            className="nav-btn text-[9px] md:text-[10px] tracking-[3px] uppercase px-4 py-2 border border-g text-g bg-transparent relative overflow-hidden transition-all duration-300 hover:bg-g/10 hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] cursor-pointer font-mono"
          >
            {t('URUCHOM APLIKACJĘ', 'LAUNCH APP')}
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
                  onClick={() => { scrollToSection('presale'); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-between text-sm sm:text-base font-bold tracking-[3px] py-4 px-6 text-g hover:text-white hover:bg-g/10 border-b border-white/5 bg-transparent border-none cursor-pointer text-left font-mono"
                >
                  <span className="text-shadow-[0_0_6px_rgba(0,255,136,0.3)] font-extrabold">{t('PRZEDSPRZEDAŻ', 'PRESALE')}</span>
                  <span className="text-[12px] text-g">➔</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { scrollToSection('pools'); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-between text-sm sm:text-base font-bold tracking-[3px] py-4 px-6 text-g hover:text-white hover:bg-g/10 border-b border-white/5 bg-transparent border-none cursor-pointer text-left font-mono"
                >
                  <span>{t('HANDEL', 'TRADE')}</span>
                  <span className="text-[12px] text-g">➔</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { scrollToSection('network'); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-between text-sm sm:text-base font-bold tracking-[3px] py-4 px-6 text-g hover:text-white hover:bg-g/10 border-b border-white/5 bg-transparent border-none cursor-pointer text-left font-mono"
                >
                  <span>SOLANA</span>
                  <span className="text-[12px] text-g">➔</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { scrollToSection('token'); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-between text-sm sm:text-base font-bold tracking-[3px] py-4 px-6 text-g hover:text-white hover:bg-g/10 border-b border-white/5 bg-transparent border-none cursor-pointer text-left font-mono"
                >
                  <span>{t('TOKEN $SLX', '$SLX TOKEN')}</span>
                  <span className="text-[12px] text-g">➔</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { scrollToSection('generator'); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-between text-sm sm:text-base font-bold tracking-[3px] py-4 px-6 text-g hover:text-white hover:bg-g/10 border-b border-white/5 bg-transparent border-none cursor-pointer text-left font-mono"
                >
                  <span>{t('KREATOR AI', 'AI CREATOR')}</span>
                  <span className="text-[12px] text-g">➔</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { scrollToSection('forge'); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-between text-sm sm:text-base font-bold tracking-[3px] py-4 px-6 text-g hover:text-white hover:bg-g/10 border-b border-white/5 bg-transparent border-none cursor-pointer text-left font-mono"
                >
                  <span>{t('KUŹNIA & STAKING', 'FORGE & STAKING')}</span>
                  <span className="text-[12px] text-g">➔</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { scrollToSection('features'); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-between text-sm sm:text-base font-bold tracking-[3px] py-4 px-6 text-g hover:text-white hover:bg-g/10 border-b border-white/5 bg-transparent border-none cursor-pointer text-left font-mono"
                >
                  <span>{t('FUNKCJE', 'FEATURES')}</span>
                  <span className="text-[12px] text-g">➔</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { scrollToSection('roadmap'); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-between text-sm sm:text-base font-bold tracking-[3px] py-4 px-6 text-g hover:text-white hover:bg-g/10 bg-transparent border-none cursor-pointer text-left font-mono"
                >
                  <span>ROADMAP</span>
                  <span className="text-[12px] text-g">➔</span>
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

      {/* ══ HERO SECTION ══ */}
      <section id="trade-hero" className="min-h-screen flex items-center px-4 sm:px-6 md:px-12 lg:px-24 pt-[130px] sm:pt-[180px] pb-12 sm:pb-24 relative z-[5]">
        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Content Left */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 text-[11px] sm:text-xs tracking-[5px] text-g/75 uppercase mb-6 font-bold">
              <span className="scr-l h-[1px] w-[36px] bg-g shadow-[0_0_8px_#00ff88] inline-block" />
              {t('ZAAWANSOWANY PROTOKÓŁ SOLANA DEX', 'ADVANCED SOLANA DEX PROTOCOL')}
            </div>

            <h1 className="font-display text-[38px] sm:text-6xl md:text-[80px] lg:text-[88px] leading-[1.1] sm:leading-[0.9] tracking-[3px] mb-8 font-extrabold">
              <div className="text-g text-shadow-[0_0_12px_rgba(0,255,136,0.6)] glitch ficker-anim" data-t={t('PRZYSZŁOŚĆ', 'THE FUTURE')}>
                {t('PRZYSZŁOŚĆ', 'THE FUTURE')}
              </div>
              <div className="text-r text-shadow-[0_0_12px_rgba(255,26,74,0.6)] glitch ficker-red-anim" data-t={t('HANDLU SVM', 'OF SVM TRADING')}>
                {t('HANDLU SVM', 'OF SVM TRADING')}
              </div>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-[#c8e6d2]/80 leading-relaxed max-w-[540px] mb-10 font-bold">
              {t(
                'Zaawansowany agregator płynności nowej generacji i ultra-szybki silnik transakcyjny na Solana SVM.',
                'Next-generation liquidity aggregator and ultra-fast trading engine on Solana SVM.'
              )} <br />
              <strong className="text-g font-extrabold">$SLX</strong> {t('to nie tylko token — to ', 'is not just a token — it is a ')}<strong className="text-g font-extrabold">{t('protokół nowej ery', 'new era protocol')}</strong>.<br />
              {t('Zabezpieczony smart contract · zero custody · inteligentny routing.', 'Secure smart contract · zero custody · intelligent routing.')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-center mb-16 w-full">
              <button onClick={() => scrollToSection('presale')} className="btn-neon interactive-cursor w-full sm:w-auto text-center font-bold bg-transparent border-none">
                <span className="c tl" /><span className="c tr" />
                <span className="c bl" /><span className="c br" />
                {t('⚡ START PRESALE', '⚡ START PRESALE')}
              </button>
              <button onClick={() => scrollToSection('generator')} className="btn-neon red sm interactive-cursor w-full sm:w-auto text-center font-bold bg-transparent border-none">
                <span className="c tl" /><span className="c tr" />
                <span className="c bl" /><span className="c br" />
                {t('⚡ TWÓRZ TOKEN', '⚡ CREATE TOKEN')}
              </button>
              <button onClick={() => scrollToSection('pools')} className="btn-neon border-white/20 hover:border-white/40 text-white/80 hover:text-white sm interactive-cursor w-full sm:w-auto text-center font-bold bg-transparent">
                <span className="c tl" /><span className="c tr" />
                <span className="c bl" /><span className="c br" />
                {t('WATCH DEMO ➔', 'WATCH DEMO ➔')}
              </button>
            </div>

            {/* ══ COCKPIT CONTROL PANEL / MISSION DIRECTORY ══ */}
            <div className="mb-12 border border-g/15 bg-[#04080f]/75 p-5 relative rounded">
              <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-g" />
              <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-g" />
              <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-g" />
              <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-g" />
              
              <div className="flex items-center justify-between border-b border-g/10 pb-3 mb-4 font-mono select-none">
                <span className="text-[10px] tracking-[4px] text-g font-bold uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-g animate-pulse" />
                  {t('SZYBKA NAWIGACJA SATELLITE', 'SATELLITE QUICK DIRECTORY')}
                </span>
                <span className="text-[8px] text-white/30 uppercase">SYS_INDEX // SLX-DIR-01</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: 'pools', name: t('HANDEL DEX', 'DEX SWAP'), chibi: 'chibi-wave' },
                  { id: 'network', name: 'SOLANA SVM', chibi: 'chibi-shades' },
                  { id: 'token', name: t('TOKEN $SLX', '$SLX HUB'), chibi: 'chibi-swirl' },
                  { id: 'generator', name: t('KREATOR AI', 'AI ENGINE'), chibi: 'chibi-tablet' },
                  { id: 'forge', name: t('KUŹNIA & YIELD', 'FORGE YIELD'), chibi: 'chibi-laptop' },
                  { id: 'features', name: t('MOŻLIWOŚCI', 'CAPABILITIES'), chibi: 'chibi-idea' },
                  { id: 'roadmap', name: t('HARMONOGRAM', 'ROADMAP'), chibi: 'chibi-heart' },
                  { id: 'sentinel-hub', name: t('ZABEZPIECZENIA', 'SECURITY CORE'), chibi: 'chibi-confused' }
                ].map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className="flex items-center gap-2.5 p-2 border border-white/5 bg-black/40 hover:bg-g/5 hover:border-g/30 hover:shadow-[0_0_12px_rgba(0,255,136,0.1)] transition-all duration-300 text-left cursor-pointer group rounded"
                  >
                    <div className="w-10 h-10 bg-black/60 border border-white/10 rounded flex-shrink-0 p-0.5 flex items-center justify-center overflow-hidden group-hover:border-g/30">
                      <SlicedAsset asset={sec.chibi as any} className="w-full h-full group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div>
                      <div className="text-[10px] font-display font-extrabold text-white group-hover:text-g tracking-[0.5px] uppercase transition-colors">
                        {sec.name}
                      </div>
                      <div className="text-[7.5px] font-mono text-white/30 group-hover:text-white/50 tracking-[1px] uppercase">
                        {t('PRZEJDŹ', 'GOTO')} ➔
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Key Metrics Dashboard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 items-start">
              {/* 1. TVL Card */}
              <div 
                onClick={() => setExpandedMetric(expandedMetric === 'tvl' ? null : 'tvl')}
                onMouseEnter={() => handleMetricMouseEnter('tvl')}
                onMouseLeave={handleMetricMouseLeave}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedMetric(expandedMetric === 'tvl' ? null : 'tvl'); } }}
                role="button"
                tabIndex={0}
                className={`metric-card-glitch py-3 px-4 interactive-cursor rounded-r select-none outline-none focus-visible:ring-1 focus-visible:ring-g/50 transition-all duration-300 ${
                  expandedMetric === 'tvl' ? 'expanded' : ''
                }`}
              >
                <div className="metric-glow" />
                <div className="metric-value font-display text-3xl md:text-4xl text-g text-shadow-[0_0_15px_rgba(0,255,136,0.5)]">
                  ${tvl}B
                </div>
                <div className="text-[9px] tracking-[2px] uppercase text-white/40 mt-1 font-mono select-none">
                  {t('Zablokowane TVL', 'TVL Locked')}
                </div>
                <div className="text-[7px] tracking-[1px] text-g/40 mt-2 uppercase flex items-center gap-1 select-none font-mono">
                  <span>{expandedMetric === 'tvl' ? t('▲ ZWIŃ', '▲ COLLAPSE') : t('▼ POKAŻ TREND', '▼ VIEW TREND')}</span>
                </div>
                {expandedMetric === 'tvl' && (
                  <MetricSparkline metricId="tvl" currentValue={tvl} />
                )}
              </div>

              {/* 2. Trades Card */}
              <div 
                onClick={() => setExpandedMetric(expandedMetric === 'trades' ? null : 'trades')}
                onMouseEnter={() => handleMetricMouseEnter('trades')}
                onMouseLeave={handleMetricMouseLeave}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedMetric(expandedMetric === 'trades' ? null : 'trades'); } }}
                role="button"
                tabIndex={0}
                className={`metric-card-glitch py-3 px-4 interactive-cursor rounded-r select-none outline-none focus-visible:ring-1 focus-visible:ring-g/50 transition-all duration-300 ${
                  expandedMetric === 'trades' ? 'expanded' : ''
                }`}
              >
                <div className="metric-glow" />
                <div className="metric-value font-display text-3xl md:text-4xl text-g text-shadow-[0_0_15px_rgba(0,255,136,0.5)]">
                  {trades}M
                </div>
                <div className="text-[9px] tracking-[2px] uppercase text-white/40 mt-1 font-mono select-none">
                  {t('Transakcje / 24h', 'Trades / 24h')}
                </div>
                <div className="text-[7px] tracking-[1px] text-g/40 mt-2 uppercase flex items-center gap-1 select-none font-mono">
                  <span>{expandedMetric === 'trades' ? t('▲ ZWIŃ', '▲ COLLAPSE') : t('▼ POKAŻ TREND', '▼ VIEW TREND')}</span>
                </div>
                {expandedMetric === 'trades' && (
                  <MetricSparkline metricId="trades" currentValue={trades} />
                )}
              </div>

              {/* 3. TPS Card */}
              <div 
                onClick={() => setExpandedMetric(expandedMetric === 'tps' ? null : 'tps')}
                onMouseEnter={() => handleMetricMouseEnter('tps')}
                onMouseLeave={handleMetricMouseLeave}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedMetric(expandedMetric === 'tps' ? null : 'tps'); } }}
                role="button"
                tabIndex={0}
                className={`metric-card-glitch py-3 px-4 interactive-cursor rounded-r select-none outline-none focus-visible:ring-1 focus-visible:ring-g/50 transition-all duration-300 ${
                  expandedMetric === 'tps' ? 'expanded' : ''
                }`}
              >
                <div className="metric-glow" />
                <div className="metric-value font-display text-3xl md:text-4xl text-g text-shadow-[0_0_15px_rgba(0,255,136,0.5)]">
                  {(tps / 1000).toFixed(1)}K
                </div>
                <div className="text-[9px] tracking-[2px] uppercase text-white/40 mt-1 font-mono select-none">
                  {t('Solana TPS', 'Solana TPS')}
                </div>
                <div className="text-[7px] tracking-[1px] text-g/40 mt-2 uppercase flex items-center gap-1 select-none font-mono">
                  <span>{expandedMetric === 'tps' ? t('▲ ZWIŃ', '▲ COLLAPSE') : t('▼ POKAŻ TREND', '▼ VIEW TREND')}</span>
                </div>
                {expandedMetric === 'tps' && (
                  <MetricSparkline metricId="tps" currentValue={tps} />
                )}
              </div>

              {/* 4. Volume Card */}
              <div 
                onClick={() => setExpandedMetric(expandedMetric === 'volume' ? null : 'volume')}
                onMouseEnter={() => handleMetricMouseEnter('volume')}
                onMouseLeave={handleMetricMouseLeave}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedMetric(expandedMetric === 'volume' ? null : 'volume'); } }}
                role="button"
                tabIndex={0}
                className={`metric-card-glitch py-3 px-4 interactive-cursor rounded-r select-none outline-none focus-visible:ring-1 focus-visible:ring-g/50 transition-all duration-300 ${
                  expandedMetric === 'volume' ? 'expanded' : ''
                }`}
              >
                <div className="metric-glow" />
                <div className="metric-value font-display text-3xl md:text-4xl text-g text-shadow-[0_0_15px_rgba(0,255,136,0.5)]">
                  ${volume}M
                </div>
                <div className="text-[9px] tracking-[2px] uppercase text-white/40 mt-1 font-mono select-none">
                  {t('Wolumen 24h', 'Volume 24h')}
                </div>
                <div className="text-[7px] tracking-[1px] text-g/40 mt-2 uppercase flex items-center gap-1 select-none font-mono">
                  <span>{expandedMetric === 'volume' ? t('▲ ZWIŃ', '▲ COLLAPSE') : t('▼ POKAŻ TREND', '▼ VIEW TREND')}</span>
                </div>
                {expandedMetric === 'volume' && (
                  <MetricSparkline metricId="volume" currentValue={volume} />
                )}
              </div>
            </div>
          </div>

          {/* Hero Graphic Right (AI Core Reactor) */}
          <div className="lg:col-span-5 flex justify-center items-center relative group select-none">
            {/* Ambient glows and lines */}
            <div className="absolute -inset-4 bg-g/5 rounded-full filter blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-500 animate-[pulse_6s_ease-in-out_infinite]" />
            <AICoreReactor />
          </div>

        </div>

        {/* Scroll helper */}
        <div className="absolute bottom-[36px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
          <div className="scr-l" />
          <div className="text-[8px] tracking-[4px] text-g/40">{t('PRZEWIŃ', 'SCROLL')}</div>
        </div>
      </section>

      {/* ══ PRESALE SECTION WITH ANIMATED COUNTDOWN TIMER ══ */}
      <PresaleSection />

      {/* ══ QUANTUM SYSTEM NAVIGATOR (TABLE OF CONTENTS / OPERATIONAL INDEX) ══ */}
      <section className="relative z-[10] max-w-7xl mx-auto px-4 sm:px-6 md:px-12 mb-16 select-none">
        <div className="border border-g/20 bg-[#04080f]/85 backdrop-blur-xl p-6 md:p-8 relative overflow-hidden shadow-[0_0_40px_rgba(0,255,136,0.05)]">
          {/* Tech-deco markings */}
          <div className="absolute top-0 right-0 w-32 h-[1px] bg-gradient-to-r from-transparent to-g shadow-[0_0_8px_#00ff88]" />
          <div className="absolute bottom-0 left-0 w-32 h-[1px] bg-gradient-to-r from-g to-transparent shadow-[0_0_8px_#00ff88]" />
          <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-g" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-g" />
          <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-g" />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-g" />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-g/10 pb-4 mb-6 gap-4">
            <div>
              <div className="text-[9px] tracking-[4px] text-g font-bold uppercase flex items-center gap-1.5 mb-1">
                <span className="lpulse" /> {t('SYSTEMOWY INDEKS OPERACYJNY', 'SYSTEM OPERATIONAL INDEX')}
              </div>
              <h3 className="font-display text-lg md:text-xl text-white uppercase tracking-[1px] font-extrabold">
                {t('NAWIGATOR SEKTORÓW EKOSYSTEMU', 'ECOSYSTEM SECTOR NAVIGATOR')}
              </h3>
            </div>
            <div className="text-[9px] md:text-[10px] text-[#c8e6d2]/40 font-mono flex items-center gap-4 bg-g/5 border border-g/15 px-3 py-1.5">
              <span className="text-g font-bold uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-g rounded-full animate-ping" />
                {t('STAN: AKTYWNY', 'SYS STATUS: ACTIVE')}
              </span>
              <span className="text-white/20">|</span>
              <span>TPS: <span className="text-g font-bold">{tps}</span></span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectors.map((sec) => {
              const IconComp = sec.icon;
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className="group relative flex flex-col justify-between text-left p-4 bg-g/[0.02] border border-g/10 hover:border-g/30 hover:bg-g/[0.04] transition-all duration-300 select-none cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-g"
                >
                  <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-g/40 group-hover:border-g" />
                  <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-g/40 group-hover:border-g" />

                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[9px] font-mono font-bold text-white/35 group-hover:text-g tracking-[1px]">
                      {sec.code}
                    </span>
                    <span className={`px-2 py-0.5 border border-g/10 text-[8px] font-bold group-hover:border-g/30 tracking-[1px] uppercase bg-black/40 ${sec.color}`}>
                      {sec.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-g/5 border border-g/10 group-hover:border-g/20 group-hover:bg-g/10 transition-colors">
                      <IconComp className={`w-4 h-4 ${sec.color}`} />
                    </div>
                    <h4 className="font-display text-xs md:text-sm font-extrabold text-white group-hover:text-g tracking-[0.5px] uppercase transition-colors">
                      {sec.name}
                    </h4>
                  </div>

                  <p className="text-[10px] text-[#c8e6d2]/50 leading-relaxed mb-4 group-hover:text-white/80 transition-colors">
                    {sec.desc}
                  </p>

                  <div className="text-[8px] tracking-[2px] text-g/40 group-hover:text-g font-bold uppercase flex items-center gap-1 mt-auto">
                    <span>{t('INICJUJ SKOK', 'INITIALIZE LEAP')}</span>
                    <span className="group-hover:translate-x-1 transition-transform">➔</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ PROTOCOLS LIVE HUB (LIVE TRADING LEDGER & SMART ROUTER) ══ */}
      <section className="relative z-[5] py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-g/10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 text-[10px] tracking-[5px] text-g/50 uppercase mb-4">
            <span className="w-6 h-[1px] bg-g shadow-[0_0_6px_#00ff88]" /> {t('KONSOLA MONITORINGU TRANSAKCJI', 'REAL-TIME TRANSACTION CONSOLE')}
          </div>
          <h2 className="font-display text-3xl md:text-5xl tracking-[2px] text-white uppercase">
            {t('MONITORING TRANSAKCJI & ', 'TRANSACTION MONITORING & ')}{' '}
            <span className="text-g text-shadow-[0_0_8px_rgba(0,255,136,0.4)]">{t('INTELIGENTNY ROUTING', 'INTELLIGENT ROUTING')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#c8e6d2]/50 max-w-[620px] mx-auto mt-4 leading-relaxed">
            {t(
              'Śledź aktywność puli w czasie rzeczywistym, weryfikuj optymalne trasy transakcyjne i analizuj stabilność sieci Solana SVM.',
              'Track real-time pool activity, verify optimized transaction routing paths, and analyze Solana SVM network stability.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <div className="reveal-trigger" id="mempool-hub">
            <MempoolStream />
          </div>
          <div className="reveal-trigger" id="router-hub">
            <RouteOptimizer />
          </div>
        </div>
      </section>

      {/* ══ SOLANA ECOSYSTEM NETWORK SECTION ══ */}
      <section id="network" className="relative z-[5] py-24 px-6 md:px-12 flex flex-col items-center border-t border-g/10 bg-[#000208]/40">
        <div className="text-center max-w-[680px] mb-12">
          <div className="flex items-center justify-center gap-2 text-[10px] tracking-[5px] text-g/50 uppercase mb-4">
            <span className="w-6 h-[1px] bg-g shadow-[0_0_6px_#00ff88]" /> {t('ZINTEGROWANA ARCHITEKTURA', 'INTEGRATED ARCHITECTURE')}
          </div>
          <h2 className="font-display text-3xl sm:text-5xl md:text-[64px] leading-none tracking-[2px] mb-6">
            <span className="text-g text-shadow-[0_0_10px_rgba(0,255,136,0.4)]">SOLAXY</span> {t('NEXUS', 'NEXUS')}{' '}
            <span className="text-cyan text-shadow-[0_0_10px_rgba(0,238,255,0.4)]">{t('W SIECI', 'IN THE NETWORK')}</span>
            <div className="text-white/75 mt-2 text-2xl sm:text-4xl uppercase">{t('INTEGRACJA EKOSYSTEMU SVM', 'SVM ECOSYSTEM INTEGRATION')}</div>
          </h2>
          <p className="text-xs sm:text-sm text-[#c8e6d2]/50 leading-relaxed">
            {t(
              'SOLAXY integruje się bezpośrednio z kluczowymi protokołami DeFi w ekosystemie Solana. Transakcje są dystrybuowane w całej sieci z optymalnym czasem reakcji i zerowymi opóźnieniami.',
              'SOLAXY integrates directly with key DeFi protocols in the Solana ecosystem. Transactions are routed across the network with optimal execution speeds and zero latency.'
            )}
          </p>
        </div>

        {/* HIGH PERFORMANCE NETWORK VIZ */}
        <div className="w-full flex justify-center py-6">
          <NetworkViz />
        </div>
      </section>

      {/* ══ DIMENSIONAL WORMHOLE SECTION ══ */}
      <section className="relative z-[5] py-32 overflow-hidden min-h-[580px] flex items-center justify-center border-t border-cyan/10">
        {/* OPTIMIZED COSMIC WORMHOLE */}
        <Wormhole />
        
        <div className="relative z-[2] text-center px-4">
          <div className="font-display text-4xl sm:text-6xl md:text-[88px] leading-[0.95] tracking-[4px]">
            <div className="text-r text-shadow-[0_0_10px_rgba(255,26,74,0.5)] glitch" data-t={t('PŁYNNOŚĆ', 'LIQUIDITY')}>{t('PŁYNNOŚĆ', 'LIQUIDITY')}</div>
            <div className="text-g text-shadow-[0_0_10px_rgba(0,255,136,0.5)] glitch" data-t={t('BEZ', 'WITHOUT')}>{t('BEZ', 'WITHOUT')}</div>
            <div className="text-cyan text-shadow-[0_0_12px_rgba(0,238,255,0.5)] text-3xl sm:text-5xl md:text-[72px] mt-2 font-display">
              {t('GRANIC', 'BORDERS')}
            </div>
          </div>
          <div className="text-[10px] sm:text-xs tracking-[4px] text-g/60 mt-8 font-bold">
            {t('MAKSYMALNA GŁĘBOKOŚĆ · PEŁNA DECENTRAlIZACJA · BŁYSKAWICZNA FINALIZACJA', 'MAXIMUM DEPTH · FULL DECENTRALIZATION · INSTANT SETTLEMENT')}
          </div>
        </div>
      </section>

      {/* ══ FEATURES GRID (BENTO CARD STYLE) ══ */}
      <section id="features" className="relative z-[5] py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-g/10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 text-[10px] tracking-[5px] text-g/50 uppercase mb-4">
            <span className="w-6 h-[1px] bg-g shadow-[0_0_6px_#00ff88]" /> {t('MOŻLIWOŚCI SILNIKA', 'ENGINE CAPABILITIES')}
          </div>
          <h2 className="font-display text-3xl md:text-5xl tracking-[2px] text-white">
            {t('MAKSYMALNA', 'MAXIMUM')}{' '}
            <span className="text-g text-shadow-[0_0_8px_rgba(0,255,136,0.4)]">{t('WYDAJNOŚĆ', 'PERFORMANCE')}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="border border-g/10 bg-[#04080f]/75 p-8 relative overflow-hidden group hover:bg-[#000a06]/90 hover:border-g/30 hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-g to-cyan scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            <div className="text-white/20 text-[10px] tracking-[4px] mb-6">01</div>
            <SlicedAsset asset="icon-fast" className="w-12 h-12 mb-6 hover:scale-110 transition-transform duration-300" />
            <h3 className="font-display text-xl tracking-[1px] text-g mb-3">ULTRA SPEED</h3>
            <p className="text-xs text-[#c8e6d2]/50 leading-relaxed">
              {t(
                'Finalizacja transakcji w zaledwie 400ms. Szybki silnik kojarzenia zleceń w czasie rzeczywistym działa płynniej niż CEX.',
                'Transaction finality in just 400ms. High-speed matching engine in real-time runs smoother than any CEX.'
              )}
            </p>
          </div>

          {/* Card 2 */}
          <div className="border border-g/10 bg-[#04080f]/75 p-8 relative overflow-hidden group hover:bg-[#000a06]/90 hover:border-g/30 hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-g to-cyan scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            <div className="text-white/20 text-[10px] tracking-[4px] mb-6">02</div>
            <SlicedAsset asset="icon-secure" className="w-12 h-12 mb-6 hover:scale-110 transition-transform duration-300" />
            <h3 className="font-display text-xl tracking-[1px] text-g mb-3">SELF-CUSTODY</h3>
            <p className="text-xs text-[#c8e6d2]/50 leading-relaxed">
              {t(
                'Pełna integracja z Phantom, Backpack, Solflare. Twoje fundusze należą wyłącznie do Ciebie na każdym etapie wymiany.',
                'Full integration with Phantom, Backpack, and Solflare. Your funds belong strictly to you at every stage of exchange.'
              )}
            </p>
          </div>

          {/* Card 3 */}
          <div className="border border-g/10 bg-[#04080f]/75 p-8 relative overflow-hidden group hover:bg-[#000a06]/90 hover:border-g/30 hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-g to-cyan scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            <div className="text-white/20 text-[10px] tracking-[4px] mb-6">03</div>
            <SlicedAsset asset="icon-scalable" className="w-12 h-12 mb-6 hover:scale-110 transition-transform duration-300" />
            <h3 className="font-display text-xl tracking-[1px] text-g mb-3">DEEP LIQUIDITY</h3>
            <p className="text-xs text-[#c8e6d2]/50 leading-relaxed">
              {t(
                "Agregacja płynności z ponad 12 protokołów. Skoncentrowane pule CLMM gwarantują optymalne spready i brak slippage'u.",
                'Liquidity aggregation from over 12 protocols. Concentrated CLMM pools guarantee optimal spreads and zero slippage.'
              )}
            </p>
          </div>

          {/* Card 4 */}
          <div className="border border-g/10 bg-[#04080f]/75 p-8 relative overflow-hidden group hover:bg-[#000a06]/90 hover:border-g/30 hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-g to-cyan scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            <div className="text-white/20 text-[10px] tracking-[4px] mb-6">04</div>
            <SlicedAsset asset="icon-solana" className="w-12 h-12 mb-6 hover:scale-110 transition-transform duration-300" />
            <h3 className="font-display text-xl tracking-[1px] text-g mb-3">ZERO FEES</h3>
            <p className="text-xs text-[#c8e6d2]/50 leading-relaxed">
              {t(
                'Protokół nie nalicza ukrytych opłat handlowych. Płacisz wyłącznie standardowy, minimalny gas sieci Solana.',
                'The protocol does not charge hidden trading fees. You only pay standard, minimal Solana network gas.'
              )}
            </p>
          </div>

          {/* Card 5 */}
          <div className="border border-g/10 bg-[#04080f]/75 p-8 relative overflow-hidden group hover:bg-[#000a06]/90 hover:border-g/30 hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-g to-cyan scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            <div className="text-white/20 text-[10px] tracking-[4px] mb-6">05</div>
            <SlicedAsset asset="icon-innovative" className="w-12 h-12 mb-6 hover:scale-110 transition-transform duration-300" />
            <h3 className="font-display text-xl tracking-[1px] text-g mb-3">AI ROUTING</h3>
            <p className="text-xs text-[#c8e6d2]/50 leading-relaxed">
              {t(
                'Algorytm automatycznie przeszukuje i rozdziela transakcje między 50+ pul DeFi w celu maksymalizacji Twojego zysku.',
                'The algorithm automatically searches and splits trades among 50+ DeFi pools to maximize your return.'
              )}
            </p>
          </div>

          {/* Card 6 */}
          <div className="border border-g/10 bg-[#04080f]/75 p-8 relative overflow-hidden group hover:bg-[#000a06]/90 hover:border-g/30 hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-g to-cyan scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            <div className="text-white/20 text-[10px] tracking-[4px] mb-6">06</div>
            <SlicedAsset asset="icon-decentralized" className="w-12 h-12 mb-6 hover:scale-110 transition-transform duration-300" />
            <h3 className="font-display text-xl tracking-[1px] text-g mb-3">CROSS-CHAIN</h3>
            <p className="text-xs text-[#c8e6d2]/50 leading-relaxed">
              {t(
                'Wbudowany most Wormhole umożliwia natychmiastowy trading z sieciami Ethereum, BNB i Polygon bezpośrednio z pulpitu.',
                'Built-in Wormhole bridge enables instant trading with Ethereum, BNB, and Polygon networks directly from your dashboard.'
              )}
            </p>
          </div>
        </div>

        {/* Interactive Mascot Matrix Portal */}
        <div className="mt-12">
          <MascotShowcase />
        </div>
      </section>

      {/* ══ STATS MARQUEE (ENDLESS TICKING WORDS) ══ */}
      <div className="relative z-[5] py-10 bg-[#000208]/85 border-y border-g/10 overflow-hidden my-16">
        <div className="marquee-track">
          {Array.from({ length: 3 }).map((_, rIdx) => (
            <React.Fragment key={rIdx}>
              {[
                'SOLANA', 
                '$SLX TOKEN', 
                t('PROTOKÓŁ DEX', 'DEX PROTOCOL'), 
                t('ZERO OPŁAT', 'ZERO FEES'), 
                t('NATYCHMIASTOWA FINALIZACJA', 'INSTANT SETTLEMENT'), 
                'ON-CHAIN', 
                t('BEZ POWIERNICTWA', 'NON-CUSTODIAL'), 
                t('ZOPTYMALIZOWANE PRZEZ AI', 'AI OPTIMIZED'), 
                t('MOST CROSS-CHAIN', 'CROSS-CHAIN BRIDGE'), 
                t('HANDLUJ TERAZ', 'TRADE NOW')
              ].map((word, wIdx) => (
                <div key={`${word}-${wIdx}`} className="flex items-center gap-6 px-12 font-display text-lg sm:text-xl tracking-[4px] text-g/25">
                  {word} <span className="w-[5px] h-[5px] bg-r rounded-full shadow-[0_0_6px_#ff1a4a]" />
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ══ TOKENOMICS SECTION ══ */}
      <section id="token" className="relative z-[5] py-12 sm:py-24 px-4 sm:px-6 md:px-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center border-t border-g/10">
        
        {/* OPTIMIZED TOKEN ORB VISUALIZATION */}
        <div className="token-orb-wrap relative h-[280px] sm:h-[440px] flex items-center justify-center w-full">
          <TokenOrb />
          <div className="absolute text-center z-[10] pointer-events-none select-none">
            <div className="font-display text-[72px] sm:text-[96px] text-g text-shadow-[0_0_20px_#00ff88] leading-none flicker-anim">
              $
            </div>
            <div className="text-sm tracking-[8px] text-g/75 font-bold mt-1 font-extrabold">S L X</div>
          </div>
        </div>

        {/* TOKEN DATA */}
        <div>
          <div className="flex items-center gap-2 text-[10px] tracking-[5px] text-g/50 uppercase mb-4">
            <span className="w-6 h-[1px] bg-g shadow-[0_0_6px_#00ff88]" /> {t('NATYWNA UŻYTECZNOŚĆ', 'NATIVE UTILITY')}
          </div>
          <h2 className="font-display text-4xl sm:text-5xl leading-none tracking-[2px] mb-8">
            <span className="text-g text-shadow-[0_0_10px_rgba(0,255,136,0.35)]">$SLX</span>
            <div className="text-white/60 text-2xl tracking-[2px] mt-2">{t('TOKENOMIKA I DYSTRYBUCJA', 'TOKENOMICS & DISTRIBUTION')}</div>
          </h2>
          
          <p className="text-xs sm:text-sm text-[#c8e6d2]/50 leading-relaxed mb-10">
            {t(
              'Posiadaj swój własny udział w protokole. Stakuj tokeny $SLX i uzyskaj dostęp do redystrybucji opłat transakcyjnych sieci, zniżek handlowych i praw głosowania w strukturach DAO.',
              'Own your stake in the protocol. Stake $SLX tokens and get access to the redistribution of network transaction fees, trading discounts, and voting rights in DAO structures.'
            )}
          </p>

          <div className="flex flex-col gap-6">
            {/* Row 1 */}
            <div>
              <div className="flex justify-between text-xs tracking-[1px] mb-2">
                <span className="text-white/60">{t('Nagrody dla Społeczności', 'Community Rewards')}</span>
                <span className="text-g font-bold">40%</span>
              </div>
              <div className="h-[3px] bg-white/5 overflow-hidden">
                <div className="tok-bar-fill bg-g shadow-[0_0_8px_#00ff88]" style={{ width: '40%' }} />
              </div>
            </div>

            {/* Row 2 */}
            <div>
              <div className="flex justify-between text-xs tracking-[1px] mb-2">
                <span className="text-white/60">{t('Pule Wydobywania Płynności', 'Liquidity Mining Pools')}</span>
                <span className="text-g font-bold">25%</span>
              </div>
              <div className="h-[3px] bg-white/5 overflow-hidden">
                <div className="tok-bar-fill bg-g shadow-[0_0_8px_#00ff88]" style={{ width: '25%' }} />
              </div>
            </div>

            {/* Row 3 */}
            <div>
              <div className="flex justify-between text-xs tracking-[1px] mb-2">
                <span className="text-white/60">{t('Zespół i Doradcy (Vesting)', 'Team & Advisors (Vested)')}</span>
                <span className="text-r font-bold">15%</span>
              </div>
              <div className="h-[3px] bg-white/5 overflow-hidden">
                <div className="tok-bar-fill bg-r shadow-[0_0_8px_#ff1a4a]" style={{ width: '15%' }} />
              </div>
            </div>

            {/* Row 4 */}
            <div>
              <div className="flex justify-between text-xs tracking-[1px] mb-2">
                <span className="text-white/60">{t('Fundusz Rozwoju Ekosystemu', 'Ecosystem Growth Fund')}</span>
                <span className="text-cyan font-bold">12%</span>
              </div>
              <div className="h-[3px] bg-white/5 overflow-hidden">
                <div className="tok-bar-fill bg-cyan shadow-[0_0_8px_#00eeff]" style={{ width: '12%' }} />
              </div>
            </div>

            {/* Row 5 */}
            <div>
              <div className="flex justify-between text-xs tracking-[1px] mb-2">
                <span className="text-white/60">{t('Publiczna Sprzedaż Tokenów', 'Public Token Sale')}</span>
                <span className="text-purple font-bold">8%</span>
              </div>
              <div className="h-[3px] bg-white/5 overflow-hidden">
                <div className="tok-bar-fill bg-purple shadow-[0_0_8px_#7b2dff]" style={{ width: '8%' }} />
              </div>
            </div>
          </div>

          <div className="mt-10 inline-flex items-center gap-4 border border-g/20 bg-g/5 px-6 py-4 mb-8">
            <div>
              <div className="font-display text-2xl sm:text-3xl text-g text-shadow-[0_0_15px_rgba(0,255,136,0.5)] tracking-[2px]">
                1,000,000,000
              </div>
              <div className="text-[10px] tracking-[3px] text-g/40 uppercase mt-1 font-bold">
                {t('CAŁKOWITA PODAŻ $SLX', 'TOTAL SUPPLY $SLX')}
              </div>
            </div>
          </div>

          <div className="reveal-trigger" id="sentinel-hub">
            <SecuritySentinel />
          </div>
        </div>
      </section>

      {/* ══ AI TOKEN GENERATOR SECTION ══ */}
      <section id="generator" className="relative z-[5] py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-g/10">
        <div className="reveal-trigger" id="ai-generator-hub">
          <AITokenGenerator />
        </div>
      </section>

      {/* ══ REAL-TIME LIQUIDITY POOLS & AMM TRADING SECTION ══ */}
      <section id="pools" className="relative z-[5] py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-g/10 bg-[#000208]/40">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 text-[10px] tracking-[5px] text-g/50 uppercase mb-4">
            <span className="w-6 h-[1px] bg-g shadow-[0_0_6px_#00ff88]" /> {t('AUTOMATYCZNY ANIMATOR RYNKU (AMM)', 'AUTOMATED MARKET MAKER (AMM)')}
          </div>
          <h2 className="font-display text-3xl md:text-5xl tracking-[2px] text-white uppercase mb-4">
            {t('ZDECENTRALIZOWANE ', 'DECENTRALIZED ')}<span className="text-cyan text-shadow-[0_0_8px_rgba(0,238,255,0.4)]">{t('PULE PŁYNNOŚCI', 'LIQUIDITY POOLS')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#c8e6d2]/50 max-w-[680px] mx-auto leading-relaxed">
            {t(
              'Zdecentralizowany rynek tokenów i automatyczny kreator płynności AMM. Każdy nowo wdrożony token otrzymuje natychmiastowe wsparcie płynnościowe (80% puli), umożliwiając bezproblemowy, bezpieczny handel bez pośredników z natychmiastową wyceną rynkową.',
              'Decentralized token market and automated AMM liquidity provision. Each newly deployed token receives instant liquidity support (80% of supply), enabling seamless and secure trading with immediate, transparent market valuation.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pools List */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-g/10 pb-4">
              <span className="font-display text-xs tracking-[2px] text-g uppercase">{t('Dostępne Pule Płynności', 'Available Liquidity Pools')}</span>
              <span className="font-mono text-[10px] text-white/40 uppercase">
                {t(`Łącznie pul: ${tokens.length}`, `Total pools: ${tokens.length}`)}
              </span>
            </div>

            {tokens.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-g/10 bg-[#04080f]/40">
                <RefreshCw className="w-8 h-8 text-g/30 animate-spin mx-auto mb-4" />
                <p className="text-xs text-white/40">{t('Ładowanie pul płynności...', 'Loading liquidity pools...')}</p>
              </div>
            ) : (
              tokens.map((tok: any) => {
                const pctLeft = (tok.remainingPool / tok.initialPool) * 100;
                const IconComponent = tok.iconType === "Flame" ? Flame : tok.iconType === "Hammer" ? Hammer : tok.iconType === "Sparkles" ? Sparkles : Coins;
                const isSelected = selectedTokenForTrade?.ticker === tok.ticker;

                return (
                  <div 
                    key={tok.ticker}
                    className={`border transition-all duration-300 p-5 bg-[#04080f]/75 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-[#000a06]/50 ${isSelected ? 'border-g shadow-[0_0_15px_rgba(0,255,136,0.15)]' : 'border-g/10'}`}
                  >
                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 bg-gradient-to-br ${tok.colorGradient} bg-clip-text text-transparent border border-g/20 rounded-none`}>
                          <IconComponent className="w-5 h-5 text-g" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-display text-sm text-white tracking-[1px] uppercase">{tok.name}</span>
                            <span className="font-mono text-xs text-g font-bold px-1.5 py-0.5 bg-g/5 border border-g/20">{tok.ticker}</span>
                          </div>
                          <p className="text-[10px] text-[#c8e6d2]/40 line-clamp-1 mt-0.5">{tok.description}</p>
                        </div>
                      </div>

                      {/* Liquidity Remaining Bar */}
                      <div className="mt-4">
                        <div className="flex justify-between text-[10px] tracking-[1px] mb-1.5">
                          <span className="text-white/40">{t('Pozostało w puli płynności AMM:', 'Remaining in AMM pool:')}</span>
                          <span className="text-g font-bold">
                            {tok.remainingPool.toLocaleString()} / {tok.initialPool.toLocaleString()} {tok.ticker} ({pctLeft.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="h-2.5 bg-white/5 border border-g/5 overflow-hidden p-[2px]">
                          <div 
                            className="h-full bg-gradient-to-r from-g to-cyan shadow-[0_0_8px_#00ff88] transition-all duration-500" 
                            style={{ width: `${pctLeft}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto border-t sm:border-t-0 border-g/10 pt-3 sm:pt-0">
                      <div className="text-left sm:text-right">
                        <div className="text-[10px] text-white/30 uppercase tracking-[1px]">{t('Cena rynkowa:', 'Market price:')}</div>
                        <div className="font-mono text-xs text-white font-bold mt-0.5">
                          {(tok.priceSol * solPrice).toFixed(4)} USD <span className="text-g">/ {tok.priceSol.toFixed(6)} SOL</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedTokenForTrade(tok);
                          setTradeSuccess(null);
                          setTradeError(null);
                        }}
                        className={`w-full sm:w-auto btn-neon text-xs px-4 py-2 interactive-cursor ${isSelected ? 'active' : ''}`}
                      >
                        <span className="c tl" /><span className="c tr" />
                        <span className="c bl" /><span className="c br" />
                        ⚡ {isSelected ? t('WYBRANY', 'SELECTED') : t('HANDLUJ', 'TRADE')}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* AMM Swap Interface */}
          <div className="border border-cyan/15 bg-[#00050e]/95 p-6 relative overflow-hidden flex flex-col justify-between">
            {/* Corner designs */}
            <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyan" />
            <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cyan" />
            <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cyan" />
            <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyan" />

            <div>
              <div className="flex items-center gap-2 border-b border-cyan/10 pb-4 mb-6">
                <ArrowDownUp className="w-5 h-5 text-cyan" />
                <span className="font-display text-sm tracking-[2px] text-cyan uppercase">{t('SWAP GIEŁDOWY AMM', 'AMM SWAP EXCHANGE')}</span>
              </div>

              {!selectedTokenForTrade ? (
                <div className="text-center py-16">
                  <Coins className="w-12 h-12 text-cyan/20 mx-auto mb-4 animate-pulse" />
                  <p className="text-xs text-[#c8e6d2]/50 mb-1 leading-relaxed">
                    {t('Wybierz token z pul płynności po lewej, aby rozpocząć natychmiastowy handel AMM.', 'Select a token from the liquidity pools on the left to start instant AMM trading.')}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  <div className="p-3 bg-cyan/5 border border-cyan/20">
                    <div className="text-[10px] text-cyan/60 uppercase tracking-[1px] mb-1">{t('Wybrany Token:', 'Selected Token:')}</div>
                    <div className="flex justify-between items-center">
                      <span className="font-display text-xs text-white font-bold">{selectedTokenForTrade.name}</span>
                      <span className="font-mono text-xs text-cyan bg-cyan/5 border border-cyan/30 px-2 py-0.5">{selectedTokenForTrade.ticker}</span>
                    </div>
                  </div>

                  {/* Buy/Sell Toggles */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 border border-white/10 rounded-none">
                    <button
                      type="button"
                      onClick={() => setTradeType('BUY')}
                      className={`py-2.5 text-xs font-display tracking-[1px] transition-all ${tradeType === 'BUY' ? 'bg-g text-black font-extrabold shadow-[0_0_10px_#00ff88]' : 'text-white/60 hover:text-white'}`}
                    >
                      {t('KUP', 'BUY')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTradeType('SELL')}
                      className={`py-2.5 text-xs font-display tracking-[1px] transition-all ${tradeType === 'SELL' ? 'bg-r text-white font-extrabold shadow-[0_0_10px_#ff1a4a]' : 'text-white/60 hover:text-white'}`}
                    >
                      {t('SPRZEDAJ', 'SELL')}
                    </button>
                  </div>

                  {/* Input Form */}
                  <div>
                    <label className="block text-[10px] text-white/40 uppercase tracking-[1px] mb-1.5">{t('Wpłać Ilość SOL:', 'Pay SOL Amount:')}</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0.01"
                        value={tradeAmount}
                        onChange={(e) => setTradeAmount(e.target.value)}
                        className="w-full bg-[#04080f]/90 border border-cyan/20 px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-cyan transition-colors"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono text-cyan font-bold">SOL</span>
                    </div>
                  </div>

                  {/* AMM estimation */}
                  <div className="p-3 bg-white/5 border border-white/5">
                    <div className="flex justify-between text-[10px] text-white/40 mb-1">
                      <span>{t('Szacowany odbiór:', 'Estimated payout:')}</span>
                      <span>{t('Wpływ na cenę:', 'Price impact:')}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="font-mono text-sm text-g font-bold">
                        {(() => {
                          const amt = parseFloat(tradeAmount);
                          if (isNaN(amt) || amt <= 0) return '0.00';
                          return (amt / selectedTokenForTrade.priceSol).toLocaleString(undefined, {maximumFractionDigits: 4});
                        })()}{' '}
                        {selectedTokenForTrade.ticker}
                      </span>
                      <span className="font-mono text-[10px] text-yellow-400">
                        {(() => {
                          const amt = parseFloat(tradeAmount);
                          if (isNaN(amt) || amt <= 0) return '0.00%';
                          const tokAmt = amt / selectedTokenForTrade.priceSol;
                          const impact = (tokAmt / selectedTokenForTrade.initialPool) * 100;
                          return `${impact.toFixed(3)}%`;
                        })()}
                      </span>
                    </div>
                  </div>

                  {tradeError && (
                    <div className="text-xs text-r bg-r/10 border border-r/20 p-3 leading-relaxed">
                      ❌ {tradeError}
                    </div>
                  )}

                  {tradeSuccess && (
                    <div className="text-xs text-g bg-g/10 border border-g/20 p-3 leading-relaxed">
                      ✅ {tradeSuccess}
                    </div>
                  )}

                  <button
                    onClick={() => handleExecuteTrade(selectedTokenForTrade.ticker)}
                    disabled={isTrading}
                    className="w-full btn-neon cyan text-xs py-4 text-center font-display tracking-[2px] mt-2 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="c tl" /><span className="c tr" />
                    <span className="c bl" /><span className="c br" />
                    {isTrading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-cyan" />
                        {t('PRZETWARZANIE SWAP...', 'PROCESSING SWAP...')}
                      </>
                    ) : (
                      t('ZATWIERDŹ SWAP (SOLANA)', 'CONFIRM SWAP (SOLANA)')
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="border-t border-cyan/10 pt-4 mt-6 text-center">
              <span className="text-[9px] tracking-[2px] text-white/30 uppercase">
                {t('NAPĘDZANE FORMUIĄ STAŁEGO PRODUKTU AMM', 'POWERED BY CONSTANT PRODUCT AMM FORMULA')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ MINING, STAKING & DEFLATION FORGE SECTION ══ */}
      <section id="forge" className="relative z-[5] py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-g/10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-[10px] tracking-[5px] text-g/50 uppercase mb-4">
            <span className="w-6 h-[1px] bg-g shadow-[0_0_6px_#00ff88]" /> {t('PŁYNNOŚĆ I STAKING DEFI', 'DEFI LIQUIDITY & STAKING')}
          </div>
          <h2 className="font-display text-3xl md:text-5xl tracking-[2px] text-white uppercase">
            {t('ZDECENTRALIZOWANA EMISJA & ', 'DECENTRALIZED EMISSION & ')}<span className="text-g text-shadow-[0_0_8px_rgba(0,255,136,0.4)]">{t('SYSTEM STAKINGU', 'STAKING SYSTEM')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#c8e6d2]/50 max-w-[620px] mx-auto mt-4 leading-relaxed">
            {t(
              'Zabezpiecz swoje aktywa w zdecentralizowanych skarbcach płynności, uzyskaj konkurencyjne stopy zwrotu (APY) i bierz udział w ekosystemie stakingowym Solaxy.',
              'Secure your assets in decentralized liquidity vaults, yield competitive returns (APY), and actively participate in the Solaxy staking ecosystem.'
            )}
          </p>
        </div>

        <div className="reveal-trigger" id="mining-staking-hub">
          <MiningStakingForge />
        </div>
      </section>

      {/* ══ INTERACTIVE ROADMAP TIMELINE ══ */}
      <RoadmapTimeline />

      {/* ══ CALL TO ACTION (CTA) SECTION ══ */}
      <section id="cta" className="relative z-[5] py-32 px-6 text-center border-t border-g/10">
        <div className="absolute inset-0 bg-radial-[ellipse_80%_60%_at_50%_50%] from-g/[0.03] to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-g to-transparent shadow-[0_0_40px_#00ff88]" />

        <div className="max-w-[800px] mx-auto">
          <div className="flex items-center justify-center gap-2 text-[10px] tracking-[5px] text-g/50 uppercase mb-4">
            <span className="w-6 h-[1px] bg-g shadow-[0_0_6px_#00ff88]" /> {t('DOŁĄCZ DO REWOLUCJI', 'JOIN THE REVOLUTION')}
          </div>

          <h2 className="font-display text-4xl sm:text-6xl md:text-[88px] leading-[0.95] tracking-[4px] mb-8">
            <div className="text-g text-shadow-[0_0_15px_rgba(0,255,136,0.6)] glitch" data-t={t('DOŁĄCZ DO', 'JOIN THE')}>
              {t('DOŁĄCZ DO', 'JOIN THE')}
            </div>
            <div className="text-r text-shadow-[0_0_15px_rgba(255,26,74,0.6)] glitch" data-t={t('REWOLUCJI', 'REVOLUTION')}>
              {t('REWOLUCJI', 'REVOLUTION')}
            </div>
          </h2>

          <p className="text-xs sm:text-sm text-[#c8e6d2]/50 tracking-[2px] uppercase mb-12">
            {t('Phantom Wallet · Backpack · Solflare — Połącz portfel w 1 kliknięcie', 'Phantom Wallet · Backpack · Solflare — Connect wallet in 1 click')}
          </p>

          <div className="flex flex-wrap gap-5 justify-center mb-10">
            <button 
              className="btn-neon text-xl sm:text-2xl px-12 py-5 interactive-cursor" 
              onClick={() => alert(t('W AI Studio Preview symulowana jest bezpieczna integracja autoryzacji transakcji Solana. Połączenie portfela przebiegło pomyślnie!', 'Solana transaction authorization secure integration simulated in AI Studio Preview. Wallet connected successfully!'))}
            >
              <span className="c tl" /><span className="c tr" />
              <span className="c bl" /><span className="c br" />
              ⚡ {t('POŁĄCZ PORTFEL', 'CONNECT WALLET')}
            </button>
            <a href="#" className="btn-neon red px-8 py-4 text-sm sm:text-base interactive-cursor">
              <span className="c tl" /><span className="c tr" />
              <span className="c bl" /><span className="c br" />
              WHITE PAPER
            </a>
          </div>

          <p className="text-[9px] tracking-[4px] text-white/20 uppercase">
            {t('ZBUDOWANE NA SOLANIE · ZABEZPIECZONE KRYPTOGRAFIĄ · NAPĘDZANE MATEMATYKĄ', 'BUILT ON SOLANA · SECURED BY CRYPTOGRAPHY · POWERED BY MATH')}
          </p>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="relative z-[5] py-8 px-6 md:px-12 border-t border-g/10 bg-[#000208]/90 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="logo font-display text-xl md:text-2xl tracking-[5px] text-g text-shadow-[0_0_10px_rgba(0,255,136,0.4)]">
          SOLA<span className="text-r text-shadow-[0_0_8px_rgba(255,26,74,0.4)]">X</span>
        </div>

        <div className="text-[9px] tracking-[2px] text-white/30 text-center sm:text-left">
          © 2026 SOLAX PROTOCOL · {t('WSZELKIE PRAWA ZASTRZEŻONE', 'ALL RIGHTS RESERVED')}
        </div>

        <div className="flex gap-6">
          {['Twitter', 'Discord', 'Telegram', 'GitHub', 'Docs'].map((network) => (
            <a 
              key={network} 
              href="#" 
              className="text-[9px] tracking-[2px] uppercase text-g/40 hover:text-g hover:text-shadow-[0_0_8px_#00ff88] transition-all duration-200"
            >
              {network}
            </a>
          ))}
        </div>
      </footer>

    </div>
  );
}
