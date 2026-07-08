import React, { useState } from 'react';
import { Shield, Zap, Cpu, Compass, Users, Hammer, Sparkles, RefreshCw, Layers } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import SlicedAsset, { SlicedAssetKey } from './SlicedAsset';

export interface PoseInfo {
  id: string;
  name: string;
  polishName: string;
  tagline: string;
  polishTagline: string;
  icon: any;
  color: string;
  bgGlow: string;
  borderGlow: string;
  metrics: {
    label: string;
    polishLabel: string;
    value: string;
  }[];
  specifications: {
    key: string;
    polishKey: string;
    val: string;
  }[];
}

const POSES: PoseInfo[] = [
  {
    id: 'speed',
    name: 'SPEED',
    polishName: 'PRĘDKOŚĆ',
    tagline: '400ms Sub-Second Finality Engine',
    polishTagline: 'Silnik finalizacji poniżej 400ms',
    icon: Zap,
    color: 'text-g',
    bgGlow: 'rgba(0, 255, 136, 0.15)',
    borderGlow: 'border-g/30 hover:border-g/80',
    metrics: [
      { label: 'Latency Rate', polishLabel: 'Opóźnienie', value: '0.40ms' },
      { label: 'Block Capacity', polishLabel: 'Pojemność bloku', value: '65,000 tx' },
      { label: 'Hyper-drive', polishLabel: 'Napęd', value: 'ACTIVE' }
    ],
    specifications: [
      { key: 'Engine core', polishKey: 'Rdzeń silnika', val: 'Solana SVM v3.2' },
      { key: 'Pipelining', polishKey: 'Potokowość', val: 'Enabled' },
      { key: 'Slippage efficiency', polishKey: 'Slippage', val: '99.98%' }
    ]
  },
  {
    id: 'security',
    name: 'SECURITY',
    polishName: 'BEZPIECZEŃSTWO',
    tagline: 'Multi-Vault Cryptographic Shield',
    polishTagline: 'Kryptograficzna tarcza skarbców',
    icon: Shield,
    color: 'text-cyan',
    bgGlow: 'rgba(0, 238, 255, 0.15)',
    borderGlow: 'border-cyan/30 hover:border-cyan/80',
    metrics: [
      { label: 'Shield Integrity', polishLabel: 'Integralność tarczy', value: '100% SECURE' },
      { label: 'Audit Hash', polishLabel: 'Hash audytu', value: '0x99A3F1' },
      { label: 'Sentinel Core', polishLabel: 'Rdzeń wartownika', value: 'Vigilant v9' }
    ],
    specifications: [
      { key: 'Lock Mechanism', polishKey: 'Mechanizm blokady', val: 'Multi-Sig Zero Trust' },
      { key: 'Intrusion Detection', polishKey: 'Wykrywanie włamań', val: 'AI-Sentinel Active' },
      { key: 'Failsafe Vaults', polishKey: 'Skarbce awaryjne', val: 'Standard SLX-04' }
    ]
  },
  {
    id: 'innovation',
    name: 'INNOVATION',
    polishName: 'INNOWACJA',
    tagline: 'AI-Powered Smart Routing Solver',
    polishTagline: 'Inteligentny router sterowany AI',
    icon: Cpu,
    color: 'text-purple',
    bgGlow: 'rgba(123, 45, 255, 0.15)',
    borderGlow: 'border-purple/30 hover:border-purple/80',
    metrics: [
      { label: 'Routing Options', polishLabel: 'Opcje routingu', value: '256 paths/s' },
      { label: 'Cognitive Sync', polishLabel: 'Synchroniczność', value: '99.92%' },
      { label: 'Solver Latency', polishLabel: 'Opóźnienie solvera', value: '0.04ms' }
    ],
    specifications: [
      { key: 'AI Deep Solver', polishKey: 'Rozwiązanie AI', val: 'Gemini-Flash Core' },
      { key: 'Ecosystem Bridge', polishKey: 'Most ekosystemu', val: 'Wormhole SDK' },
      { key: 'Auto-liquidation', polishKey: 'Auto-likwidacja', val: 'Zero Gas Optimized' }
    ]
  },
  {
    id: 'explorer',
    name: 'EXPLORER',
    polishName: 'EKSPLORATOR',
    tagline: 'Cross-Chain Cosmic Deep Scan',
    polishTagline: 'Kosmiczny skan wielołańcuchowy',
    icon: Compass,
    color: 'text-amber-400',
    bgGlow: 'rgba(251, 191, 36, 0.15)',
    borderGlow: 'border-amber-400/30 hover:border-amber-400/80',
    metrics: [
      { label: 'Scan Depth', polishLabel: 'Głębokość skanu', value: '9 networks' },
      { label: 'Orbit Position', polishLabel: 'Pozycja orbity', value: 'Sector L-42' },
      { label: 'Discovery Ratio', polishLabel: 'Stosunek odkryć', value: '1.4B pool metrics' }
    ],
    specifications: [
      { key: 'Radar System', polishKey: 'System radarowy', val: 'Quantum Wave Scanner' },
      { key: 'Cartography', polishKey: 'Kartografia', val: 'Ecosystem Graph V2' },
      { key: 'Scan Interval', polishKey: 'Interwał skanu', val: 'Real-time Instant' }
    ]
  },
  {
    id: 'community',
    name: 'COMMUNITY',
    polishName: 'SPOŁECZNOŚĆ',
    tagline: 'DAO Governance & High-Five Sync',
    polishTagline: 'Zarządzanie DAO i pełna synergia',
    icon: Users,
    color: 'text-pink-500',
    bgGlow: 'rgba(236, 72, 153, 0.15)',
    borderGlow: 'border-pink-500/30 hover:border-pink-500/80',
    metrics: [
      { label: 'High-Five Sync', polishLabel: 'Synergia rąk', value: '100% PITCH-PERFECT' },
      { label: 'Active Votes', polishLabel: 'Aktywne głosy', value: '2.4M $SLX' },
      { label: 'DAO Proposal Rate', polishLabel: 'Propozycje DAO', value: '94.8% APRV' }
    ],
    specifications: [
      { key: 'Consensus Mode', polishKey: 'Tryb konsensusu', val: 'Proof of Friendship' },
      { key: 'Governance Portal', polishKey: 'Portal zarządzania', val: 'On-Chain Solaxy DAO' },
      { key: 'Reward Pool', polishKey: 'Pula nagród', val: '30% Supply Yield' }
    ]
  },
  {
    id: 'builder',
    name: 'BUILDER',
    polishName: 'BUDOWNICZY',
    tagline: 'Solana Blocks Layer-2 Stack Assembler',
    polishTagline: 'Montażysta bloków Solana Layer-2',
    icon: Hammer,
    color: 'text-r',
    bgGlow: 'rgba(255, 26, 74, 0.15)',
    borderGlow: 'border-r/30 hover:border-r/80',
    metrics: [
      { label: 'Assembly Rate', polishLabel: 'Szybkość budowy', value: '48k blocks/s' },
      { label: 'Block Stack Height', polishLabel: 'Wysokość stosu', value: '128 blocks' },
      { label: 'Material Density', polishLabel: 'Gęstość struktury', value: 'Nano Carbon Fiber' }
    ],
    specifications: [
      { key: 'Compiler', polishKey: 'Kompilator', val: 'Rust / Anchor-V2' },
      { key: 'Integrity Rating', polishKey: 'Wskaźnik trwałości', val: 'AAA Quantum Grade' },
      { key: 'Block Type', polishKey: 'Typ bloku', val: 'Compressed State Merkle' }
    ]
  }
];

