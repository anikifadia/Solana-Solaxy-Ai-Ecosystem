import React from 'react';
import { motion } from 'motion/react';
import SlicedAsset from './SlicedAsset';
import AICoreReactor from './AICoreReactor';
import MascotShowcase from './MascotShowcase';
import RoadmapTimeline from './RoadmapTimeline';
import Wormhole from './Wormhole';

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
      <section id="trade-hero" className="min-h-screen flex items-center px-4 sm:px-6 md:px-12 lg:px-24 pt-[130px] sm:pt-[180px] pb-12 sm:pb-24 relative z-[5]">
        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Content Left */}
          <div className="lg:col-span-7">
            <img 
              src="/src/assets/images/solaxy_mascot_hero_1783437956325.jpg" 
              alt="Solaxy Hero" 
              className="w-full h-auto rounded-lg border border-g/15 shadow-[0_0_35px_rgba(0,255,136,0.15)] mb-8"
            />

            <h1 className="font-display text-[38px] sm:text-6xl md:text-[80px] lg:text-[88px] leading-[1.1] sm:leading-[0.9] tracking-[3px] mb-8 font-extrabold">
              <div className="text-g text-shadow-[0_0_12px_rgba(0,255,136,0.6)] glitch ficker-anim" data-t={t('PRZYSZŁOŚĆ', 'THE FUTURE')}>
                {t('PRZYSZŁOŚĆ', 'THE FUTURE')}
              </div>
              <div className="text-r text-shadow-[0_0_12px_rgba(255,26,74,0.6)] glitch ficker-red-anim" data-t={t('HANDLU SVM', 'OF SVM TRADING')}>
                {t('HANDLU SVM', 'OF SVM TRADING')}
              </div>
            </h1>

            {/* ══ INTERACTIVE KEY ACTIONS TAGLINE ══ */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 font-mono text-[10px] sm:text-xs tracking-[3px] uppercase mb-8 font-extrabold select-none">
              <button 
                onClick={() => scrollToSection('generator')}
                className="text-g hover:text-white hover:bg-g/10 hover:border-g/50 transition-all border border-g/20 bg-g/5 px-3 py-1.5 cursor-pointer rounded-sm"
              >
                CREATE
              </button>
              <span className="text-white/20 font-sans">•</span>
              <button 
                onClick={() => scrollToSection('presale')}
                className="text-cyan hover:text-white hover:bg-cyan/10 hover:border-cyan/50 transition-all border border-cyan/20 bg-cyan/5 px-3 py-1.5 cursor-pointer rounded-sm"
              >
                LAUNCH
              </button>
              <span className="text-white/20 font-sans">•</span>
              <button 
                onClick={() => scrollToSection('forge')}
                className="text-r hover:text-white hover:bg-r/10 hover:border-r/50 transition-all border border-r/20 bg-r/5 px-3 py-1.5 cursor-pointer rounded-sm"
              >
                DOMINATE
              </button>
            </div>

            <p className="text-sm sm:text-base md:text-lg text-[#c8e6d2]/80 leading-relaxed max-w-[540px] mb-10 font-bold">
              {t(
                'Zaawansowany agregator płynności nowej generacji i ultra-szybki silnik transakcyjny na Solana SVM.',
                'Next-generation liquidity aggregator and ultra-fast trading engine on Solana SVM.'
              )} <br />
              <strong className="text-g font-extrabold">$SLX</strong> {t('to nie tylko token — to ', 'is not just a token — it is a ')}<strong className="text-g font-extrabold">{t('protokół nowej ery', 'new era protocol')}</strong>.<br />
              {t('Zabezpieczony smart contract · zero custody · inteligentny routing.', 'Secure smart contract · zero custody · intelligent routing.')}
            </p>

            {/* ══ COCKPIT CONTROL PANEL / MISSION DIRECTORY ══ */}
            <div className="mb-10 border border-g/30 bg-black/85 p-6 relative rounded-lg shadow-[0_0_25px_rgba(0,255,136,0.08)]">
              {/* Modern Grid Background Elements */}
              <div className="absolute inset-0 bg-gradient-to-r from-g/5 to-transparent pointer-events-none opacity-40 rounded-lg" />
              <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-g" />
              <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-g" />
              <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-g" />
              <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-g" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-g/20 pb-4 mb-6 font-mono select-none gap-2">
                <span className="text-xs sm:text-sm tracking-[5px] text-g font-black uppercase flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-g shadow-[0_0_8px_#00ff88] animate-pulse shrink-0" />
                  {t('SZYBKA NAWIGACJA SATELLITE', 'SATELLITE QUICK DIRECTORY')}
                </span>
                <span className="text-[10px] text-white/50 tracking-[2px] font-bold bg-g/10 border border-g/20 px-2 py-0.5 rounded">
                  SYS_INDEX // SLX-DIR-01
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { id: 'pools', name: t('HANDEL DEX', 'DEX SWAP'), desc: t('Szybka wymiana', 'Instant swap'), chibi: 'chibi-wave' },
                  { id: 'network', name: 'SOLANA SVM', desc: t('Monitor mempoola', 'Mempool monitor'), chibi: 'chibi-shades' },
                  { id: 'token', name: t('TOKEN $SLX', '$SLX HUB'), desc: t('Dystrybucja tokena', 'Token economics'), chibi: 'chibi-swirl' },
                  { id: 'generator', name: t('KREATOR AI', 'AI ENGINE'), desc: t('Generator memów', 'Meme token builder'), chibi: 'chibi-tablet' },
                  { id: 'forge', name: t('KUŹNIA & YIELD', 'FORGE YIELD'), desc: t('Staking i spalanie', 'Stake & burn'), chibi: 'chibi-laptop' },
                  { id: 'features', name: t('MOŻLIWOŚCI', 'CAPABILITIES'), desc: t('Funkcje ekosystemu', 'Ecosystem features'), chibi: 'chibi-idea' },
                  { id: 'roadmap', name: t('HARMONOGRAM', 'ROADMAP'), desc: t('Plany rozwoju', 'Development path'), chibi: 'chibi-heart' },
                  { id: 'sentinel-hub', name: t('ZABEZPIECZENIA', 'SECURITY CORE'), desc: t('Skaner kontraktów', 'Contract audit'), chibi: 'chibi-confused' }
                ].map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className="flex items-center gap-3.5 p-3.5 border border-white/10 bg-[#060c16]/90 hover:bg-g/10 hover:border-g hover:shadow-[0_0_20px_rgba(0,255,136,0.18)] transition-all duration-300 text-left cursor-pointer group rounded-lg w-full relative overflow-hidden"
                  >
                    {/* Glowing Accent Indicator on Hover */}
                    <div className="absolute top-0 right-0 w-2 h-2 bg-g/40 rounded-bl transform translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-300" />
                    
                    <div className="w-12 h-12 bg-black/80 border border-white/15 rounded-lg flex-shrink-0 p-1 flex items-center justify-center overflow-hidden group-hover:border-g/40 group-hover:scale-105 transition-all duration-300">
                      <SlicedAsset asset={sec.chibi as any} className="w-full h-full group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-[13px] font-display font-black text-white group-hover:text-g tracking-[1px] uppercase transition-colors truncate">
                        {sec.name}
                      </div>
                      <div className="text-[10px] text-white/40 group-hover:text-white/70 transition-colors truncate mb-1">
                        {sec.desc}
                      </div>
                      <div className="text-[8px] font-mono font-bold text-g/70 tracking-[2px] uppercase flex items-center gap-1">
                        <span>{t('PRZEJDŹ', 'GOTO')}</span> <span className="group-hover:translate-x-1 transition-transform duration-300">➔</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

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

            {/* Promotional Banner */}
            <div className="mb-12 overflow-hidden rounded-lg border border-g/15 shadow-[0_0_35px_rgba(0,255,136,0.15)] bg-black/45">
              <img 
                src="/src/assets/images/solaxy_beyond_chain_1783602087724.jpg" 
                alt="Solaxy Beyond The Chain" 
                className="w-full h-auto object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* ══ QUANTUM SYSTEM NAVIGATOR (TABLE OF CONTENTS / OPERATIONAL INDEX) ══ */}
            <div className="mb-12 select-none">
              <div className="border border-g/20 bg-[#04080f]/85 backdrop-blur-xl p-5 relative overflow-hidden shadow-[0_0_40px_rgba(0,255,136,0.05)] rounded-lg">
                {/* Tech-deco markings */}
                <div className="absolute top-0 right-0 w-32 h-[1px] bg-gradient-to-r from-transparent to-g shadow-[0_0_8px_#00ff88]" />
                <div className="absolute bottom-0 left-0 w-32 h-[1px] bg-gradient-to-r from-g to-transparent shadow-[0_0_8px_#00ff88]" />
                <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-g" />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-g" />
                <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-g" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-g" />

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-g/10 pb-4 mb-5 gap-3">
                  <div>
                    <div className="text-[9px] tracking-[4px] text-g font-bold uppercase flex items-center gap-1.5 mb-1 font-mono">
                      <span className="lpulse" /> {t('SYSTEMOWY INDEKS OPERACYJNY', 'SYSTEM OPERATIONAL INDEX')}
                    </div>
                    <h3 className="font-display text-base text-white uppercase tracking-[1px] font-extrabold">
                      {t('NAWIGATOR SEKTORÓW EKOSYSTEMU', 'ECOSYSTEM SECTOR NAVIGATOR')}
                    </h3>
                  </div>
                  <div className="text-[9px] text-[#c8e6d2]/40 font-mono flex items-center gap-3 bg-g/5 border border-g/15 px-2.5 py-1 rounded-sm">
                    <span className="text-g font-bold uppercase flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-g rounded-full animate-ping" />
                      {t('STAN: AKTYWNY', 'SYS STATUS: ACTIVE')}
                    </span>
                    <span className="text-white/20">|</span>
                    <span>TPS: <span className="text-g font-bold">{tps}</span></span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sectors.map((sec) => {
                    const IconComp = sec.icon;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => scrollToSection(sec.id)}
                        className="group relative flex flex-col justify-between text-left p-3.5 bg-g/[0.02] border border-g/10 hover:border-g/30 hover:bg-g/[0.04] transition-all duration-300 select-none cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-g w-full rounded"
                      >
                        <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-g/40 group-hover:border-g" />
                        <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-g/40 group-hover:border-g" />

                        <div className="flex justify-between items-start mb-2.5">
                          <span className="text-[9px] font-mono font-bold text-white/35 group-hover:text-g tracking-[1px]">
                            {sec.code}
                          </span>
                          <span className={`px-1.5 py-0.5 border border-g/10 text-[8px] font-bold group-hover:border-g/30 tracking-[1px] uppercase bg-black/40 ${sec.color}`}>
                            {sec.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5 mb-1.5">
                          <div className="p-1.5 bg-g/5 border border-g/10 group-hover:border-g/20 group-hover:bg-g/10 transition-colors rounded-sm">
                            <IconComp className={`w-3.5 h-3.5 ${sec.color}`} />
                          </div>
                          <h4 className="font-display text-[11px] font-extrabold text-white group-hover:text-g tracking-[0.5px] uppercase transition-colors">
                            {sec.name}
                          </h4>
                        </div>

                        <p className="text-[10px] text-[#c8e6d2]/50 leading-normal mb-3 group-hover:text-white/80 transition-colors">
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
            </div>

            {/* Mascot Poses Banner */}
            <div className="mb-14 overflow-hidden rounded-lg border border-g/15 shadow-[0_0_35px_rgba(0,255,136,0.15)] bg-black/45">
              <img 
                src="/src/assets/images/solaxy_mascot_poses_1783437972677.jpg" 
                alt="Solaxy Mascot Poses" 
                className="w-full h-auto object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Key Metrics Dashboard with HD spinning galaxy background */}
            <div className="relative border border-g/30 bg-black/90 p-6 rounded-lg shadow-[0_0_35px_rgba(0,255,136,0.12)] overflow-hidden">
              {/* Spinning Galaxy Background */}
              <div className="absolute inset-0 opacity-60 mix-blend-screen pointer-events-none z-0">
                <Wormhole />
              </div>
              
              {/* Glow overlay for luxury depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#000208] via-transparent to-transparent pointer-events-none z-[1]" />

              {/* Header */}
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between border-b border-g/20 pb-4 mb-6 font-mono select-none gap-2">
                <span className="text-xs sm:text-sm tracking-[5px] text-g font-black uppercase flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-g shadow-[0_0_8px_#00ff88] animate-pulse shrink-0" />
                  {t('METRYKI EKOSYSTEMU NA ŻYWO', 'LIVE ECOSYSTEM METRICS')}
                </span>
                <span className="text-[10px] text-white/50 tracking-[2px] font-bold bg-g/10 border border-g/20 px-2 py-0.5 rounded">
                  LIVE_CORE // SLX-STATS
                </span>
              </div>

              {/* 4 Cards Grid */}
              <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* 1. TVL Card */}
                <div className="bg-black/75 backdrop-blur-md border border-white/10 p-4 rounded-lg flex flex-col justify-center min-h-[110px] hover:border-g/40 transition-colors duration-300">
                  <div className="text-[28px] sm:text-[32px] font-display font-black text-g text-shadow-[0_0_15px_rgba(0,255,136,0.4)] leading-none mb-2">
                    ${tvl}B
                  </div>
                  <div className="text-[9px] tracking-[1.5px] uppercase text-white/50 font-mono font-bold leading-tight">
                    {t('ZABLOKOWANE TVL', 'TVL LOCKED')}
                  </div>
                </div>

                {/* 2. Trades Card */}
                <div className="bg-black/75 backdrop-blur-md border border-white/10 p-4 rounded-lg flex flex-col justify-center min-h-[110px] hover:border-g/40 transition-colors duration-300">
                  <div className="text-[28px] sm:text-[32px] font-display font-black text-g text-shadow-[0_0_15px_rgba(0,255,136,0.4)] leading-none mb-2">
                    {trades}M
                  </div>
                  <div className="text-[9px] tracking-[1.5px] uppercase text-white/50 font-mono font-bold leading-tight">
                    {t('TRANSAKCJE / 24H', 'TRADES / 24H')}
                  </div>
                </div>

                {/* 3. TPS Card */}
                <div className="bg-black/75 backdrop-blur-md border border-white/10 p-4 rounded-lg flex flex-col justify-center min-h-[110px] hover:border-g/40 transition-colors duration-300">
                  <div className="text-[28px] sm:text-[32px] font-display font-black text-g text-shadow-[0_0_15px_rgba(0,255,136,0.4)] leading-none mb-2">
                    {(tps / 1000).toFixed(1)}K
                  </div>
                  <div className="text-[9px] tracking-[1.5px] uppercase text-white/50 font-mono font-bold leading-tight">
                    {t('SOLANA TPS', 'SOLANA TPS')}
                  </div>
                </div>

                {/* 4. Volume Card */}
                <div className="bg-black/75 backdrop-blur-md border border-white/10 p-4 rounded-lg flex flex-col justify-center min-h-[110px] hover:border-g/40 transition-colors duration-300">
                  <div className="text-[28px] sm:text-[32px] font-display font-black text-g text-shadow-[0_0_15px_rgba(0,255,136,0.4)] leading-none mb-2">
                    ${volume}M
                  </div>
                  <div className="text-[9px] tracking-[1.5px] uppercase text-white/50 font-mono font-bold leading-tight">
                    {t('WOLUMEN 24H', 'VOLUME 24H')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Graphic Right (AI Core Reactor & Mascot) with swirling galaxy of Solana tokens swirling around Solaxy */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative group select-none gap-6 min-h-[500px]">
            {/* Ambient glows and lines */}
            <div className="absolute -inset-4 bg-g/5 rounded-full filter blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-500 animate-[pulse_6s_ease-in-out_infinite] pointer-events-none" />
            
            {/* 🌌 Spinning Galaxy Swirling Around Mascot! */}
            <div className="absolute inset-0 w-full h-full opacity-90 mix-blend-screen pointer-events-none z-0">
              <Wormhole />
            </div>

            {/* 🤖 Solaxy Mascot Character ("Typ") at the very top of the Hero zone */}
            <motion.div 
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              onClick={() => {
                scrollToSection('generator');
                setTimeout(() => {
                  window.dispatchEvent(new CustomEvent('trigger-mascot-prompt'));
                }, 400);
              }}
              className="relative z-10 w-[180px] sm:w-[210px] flex flex-col items-center group-hover:scale-105 transition-transform duration-500 cursor-pointer active:scale-95"
              title={t('Kliknij mnie, aby stworzyć token o pieskach!', 'Click me to generate a token about dogs!')}
            >
              {/* Retro HUD speech bubble */}
              <div className="absolute -top-12 bg-g/10 border border-g/30 px-3 py-1 text-[9px] text-g font-bold tracking-[1.5px] select-none font-mono text-center z-10 whitespace-nowrap shadow-[0_0_15px_rgba(0,255,136,0.25)] rounded-sm">
                {t('KLIKNIJ MNIE: PROMPT AI!', 'CLICK ME: AI PROMPT!')}
                <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-2 h-2 bg-[#04080f] border-r border-b border-g/30 rotate-45" />
              </div>
              <SlicedAsset asset="main-pose" className="w-full h-auto drop-shadow-[0_0_40px_rgba(0,255,136,0.35)]" />
            </motion.div>

            <div className="relative z-10 w-full flex justify-center">
              <AICoreReactor />
            </div>
          </div>

        </div>

        {/* Scroll helper */}
        <div className="absolute bottom-[36px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
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
