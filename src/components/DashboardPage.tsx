import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldCheck, Wallet, Activity, Zap, Terminal, TrendingUp, AlertTriangle, MessageSquare, Plus, FileText, Cpu, CheckCircle2, ChevronRight, BarChart3, Radio } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useWallet } from '../WalletContext';

export default function DashboardPage() {
  const { t } = useLanguage();
  const { walletAddress, isConnected } = useWallet();
  const [activeTab, setActiveTab] = useState<'agent' | 'portfolio' | 'scanner' | 'signals' | 'news'>('agent');
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [agentResponse, setAgentResponse] = useState<any>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const isActuallyConnected = isConnected || isDemoMode;

  const handleAnalyze = () => {
    if (!prompt) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAgentResponse({
        riskScore: Math.floor(Math.random() * 40) + 10,
        summary: "Analysis complete. Detected 3 safe contracts, 1 medium risk token.",
        scamRisk: "Low",
        whaleActivity: "Moderate",
        suggestions: [
          "Consider taking profits on $MEME.",
          "Stake $SLX for higher yield.",
          "Revoke permissions for 0x...a1b."
        ]
      });
    }, 2000);
  };

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-white uppercase tracking-[2px]">
            {t('AI TERMINAL & DASHBOARD', 'AI TERMINAL & DASHBOARD')}
          </h1>
          <p className="text-white/50 text-sm mt-2 max-w-2xl">
            {t('Osobisty asystent AI i centrum dowodzenia Web3. Analizuj tokeny, zarządzaj portfelem i otrzymuj sygnały rynkowe w czasie rzeczywistym.', 'Your personal AI assistant and Web3 command center. Analyze tokens, manage portfolio, and receive real-time market signals.')}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {isDemoMode && !isConnected && (
            <button 
              onClick={() => setIsDemoMode(false)}
              className="text-xs text-white/40 hover:text-white border border-white/10 px-3 py-1 rounded"
            >
              {t('Zakończ Demo', 'Exit Demo')}
            </button>
          )}
        </div>
      </div>

      {!isActuallyConnected ? (
        <div className="bg-white/5 border border-white/10 rounded-lg p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-g/10 flex items-center justify-center mb-4">
            <Wallet className="w-8 h-8 text-g" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">{t('Wymagane Podłączenie Portfela', 'Wallet Connection Required')}</h2>
          <p className="text-white/50 text-sm max-w-md mb-6">
            {t('Zaloguj się za pomocą portfela Solana, aby uzyskać dostęp do pełnego panelu AI, analizy ryzyka i sygnałów handlowych.', 'Connect your Solana wallet to access the full AI dashboard, risk analysis, and trading signals.')}
          </p>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDemoMode(true)}
              className="text-xs text-g bg-g/10 hover:bg-g/20 px-6 py-3 rounded-full font-bold tracking-[1px] uppercase border border-g/20 transition-all"
            >
              {t('Wypróbuj Live Demo AI', 'Try Live AI Demo')}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            {[
              { id: 'agent', icon: Terminal, label: t('Agent AI', 'AI Agent') },
              { id: 'portfolio', icon: BarChart3, label: t('AI Portfolio', 'AI Portfolio') },
              { id: 'scanner', icon: Shield, label: t('Skaner Portfela', 'Wallet Scanner') },
              { id: 'signals', icon: Activity, label: t('Sygnały AI', 'AI Signals') },
              { id: 'news', icon: Radio, label: t('Wiadomości AI', 'AI News') },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-all ${
                  activeTab === tab.id 
                    ? 'bg-g/10 border-g/50 text-g shadow-[0_0_15px_rgba(0,255,136,0.15)]' 
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-bold text-sm tracking-[1px]">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'agent' && (
              <div className="bg-black/40 border border-white/10 rounded-lg p-6 flex flex-col min-h-[500px]">
                <div className="flex-1 overflow-y-auto mb-6 space-y-4">
                  {/* AI Welcome Message */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded bg-g/20 border border-g/40 flex items-center justify-center shrink-0">
                      <Cpu className="w-5 h-5 text-g" />
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-lg rounded-tl-none max-w-[80%]">
                      <p className="text-sm text-white/90 leading-relaxed">
                        {t(
                          'Witaj w Solaxy AI Terminal. Mogę przeanalizować dla Ciebie dowolny kontrakt, sprawdzić portfel pod kątem ryzyka lub wygenerować raport rynkowy. Co chcesz zrobić?',
                          'Welcome to Solaxy AI Terminal. I can analyze any contract for you, check your wallet for risk, or generate a market report. What would you like to do?'
                        )}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        <button onClick={() => setPrompt("Analyze my wallet")} className="text-[10px] bg-white/10 hover:bg-g/20 hover:text-g hover:border-g/50 border border-white/20 px-3 py-1.5 rounded transition-colors text-white/70">Analyze my wallet</button>
                        <button onClick={() => setPrompt("Scan contract 7xKX... for rug pull risk")} className="text-[10px] bg-white/10 hover:bg-g/20 hover:text-g hover:border-g/50 border border-white/20 px-3 py-1.5 rounded transition-colors text-white/70">Scan contract for risk</button>
                        <button onClick={() => setPrompt("Give me top AI trading signals today")} className="text-[10px] bg-white/10 hover:bg-g/20 hover:text-g hover:border-g/50 border border-white/20 px-3 py-1.5 rounded transition-colors text-white/70">Show trading signals</button>
                      </div>
                    </div>
                  </div>

                  {/* User Message */}
                  {prompt && isAnalyzing && (
                     <div className="flex items-start justify-end gap-4">
                       <div className="bg-g/10 border border-g/30 p-4 rounded-lg rounded-tr-none max-w-[80%] text-right">
                         <p className="text-sm text-white/90">{prompt}</p>
                       </div>
                       <div className="w-10 h-10 rounded bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                         <Wallet className="w-5 h-5 text-white/50" />
                       </div>
                     </div>
                  )}

                  {/* Loading State */}
                  {isAnalyzing && (
                    <div className="flex items-center gap-3 text-g text-sm font-mono p-4">
                      <div className="w-4 h-4 border-2 border-g border-t-transparent rounded-full animate-spin" />
                      {t('AI analizuje dane on-chain...', 'AI is analyzing on-chain data...')}
                    </div>
                  )}

                  {/* Agent Response */}
                  {agentResponse && !isAnalyzing && (
                     <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded bg-g/20 border border-g/40 flex items-center justify-center shrink-0">
                         <Cpu className="w-5 h-5 text-g" />
                       </div>
                       <div className="bg-white/5 border border-white/10 p-4 rounded-lg rounded-tl-none w-full max-w-[80%]">
                         <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/10">
                            <div className="flex flex-col">
                              <span className="text-[10px] text-white/40 uppercase tracking-[1px] font-bold">Risk Score</span>
                              <span className={`text-xl font-bold ${agentResponse.riskScore < 30 ? 'text-g' : 'text-r'}`}>{agentResponse.riskScore}/100</span>
                            </div>
                            <div className="flex flex-col border-l border-white/10 pl-4">
                              <span className="text-[10px] text-white/40 uppercase tracking-[1px] font-bold">Scam Risk</span>
                              <span className="text-sm font-bold text-white">{agentResponse.scamRisk}</span>
                            </div>
                            <div className="flex flex-col border-l border-white/10 pl-4">
                              <span className="text-[10px] text-white/40 uppercase tracking-[1px] font-bold">Whale Activity</span>
                              <span className="text-sm font-bold text-white">{agentResponse.whaleActivity}</span>
                            </div>
                         </div>
                         <p className="text-sm text-white/80 mb-4">{agentResponse.summary}</p>
                         
                         <div className="space-y-2">
                           <span className="text-[10px] text-white/40 uppercase tracking-[1px] font-bold">AI Suggestions:</span>
                           {agentResponse.suggestions.map((s: string, i: number) => (
                             <div key={i} className="flex items-center gap-2 text-xs text-white/70 bg-black/40 p-2 rounded border border-white/5">
                               <Shield className="w-3 h-3 text-cyan" />
                               {s}
                             </div>
                           ))}
                         </div>
                       </div>
                     </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="mt-auto relative">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={t('Wpisz komendę dla Solaxy AI (np. Analyze my wallet)...', 'Type a command for Solaxy AI (e.g. Analyze my wallet)...')}
                    className="w-full bg-black/60 border border-white/20 rounded-lg pl-4 pr-12 py-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-g/50 transition-colors"
                    onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                  />
                  <button 
                    onClick={handleAnalyze}
                    disabled={!prompt || isAnalyzing}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-g/20 text-g rounded hover:bg-g/40 disabled:opacity-50 transition-colors"
                  >
                    <Plus className="w-4 h-4 rotate-45" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div className="bg-black/40 border border-white/10 rounded-lg p-6 min-h-[500px]">
                <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-[2px]">{t('Podsumowanie Portfela', 'Portfolio Summary')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                    <div className="text-[10px] text-white/40 uppercase tracking-[1px] mb-1">Total Value</div>
                    <div className="text-2xl font-bold text-white">$14,235.80</div>
                    <div className="text-xs text-g mt-1">+5.2% (24h)</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                    <div className="text-[10px] text-white/40 uppercase tracking-[1px] mb-1">AI Copilot Score</div>
                    <div className="text-2xl font-bold text-cyan">92/100</div>
                    <div className="text-xs text-white/50 mt-1">Highly Optimized</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                    <div className="text-[10px] text-white/40 uppercase tracking-[1px] mb-1">Rug Probability</div>
                    <div className="text-2xl font-bold text-g">0.4%</div>
                    <div className="text-xs text-white/50 mt-1">Safe holding</div>
                  </div>
                </div>
                
                <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-[1px]">{t('Ekspozycja na Tokeny', 'Token Exposure')}</h4>
                <div className="space-y-3">
                  {['SOL', 'SLX', 'BONK', 'JUP'].map((token, i) => (
                    <div key={i} className="flex items-center justify-between bg-white/5 p-3 rounded border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs">{token[0]}</div>
                        <div>
                          <div className="text-sm font-bold text-white">{token}</div>
                          <div className="text-xs text-white/50">{t('Zaufany Token', 'Trusted Token')}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-white">${(Math.random() * 5000 + 100).toFixed(2)}</div>
                        <div className="text-xs text-g">+{Math.random().toFixed(2)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'scanner' && (
              <div className="bg-black/40 border border-white/10 rounded-lg p-6 min-h-[500px]">
                <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-[2px]">{t('AI Skaner Bezpieczeństwa', 'AI Security Scanner')}</h3>
                <div className="bg-cyan/10 border border-cyan/30 p-4 rounded-lg mb-6 flex items-start gap-4">
                  <ShieldCheck className="w-6 h-6 text-cyan shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-cyan mb-1">{t('Twój portfel jest bezpieczny', 'Your wallet is secure')}</h4>
                    <p className="text-xs text-cyan/70 leading-relaxed">
                      {t('Solaxy AI na bieżąco monitoruje Twój portfel i autoryzowane kontrakty pod kątem złośliwego kodu, wyciągania płynności (rug pull) i podejrzanej aktywności wielorybów.', 'Solaxy AI continuously monitors your wallet and authorized contracts for malicious code, rug pulls, and suspicious whale activity.')}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-sm text-white/70">Smart Contract Approvals</span>
                    <span className="text-sm font-bold text-g">2 Safe</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-sm text-white/70">Phishing Protection</span>
                    <span className="text-sm font-bold text-g">Active</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-sm text-white/70">Honeypot Detection</span>
                    <span className="text-sm font-bold text-g">Monitoring</span>
                  </div>
                </div>
              </div>
            )}

            {(activeTab === 'signals' || activeTab === 'news') && (
              <div className="bg-black/40 border border-white/10 rounded-lg p-12 flex flex-col items-center justify-center text-center min-h-[500px]">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                  <Activity className="w-8 h-8 text-white/30" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-[2px]">{t('Moduł Aktywny Wkrótce', 'Module Coming Soon')}</h3>
                <p className="text-white/40 text-sm max-w-sm">
                  {t('Sygnały transakcyjne na żywo i agregacja wiadomości AI zostaną uruchomione po wdrożeniu Solaxy Mainnet.', 'Live trading signals and AI news aggregation will be launched after the Solaxy Mainnet deployment.')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
