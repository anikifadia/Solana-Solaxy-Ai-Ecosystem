import React, { useState } from 'react';
import { Coins, Clock, Wallet, ExternalLink, CheckCircle2, User, Search, RefreshCw, Sparkles } from 'lucide-react';
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

export interface Withdrawal {
  id: string;
  username: string;
  amount: number;
  timestamp: string;
  wallet: string;
  status: string;
}

interface MiningLedgerProps {
  withdrawals: Withdrawal[];
  onRefresh?: () => void;
  currentUser?: string | null;
  isLoading?: boolean;
}

export const MiningLedger: React.FC<MiningLedgerProps> = ({
  withdrawals,
  onRefresh,
  currentUser,
  isLoading = false
}) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter withdrawals based on search term
  const filteredWithdrawals = withdrawals.filter(w => 
    w.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.wallet.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Take the last 10 for display (the API already unshifts new ones to the top)
  const displayedWithdrawals = filteredWithdrawals.slice(0, 10);

  // Stats calculations
  const totalWithdrawnRecent = withdrawals.reduce((sum, w) => sum + w.amount, 0);
  const userWithdrawalsCount = withdrawals.filter(w => w.username === currentUser).length;
  const userTotalWithdrawn = withdrawals
    .filter(w => w.username === currentUser)
    .reduce((sum, w) => sum + w.amount, 0);

  return (
    <div id="mining-ledger-root" className="border border-white/10 bg-black/60 p-4 font-mono relative overflow-hidden rounded">
      {/* Visual background details */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan/5 rounded-full filter blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-g/5 rounded-full filter blur-2xl pointer-events-none" />

      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] tracking-[3px] text-g font-bold uppercase">
            <Sparkles className="w-3.5 h-3.5 text-g animate-pulse" />
            SOLAXY LEDGER MATRIX
          </div>
          <h4 className="font-display text-lg tracking-[1px] text-white uppercase mt-1">
            {t('Księga Wypłat Wydobytych Tokenów $SLX', 'Mined $SLX Tokens Withdrawal Ledger')}
          </h4>
        </div>

        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-1.5 border border-white/10 hover:border-cyan/50 hover:bg-cyan/10 text-white/60 hover:text-cyan transition-all duration-300 rounded cursor-pointer"
              title={t('Odśwież księgę', 'Refresh ledger')}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan' : ''}`} />
            </button>
          )}
          <span className="text-[10px] bg-cyan/10 border border-cyan/20 text-cyan px-2 py-1 rounded">
            {t('WPISY LIVE: 10 NAJNOWSZYCH', 'LIVE ENTRIES: 10 LATEST')}
          </span>
        </div>
      </div>

      {/* Grid for Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-xs">
        <div className="bg-black/40 border border-white/5 p-2.5 rounded">
          <div className="text-[9px] text-white/40 uppercase">{t('Suma ostatnich wypłat', 'Sum of recent withdrawals')}</div>
          <div className="text-base font-bold text-g mt-1">
            {totalWithdrawnRecent.toFixed(2)} <span className="text-[10px] text-white/50 font-mono">$SLX</span>
          </div>
        </div>

        <div className="bg-black/40 border border-white/5 p-2.5 rounded">
          <div className="text-[9px] text-white/40 uppercase">{t('Twoje transakcje wypłat', 'Your withdrawal transactions')}</div>
          <div className="text-base font-bold text-cyan mt-1">
            {userWithdrawalsCount} <span className="text-[10px] text-white/50 font-mono">TXs</span>
          </div>
        </div>

        <div className="bg-black/40 border border-white/5 p-2.5 rounded">
          <div className="text-[9px] text-white/40 uppercase">{t('Suma Twoich wypłat', 'Sum of your withdrawals')}</div>
          <div className="text-base font-bold text-cyan mt-1">
            {userTotalWithdrawn.toFixed(4)} <span className="text-[10px] text-white/50 font-mono">$SLX</span>
          </div>
        </div>
      </div>

      {/* Search Input bar */}
      <div className="flex items-center bg-black/50 border border-white/10 px-2.5 py-1.5 mb-4 rounded">
        <Search className="w-3.5 h-3.5 text-white/40 mr-2 shrink-0" />
        <input
          type="text"
          placeholder={t('Filtruj księgę po nazwie kopacza, tx lub portfelu...', 'Filter ledger by miner name, tx, or wallet...')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent text-white font-mono text-xs focus:outline-none placeholder-white/20"
        />
      </div>

      {/* Ledger Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr className="text-white/40 text-[9px] uppercase border-b border-white/10">
              <th className="py-2 px-1">{t('ID Transakcji', 'Transaction ID')}</th>
              <th className="py-2 px-1">{t('Górnik / Węzeł', 'Miner / Node')}</th>
              <th className="py-2 px-1">{t('Adres Portfela Solana', 'Solana Wallet Address')}</th>
              <th className="py-2 px-1 text-right">{t('Wypłacono', 'Withdrawn')}</th>
              <th className="py-2 px-1">{t('Sygnatura Czasowa', 'Timestamp')}</th>
              <th className="py-2 px-1 text-center">{t('Status', 'Status')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {displayedWithdrawals.length > 0 ? (
              displayedWithdrawals.map((w) => {
                const isMyWithdrawal = currentUser && w.username === currentUser;
                return (
                  <tr 
                    key={w.id} 
                    className={`transition-colors duration-200 ${
                      isMyWithdrawal 
                        ? 'bg-cyan/5 text-cyan hover:bg-cyan/10' 
                        : 'hover:bg-white/5 text-white/80'
                    }`}
                  >
                    <td className="py-2 px-1 font-bold text-[10px] text-white/50 tracking-wide flex items-center gap-1">
                      <span className="text-cyan font-semibold">{w.id}</span>
                      <ExternalLink className="w-2.5 h-2.5 text-white/20 cursor-pointer hover:text-cyan" />
                    </td>
                    <td className="py-2 px-1">
                      <div className="flex items-center gap-1.5 max-w-[125px] truncate">
                        {/* Dynamic Sliced Mascot Avatar */}
                        <div 
                          className="w-6 h-6 border border-cyan/40 bg-black relative flex-shrink-0 flex items-center justify-center p-0.5 rounded overflow-hidden"
                          title={`Mascot Chibi Avatar`}
                        >
                          <SlicedAsset
                            asset={CHIBI_AVATARS[Math.abs(w.username.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)) % CHIBI_AVATARS.length]}
                            className="w-full h-full"
                          />
                        </div>
                        <span className="font-bold">{w.username}</span>
                        {isMyWithdrawal && (
                          <span className="text-[7px] bg-cyan/20 border border-cyan/30 text-cyan px-1 py-0.2 rounded font-sans shrink-0 uppercase">
                            {t('Ty', 'You')}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-1 text-white/40 font-mono tracking-wide text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <Wallet className="w-3 h-3 text-white/30 shrink-0" />
                        <span>{w.wallet}</span>
                      </div>
                    </td>
                    <td className="py-2 px-1 text-right font-bold text-shadow-[0_0_6px_rgba(0,255,136,0.2)] text-g">
                      {w.amount.toFixed(4)} $SLX
                    </td>
                    <td className="py-2 px-1 text-white/40 text-[10px]">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-white/20 shrink-0" />
                        <span>{w.timestamp}</span>
                      </div>
                    </td>
                    <td className="py-2 px-1 text-center">
                      <div className="inline-flex items-center gap-1 text-[9px] bg-g/10 text-g px-1.5 py-0.5 rounded border border-g/10">
                        <CheckCircle2 className="w-2.5 h-2.5 text-g" />
                        <span>{w.status === 'ZAKOŃCZONE' ? t('ZAKOŃCZONE', 'COMPLETED') : w.status}</span>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-6 text-center text-white/30 italic">
                  {isLoading ? t('Ładowanie transakcji wypłat...', 'Loading withdrawal transactions...') : t('Brak pasujących transakcji wypłaty w bazie danych.', 'No matching withdrawal transactions in the database.')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Explanatory footer */}
      <div className="mt-3 pt-3 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-[9px] text-white/30">
        <div>
          {t('* Wszystkie wypłaty są automatycznie weryfikowane przez inteligentną sieć górniczą Solaxy.', '* All withdrawals are automatically verified by the Solaxy smart mining network.')}
        </div>
        <div className="mt-1 sm:mt-0 flex items-center gap-1 text-cyan font-bold uppercase">
          <Coins className="w-3 h-3 text-cyan" />
          {t('Moc zabezpieczeń: 100% On-Chain', 'Security strength: 100% On-Chain')}
        </div>
      </div>
    </div>
  );
};

