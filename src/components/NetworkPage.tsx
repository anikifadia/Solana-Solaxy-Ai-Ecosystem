import React from 'react';
import NetworkViz from './NetworkViz';
import Wormhole from './Wormhole';
import MempoolStream from './MempoolStream';
import RouteOptimizer from './RouteOptimizer';
import SecuritySentinel from './SecuritySentinel';

interface NetworkPageProps {
  t: (pl: string, en: string) => string;
}

export default function NetworkPage({ t }: NetworkPageProps) {
  return (
    <div className="pt-[110px]">
      {/* ══ SOLANA ECOSYSTEM NETWORK SECTION ══ */}
      <section id="network" className="relative z-[5] py-16 px-6 md:px-12 flex flex-col items-center">
        <div className="text-center max-w-[680px] mb-12">
          <div className="flex items-center justify-center gap-2 text-[10px] tracking-[5px] text-g/50 uppercase mb-4">
            <span className="w-6 h-[1px] bg-g shadow-[0_0_6px_#00ff88]" /> {t('ZINTEGROWANA ARCHITEKTURA', 'INTEGRATED ARCHITECTURE')}
          </div>
          <h2 className="font-display text-3xl sm:text-5xl md:text-[64px] leading-none tracking-[2px] mb-6 text-center">
            <span className="text-g text-shadow-[0_0_10px_rgba(0,255,136,0.4)]">SOLAXY</span> {t('NEXUS', 'NEXUS')}{' '}
            <span className="text-cyan text-shadow-[0_0_10px_rgba(0,238,255,0.4)]">{t('W SIECI', 'IN THE NETWORK')}</span>
            <div className="text-white/75 mt-2 text-2xl sm:text-4xl uppercase">{t('INTEGRACJA EKOSYSTEMU SVM', 'SVM ECOSYSTEM INTEGRATION')}</div>
          </h2>
          <p className="text-xs sm:text-sm text-[#c8e6d2]/50 leading-relaxed text-center">
            {t(
              'SOLAXY integruje się bezpośrednio z kluczowymi protokołami DeFi w ekosystemie Solana. Transakcje są dystrybuowane w całej sieci z optymalnym doomed i zerowymi opóźnieniami.',
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
      <section className="relative z-[5] py-24 overflow-hidden min-h-[480px] flex items-center justify-center border-t border-cyan/10">
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
            {t('MAKSYMALNA GŁĘBOKOŚĆ · PEŁNA DECENTRALIZACJA · BŁYSKAWICZNA FINALIZACJA', 'MAXIMUM DEPTH · FULL DECENTRALIZATION · INSTANT SETTLEMENT')}
          </div>
        </div>
      </section>

      {/* ══ PROTOCOLS LIVE HUB (LIVE TRADING LEDGER & SMART ROUTER) ══ */}
      <section className="relative z-[5] py-16 px-6 md:px-12 max-w-7xl mx-auto border-t border-g/10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 text-[10px] tracking-[5px] text-g/50 uppercase mb-4">
            <span className="w-6 h-[1px] bg-g shadow-[0_0_6px_#00ff88]" /> {t('KONSOLA MONITORINGU TRANSAKCJI', 'REAL-TIME TRANSACTION CONSOLE')}
          </div>
          <h2 className="font-display text-3xl md:text-5xl tracking-[2px] text-white uppercase text-center">
            {t('MONITOR TRANSAKCJI & ', 'TRANSACTION STREAM & ')}{' '}
            <span className="text-g text-shadow-[0_0_8px_rgba(0,255,136,0.4)]">{t('INTELIGENTNY ROUTING', 'INTELLIGENT ROUTING')}</span>
          </h2>
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

      {/* Sentinel Hub */}
      <section className="relative z-[5] py-12 px-6 md:px-12 max-w-7xl mx-auto border-t border-g/10">
        <div className="reveal-trigger" id="sentinel-hub">
          <SecuritySentinel />
        </div>
      </section>
    </div>
  );
}
