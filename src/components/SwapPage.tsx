import React from 'react';
import { 
  RefreshCw, 
  Coins, 
  ArrowDownUp, 
  Flame, 
  Hammer, 
  Sparkles 
} from 'lucide-react';
import MempoolStream from './MempoolStream';

interface SwapPageProps {
  t: (pl: string, en: string) => string;
  tokens: any[];
  solPrice: number;
  selectedTokenForTrade: any | null;
  setSelectedTokenForTrade: (token: any | null) => void;
  tradeAmount: string;
  setTradeAmount: (amt: string) => void;
  tradeType: 'BUY' | 'SELL';
  setTradeType: (type: 'BUY' | 'SELL') => void;
  tradeSuccess: string | null;
  setTradeSuccess: (msg: string | null) => void;
  tradeError: string | null;
  setTradeError: (msg: string | null) => void;
  isTrading: boolean;
  handleExecuteTrade: (ticker: string) => void;
}

export default function SwapPage({
  t,
  tokens,
  solPrice,
  selectedTokenForTrade,
  setSelectedTokenForTrade,
  tradeAmount,
  setTradeAmount,
  tradeType,
  setTradeType,
  tradeSuccess,
  setTradeSuccess,
  tradeError,
  setTradeError,
  isTrading,
  handleExecuteTrade,
}: SwapPageProps) {
  return (
    <div className="pt-[110px]">
      {/* ══ REAL-TIME LIQUIDITY POOLS & AMM TRADING SECTION ══ */}
      <section id="pools" className="relative z-[5] py-12 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 text-[10px] tracking-[5px] text-g/50 uppercase mb-4">
            <span className="w-6 h-[1px] bg-g shadow-[0_0_6px_#00ff88]" /> {t('AUTOMATYCZNY ANIMATOR RYNKU (AMM)', 'AUTOMATED MARKET MAKER (AMM)')}
          </div>
          <h2 className="font-display text-3xl md:text-5xl tracking-[2px] text-white uppercase mb-4">
            {t('ZDECENTRALIZOWANE ', 'DECENTRALIZED ')}<span className="text-cyan text-shadow-[0_0_8px_rgba(0,238,255,0.4)]">{t('PULE PŁYNNOŚCI', 'LIQUIDITY POOLS')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#c8e6d2]/50 max-w-[680px] mx-auto leading-relaxed">
            {t(
              'Zdecentralizowany rynek tokenów i automatyczny kreator płynności AMM. Każdy nowo wdrożony token otrzymuje natychmiastowe wsparcie płynnościowe (80% puli), umożliwiając bezproblemowy, bezpieczny handel bez pośredników z natychmiastową wyceną rynkową.',
              'Decentralized token market and automated AMM liquidity provision. Each newly deployed token receives instant liquidity support (80% of supply), enabling seamless and secure trading with immediate, transparent market valuation.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pools List */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-g/10 pb-4">
              <span className="font-display text-xs tracking-[2px] text-g uppercase">{t('Dostępne Pule Płynności', 'Available Liquidity Pools')}</span>
              <span className="font-mono text-[10px] text-white/40 uppercase">
                {t(`Łącznie pul: ${tokens.length}`, `Total pools: ${tokens.length}`)}
              </span>
            </div>

            {tokens.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-g/10 bg-[#04080f]/40">
                <RefreshCw className="w-8 h-8 text-g/30 animate-spin mx-auto mb-4" />
                <p className="text-xs text-white/40">{t('Ładowanie pul płynności...', 'Loading liquidity pools...')}</p>
              </div>
            ) : (
              tokens.map((tok: any) => {
                const pctLeft = (tok.remainingPool / tok.initialPool) * 100;
                const IconComponent = tok.iconType === "Flame" ? Flame : tok.iconType === "Hammer" ? Hammer : tok.iconType === "Sparkles" ? Sparkles : Coins;
                const isSelected = selectedTokenForTrade?.ticker === tok.ticker;

                return (
                  <div 
                    key={tok.ticker}
                    className={`border transition-all duration-300 p-5 bg-[#04080f]/75 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-[#000a06]/50 ${isSelected ? 'border-g shadow-[0_0_15px_rgba(0,255,136,0.15)]' : 'border-g/10'}`}
                  >
                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 bg-gradient-to-br ${tok.colorGradient} bg-clip-text text-transparent border border-g/20 rounded-none`}>
                          <IconComponent className="w-5 h-5 text-g" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-display text-sm text-white tracking-[1px] uppercase">{tok.name}</span>
                            <span className="font-mono text-xs text-g font-bold px-1.5 py-0.5 bg-g/5 border border-g/20">{tok.ticker}</span>
                          </div>
                          <p className="text-[10px] text-[#c8e6d2]/40 line-clamp-1 mt-0.5">{tok.description}</p>
                        </div>
                      </div>

                      {/* Liquidity Remaining Bar */}
                      <div className="mt-4">
                        <div className="flex justify-between text-[10px] tracking-[1px] mb-1.5">
                          <span className="text-white/40">{t('Pozostało w puli płynności AMM:', 'Remaining in AMM pool:')}</span>
                          <span className="text-g font-bold">
                            {tok.remainingPool.toLocaleString()} / {tok.initialPool.toLocaleString()} {tok.ticker} ({pctLeft.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="h-2.5 bg-white/5 border border-g/5 overflow-hidden p-[2px]">
                          <div 
                            className="h-full bg-gradient-to-r from-g to-cyan shadow-[0_0_8px_#00ff88] transition-all duration-500" 
                            style={{ width: `${pctLeft}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto border-t sm:border-t-0 border-g/10 pt-3 sm:pt-0">
                      <div className="text-left sm:text-right">
                        <div className="text-[10px] text-white/30 uppercase tracking-[1px]">{t('Cena rynkowa:', 'Market price:')}</div>
                        <div className="font-mono text-xs text-white font-bold mt-0.5">
                          {(tok.priceSol * solPrice).toFixed(4)} USD <span className="text-g">/ {tok.priceSol.toFixed(6)} SOL</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedTokenForTrade(tok);
                          setTradeSuccess(null);
                          setTradeError(null);
                        }}
                        className={`w-full sm:w-auto btn-neon text-xs px-4 py-2 interactive-cursor ${isSelected ? 'active' : ''}`}
                      >
                        <span className="c tl" /><span className="c tr" />
                        <span className="c bl" /><span className="c br" />
                        ⚡ {isSelected ? t('WYBRANY', 'SELECTED') : t('HANDLUJ', 'TRADE')}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* AMM Swap Interface */}
          <div className="border border-cyan/15 bg-[#00050e]/95 p-6 relative overflow-hidden flex flex-col justify-between">
            {/* Corner designs */}
            <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyan" />
            <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cyan" />
            <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cyan" />
            <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyan" />

            <div>
              <div className="flex items-center gap-2 border-b border-cyan/10 pb-4 mb-6">
                <ArrowDownUp className="w-5 h-5 text-cyan" />
                <span className="font-display text-sm tracking-[2px] text-cyan uppercase">{t('SWAP GIEŁDOWY AMM', 'AMM SWAP EXCHANGE')}</span>
              </div>

              {!selectedTokenForTrade ? (
                <div className="text-center py-16">
                  <Coins className="w-12 h-12 text-cyan/20 mx-auto mb-4 animate-pulse" />
                  <p className="text-xs text-[#c8e6d2]/50 mb-1 leading-relaxed">
                    {t('Wybierz token z pul płynności po lewej, aby rozpocząć natychmiastowy handel AMM.', 'Select a token from the liquidity pools on the left to start instant AMM trading.')}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  <div className="p-3 bg-cyan/5 border border-cyan/20">
                    <div className="text-[10px] text-cyan/60 uppercase tracking-[1px] mb-1">{t('Wybrany Token:', 'Selected Token:')}</div>
                    <div className="flex justify-between items-center">
                      <span className="font-display text-xs text-white font-bold">{selectedTokenForTrade.name}</span>
                      <span className="font-mono text-xs text-cyan bg-cyan/5 border border-cyan/30 px-2 py-0.5">{selectedTokenForTrade.ticker}</span>
                    </div>
                  </div>

                  {/* Buy/Sell Toggles */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 border border-white/10 rounded-none">
                    <button
                      type="button"
                      onClick={() => setTradeType('BUY')}
                      className={`py-2.5 text-xs font-display tracking-[1px] transition-all bg-transparent border-none cursor-pointer ${tradeType === 'BUY' ? 'bg-g text-black font-extrabold shadow-[0_0_10px_#00ff88]' : 'text-white/60 hover:text-white'}`}
                    >
                      {t('KUP', 'BUY')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTradeType('SELL')}
                      className={`py-2.5 text-xs font-display tracking-[1px] transition-all bg-transparent border-none cursor-pointer ${tradeType === 'SELL' ? 'bg-r text-white font-extrabold shadow-[0_0_10px_#ff1a4a]' : 'text-white/60 hover:text-white'}`}
                    >
                      {t('SPRZEDAJ', 'SELL')}
                    </button>
                  </div>

                  {/* Input Form */}
                  <div>
                    <label className="block text-[10px] text-white/40 uppercase tracking-[1px] mb-1.5">{t('Wpłać Ilość SOL:', 'Pay SOL Amount:')}</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0.01"
                        value={tradeAmount}
                        onChange={(e) => setTradeAmount(e.target.value)}
                        className="w-full bg-[#04080f]/90 border border-cyan/20 px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-cyan transition-colors"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono text-cyan font-bold">SOL</span>
                    </div>
                  </div>

                  {/* AMM estimation */}
                  <div className="p-3 bg-white/5 border border-white/5">
                    <div className="flex justify-between text-[10px] text-white/40 mb-1">
                      <span>{t('Szacowany odbiór:', 'Estimated payout:')}</span>
                      <span>{t('Wpływ na cenę:', 'Price impact:')}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="font-mono text-sm text-g font-bold">
                        {(() => {
                          const amt = parseFloat(tradeAmount);
                          if (isNaN(amt) || amt <= 0) return '0.00';
                          return (amt / selectedTokenForTrade.priceSol).toLocaleString(undefined, {maximumFractionDigits: 4});
                        })()}{' '}
                        {selectedTokenForTrade.ticker}
                      </span>
                      <span className="font-mono text-[10px] text-yellow-400">
                        {(() => {
                          const amt = parseFloat(tradeAmount);
                          if (isNaN(amt) || amt <= 0) return '0.00%';
                          const tokAmt = amt / selectedTokenForTrade.priceSol;
                          const impact = (tokAmt / selectedTokenForTrade.initialPool) * 100;
                          return `${impact.toFixed(3)}%`;
                        })()}
                      </span>
                    </div>
                  </div>

                  {tradeError && (
                    <div className="text-xs text-r bg-r/10 border border-r/20 p-3 leading-relaxed">
                      ❌ {tradeError}
                    </div>
                  )}

                  {tradeSuccess && (
                    <div className="text-xs text-g bg-g/10 border border-g/20 p-3 leading-relaxed">
                      ✅ {tradeSuccess}
                    </div>
                  )}

                  <button
                    onClick={() => handleExecuteTrade(selectedTokenForTrade.ticker)}
                    disabled={isTrading}
                    className="w-full btn-neon cyan text-xs py-4 text-center font-display tracking-[2px] mt-2 flex items-center justify-center gap-2 cursor-pointer bg-transparent border-none"
                  >
                    <span className="c tl" /><span className="c tr" />
                    <span className="c bl" /><span className="c br" />
                    {isTrading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-cyan" />
                        {t('PRZETWARZANIE SWAP...', 'PROCESSING SWAP...')}
                      </>
                    ) : (
                      t('ZATWIERDŹ SWAP (SOLANA)', 'CONFIRM SWAP (SOLANA)')
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="border-t border-cyan/10 pt-4 mt-6 text-center">
              <span className="text-[9px] tracking-[2px] text-white/30 uppercase">
                {t('NAPĘDZANE FORMUŁĄ STAŁEGO PRODUKTU AMM', 'POWERED BY CONSTANT PRODUCT AMM FORMULA')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ PROTOCOLS LIVE HUB (LIVE TRADING LEDGER & SMART ROUTER) ══ */}
      <section className="relative z-[5] py-12 px-6 md:px-12 max-w-7xl mx-auto border-t border-g/10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 text-[10px] tracking-[5px] text-g/50 uppercase mb-4">
            <span className="w-6 h-[1px] bg-g shadow-[0_0_6px_#00ff88]" /> {t('KONSOLA MONITORINGU TRANSAKCJI', 'REAL-TIME TRANSACTION CONSOLE')}
          </div>
          <h2 className="font-display text-3xl md:text-5xl tracking-[2px] text-white uppercase">
            {t('OSTATNIE TRANSAKCJE AMM', 'RECENT AMM SWAPS')}
          </h2>
        </div>
        <div className="max-w-4xl mx-auto">
          <MempoolStream />
        </div>
      </section>
    </div>
  );
}
