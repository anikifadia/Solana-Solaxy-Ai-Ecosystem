import React from 'react';
import MiningStakingForge from './MiningStakingForge';

interface ForgePageProps {
  t: (pl: string, en: string) => string;
}

export default function ForgePage({ t }: ForgePageProps) {
  return (
    <div className="pt-[110px]">
      {/* ══ MINING, STAKING & DEFLATION FORGE SECTION ══ */}
      <section id="forge" className="relative z-[5] py-12 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-[10px] tracking-[5px] text-g/50 uppercase mb-4">
            <span className="w-6 h-[1px] bg-g shadow-[0_0_6px_#00ff88]" /> {t('PŁYNNOŚĆ I STAKING DEFI', 'DEFI LIQUIDITY & STAKING')}
          </div>
          <h2 className="font-display text-3xl md:text-5xl tracking-[2px] text-white uppercase text-center">
            {t('ZDECENTRALIZOWANA EMISJA & ', 'DECENTRALIZED EMISSION & ')}<span className="text-g text-shadow-[0_0_8px_rgba(0,255,136,0.4)]">{t('SYSTEM STAKINGU', 'STAKING SYSTEM')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#c8e6d2]/50 max-w-[620px] mx-auto mt-4 leading-relaxed text-center">
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
    </div>
  );
}