export default function MascotShowcase() {
  const { t } = useLanguage();
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [isRunningScan, setIsRunningScan] = useState<boolean>(false);
  const [scanStatus, setScanStatus] = useState<string>('SYS_READY');

  const activePose = POSES[activeIdx];
  const IconComponent = activePose.icon;

  const handleDiagnose = () => {
    setIsRunningScan(true);
    setScanStatus('ANALYZING_CHASSIS...');
    setTimeout(() => {
      setScanStatus('CROP_MATRIX_VERIFIED');
      setTimeout(() => {
        setScanStatus('SYS_SYNC_100');
        setIsRunningScan(false);
      }, 1000);
    }, 1200);
  };

  return (
    <div id="mascot-portal-inspector" className="border border-g/20 bg-[#04080f]/85 backdrop-blur-xl p-6 md:p-8 relative overflow-hidden shadow-[0_0_50px_rgba(0,255,136,0.05)]">
      {/* Absolute Tech Deco items */}
      <div className="absolute top-0 left-0 w-32 h-[1px] bg-gradient-to-r from-g to-transparent shadow-[0_0_8px_#00ff88]" />
      <div className="absolute bottom-0 right-0 w-32 h-[1px] bg-gradient-to-r from-transparent to-g shadow-[0_0_8px_#00ff88]" />
      <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-g" />
      <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-g" />
      <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-g" />
      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-g" />

      {/* Heading */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-g/10 pb-5 mb-6 gap-4 select-none">
        <div>
          <div className="text-[9px] tracking-[4px] text-g font-bold uppercase flex items-center gap-1.5 mb-1">
            <Layers className="w-3.5 h-3.5 text-g animate-pulse" />
            {t('KROJENIE MATRYCY MASKOTKI', 'MASCOT IMAGE MATRIX CROPPER')}
          </div>
          <h3 className="font-display text-xl md:text-2xl text-white uppercase tracking-[1.5px] font-extrabold">
            {t('CYBERNETYCZNY DETEKTOR FILARÓW SOLAXY', 'CYBERNETIC SOLAXY PILLARS INSPECTOR')}
          </h3>
        </div>
        <div className="text-[9px] md:text-[10px] text-[#c8e6d2]/40 font-mono flex items-center gap-3 bg-g/5 border border-g/15 px-3 py-1.5">
          <span className="text-g font-bold uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-g rounded-full animate-ping" />
            {t('STATUS SAKNÓW: SKOMPLETOWANY', 'SCAN ENGINE: FULLY COMPILED')}
          </span>
          <span className="text-white/20">|</span>
          <span className="font-bold uppercase text-white/50">{scanStatus}</span>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Selection rail (6 positions) */}
        <div className="lg:col-span-4 flex flex-col gap-2.5">
          <div className="text-[9px] tracking-[2px] font-mono font-bold text-white/30 uppercase mb-1 px-1">
            {t('WYBIERZ SEKTOR DO PRZYCIĘCIA', 'SELECT CROP SECTOR')}
          </div>
          <div className="flex flex-col gap-2">
            {POSES.map((pose, idx) => {
              const PoseIcon = pose.icon;
              const isActive = activeIdx === idx;
              return (
                <button
                  key={pose.id}
                  onClick={() => {
                    setActiveIdx(idx);
                    setScanStatus(`SYS_CROP_CH_${idx + 1}`);
                  }}
                  className={`w-full flex items-center justify-between p-3 border text-left transition-all duration-300 relative select-none cursor-pointer group ${
                    isActive 
                      ? 'bg-g/[0.05] border-g text-white shadow-[0_0_15px_rgba(0,255,136,0.1)]' 
                      : 'bg-black/30 border-white/5 text-white/40 hover:border-g/30 hover:bg-g/[0.02] hover:text-white/80'
                  }`}
                >
                  {/* Decorative bracket inside active list */}
                  {isActive && (
                    <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-g shadow-[0_0_8px_#00ff88]" />
                  )}

                  <div className="flex items-center gap-3.5">
                    <div className={`p-1.5 border transition-colors ${
                      isActive ? 'bg-g/10 border-g/30' : 'bg-white/5 border-white/10 group-hover:border-g/20'
                    }`}>
                      <PoseIcon className={`w-4 h-4 ${isActive ? pose.color : 'text-white/40 group-hover:text-g'}`} />
                    </div>
                    <div>
                      <div className="font-display text-xs font-extrabold tracking-[1px] uppercase">
                        {t(pose.polishName, pose.name)}
                      </div>
                      <div className="text-[8px] font-mono text-white/30 group-hover:text-white/50 mt-0.5 uppercase">
                        {t('Matryca', 'Matrix Column')} #0{idx + 1} // SLX-P{idx + 1}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono transition-transform duration-300 ${
                    isActive ? 'text-g translate-x-1' : 'text-white/20 group-hover:translate-x-0.5'
                  }`}>
                    ➔
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick diagnostic button */}
          <button
            onClick={handleDiagnose}
            disabled={isRunningScan}
            className="mt-4 w-full flex items-center justify-center gap-2 border border-g/40 hover:border-g bg-g/5 hover:bg-g/15 py-3 text-xs font-mono font-bold tracking-[2px] text-g uppercase cursor-pointer select-none transition-all duration-300 shadow-[0_0_10px_rgba(0,255,136,0.03)]"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-g ${isRunningScan ? 'animate-spin' : ''}`} />
            {isRunningScan ? t('KALIBRACJA MATRYCY...', 'CALIBRATING MATRIXY...') : t('ZAINICJUJ AUTODIAGNOSTYKĘ', 'RUN DIAGNOSTICS')}
          </button>
        </div>

        {/* Middle column: Giant Crop Viewbox */}
        <div className="lg:col-span-5">
          <div className="border border-white/10 bg-black p-3 relative group overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)]">
            
            {/* Overlay grid HUD interface */}
            <div className="absolute inset-0 border border-g/5 pointer-events-none z-10" />
            <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md border border-g/30 px-2 py-1 text-[8px] font-mono text-g font-bold tracking-[1.5px] z-10 select-none flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-g rounded-full animate-ping" />
              CROP ZONE // COL_0{activeIdx + 1}
            </div>

            <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md border border-white/10 px-2.5 py-1 text-[8px] font-mono text-white/50 tracking-[1px] z-10 select-none">
              W: 1024px · H: 1024px
            </div>

            {/* Target Reticle in Center */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 select-none">
              <div className="w-20 h-20 border border-g/20 rounded-full flex items-center justify-center animate-[pulse_4s_ease-in-out_infinite]">
                <div className="w-6 h-6 border border-g/40 relative">
                  <span className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-g" />
                  <span className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-g" />
                  <span className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-g" />
                  <span className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-g" />
                </div>
              </div>
              
              {/* Scanline element */}
              <div className="absolute left-0 right-0 h-[1.5px] bg-g/20 shadow-[0_0_8px_#00ff88] animate-[scan_2.8s_ease-in-out_infinite] z-20" />
            </div>

            {/* Dynamic Sliced Asset */}
            <div className="relative overflow-hidden aspect-square w-full bg-b border border-white/5 flex items-center justify-center p-2">
              <SlicedAsset
                asset={
                  [
                    'card-speed',
                    'card-security',
                    'card-innovation',
                    'card-explorer',
                    'card-community',
                    'card-builder'
                  ][activeIdx] as SlicedAssetKey
                }
                className="w-full h-full hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>
          
          <div className="mt-3 flex justify-between items-center text-[9px] font-mono text-white/30 px-1 select-none">
            <span>SYS_CROP_MATRIX: {activeIdx * 16.66}% TO {((activeIdx + 1) * 16.66).toFixed(2)}%</span>
            <span>ZOOM: 1.0X</span>
          </div>
        </div>

        {/* Right column: Specs and Lore Dashboard */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="border border-white/5 bg-[#0a1224]/30 p-4 rounded-none select-none">
            <div className="text-[9px] tracking-[2px] font-mono text-g font-bold uppercase mb-1">
              {t('RDZENNY FILAR EKOSYSTEMU', 'CORE ECOSYSTEM PILLAR')}
            </div>
            <h4 className="font-display text-lg font-extrabold text-white tracking-[0.5px] uppercase mb-1">
              {t(activePose.polishName, activePose.name)}
            </h4>
            <p className="text-[10px] text-[#c8e6d2]/60 font-mono font-bold uppercase tracking-[0.5px] leading-relaxed pb-3 border-b border-g/15">
              {t(activePose.polishTagline, activePose.tagline)}
            </p>

            {/* Metrics block */}
            <div className="mt-4 flex flex-col gap-3">
              {activePose.metrics.map((met, idx) => (
                <div key={idx} className="flex justify-between items-center bg-black/40 border border-white/5 px-3 py-2">
                  <span className="text-[9px] font-mono text-white/40 uppercase">
                    {t(met.polishLabel, met.label)}:
                  </span>
                  <span className={`text-[11px] font-mono font-bold tracking-[0.5px] ${activePose.color}`}>
                    {met.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-white/5 bg-black/40 p-4 rounded-none select-none">
            <div className="text-[9px] tracking-[2px] font-mono text-white/35 font-bold uppercase mb-2">
              {t('PARAMETRY SYGNAŁOWE', 'SIGNAL PARAMETERS')}
            </div>
            <div className="flex flex-col gap-2 font-mono text-[10px]">
              {activePose.specifications.map((spec, sIdx) => (
                <div key={sIdx} className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-white/30">{t(spec.polishKey, spec.key)}:</span>
                  <span className="text-white/70 font-bold">{spec.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
