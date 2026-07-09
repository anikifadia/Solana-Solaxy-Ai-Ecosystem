import React from 'react';
import { PresaleSection } from './PresaleSection';
import TokenOrb from './TokenOrb';
import SecuritySentinel from './SecuritySentinel';

interface PresalePageProps {
  t: (pl: string, en: string) => string;
}

export default function PresalePage({ t }: PresalePageProps) {
  return (
    <div className="pt-[110px]">
      {/* ══ PRESALE SECTION WITH ANIMATED COUNTDOWN TIMER ══ */}
      <div className="pt-12">
        <PresaleSection />
      </div>

      {/* ══ TOKENOMICS SECTION ══ */}
      <section id="token" className="relative z-[5] py-12 sm:py-24 px-4 sm:px-6 md:px-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center border-t border-g/10">
        
        {/* OPTIMIZED TOKEN ORB VISUALIZATION */}
        <div className="token-orb-wrap relative h-[280px] sm:h-[440px] flex items-center justify-center w-full">
          <TokenOrb />
          <div className="absolute text-center z-[10] pointer-events-none select-none">
            <div className="font-display text-[72px] sm:text-[96px] text-g text-shadow-[0_0_20px_#00ff88] leading-none">
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
    </div>
  );
}
