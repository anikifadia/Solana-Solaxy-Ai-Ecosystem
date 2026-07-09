import React from 'react';
import AITokenGenerator from './AITokenGenerator';

interface GeneratorPageProps {
  t: (pl: string, en: string) => string;
}

export default function GeneratorPage({ t }: GeneratorPageProps) {
  return (
    <div className="pt-[110px]">
      {/* AI Generator Hero Title */}
      <div className="text-center max-w-[680px] mx-auto mt-16 mb-8 px-4">
        <div className="flex items-center justify-center gap-2 text-[10px] tracking-[5px] text-g/50 uppercase mb-4">
          <span className="w-6 h-[1px] bg-g shadow-[0_0_6px_#00ff88]" /> {t('FABRYKA TOKENÓW AI', 'AI TOKEN FACTORY')}
        </div>
        <h1 className="font-display text-4xl sm:text-5xl md:text-[64px] leading-none tracking-[2px] mb-6">
          <span className="text-g text-shadow-[0_0_10px_rgba(0,255,136,0.4)]">SOLAXY</span> {t('GENERATOR', 'GENERATOR')}
        </h1>
        <p className="text-xs sm:text-sm text-[#c8e6d2]/50 leading-relaxed">
          {t(
            'Użyj zaawansowanego algorytmu sztucznej inteligencji, aby zaprojektować, skonfigurować i wdrożyć swój własny token na Solana SVM w mniej niż 30 sekund.',
            'Leverage state-of-the-art neural generation to design, configure, and instantly launch custom assets on the Solana SVM in under 30 seconds.'
          )}
        </p>
      </div>

      {/* ══ AI TOKEN GENERATOR SECTION ══ */}
      <section id="generator" className="relative z-[5] py-12 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="reveal-trigger" id="ai-generator-hub">
          <AITokenGenerator />
        </div>
      </section>
    </div>
  );
}
