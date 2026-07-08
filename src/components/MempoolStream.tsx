import React, { useEffect, useState, useRef } from 'react';
import { RefreshCw, CheckCircle2, ArrowRightLeft, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import SlicedAsset, { SlicedAssetKey } from './SlicedAsset';

const CHIBI_AVATARS: SlicedAssetKey[] = [
  'chibi-wave',
  'chibi-confused',
  'chibi-swirl',
  'chibi-tablet',
  'chibi-heart',
  'chibi-idea',
  'chibi-shades',
  'chibi-laptop'
];

interface Transaction {
  id: string;
  hash: string;
  fromToken: string;
  fromAmount: number;
  toToken: string;
  toAmount: number;
  timeMs: number;
  feeSol: number;
  status: 'confirmed' | 'pending';
}

const TOKENS = ['SOL', 'USDC', 'SLX', 'JUP', 'RAY', 'JTO', 'BONK', 'WIF', 'PYTH'];

export default function MempoolStream() {
  const { t } = useLanguage();
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [blockHeight, setBlockHeight] = useState(301482912);
  const [activeValidators, setActiveValidators] = useState(1842);
  const [avgConfirmTime, setAvgConfirmTime] = useState(384);
  const [isLive, setIsLive] = useState(true);

  // Helper to generate a random transaction
  const generateRandomTx = (): Transaction => {
    const fromToken = TOKENS[Math.floor(Math.random() * TOKENS.length)];
    let toToken = TOKENS[Math.floor(Math.random() * TOKENS.length)];
    while (toToken === fromToken) {
      toToken = TOKENS[Math.floor(Math.random() * TOKENS.length)];
    }

    const hash = '3' + Array.from({ length: 32 }, () => 
      '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'[Math.floor(Math.random() * 58)]
    ).join('').slice(0, 8) + '...' + Array.from({ length: 8 }, () => 
      '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'[Math.floor(Math.random() * 58)]
    ).join('');

    const fromAmount = fromToken === 'BONK' 
      ? Math.floor(Math.random() * 10000000) + 500000
      : fromToken === 'SLX' 
      ? Math.floor(Math.random() * 10000) + 150
      : Number((Math.random() * 120 + 0.1).toFixed(fromToken === 'SOL' ? 3 : 2));

    const rate = fromToken === 'BONK' ? 0.00003 : fromToken === 'SLX' ? 0.048 : fromToken === 'SOL' ? 182 : 1;
    const destRate = toToken === 'BONK' ? 0.00003 : toToken === 'SLX' ? 0.048 : toToken === 'SOL' ? 182 : 1;
    const toAmount = Number(((fromAmount * rate) / destRate).toFixed(toToken === 'SOL' ? 3 : toToken === 'BONK' ? 0 : 2));

    return {
      id: Math.random().toString(36).slice(2, 9),
      hash,
      fromToken,
      fromAmount,
      toToken,
      toAmount: toAmount || 0.01,
      timeMs: Math.floor(Math.random() * 90) + 340, // 340ms to 430ms
      feeSol: Number((Math.random() * 0.00008 + 0.00003).toFixed(6)),
      status: 'confirmed',
    };
  };

  // Seed initial list
  useEffect(() => {
    const initialList = Array.from({ length: 5 }, () => generateRandomTx());
    setTxs(initialList);
  }, []);

  // Live streaming effect
  useEffect(() => {
    if (!isLive) return;

    const txInterval = setInterval(() => {
      setTxs((prev) => {
        const next = [generateRandomTx(), ...prev];
        return next.slice(0, 6); // Keep top 6 items
      });

      // Update block height
      setBlockHeight((h) => h + Math.floor(Math.random() * 2) + 1);
      
      // Small variations in validators & confirmation speed
      if (Math.random() < 0.25) {
        setActiveValidators((v) => v + (Math.random() < 0.5 ? 1 : -1));
      }
      if (Math.random() < 0.3) {
        setAvgConfirmTime((t) => Math.max(340, Math.min(440, t + Math.floor((Math.random() - 0.5) * 8))));
      }
    }, 1200 + Math.random() * 1000);

    return () => clearInterval(txInterval);
  }, [isLive]);

  return (
    <div className="border border-g/15 bg-b2/90 p-5 md:p-6 rounded-none relative overflow-hidden backdrop-blur-md">
      {/* Laser line scanner decoration */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-g/30 to-transparent animate-pulse" />
      
      {/* Top Ledger Metadata HUD */}
      <div className="grid grid-cols-3 gap-2 border-b border-g/10 pb-4 mb-4 text-[9px] md:text-xs">
        <div>
          <div className="text-white/30 tracking-[1px] uppercase">{t('Blok Solana', 'Solana Block')}</div>
          <div className="text-g font-bold font-mono tracking-[1px] mt-0.5">
            #{blockHeight.toLocaleString()}
          </div>
        </div>
        <div className="border-x border-g/10 px-3">
          <div className="text-white/30 tracking-[1px] uppercase">{t('Aktywne węzły RPC', 'Active RPC Nodes')}</div>
          <div className="text-cyan font-bold font-mono tracking-[1px] mt-0.5">
            {activeValidators} ONLINE
          </div>
        </div>
        <div className="pl-2">
          <div className="text-white/30 tracking-[1px] uppercase">{t('Śr. czas bloku', 'Avg Block Time')}</div>
          <div className="text-g2 font-bold font-mono tracking-[1px] mt-0.5">
            {avgConfirmTime}ms
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-g animate-ping" />
          <span className="text-[10px] tracking-[4px] uppercase text-white font-bold">SOLAX LIVE LEDGER</span>
        </div>
        <button 
          onClick={() => setIsLive(!isLive)}
          className="text-[9px] tracking-[2px] uppercase text-g/40 hover:text-g transition-colors flex items-center gap-1.5 border border-g/15 px-2 py-0.5 bg-g/5 interactive-cursor"
        >
          <RefreshCw className={`w-2.5 h-2.5 ${isLive ? 'animate-spin' : ''}`} />
          {isLive ? t('ZAMRÓŹ', 'FREEZE') : t('WZNÓW', 'RESUME')}
        </button>
      </div>

      {/* Transaction List */}
      <div className="flex flex-col gap-2 relative min-h-[300px]">
        {txs.map((tx) => (
          <div 
            key={tx.id}
            className="border border-g/5 bg-b/40 p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 relative overflow-hidden group hover:bg-g/5 hover:border-g/20 transition-all duration-200 animate-fadeIn"
          >
            {/* Left Column: TX Info & Route */}
            <div className="flex items-center gap-3">
              {/* Dynamic Sliced Mascot Avatar */}
              <div 
                className="w-10 h-10 border border-g/20 bg-black/60 relative flex-shrink-0 flex items-center justify-center p-0.5 rounded overflow-hidden"
                title={`Mascot Chibi Avatar`}
              >
                <SlicedAsset
                  asset={CHIBI_AVATARS[tx.id.charCodeAt(0) % CHIBI_AVATARS.length]}
                  className="w-full h-full"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] md:text-xs text-white font-bold">
                    {tx.fromAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} {tx.fromToken}
                  </span>
                  <span className="text-[9px] text-white/40">➔</span>
                  <span className="text-[10px] md:text-xs text-g font-bold">
                    {tx.toAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} {tx.toToken}
                  </span>
                </div>
                <div className="text-[9px] text-white/30 font-mono mt-0.5">
                  TX: <span className="text-white/50">{tx.hash}</span>
                </div>
              </div>
            </div>

            {/* Right Column: confirmation metadata */}
            <div className="flex items-center justify-between md:justify-end gap-4 border-t border-white/5 md:border-0 pt-2 md:pt-0">
              <div className="text-right">
                <div className="text-[9px] text-white/30 font-mono uppercase">{t('Szybkość potw.', 'Confirm speed')}</div>
                <div className="text-[10px] text-cyan font-bold font-mono mt-0.5">{tx.timeMs}ms</div>
              </div>
              <div className="text-right">
                <div className="text-[9px] text-white/30 font-mono uppercase">{t('Opłata sieciowa', 'Network fee')}</div>
                <div className="text-[10px] text-white/60 font-mono mt-0.5">{tx.feeSol} SOL</div>
              </div>
              <div className="flex items-center gap-1 border border-g/20 bg-g/5 px-2 py-1 text-g text-[9px] font-bold tracking-[1px] uppercase">
                <CheckCircle2 className="w-3 h-3 text-g" />
                {t('ZABEZPIECZONO', 'SECURED')}
              </div>
            </div>
            
            {/* Confirmed Glow pulse */}
            <div className="absolute inset-y-0 left-0 w-[2px] bg-g shadow-[0_0_8px_#00ff88]" />
          </div>
        ))}
      </div>
    </div>
  );
}
