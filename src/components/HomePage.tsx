import React from 'react';
import { motion } from 'motion/react';
import SlicedAsset from './SlicedAsset';
import AICoreReactor from './AICoreReactor';
import MascotShowcase from './MascotShowcase';
import RoadmapTimeline from './RoadmapTimeline';
import MetricSparkline from './MetricSparkline';
import HERO_POSTER_URL from '../assets/images/solaxy_mascot_hero_1783437956325.jpg';

interface HomePageProps {
  t: (pl: string, en: string) => string;
  scrollToSection: (id: string) => void;
  currentPage: string;
  setCurrentPage: (page: 'home' | 'generator' | 'presale' | 'swap' | 'network' | 'forge') => void;
  tvl: number;
  trades: number;
  tps: number;
  volume: number;
  isConnected: boolean;
  walletAddress: string | null;
  setIsWalletModalOpen: (open: boolean) => void;
  expandedMetric: string | null;
  setExpandedMetric: (metric: string | null) => void;
  handleMetricMouseEnter: (metricId: string) => void;
  handleMetricMouseLeave: () => void;
  sectors: any[];
}

export default function HomePage({
  t,
  scrollToSection,
  tvl,
  trades,
  tps,
  volume,
  isConnected,
  walletAddress,
  setIsWalletModalOpen,
  expandedMetric,
  setExpandedMetric,
  handleMetricMouseEnter,
  handleMetricMouseLeave,
  sectors,
}: HomePageProps) {
  return (
    <>
      {/* ══ HERO SECTION ══ */}
      <section id="trade-hero" className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 sm:px-6 md:px-12 lg:px-24 pt-[110px] pb-12 z-[5] w-full">
        <div className="max-w-5xl w-full mx-auto flex flex-col items-center gap-8">
          
          {/* Responsive Hero Poster Container */}
          <div className="relative w-full rounded-xl overflow-hidden border border-g/30 bg-[#04080f]/95 shadow-[0_0_50px_rgba(0,255,136,0.18)] group transition-all duration-500 hover:border-g/50 hover:shadow-[0_0_60px_rgba(0,255,136,0.3)]">
            {/* Ambient overlay light reflections */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
            <div className="absolute -inset-10 bg-g/5 rounded-full filter blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" />
            
            <img 
              src={HERO_POSTER_URL} 
              alt="Solaxy AI Token Ecosystem Launcher" 
              className="w-full h-auto object-contain block mx-auto select-none pointer-events-none transition-transform duration-500 group-hover:scale-[1.01]"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Interactive Button Shortcuts for quick navigation */}
          <div className="flex flex-wrap gap-4 sm:gap-6 justify-center w-full z-10 select-none">
            <button 
              onClick={() => scrollToSection('presale')} 
              className="btn-neon interactive-cursor text-center font-bold bg-transparent border-none py-3 px-6 text-xs sm:text-sm"
            >
              <span className="c tl" /><span className="c tr" />
              <span className="c bl" /><span className="c br" />
              {t('⚡ ROZPOCZNIJ PRZEDSPRZEDAŻ', '⚡ START PRESALE')}
            </button>
            <button 
              onClick={() => scrollToSection('generator')} 
              className="btn-neon red interactive-cursor text-center font-bold bg-transparent border-none py-3 px-6 text-xs sm:text-sm"
            >
              <span className="c tl" /><span className="c tr" />
              <span className="c bl" /><span className="c br" />
              {t('⚡ KREATOR TOKENÓW AI', '⚡ AI TOKEN FACTORY')}
            </button>
            <button 
              onClick={() => scrollToSection('pools')} 
              className="btn-neon border-white/20 hover:border-white/40 text-white/80 hover:text-white interactive-cursor py-3 px-6 text-xs sm:text-sm bg-transparent"
            >
              <span className="c tl" /><span className="c tr" />
              <span className="c bl" /><span className="c br" />
              {t('WIZUALIZATOR SWAP AMM ➔', 'SWAP AMM VISUALIZER ➔')}
            </button>
          </div>
        </div>

        {/* Scroll helper */}
        <div className="absolute bottom-[20px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
          <div className="scr-l" />
          <div className="text-[8px] tracking-[4px] text-g/40">{t('PRZEWIŃ', 'SCROLL')}</div>
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
                  className="group relative flex flex-col justify-between text-left p-4 bg-g/[0.02] border border-g/10 hover:border-g/30 hover:bg-g/[0.04] transition-all duration-300 select-none cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-g w-full"
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
              className="btn-neon text-xl sm:text-2xl px-12 py-5 interactive-cursor bg-transparent border-none" 
              onClick={() => setIsWalletModalOpen(true)}
            >
              <span className="c tl" /><span className="c tr" />
              <span className="c bl" /><span className="c br" />
              {isConnected ? `⚡ ${walletAddress?.slice(0, 6)}...${walletAddress?.slice(-6)}` : `⚡ ${t('POŁĄCZ PORTFEL', 'CONNECT WALLET')}`}
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
    </>
  );
}
