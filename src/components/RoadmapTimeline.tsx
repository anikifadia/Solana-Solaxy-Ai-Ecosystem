import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Circle, Clock, Flame, Play, AlertCircle, Cpu, Network, Database, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import SlicedAsset, { SlicedAssetKey } from './SlicedAsset';
import ScrollReveal from './ScrollReveal';

type StatusType = 'completed' | 'active' | 'planned';

interface Milestone {
  textPl: string;
  textEn: string;
  completed: boolean;
  progress: number; // 0 to 100
}

interface Phase {
  id: string;
  number: string;
  titlePl: string;
  titleEn: string;
  quarter: string;
  status: StatusType;
  chibi: SlicedAssetKey;
  progress: number;
  themeColor: string; // text/border coloring tailwind classes
  glowColor: string; // for text shadow/neon effects
  accentColor: string; // e.g. 'g', 'cyan', 'rose' etc.
  milestones: Milestone[];
  logs: string[];
}

export default function RoadmapTimeline() {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<'all' | StatusType>('all');
  const [expandedPhaseId, setExpandedPhaseId] = useState<string | null>('phase-2'); // default expanded active phase
  const [simulatedLogs, setSimulatedLogs] = useState<Record<string, string[]>>({});
  const [isSimulating, setIsSimulating] = useState<Record<string, boolean>>({});

  const phases: Phase[] = [
    {
      id: 'phase-1',
      number: '01',
      titlePl: 'INICJACJA GALAKTYCZNA',
      titleEn: 'GALACTIC IGNITION',
      quarter: 'Q1 2026',
      status: 'completed',
      chibi: 'chibi-wave',
      progress: 100,
      themeColor: 'border-g/30 text-g hover:border-g/60',
      glowColor: 'rgba(0,255,136,0.3)',
      accentColor: 'g',
      milestones: [
        { textPl: 'Wdrożenie i weryfikacja inteligentnego kontraktu SLX', textEn: 'Smart contract deployment & validation on Solana mainnet', completed: true, progress: 100 },
        { textPl: 'Uruchomienie mechanizmu przedsprzedaży', textEn: 'Launch of the decentralized presale engine', completed: true, progress: 100 },
        { textPl: 'Pełny audyt bezpieczeństwa przez Sentinel Labs', textEn: 'Comprehensive security audit by Sentinel Labs', completed: true, progress: 100 },
        { textPl: 'Wydanie podstawowej wersji dApp i portalu integracyjnego', textEn: 'Release of interactive dApp and initial integrations', completed: true, progress: 100 }
      ],
      logs: [
        'SYSTEM_INFO: BOOT_INITIALIZED [SUCCESS]',
        'CONTRACT_ADDR: Solax99...vTx91',
        'AUDIT_INDEX: 100% SECURE_PASS_VERIFIED',
        'PRESALE_CAP: HARD_CAP_REACHED'
      ]
    },
    {
      id: 'phase-2',
      number: '02',
      titlePl: 'PŁYNNOŚĆ MGŁAWICY',
      titleEn: 'NEBULA SWAPS',
      quarter: 'Q2 2026',
      status: 'active',
      chibi: 'chibi-shades',
      progress: 75,
      themeColor: 'border-cyan/30 text-cyan hover:border-cyan/60',
      glowColor: 'rgba(0,240,255,0.3)',
      accentColor: 'cyan',
      milestones: [
        { textPl: 'Uruchomienie pul płynności i Kuźni Yield', textEn: 'Launch of liquidity pools & Farming Forge Yield mechanics', completed: true, progress: 100 },
        { textPl: 'Optymalizacje tras transakcyjnych AI Routing', textEn: 'AI-Powered Cross-Pool Routing Optimizations', completed: true, progress: 100 },
        { textPl: 'Wysokowydajny strumień mempoola Solana SVM', textEn: 'High-speed Solana SVM mempool live feed dashboard', completed: true, progress: 95 },
        { textPl: 'Integracja dynamicznego slippage i ochrony MEV', textEn: 'Dynamic slippage AI engine & MEV frontrun shield', completed: false, progress: 40 }
      ],
      logs: [
        'AMM_ROUTING: ACTIVATING_AI_MATRIX',
        'PING_LATENCY: 14.2ms [STABLE]',
        'MEMPOOL_POOLING: ONLINE [42,912 tps]',
        'SLIPPAGE_GUARD: CALIBRATING_ALGORITHMS'
      ]
    },
    {
      id: 'phase-3',
      number: '03',
      titlePl: 'EKSPANSJA TUNELU CZASOPRZESTRZENNEGO',
      titleEn: 'WORMHOLE EXPANSION',
      quarter: 'Q3 2026',
      status: 'planned',
      chibi: 'chibi-tablet',
      progress: 15,
      themeColor: 'border-purple-500/30 text-purple-400 hover:border-purple-500/60',
      glowColor: 'rgba(168,85,247,0.3)',
      accentColor: 'purple-400',
      milestones: [
        { textPl: 'Mosty cross-chain do Ethereum i łańcuchów EVM', textEn: 'Cross-chain bridge to Ethereum & major EVM networks', completed: false, progress: 20 },
        { textPl: 'Scentralizowany i rozproszony system wyroczni v1', textEn: 'Decentralized Oracle system integration v1', completed: false, progress: 10 },
        { textPl: 'SDK oraz klucze API dla zewnętrznych deweloperów', textEn: 'Comprehensive SDK & API keys for external developers', completed: false, progress: 15 },
        { textPl: 'Wdrożenie szyfrowania odpornego na komputery kwantowe', textEn: 'Quantum-resistant cryptography algorithms upgrade', completed: false, progress: 0 }
      ],
      logs: [
        'BRIDGE_INIT: INGESTION_STAGE_01',
        'ORACLE_SYNC: ESTABLISHING_LIGHT_CHANNELS',
        'SDK_COMPILER: LOCAL_TEST_ENV [STAGED]'
      ]
    },
    {
      id: 'phase-4',
      number: '04',
      titlePl: 'SUPERKLASTER AI',
      titleEn: 'AI SUPERCLUSTER',
      quarter: 'Q4 2026',
      status: 'planned',
      chibi: 'chibi-laptop',
      progress: 0,
      themeColor: 'border-rose-500/30 text-rose-400 hover:border-rose-500/60',
      glowColor: 'rgba(251,113,133,0.3)',
      accentColor: 'rose-400',
      milestones: [
        { textPl: 'Uruchomienie autonomicznych agentów handlowych AI', textEn: 'Launch of fully autonomous AI Trading Agents', completed: false, progress: 0 },
        { textPl: 'W pełni zdecentralizowana organizacja autonomiczna (DAO)', textEn: 'Fully decentralized governance DAO dashboard', completed: false, progress: 0 },
        { textPl: 'Predyktywny panel analityczny uczenia maszynowego', textEn: 'Machine learning predictive analytics suite', completed: false, progress: 0 },
        { textPl: 'Integracja sieci neuronowych do zapobiegania zagrożeniom', textEn: 'Neural-network based real-time exploit prevention', completed: false, progress: 0 }
      ],
      logs: [
        'NEURAL_CORE: UNINITIALIZED',
        'AGENT_HOSTS: OFFLINE',
        'DAO_STAGGER: ENROLLMENT_COMMENCING_DEC_2026'
      ]
    }
  ];

  const filteredPhases = phases.filter(
    (p) => activeFilter === 'all' || p.status === activeFilter
  );

  const togglePhaseExpand = (id: string) => {
    setExpandedPhaseId(expandedPhaseId === id ? null : id);
  };

  const handleSimulateDiagnostics = (phaseId: string, initialLogs: string[]) => {
    if (isSimulating[phaseId]) return;

    setIsSimulating((prev) => ({ ...prev, [phaseId]: true }));
    setSimulatedLogs((prev) => ({
      ...prev,
      [phaseId]: ['[DIAG_INIT]: ESTABLISHING SECURE SATELLITE HANDSHAKE...', ...initialLogs]
    }));

    let step = 0;
    const additionalLogs = [
      '[DIAG_SECURE]: CHECKING SOLANA CONGESTION RATIO...',
      '[DIAG_METRIC]: EXECUTING SIMULATED BYTECODE VALIDATION...',
      '[DIAG_INTEGRITY]: RE-HASHING LEDGER PROOF MATRIX...',
      '[DIAG_COMPLETE]: DIAGNOSTICS CONCLUDED. UNIT OPERATING AT 100% EFFICIENCY.'
    ];

    const interval = setInterval(() => {
      if (step < additionalLogs.length) {
        setSimulatedLogs((prev) => ({
          ...prev,
          [phaseId]: [...(prev[phaseId] || []), additionalLogs[step]]
        }));
        step++;
      } else {
        clearInterval(interval);
        setIsSimulating((prev) => ({ ...prev, [phaseId]: false }));
      }
    }, 900);
  };

  // Motion variants for staggering
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 90,
        damping: 15,
      },
    },
  };

  return (
    <motion.section 
      id="roadmap" 
      className="relative z-[5] py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto border-t border-g/10"
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Visual cyber details */}
      <div className="absolute top-0 left-0 w-24 h-[1px] bg-gradient-to-r from-g to-transparent" />
      <div className="absolute bottom-0 right-0 w-24 h-[1px] bg-gradient-to-l from-g to-transparent" />

      {/* Title */}
      <ScrollReveal direction="up" delay={0} duration={900}>
        <div className="text-center mb-16 select-none">
          <div className="flex items-center justify-center gap-2 text-[10px] tracking-[5px] text-g/50 uppercase mb-4">
            <span className="w-6 h-[1px] bg-g shadow-[0_0_6px_#00ff88]" />
            {t('DOKĄD ZMIERZAMY', 'WHERE WE ARE HEADING')}
          </div>
          <h2 className="font-display text-3xl sm:text-5xl tracking-[2px] text-white uppercase">
            {t('HARMONOGRAM ROZWOJU - ', 'DEVELOPMENT ROADMAP - ')}
            <span className="text-g text-shadow-[0_0_8px_rgba(0,255,136,0.4)]">MISSION DIRECTORY</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#c8e6d2]/50 max-w-[620px] mx-auto mt-4 leading-relaxed">
            {t(
              'Zrealizuj kosmiczny plan podróży dla ekosystemu Solaxy. Przeglądaj fazy rozwoju sieci, uruchamiaj diagnostykę modułów satelitarnych w czasie rzeczywistym i śledź nasze kroki ku dominacji SVM.',
              'Track the interstellar trajectory for the Solaxy ecosystem. Explore live network integration phases, launch real-time satellite module diagnostics, and follow our steps towards SVM dominance.'
            )}
          </p>
        </div>
      </ScrollReveal>

      {/* Tabs Filter Bar */}
      <ScrollReveal direction="up" delay={150} duration={800}>
        <div className="flex justify-center gap-2 mb-12 select-none overflow-x-auto pb-2 scrollbar-none">
          {[
            { key: 'all', labelPl: 'WSZYSTKIE FAZY', labelEn: 'ALL PHASES' },
            { key: 'completed', labelPl: 'UKOŃCZONE', labelEn: 'COMPLETED' },
            { key: 'active', labelPl: 'AKTYWNE', labelEn: 'ACTIVE' },
            { key: 'planned', labelPl: 'PLANOWANE', labelEn: 'PLANNED' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveFilter(tab.key as any);
                setExpandedPhaseId(null); // collapse to prevent layout jump on filter
              }}
              className={`relative px-4 py-2 text-[10px] tracking-[2px] uppercase font-mono font-bold border transition-all duration-300 cursor-pointer rounded whitespace-nowrap ${
                activeFilter === tab.key
                  ? 'bg-g/10 border-g text-g shadow-[0_0_12px_rgba(0,255,136,0.15)]'
                  : 'bg-[#04080f]/40 border-white/5 text-white/50 hover:text-white hover:border-white/20'
              }`}
            >
              {t(tab.labelPl, tab.labelEn)}
              {activeFilter === tab.key && (
                <motion.span
                  layoutId="activeFilterGlow"
                  className="absolute inset-0 border border-g rounded"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
            </button>
          ))}
        </div>
      </ScrollReveal>

      {/* Main Roadmap Timeline Layout */}
      <div className="relative">
        {/* Glow Line Indicator Background */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-g/40 via-cyan/20 to-rose-500/10 -translate-x-1/2 hidden sm:block select-none" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="space-y-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredPhases.map((phase, idx) => {
              const isExpanded = expandedPhaseId === phase.id;
              const isEven = idx % 2 === 0;

              // Color codes for borders and icons
              let statusIcon = <Clock className="w-4 h-4 text-white/40" />;
              let statusText = t('PLANOWANE', 'PLANNED');
              let statusBg = 'bg-white/5 text-white/60 border-white/10';

              if (phase.status === 'completed') {
                statusIcon = <CheckCircle2 className="w-4 h-4 text-g" />;
                statusText = t('UKOŃCZONE', 'COMPLETED');
                statusBg = 'bg-g/10 text-g border-g/30';
              } else if (phase.status === 'active') {
                statusIcon = <Flame className="w-4 h-4 text-cyan animate-pulse" />;
                statusText = t('AKTYWNE', 'ACTIVE');
                statusBg = 'bg-cyan/10 text-cyan border-cyan/30';
              }

              return (
                <motion.div
                  key={phase.id}
                  variants={cardVariants}
                  layout="position"
                  className={`relative flex flex-col sm:flex-row items-center gap-6 md:gap-12 w-full ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline node circle centered on desktop */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 hidden sm:flex items-center justify-center z-10 select-none">
                    <div
                      className={`w-9 h-9 rounded-full border bg-black flex items-center justify-center transition-all duration-300 ${
                        phase.status === 'completed'
                          ? 'border-g shadow-[0_0_10px_rgba(0,255,136,0.3)]'
                          : phase.status === 'active'
                          ? 'border-cyan shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                          : 'border-white/15'
                      }`}
                    >
                      <span className="font-mono text-xs font-bold text-white">
                        {phase.number}
                      </span>
                    </div>
                  </div>

                  {/* Empty side spacer to push card left/right */}
                  <div className="w-full sm:w-1/2 hidden sm:block" />

                  {/* Actual Roadmap Card */}
                  <div className="w-full sm:w-1/2">
                    <ScrollReveal direction={isEven ? 'left' : 'right'} delay={idx * 80} duration={850}>
                      <div
                        className={`border bg-[#04080f]/75 p-5 sm:p-6 transition-all duration-300 relative rounded-lg overflow-hidden group/card ${
                          isExpanded
                            ? `border-${phase.accentColor}/40 bg-[#000a06]/95 shadow-[0_0_20px_rgba(0,255,136,0.04)]`
                            : `border-white/5 hover:bg-white/[0.01] ${phase.themeColor}`
                        }`}
                      >
                      {/* Interactive click area to expand details */}
                      <div
                        onClick={() => togglePhaseExpand(phase.id)}
                        className="cursor-pointer select-none flex items-start justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          {/* Chibi avatar inside cards */}
                          <div className={`w-14 h-14 bg-black/60 border border-white/10 p-0.5 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover/card:border-${phase.accentColor}/30`}>
                            <SlicedAsset asset={phase.chibi} className="w-full h-full group-hover/card:scale-105 transition-transform" />
                          </div>

                          <div>
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="font-mono text-xs text-white/40 font-extrabold uppercase">
                                PHASE {phase.number}
                              </span>
                              <span className="text-[10px] text-white/40">•</span>
                              <span className="font-mono text-xs font-bold text-cyan/90 uppercase">
                                {phase.quarter}
                              </span>
                              <span className={`text-[8.5px] px-2 py-0.5 rounded border font-mono font-extrabold uppercase ${statusBg} flex items-center gap-1`}>
                                {statusIcon}
                                {statusText}
                              </span>
                            </div>

                            <h3 className="font-display text-lg sm:text-xl text-white tracking-[0.5px] uppercase mt-1.5 transition-colors group-hover/card:text-white">
                              {t(phase.titlePl, phase.titleEn)}
                            </h3>
                          </div>
                        </div>

                        {/* Expand/Collapse arrow */}
                        <div className="text-white/40 hover:text-white mt-1">
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5 animate-bounce-slow" />
                          )}
                        </div>
                      </div>

                      {/* Expandable detailed container */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden mt-6 pt-5 border-t border-white/5"
                          >
                            {/* Phase progress indicator */}
                            <div className="mb-6 bg-black/40 border border-white/5 p-3 rounded">
                              <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                                <span className="text-white/40 uppercase tracking-[1px]">
                                  {t('PROGRES REALIZACJI', 'DEVELOPMENT METRIC')}
                                </span>
                                <span className={`text-${phase.accentColor} font-bold`}>
                                  {phase.progress}%
                                </span>
                              </div>
                              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden p-[1px] border border-white/10">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${phase.progress}%` }}
                                  transition={{ duration: 0.8, ease: 'easeOut' }}
                                  className={`h-full rounded-full bg-gradient-to-r ${
                                    phase.status === 'completed'
                                      ? 'from-g to-cyan'
                                      : phase.status === 'active'
                                      ? 'from-cyan to-blue-500'
                                      : 'from-purple-500 to-rose-500'
                                  }`}
                                />
                              </div>
                            </div>

                            {/* Milestones list with progress checks */}
                            <h4 className="text-[10px] tracking-[2px] text-white/50 font-mono font-bold uppercase mb-3 flex items-center gap-1.5 select-none">
                              <Cpu className="w-3.5 h-3.5 text-g" />
                              {t('KLUCZOWE MILI KAMIEŃE', 'KEY MILESTONES & CAPABILITIES')}
                            </h4>
                            <div className="space-y-3 mb-6">
                              {phase.milestones.map((m, mIdx) => (
                                <div
                                  key={mIdx}
                                  className={`flex items-start gap-3 p-2 border rounded transition-colors ${
                                    m.completed
                                      ? 'border-g/10 bg-g/[0.02] hover:bg-g/[0.04]'
                                      : 'border-white/5 bg-black/20 hover:bg-white/[0.02]'
                                  }`}
                                >
                                  <div className="mt-0.5 flex-shrink-0">
                                    {m.completed ? (
                                      <CheckCircle2 className="w-4 h-4 text-g" />
                                    ) : m.progress > 0 ? (
                                      <div className="w-4 h-4 rounded-full border border-cyan/50 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
                                      </div>
                                    ) : (
                                      <Circle className="w-4 h-4 text-white/20" />
                                    )}
                                  </div>

                                  <div className="flex-1">
                                    <p className={`text-xs leading-relaxed ${m.completed ? 'text-white/80' : 'text-white/50'}`}>
                                      {t(m.textPl, m.textEn)}
                                    </p>
                                    {m.progress > 0 && m.progress < 100 && (
                                      <div className="flex items-center gap-2 mt-1.5">
                                        <div className="w-24 bg-white/5 h-1 rounded overflow-hidden">
                                          <div
                                            className="h-full bg-cyan"
                                            style={{ width: `${m.progress}%` }}
                                          />
                                        </div>
                                        <span className="text-[8px] font-mono text-cyan/70">
                                          {m.progress}% {t('ukończone', 'complete')}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Interactive holographic satellite diagnostics log */}
                            <div className="border border-white/5 bg-black/60 p-4 rounded-lg font-mono text-[10px] leading-relaxed relative">
                              <div className="absolute top-2 right-2 flex items-center gap-2 select-none">
                                <span className={`w-1.5 h-1.5 rounded-full ${isSimulating[phase.id] ? 'bg-cyan animate-ping' : 'bg-g/50'}`} />
                                <span className="text-[7.5px] text-white/30 uppercase">SYS_LOG</span>
                              </div>

                              <div className="text-white/30 border-b border-white/5 pb-2 mb-2 uppercase tracking-[1px] select-none">
                                {t('DIAGNOSTYKA MODUŁU SATELITARNEGO', 'SATELLITE MODULE TELEMETRY')}
                              </div>

                              <div className="space-y-1.5 max-h-[120px] overflow-y-auto scrollbar-thin text-white/60">
                                {(simulatedLogs[phase.id] || phase.logs).map((log, lIdx) => (
                                  <div key={lIdx} className="flex gap-1.5">
                                    <span className="text-g/40 select-none">➔</span>
                                    <span>{log}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Simulator Action Button */}
                              <button
                                onClick={() => handleSimulateDiagnostics(phase.id, phase.logs)}
                                disabled={isSimulating[phase.id]}
                                className={`mt-3 w-full border border-g/30 hover:border-g/80 text-g text-[9px] py-1.5 px-3 rounded uppercase tracking-[1px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer select-none ${
                                  isSimulating[phase.id] ? 'opacity-50 cursor-not-allowed bg-g/5' : 'bg-transparent hover:bg-g/5'
                                }`}
                              >
                                {isSimulating[phase.id] ? (
                                  <>
                                    <RefreshCw className="w-3 h-3 animate-spin" />
                                    {t('URUCHAMIANIE DIAGNOSTYKI...', 'RUNNING TELEMETRY...')}
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-2.5 h-2.5 fill-g" />
                                    {t('URUCHOM DIAGNOSTYKĘ REWOLUCJI', 'RUN IGNITION TELEMETRY')}
                                  </>
                                )}
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      </div>
                    </ScrollReveal>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.section>
  );
}
