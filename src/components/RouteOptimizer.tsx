import React, { useState, useEffect } from 'react';
import { Shuffle, Settings, ShieldCheck, Zap, Info } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface PoolHop {
  name: string;
  share: number;
  fee: number;
  color: string;
}

export default function RouteOptimizer() {
  const { t } = useLanguage();
  const [amount, setAmount] = useState<number>(10);
  const [inputToken, setInputToken] = useState<string>('SOL');
  const [outputToken, setOutputToken] = useState<string>('USDC');
  const [slippage, setSlippage] = useState<number>(0.5);
  const [routeSplits, setRouteSplits] = useState<PoolHop[]>([]);
  const [savedAmount, setSavedAmount] = useState<number>(4.28);
  const [routingLoadTime, setRoutingLoadTime] = useState<number>(12);

  const tokens = ['SOL', 'USDC', 'SLX', 'JUP', 'RAY'];

  // Handle automatic route re-calculation when input parameters change
  useEffect(() => {
    // Generate organic split percentages that sum to 100%
    let s1 = Math.floor(Math.random() * 20) + 40; // 40-60%
    let s2 = Math.floor(Math.random() * 15) + 20; // 20-35%
    let s3 = 100 - s1 - s2; // remaining

    const hops: PoolHop[] = [
      { name: 'Raydium CLMM Pool', share: s1, fee: 0.0012, color: 'text-cyan border-cyan/30 bg-cyan/5' },
      { name: 'Orca Aquafarm Pool', share: s2, fee: 0.0008, color: 'text-g border-g/30 bg-g/5' },
      { name: 'SOLAX Direct Pool', share: s3, fee: 0.0001, color: 'text-purple border-purple/30 bg-purple/5' }
    ];

    setRouteSplits(hops);

    // Simulated fee saving calculations
    const saved = amount * 0.012 * (1 + (1 - slippage / 2));
    setSavedAmount(Number(saved.toFixed(2)));

    // Sim RPC latency fluctuations
    setRoutingLoadTime(Math.floor(Math.random() * 8) + 8);
  }, [amount, inputToken, outputToken, slippage]);

  return (
    <div className="border border-cyan/20 bg-b2/90 p-5 md:p-6 rounded-none relative overflow-hidden backdrop-blur-md">
      {/* Top cyan scan strip */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />

      <div className="flex items-center justify-between mb-5 border-b border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <Shuffle className="w-5 h-5 text-cyan drop-shadow-[0_0_8px_#00eeff]" />
          <div>
            <div className="text-[10px] tracking-[4px] uppercase text-white font-bold">SOLAX MULTI-ROUTE SPLITTER</div>
            <div className="text-[9px] text-white/40 tracking-[1px] uppercase font-mono mt-0.5">{t('Automatyczna optymalizacja cen', 'Automated Price Optimization')}</div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[8px] border border-cyan/30 px-2 py-0.5 bg-cyan/5 text-cyan font-bold uppercase tracking-[1px] font-mono">
            {t('OPÓŹNIENIE ROUTINGU', 'ROUTING DELAY')}: {routingLoadTime}ms
          </span>
        </div>
      </div>

      {/* Input controls widget */}
      <div className="grid grid-cols-2 gap-4 mb-5 font-mono">
        <div>
          <label className="text-[9px] text-white/40 uppercase block mb-1">{t('Ilość sprzedaży', 'Sell Amount')}</label>
          <div className="flex items-center bg-black/50 border border-white/10 px-3 py-2">
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
              className="w-full bg-transparent text-white font-bold text-sm focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <select 
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              className="bg-transparent text-g font-bold text-xs focus:outline-none cursor-pointer border-0"
            >
              {tokens.map((t) => (
                <option key={t} value={t} className="bg-b font-bold text-white">{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-[9px] text-white/40 uppercase block mb-1">{t('Tolerancja poślizgu', 'Slippage Tolerance')}</label>
          <div className="bg-black/50 border border-white/10 px-3 py-2 flex flex-col justify-center h-[38px]">
            <div className="flex justify-between items-center text-xs">
              <input 
                type="range" 
                min="0.1" 
                max="3.0" 
                step="0.1"
                value={slippage} 
                onChange={(e) => setSlippage(Number(e.target.value))}
                className="w-[70%] h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan"
              />
              <span className="text-cyan font-bold">{slippage}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive split path routing chart */}
      <div className="relative border border-white/5 bg-black/60 p-4 mb-4">
        <div className="text-[8px] text-cyan font-bold uppercase tracking-[2px] mb-4 text-center">
          {t('Optymalny podział ścieżki routingu transakcji', 'Optimal Trade routing Split Path mapping')}
        </div>

        {/* Visual Map diagram */}
        <div className="flex flex-col gap-3 relative">
          
          {/* Node: Input */}
          <div className="flex items-center justify-between">
            <div className="border border-white/15 bg-b/80 px-3 py-1 text-[10px] font-bold tracking-[1px] uppercase">
              {t('Portfel', 'Wallet')} ({amount} {inputToken})
            </div>
            <div className="h-[1px] flex-1 bg-dashed border-t border-dashed border-cyan/40 mx-2" />
            <div className="border border-cyan/40 bg-cyan/10 px-3 py-1 text-[10px] text-cyan font-bold tracking-[1px] uppercase shadow-[0_0_8px_rgba(0,238,255,0.2)]">
              SOLAX ROUTER
            </div>
          </div>

          {/* Splitted Hops rows */}
          <div className="flex flex-col gap-2 pl-8 pr-4 py-2 border-l border-cyan/20 my-1 relative">
            <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-cyan/20" />
            
            {routeSplits.map((hop, idx) => (
              <div key={idx} className="flex items-center justify-between text-[10px] font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="text-cyan/60">➔</span>
                  <span className="text-white/60">{hop.name}</span>
                </div>
                <div className={`border px-2 py-0.5 font-bold tracking-[1px] ${hop.color}`}>
                  {hop.share}%
                </div>
              </div>
            ))}
          </div>

          {/* Node: Output */}
          <div className="flex items-center justify-between">
            <div className="h-[1px] flex-1 bg-dashed border-t border-dashed border-g/40 mr-2" />
            <div className="border border-g/40 bg-g/10 px-3 py-1 text-[10px] text-g font-bold tracking-[1px] uppercase shadow-[0_0_8px_rgba(0,255,136,0.2)]">
              {t('SZACUNKOWA para wymiany', 'ESTIMATED Swapped Pair')}
            </div>
          </div>

        </div>
      </div>

      {/* Routing Savings Outcome Metrics */}
      <div className="flex items-center gap-4 bg-cyan/5 border border-cyan/15 p-4">
        <Zap className="w-6 h-6 text-cyan drop-shadow-[0_0_6px_#00eeff]" />
        <div>
          <div className="font-display text-sm md:text-base text-cyan font-bold">
            {t('Zaoszczędzono na poślizgu i opłatach', 'Saved on Slippage & Fees')}: <span className="text-white">${savedAmount} USD</span>
          </div>
          <div className="text-[9px] text-white/40 tracking-[1.5px] uppercase mt-0.5">
            {t('W porównaniu do standardowych protokołów routingu AMM', 'Compared to Standard AMM routing protocols')}
          </div>
        </div>
      </div>
    </div>
  );
}
