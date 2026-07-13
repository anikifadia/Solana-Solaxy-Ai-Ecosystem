import React from 'react';
import { motion } from 'motion/react';
import { Flame, ShieldCheck, Pickaxe, Key, Coins, Info, Rocket, Sparkles, Server, BarChart3, Calendar } from 'lucide-react';
import SlicedAsset from './SlicedAsset';
import RoadmapTimeline from './RoadmapTimeline';
import Wormhole from './Wormhole';

import HERO_IMAGE from '../assets/images/solaxy_mascot_hero_1783437956325.jpg';
import BEYOND_IMAGE from '../assets/images/solaxy_infographic_1783981728892.jpg';
import POSES_IMAGE from '../assets/images/solaxy_mascot_poses_1783437972677.jpg';

// Re-using same image constants safely
const HERO_IMG = HERO_IMAGE;
const BEYOND_IMG = '../assets/images/solaxy_infographic_1783981728892.jpg';

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
  isConnected,
  walletAddress,
  setIsWalletModalOpen,
  tps,
}: HomePageProps) {
  return (
    <div className="bg-[#000208] text-white min-h-screen pt-[110px] pb-24 overflow-hidden relative selection:bg-g/30 selection:text-white">
      {/* Background space ambient effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-g/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-r/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-24">
        
        {/* ════ SECTION 1: HERO ACTION HEADER & ARTWORK (Screenshot 3) ════ */}
        <section id="hero-header-artwork" className="flex flex-col items-center text-center">
          {/* Action Buttons Top Row */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full mb-10">
            <button 
              onClick={() => scrollToSection('presale')} 
              className="relative w-full sm:w-auto px-8 py-3.5 bg-black/80 border border-g text-g font-bold rounded-sm tracking-[2px] uppercase text-xs sm:text-sm hover:bg-g/10 hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all duration-300 select-none cursor-pointer"
            >
              <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-g" />
              <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-g" />
              <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-g" />
              <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-g" />
              {t('⚡ START PRESALE', '⚡ START PRESALE')}
            </button>
            
            <button 
              onClick={() => scrollToSection('generator')} 
              className="relative w-full sm:w-auto px-8 py-3.5 bg-black/80 border border-r text-r font-bold rounded-sm tracking-[2px] uppercase text-xs sm:text-sm hover:bg-r/10 hover:shadow-[0_0_20px_rgba(255,26,74,0.4)] transition-all duration-300 select-none cursor-pointer"
            >
              <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-r" />
              <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-r" />
              <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-r" />
              <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-r" />
              {t('⚡ TWÓRZ TOKEN', '⚡ CREATE TOKEN')}
            </button>
            
            <button 
              onClick={() => scrollToSection('pools')} 
              className="relative w-full sm:w-auto px-8 py-3.5 bg-black/85 border border-g/40 text-white/90 font-bold rounded-sm tracking-[2px] uppercase text-xs sm:text-sm hover:bg-g/5 hover:border-g transition-all duration-300 select-none cursor-pointer"
            >
              <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-g/40" />
              <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-g/40" />
              <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-g/40" />
              <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-g/40" />
              {t('WATCH DEMO ➔', 'WATCH DEMO ➔')}
            </button>
          </div>

          {/* Centered Beyond Chain Artwork */}
          <div className="w-full relative overflow-hidden rounded-lg border border-g/20 bg-[#02050a]/90 shadow-[0_0_45px_rgba(0,255,136,0.18)] mb-10 group">
            {/* Ambient inner glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none z-10" />
            <img 
              src={BEYOND_IMAGE} 
              alt="Solaxy Beyond The Chain" 
              className="w-full h-auto object-cover transform scale-100 group-hover:scale-[1.01] transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
          </div>


        </section>


        {/* ════ SECTION 2: FUTURE OF SVM TRADING (Screenshot 2) ════ */}
        <section id="future-svm" className="flex flex-col items-center text-center">
          {/* Neon Display Header */}
          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold leading-[1.1] tracking-[3px] mb-6 select-none">
            <div className="text-g text-shadow-[0_0_15px_rgba(0,255,136,0.5)] uppercase">
              {t('PRZYSZŁOŚĆ', 'PRZYSZŁOŚĆ')}
            </div>
            <div className="text-r text-shadow-[0_0_15px_rgba(255,26,74,0.5)] uppercase mt-1">
              {t('HANDLU SVM', 'HANDLU SVM')}
            </div>
          </h2>

          {/* Side-by-side Retro Pills */}
          <div className="flex items-center gap-3.5 justify-center mb-10 select-none font-mono text-[10px] font-extrabold tracking-[2px]">
            <span className="border border-g/30 bg-g/5 text-g px-3.5 py-1.5 rounded-sm">CREATE</span>
            <span className="text-white/20">•</span>
            <span className="border border-cyan/30 bg-cyan/5 text-cyan px-3.5 py-1.5 rounded-sm">LAUNCH</span>
            <span className="text-white/20">•</span>
            <span className="border border-r/30 bg-r/5 text-r px-3.5 py-1.5 rounded-sm">DOMINATE</span>
          </div>

          {/* Centered Beautiful Mascot standing on moon */}
          <div className="w-full max-w-[540px] relative overflow-hidden rounded-lg border border-g/20 bg-[#02050a]/90 shadow-[0_0_45px_rgba(0,255,136,0.18)] mb-10 group">
            {/* Ambient inner glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none z-10" />
            <img 
              src={HERO_IMAGE} 
              alt="Solaxy Mascot Hero" 
              className="w-full h-auto object-cover transform scale-100 group-hover:scale-[1.02] transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Paragraph and slogan points */}
          <div className="max-w-[580px] mx-auto">
            <p className="text-sm sm:text-base text-white/90 leading-relaxed font-bold mb-4">
              {t(
                'Zaawansowany agregator płynności nowej generacji i ultra-szybki silnik transakcyjny na Solana SVM.',
                'Zaawansowany agregator płynności nowej generacji i ultra-szybki silnik transakcyjny na Solana SVM.'
              )}
            </p>
            <p className="text-xs sm:text-sm text-g font-semibold leading-relaxed">
              {t(
                '$SLX to nie tylko token - to protokół nowej ery. Zabezpieczony smart contract · zero custody ·',
                '$SLX to nie tylko token - to protokół nowej ery. Zabezpieczony smart contract · zero custody ·'
              )}
            </p>
          </div>
        </section>


        {/* ════ SECTION 3: EMISJA & SYSTEM STAKINGU (Screenshot 1) ════ */}
        <section id="staking-emission" className="flex flex-col items-center">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-[2px] text-white uppercase mb-4">
              {t('EMISJA & SYSTEM STAKINGU', 'EMISJA & SYSTEM STAKINGU')}
            </h2>
            <p className="text-xs sm:text-sm text-[#c8e6d2]/70 max-w-[580px] mx-auto leading-relaxed">
              {t(
                'Zabezpiecz swoje aktywa w zdecentralizowanych skarbcach płynności, uzyskaj konkurencyjne stopy zwrotu (APY) i bierz udział w ekosystemie stakingowym Solaxy.',
                'Zabezpiecz swoje aktywa w zdecentralizowanych skarbcach płynności, uzyskaj konkurencyjne stopy zwrotu (APY) i bierz udział w ekosystemie stakingowym Solaxy.'
              )}
            </p>
          </div>

          {/* Glowing console box */}
          <div className="w-full border border-g/30 bg-black/90 p-5 sm:p-7 rounded-lg shadow-[0_0_35px_rgba(0,255,136,0.12)] relative overflow-hidden">
            <span className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-g" />
            <span className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-g" />
            <span className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-g" />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-g" />

            {/* Top green status badge */}
            <div className="flex items-center gap-2 mb-4 font-mono select-none">
              <span className="w-2.5 h-2.5 rounded-full bg-g shadow-[0_0_8px_#00ff88] animate-pulse shrink-0" />
              <span className="text-[10px] sm:text-xs tracking-[3px] text-g font-extrabold uppercase">
                {t('INNOWACYJNE GÓRNICTWO & KUŹNIA', 'INNOWACYJNE GÓRNICTWO & KUŹNIA')}
              </span>
            </div>

            {/* Box Header Titles */}
            <h3 className="font-display text-lg sm:text-xl md:text-2xl font-black text-white uppercase tracking-[1px] mb-3">
              {t('KOPALNIA I KUŹNIA TOKENÓW - SOLAXY MINING', 'KOPALNIA I KUŹNIA TOKENÓW - SOLAXY MINING')}
            </h3>
            <p className="text-xs text-[#c8e6d2]/60 leading-relaxed mb-6">
              {t(
                'Połączenie najprostszego na świecie tworzenia tokenów z innowacyjnym systemem wirtualnego górnictwa (Mining) i stabilnego stakowania (Staking Vault).',
                'Połączenie najprostszego na świecie tworzenia tokenów z innowacyjnym systemem wirtualnego górnictwa (Mining) i stabilnego stakowania (Staking Vault).'
              )}
            </p>

            {/* Three option boxes layout */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
              <button 
                onClick={() => scrollToSection('forge')}
                className="flex flex-col items-center justify-center p-4 bg-black border border-g hover:bg-g/10 transition-all duration-300 rounded cursor-pointer group text-center"
              >
                <div className="w-8 h-8 flex items-center justify-center mb-2.5">
                  <Key className="w-6 h-6 text-g group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-[10px] font-mono font-bold tracking-[2px] text-white uppercase mb-1">{t('SEJF STAKOWANIA', 'SEJF STAKOWANIA')}</span>
                <span className="text-[8px] text-g/70 font-bold uppercase">{t('STAKING VAULT', 'STAKING VAULT')}</span>
              </button>

              <button 
                onClick={() => scrollToSection('forge')}
                className="flex flex-col items-center justify-center p-4 bg-black border border-white/10 hover:border-g/50 hover:bg-white/[0.02] transition-all duration-300 rounded cursor-pointer group text-center"
              >
                <div className="w-8 h-8 flex items-center justify-center mb-2.5">
                  <Pickaxe className="w-6 h-6 text-white/60 group-hover:text-g group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-[10px] font-mono font-bold tracking-[2px] text-white uppercase mb-1">{t('GÓRNICTWO PŁYNNOŚCI', 'GÓRNICTWO PŁYNNOŚCI')}</span>
                <span className="text-[8px] text-white/30 font-bold uppercase">{t('LIQUIDITY MINING', 'LIQUIDITY MINING')}</span>
              </button>

              <button 
                onClick={() => scrollToSection('forge')}
                className="flex flex-col items-center justify-center p-4 bg-black border border-white/10 hover:border-g/50 hover:bg-white/[0.02] transition-all duration-300 rounded cursor-pointer group text-center"
              >
                <div className="w-8 h-8 flex items-center justify-center mb-2.5">
                  <Flame className="w-6 h-6 text-white/60 group-hover:text-g group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-[10px] font-mono font-bold tracking-[2px] text-white uppercase mb-1">{t('KUŹNIA DEFLACYJNA', 'KUŹNIA DEFLACYJNA')}</span>
                <span className="text-[8px] text-white/30 font-bold uppercase">{t('DEFLATIONARY FORGE', 'DEFLATIONARY FORGE')}</span>
              </button>
            </div>

            {/* Demo warning block */}
            <div className="bg-[#100b05] border border-amber-500/20 p-4 rounded flex items-start gap-3">
              <div className="p-1 bg-amber-500/10 border border-amber-500/20 rounded mt-0.5 shrink-0">
                <Info className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h4 className="text-[10px] font-mono font-bold uppercase tracking-[2px] text-amber-400 mb-1">
                  {t('TRYB DEMONSTRACYJNY', 'DEMO MODE')}
                </h4>
                <p className="text-[11px] text-amber-200/80 leading-relaxed font-medium">
                  {t(
                    'Zaloguj się na węzeł po prawej w zakładce „Górnictwo”, aby stakować własne zarobione tokeny w skarbcach i generować pasywny plon w czasie rzeczywistym.',
                    'Zaloguj się na węzeł po prawej w zakładce „Górnictwo”, aby stakować własne zarobione tokeny w skarbcach i generować pasywny plon w czasie rzeczywistym.'
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* ════ SECTION 4: SZYBKA NAWIGACJA SATELLITE (Screenshot 4) ════ */}
        <section id="satellite-directory" className="flex flex-col items-center">
          <div className="w-full border-b border-white/5 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between font-mono select-none gap-2">
            <span className="text-xs sm:text-sm tracking-[5px] text-g font-black uppercase flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-g shadow-[0_0_8px_#00ff88] animate-pulse shrink-0" />
              {t('SZYBKA NAWIGACJA SATELLITE', 'SATELLITE QUICK DIRECTORY')}
            </span>
            <span className="text-[10px] text-white/50 tracking-[2px] font-bold bg-g/10 border border-g/20 px-2 py-0.5 rounded">
              SYS_INDEX // SLX-DIR-01
            </span>
          </div>

          {/* Cards list exactly as styled in screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {[
              { id: 'network', namePl: 'SOLANA SVM', nameEn: 'SOLANA SVM', descPl: 'Monitor mempoola', descEn: 'Mempool monitor', chibi: 'chibi-shades' },
              { id: 'presale', namePl: 'TOKEN $SLX', nameEn: 'TOKEN $SLX', descPl: 'Dystrybucja tokena', descEn: 'Token distribution', chibi: 'chibi-wave' },
              { id: 'generator', namePl: 'KREATOR AI', nameEn: 'AI CREATOR', descPl: 'Generator memów', descEn: 'Meme generator', chibi: 'chibi-tablet' },
              { id: 'forge', namePl: 'KUŹNIA & YIELD', nameEn: 'FORGE & YIELD', descPl: 'Staking i spalanie', descEn: 'Staking and burning', chibi: 'chibi-laptop' },
              { id: 'pools', namePl: 'MOŻLIWOŚCI', nameEn: 'CAPABILITIES', descPl: 'Funkcje ekosystemu', descEn: 'Ecosystem features', chibi: 'chibi-idea' },
              { id: 'roadmap', namePl: 'HARMONOGRAM', nameEn: 'ROADMAP', descPl: 'Plany rozwoju', descEn: 'Development plans', chibi: 'chibi-heart' }
            ].map((sec) => (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className="flex items-center gap-4 p-4 border border-white/10 bg-[#040810]/80 hover:bg-g/5 hover:border-g/40 transition-all duration-300 text-left cursor-pointer group rounded-lg w-full relative overflow-hidden"
              >
                {/* Visual hover top-right neon tab */}
                <div className="absolute top-0 right-0 w-2 h-2 bg-g/40 rounded-bl transform translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-300" />
                
                {/* Left side Chibi thumb */}
                <div className="w-14 h-14 bg-black/80 border border-white/15 rounded flex-shrink-0 p-1 flex items-center justify-center overflow-hidden group-hover:border-g/30 group-hover:scale-105 transition-all duration-300">
                  <SlicedAsset asset={sec.chibi as any} className="w-full h-full transform group-hover:scale-110 transition-transform duration-300" />
                </div>

                {/* Info and action */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-display font-black text-white group-hover:text-g tracking-[1px] uppercase transition-colors truncate">
                    {t(sec.namePl, sec.nameEn)}
                  </div>
                  <div className="text-[11px] text-white/50 group-hover:text-white/80 transition-colors truncate mb-1">
                    {t(sec.descPl, sec.descEn)}
                  </div>
                  <div className="text-[9px] font-mono font-bold text-g/70 tracking-[2px] uppercase flex items-center gap-1.5 mt-1">
                    <span>{t('PRZEJDŹ', 'PRZEJDŹ')}</span> 
                    <span className="group-hover:translate-x-1.5 transition-transform duration-300">➔</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>


        {/* ════ SECTION 5: ROADMAP TIMELINE ════ */}
        <div className="border-t border-white/5 pt-12">
          <RoadmapTimeline />
        </div>

      </div>
    </div>
  );
}
