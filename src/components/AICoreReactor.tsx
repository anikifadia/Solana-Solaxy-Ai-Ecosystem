import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, Shield, Cpu, RefreshCw, Terminal, CheckCircle2, 
  Sparkles, Play, Award, HelpCircle, Activity, ChevronRight 
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { SolaxyEmoticon } from './SolaxyLogo';

export default function AICoreReactor() {
  const { t } = useLanguage();
  const [simulationState, setSimulationState] = useState<'idle' | 'analyzing' | 'synthesizing' | 'compiling' | 'auditing' | 'deployed'>('idle');
  const [promptInput, setPromptInput] = useState('');
  const [simProgress, setSimProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'status' | 'live' | 'audit'>('status');

  // Live activity feeds (automatically rotative)
  const [liveActivities, setLiveActivities] = useState([
    { id: 1, text: '🤖 AI Agent initialized "Cyberpunk Ninja" token contract', age: '2s ago', type: 'ai' },
    { id: 2, text: '🔥 50,000 $SLX burned by Automated Market Maker router', age: '14s ago', type: 'burn' },
    { id: 3, text: '🚀 User minted "Sarmata Gold" token on Solana SVM', age: '45s ago', type: 'mint' },
    { id: 4, text: '🔒 Liquidity Pool for "PolkaPierog" locked permanently', age: '1m ago', type: 'lock' }
  ]);

  // Rotate activities
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveActivities(prev => {
        const copy = [...prev];
        const last = copy.pop();
        if (last) {
          // randomized live ticker events
          const coinNames = ['KrakowCoin', 'HyperSpeed', 'SatoshiGiga', 'SolanaLover', 'Velocty', 'QuantumCats'];
          const randomCoin = coinNames[Math.floor(Math.random() * coinNames.length)];
          const events = [
            { id: Date.now(), text: `🤖 AI generated metadata & logo for "${randomCoin}"`, age: 'Just now', type: 'ai' },
            { id: Date.now() + 1, text: `🔥 Smart Contract auto-burn triggered for "${randomCoin}"`, age: 'Just now', type: 'burn' },
            { id: Date.now() + 2, text: `🚀 Token "${randomCoin}" deployed to Solana Mainnet`, age: 'Just now', type: 'mint' },
            { id: Date.now() + 3, text: `✓ Securit Sentinel checked contract bytecode for "${randomCoin}"`, age: 'Just now', type: 'lock' }
          ];
          const newEvent = events[Math.floor(Math.random() * events.length)];
          return [newEvent, ...copy.slice(0, 3)];
        }
        return prev;
      });
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Simulation timeline handler
  useEffect(() => {
    if (simulationState === 'idle') {
      setSimProgress(0);
      return;
    }

    let intervalTime = 120; // total 60s roughly
    if (simulationState === 'analyzing') intervalTime = 100;
    else if (simulationState === 'synthesizing') intervalTime = 80;
    else if (simulationState === 'compiling') intervalTime = 60;
    else if (simulationState === 'auditing') intervalTime = 50;

    const timer = setInterval(() => {
      setSimProgress(prev => {
        const next = prev + 1;
        if (next >= 100) {
          clearInterval(timer);
          // Advance simulation state
          if (simulationState === 'analyzing') {
            setSimulationState('synthesizing');
            return 0;
          } else if (simulationState === 'synthesizing') {
            setSimulationState('compiling');
            return 0;
          } else if (simulationState === 'compiling') {
            setSimulationState('auditing');
            return 0;
          } else if (simulationState === 'auditing') {
            setSimulationState('deployed');
            return 100;
          }
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [simulationState]);

  const handleStartSim = (selectedPrompt?: string) => {
    const targetPrompt = selectedPrompt || promptInput || 'Cyberpunk Ninja RPG gaming token with 3% reward pool';
    setPromptInput(targetPrompt);
    setSimulationState('analyzing');
    setSimProgress(0);

    // Dispatch custom event with user prompt to trigger real-time generation on AI Factory page
    const event = new CustomEvent('start-ai-generation', { 
      detail: { prompt: targetPrompt } 
    });
    window.dispatchEvent(event);
  };

  const handleResetSim = () => {
    setSimulationState('idle');
    setSimProgress(0);
  };

  return (
    <div className="relative w-full max-w-[480px] border border-g/20 bg-[#04080f]/80 backdrop-blur-xl p-5 md:p-6 shadow-[0_0_50px_rgba(0,255,136,0.1)] hover:shadow-[0_0_60px_rgba(0,255,136,0.25)] transition-all duration-500 rounded select-none font-mono">
      {/* HD Tech Corners */}
      <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-g shadow-[0_0_8px_rgba(0,255,136,0.8)]" />
      <span className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-g shadow-[0_0_8px_rgba(0,255,136,0.8)]" />
      <span className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-g shadow-[0_0_8px_rgba(0,255,136,0.8)]" />
      <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-g shadow-[0_0_8px_rgba(0,255,136,0.8)]" />

      {/* Top Header Controls */}
      <div className="flex justify-between items-center border-b border-g/10 pb-3 mb-4 text-[10px]">
        <span className="text-g font-bold uppercase tracking-[2px] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-g animate-ping" />
          {t('AI CORE REACTOR // SYSTEM HD', 'AI CORE REACTOR // SYSTEM HD')}
        </span>
        <span className="text-white/40 tracking-[1.5px] uppercase">
          REACTION: {simulationState === 'idle' ? '98.4% STABLE' : '142.1% ACTIVE'}
        </span>
      </div>

      {/* Interactive Reactor Center Graphic */}
      <div className="relative aspect-square w-full max-w-[280px] mx-auto mb-6 flex items-center justify-center">
        {/* Outer Rotating Energy Circles (HD Neon) */}
        <div className={`absolute inset-0 rounded-full border border-dashed border-g/20 transition-transform duration-1000 ${
          simulationState !== 'idle' ? 'animate-[spin_10s_linear_infinite]' : 'animate-[spin_40s_linear_infinite]'
        }`} />
        <div className={`absolute inset-4 rounded-full border border-g/30 border-t-g border-b-cyan transition-transform duration-1000 ${
          simulationState !== 'idle' ? 'animate-[spin_4s_linear_infinite_reverse]' : 'animate-[spin_25s_linear_infinite_reverse]'
        }`} />
        
        {/* Plasma Wave effects */}
        <div className="absolute inset-8 rounded-full bg-radial-[ellipse_at_center] from-g/[0.04] to-transparent pointer-events-none" />

        {/* Floating Blockchain Node Signals (HD Vector Elements) */}
        <div className="absolute inset-10 flex items-center justify-between pointer-events-none">
          <span className={`w-1 h-1 bg-g rounded-full ${simulationState !== 'idle' ? 'animate-ping' : ''}`} />
          <span className={`w-1 h-1 bg-cyan rounded-full ${simulationState !== 'idle' ? 'animate-ping' : ''}`} />
        </div>

        {/* Central Core Sphere */}
        <div className="relative w-36 h-36 rounded-full bg-b/90 border border-g/30 flex flex-col items-center justify-center p-4 text-center overflow-hidden z-[2] shadow-[inset_0_0_20px_rgba(0,255,136,0.15)] group">
          {/* Pulsing Core Ambient Glow */}
          <div className={`absolute inset-0 bg-g/5 rounded-full filter blur-xl transition-opacity duration-500 ${
            simulationState !== 'idle' ? 'opacity-100 animate-pulse' : 'opacity-40'
          }`} />

          {simulationState === 'idle' && (
            <div className="z-10 flex flex-col items-center animate-fadeIn">
              <SolaxyEmoticon className="w-12 h-12 mb-1" />
              <div className="text-[10px] text-white/40 uppercase tracking-[1px]">{t('PROFIL OPERACYJNY', 'OPERATIONAL PROFILE')}</div>
              <div className="text-xs font-bold text-white uppercase tracking-[1.5px] mt-1">{t('RDZEŃ AI', 'AI CORE')}</div>
              <div className="text-[8px] text-g mt-2 uppercase tracking-[2px]">{t('OCZEKIWANIE', 'STANDBY')}</div>
            </div>
          )}

          {simulationState === 'analyzing' && (
            <div className="z-10 flex flex-col items-center animate-fadeIn text-center">
              <RefreshCw className="w-9 h-9 text-cyan mb-2 animate-spin" />
              <div className="text-[8px] text-white/50 uppercase tracking-[1px]">{t('FAZA 1/5', 'PHASE 1/5')}</div>
              <div className="text-[10px] font-bold text-cyan uppercase tracking-[1px] mt-1">{t('ANALIZA POMYSŁU', 'ANALYZING PROMPT')}</div>
              <div className="text-[10px] text-g font-bold mt-1.5">{simProgress}%</div>
            </div>
          )}

          {simulationState === 'synthesizing' && (
            <div className="z-10 flex flex-col items-center animate-fadeIn text-center">
              <Sparkles className="w-9 h-9 text-purple mb-2 animate-pulse" />
              <div className="text-[8px] text-white/50 uppercase tracking-[1px]">{t('FAZA 2/5', 'PHASE 2/5')}</div>
              <div className="text-[10px] font-bold text-purple uppercase tracking-[1px] mt-1">{t('TOKENOMIKA', 'TOKENOMICS AI')}</div>
              <div className="text-[10px] text-g font-bold mt-1.5">{simProgress}%</div>
            </div>
          )}

          {simulationState === 'compiling' && (
            <div className="z-10 flex flex-col items-center animate-fadeIn text-center">
              <Terminal className="w-9 h-9 text-yellow-400 mb-2 animate-bounce" />
              <div className="text-[8px] text-white/50 uppercase tracking-[1px]">{t('FAZA 3/5', 'PHASE 3/5')}</div>
              <div className="text-[10px] font-bold text-yellow-400 uppercase tracking-[1px] mt-1">{t('RUST ANCHOR', 'COMPILING CONTRACT')}</div>
              <div className="text-[10px] text-g font-bold mt-1.5">{simProgress}%</div>
            </div>
          )}

          {simulationState === 'auditing' && (
            <div className="z-10 flex flex-col items-center animate-fadeIn text-center">
              <Shield className="w-9 h-9 text-r mb-2 animate-pulse" />
              <div className="text-[8px] text-white/50 uppercase tracking-[1px]">{t('FAZA 4/5', 'PHASE 4/5')}</div>
              <div className="text-[10px] font-bold text-r uppercase tracking-[1px] mt-1">{t('AUDYT SMART', 'SHIELD AUDIT')}</div>
              <div className="text-[10px] text-g font-bold mt-1.5">{simProgress}%</div>
            </div>
          )}

          {simulationState === 'deployed' && (
            <div className="z-10 flex flex-col items-center animate-fadeIn text-center">
              <CheckCircle2 className="w-10 h-10 text-g mb-2 animate-[bounce_1s_infinite]" />
              <div className="text-[8px] text-white/50 uppercase tracking-[1px]">{t('UKOŃCZONO 5/5', 'COMPLETED 5/5')}</div>
              <div className="text-[10px] font-bold text-g uppercase tracking-[1px] mt-1">{t('KONTRAKT AKTYWNY', 'CONTRACT ACTIVE')}</div>
              <div className="text-[7px] text-white/40 mt-1 uppercase">GAS PAID // $SLX</div>
            </div>
          )}
        </div>
      </div>

      {/* CREATE LAUNCH DOMINATE Banner */}
      <div className="text-center mb-5">
        <div className="text-xs tracking-[5px] text-white font-bold uppercase mb-1">
          {t('STWÓRZ · EMITUJ · DOMINUJ', 'CREATE · LAUNCH · DOMINATE')}
        </div>
        <div className="text-[9px] text-[#c8e6d2]/50 tracking-[1.5px] uppercase">
          {t('INTERAKTYWNY GENERATOR POMYSŁU W 60 SEKUND', 'INTERACTIVE 60-SECOND CONSTRUCT SIMULATION')}
        </div>
      </div>

      {/* Simulation Stepper progress bar */}
      {simulationState !== 'idle' && (
        <div className="mb-6 bg-black/60 border border-white/5 p-3 rounded">
          <div className="flex justify-between items-center text-[9px] text-white/40 mb-1.5">
            <span>{t('POSTĘP REAKCJI EMISYJNEJ', 'EMISSION PROCESS PROGRESS')}</span>
            <span className="text-g font-bold">{simulationState.toUpperCase()}</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 relative overflow-hidden rounded">
            <div 
              className="h-full bg-gradient-to-r from-g to-cyan transition-all duration-150"
              style={{ width: `${
                simulationState === 'analyzing' ? 20 :
                simulationState === 'synthesizing' ? 40 :
                simulationState === 'compiling' ? 60 :
                simulationState === 'auditing' ? 80 : 100
              }%` }}
            />
          </div>

          {/* Stepper details log */}
          <div className="text-[9px] text-[#c8e6d2]/60 mt-2 font-mono leading-relaxed h-[42px] overflow-hidden">
            {simulationState === 'analyzing' && `>>> [ANALYZING]: "${promptInput}" -> Designing attributes, assigning ticker, checking Solana SVM token bounds.`}
            {simulationState === 'synthesizing' && `>>> [SYNTHESIZING]: Metadata configured. Initial supply set to 1,000,000. Generating secure deflationary tax algorithms.`}
            {simulationState === 'compiling' && `>>> [COMPILING]: Translating blueprint to Anchor Rust Framework. Optimizing assembly pipeline and BPF bytecode.`}
            {simulationState === 'auditing' && `>>> [AUDITING]: Security Shield executing static analysis. 0 exploits found. CertiK Compliance grade: 99.8% SECURE.`}
            {simulationState === 'deployed' && `>>> [DEPLOYED]: Transaction validated on Solana Mainnet! Contract ID: SolaxForge${Math.random().toString(36).substring(2, 8).toUpperCase()}. Ready for decentralized trade.`}
          </div>
        </div>
      )}

      {/* Input Prompter / Control Action */}
      {simulationState === 'idle' ? (
        <div className="space-y-3 mb-6 animate-fadeIn">
          <div>
            <label className="text-[9px] text-white/40 uppercase block mb-1.5 font-mono">
              {t('WPISZ POMYSŁ DO REAKTORA AI (PROMPT)', 'EMIT YOUR IDEA TO THE AI REACTOR (PROMPT)')}
            </label>
            <div className="flex gap-2 bg-black/70 border border-white/10 p-1.5 rounded">
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder={t('np. Szybka pierogowa moneta z 1% auto-burn', 'e.g., Ultra fast space cheetah coin')}
                className="w-full bg-transparent text-white py-1.5 px-3 text-xs focus:outline-none placeholder-white/20 font-mono"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleStartSim();
                }}
              />
              <button
                onClick={() => handleStartSim()}
                className="bg-g hover:bg-g/90 text-black px-4 py-1.5 text-[10px] font-bold uppercase tracking-[1px] flex items-center gap-1 transition-all"
              >
                {t('START', 'START')} <Play className="w-3 h-3 fill-current" />
              </button>
            </div>
          </div>

          {/* Quick templates */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <button 
              onClick={() => handleStartSim('DeFi stablecoin backed by real-world treasury assets')}
              className="text-[8px] border border-white/5 bg-b2/40 hover:bg-g/5 hover:border-g/30 text-white/50 hover:text-white px-2 py-1 transition-all rounded"
            >
              # DeFi Treasury
            </button>
            <button 
              onClick={() => handleStartSim('Cyberpunk meme coin representing retro game culture')}
              className="text-[8px] border border-white/5 bg-b2/40 hover:bg-g/5 hover:border-g/30 text-white/50 hover:text-white px-2 py-1 transition-all rounded"
            >
              # Cyberpunk Meme
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-3 mb-6 animate-fadeIn">
          {simulationState === 'deployed' ? (
            <button
              onClick={handleResetSim}
              className="w-full py-2 border border-g text-g hover:bg-g/10 bg-transparent text-[10px] font-bold uppercase tracking-[2px] transition-all flex items-center justify-center gap-2"
            >
              {t('STWÓRZ KOLEJNY', 'LAUNCH NEW REACTION')}
            </button>
          ) : (
            <button
              onClick={handleResetSim}
              className="w-full py-2 border border-r/30 text-r hover:bg-r/10 bg-transparent text-[10px] font-bold uppercase tracking-[2px] transition-all flex items-center justify-center gap-2"
            >
              {t('PRZERWIJ REAKCJĘ', 'ABORT REACTION')}
            </button>
          )}
        </div>
      )}

      {/* Tabs Layout for Reactor Data (Status | Live Ticker | Audit Specs) */}
      <div className="border border-white/5 bg-black/30 p-1.5 rounded mb-4">
        <div className="grid grid-cols-3 gap-1 mb-2.5">
          {[
            { id: 'status', label: t('STATUS', 'STATUS') },
            { id: 'live', label: t('AKTYWNOŚĆ AI', 'AI ACTIVITY') },
            { id: 'audit', label: t('PRO SPEC', 'PRO SPEC') }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-1 text-[8.5px] font-bold tracking-[1px] uppercase transition-all rounded ${
                activeTab === tab.id 
                  ? 'bg-g/15 text-g border border-g/25' 
                  : 'text-white/40 hover:text-white/70 bg-transparent border-none'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="h-[95px] overflow-hidden text-[9px] leading-relaxed">
          {activeTab === 'status' && (
            <div className="space-y-1.5 animate-fadeIn">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-white/40">{t('Zaprojektowane APY', 'Target APY reward')}</span>
                <span className="text-g font-bold">up to 164.8% APY</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-white/40">{t('Bezpieczeństwo Smart Contract', 'Contract Safety')}</span>
                <span className="text-cyan font-bold">100% Non-Custodial</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">{t('Mechanizm deflacyjny', 'Deflationary burning')}</span>
                <span className="text-r font-bold">1.5% AP-Burn Rate</span>
              </div>
            </div>
          )}

          {activeTab === 'live' && (
            <div className="space-y-1.5 animate-fadeIn">
              {liveActivities.map(act => (
                <div key={act.id} className="flex justify-between items-start gap-2 border-b border-white/5 pb-1 last:border-0">
                  <span className="text-white/80 overflow-hidden text-ellipsis whitespace-nowrap max-w-[320px]">
                    {act.text}
                  </span>
                  <span className="text-[7.5px] text-white/30 whitespace-nowrap">
                    {act.age}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-1.5 animate-fadeIn">
              <div className="flex items-center gap-1.5 text-g font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-g flex-shrink-0" />
                <span>✓ {t('Kod kontraktu zweryfikowany w Anchor Explorer', 'Contract Code Verified in Anchor Explorer')}</span>
              </div>
              <div className="flex items-center gap-1.5 text-g font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-g flex-shrink-0" />
                <span>✓ {t('Własność zrzeczona (Ownership Renounced)', 'Ownership permanently renounced')}</span>
              </div>
              <div className="flex items-center gap-1.5 text-g font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-g flex-shrink-0" />
                <span>✓ {t('Blokada płynności na 10 lat (LP Locked)', '10-Year Locked Liquidity Vaults')}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Security Shield Badges */}
      <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-g/10 text-[7.5px] text-white/40 font-bold uppercase select-none tracking-[0.5px]">
        <div className="flex flex-col items-center justify-center p-1 bg-white/[0.02] border border-white/5 text-center">
          <Award className="w-3.5 h-3.5 text-g mb-0.5" />
          <span className="text-[7.5px] text-white/60">{t('Zweryfikowany', 'Verified')}</span>
        </div>
        <div className="flex flex-col items-center justify-center p-1 bg-white/[0.02] border border-white/5 text-center">
          <Zap className="w-3.5 h-3.5 text-cyan mb-0.5" />
          <span className="text-[7.5px] text-white/60">{t('Zablokowany LP', 'LP Locked')}</span>
        </div>
        <div className="flex flex-col items-center justify-center p-1 bg-white/[0.02] border border-white/5 text-center">
          <Shield className="w-3.5 h-3.5 text-purple mb-0.5" />
          <span className="text-[7.5px] text-white/60">{t('Zrzeczony', 'Renounced')}</span>
        </div>
        <div className="flex flex-col items-center justify-center p-1 bg-white/[0.02] border border-white/5 text-center">
          <CheckCircle2 className="w-3.5 h-3.5 text-g mb-0.5" />
          <span className="text-[7.5px] text-white/60">{t('Audytowany', 'Audited')}</span>
        </div>
      </div>
    </div>
  );
}
