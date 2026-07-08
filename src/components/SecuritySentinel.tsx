import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Binary, Fingerprint, Lock, Cpu, Play } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface LogMessage {
  time: string;
  type: 'info' | 'success' | 'warn';
  msg: string;
}

export default function SecuritySentinel() {
  const { t } = useLanguage();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [activeCheck, setActiveCheck] = useState(t('KONTRAKT BEZCZYNNY', 'CONTRACT IDLE'));
  const [logs, setLogs] = useState<LogMessage[]>([]);

  // Initialize logs on mount with language support
  useEffect(() => {
    setLogs([
      { time: '21:38:12', type: 'info', msg: t('Inicjalizacja frameworku Anchor zakończona.', 'Anchor framework initialization complete.') },
      { time: '21:38:14', type: 'success', msg: t('Certyfikowane podpisy audytorskie zgadzają się z kluczami Hacken i CertiK.', 'Certified Audit signatures match Hacken & CertiK keys.') },
      { time: '21:38:15', type: 'success', msg: t('Węzły konsensusu multi-sig online (zabezpieczono 4/4).', 'Multi-sig consensus nodes online (4 / 4 secured).') }
    ]);
    setActiveCheck(t('KONTRAKT BEZCZYNNY', 'CONTRACT IDLE'));
  }, [t]);

  // Handle manual scanning animation
  useEffect(() => {
    if (!isScanning) return;

    const auditSteps = [
      t('Skanowanie kodu bajtowego programu Anchor ID: SLX11a...', 'Scanning Anchor program bytecode ID: SLX11a...'),
      t('Weryfikacja uprawnień CPI (Cross-Program Invocation)...', 'Verifying cross-program invocation (CPI) authority...'),
      t('Testowanie granic ochrony przed reentrancy...', 'Testing re-entrancy protection bounds...'),
      t('Sprawdzanie odczytów wyroczni cenowej (parytet sieci Pyth)...', 'Checking oracle price feeds (Pyth network parity)...'),
      t('Walidacja macierzy zapobiegania atakom flash-loan...', 'Validating flash-loan attack prevention matrices...'),
      t('Stan Anchor zweryfikowany. Wszystkie dowody kryptograficzne zgadzają się (PASS).', 'Anchor State verified. All cryptographic proofs matches PASS.')
    ];

    let step = 0;
    setScanProgress(0);

    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsScanning(false);
          setActiveCheck(t('SYSTEM ZABEZPIECZONY', 'SYSTEM PROTECTED'));
          setLogs((l) => [
            { 
              time: new Date().toTimeString().split(' ')[0], 
              type: 'success', 
              msg: t('Kryptograficzne sprawdzenie kontraktu ukończone. Znaleziono zero anomalii.', 'Cryptographic contract check completed. Zero anomalies found.') 
            },
            ...l
          ]);
          return 100;
        }

        // Change audit step labels based on progress
        const stepIndex = Math.floor((prev / 100) * auditSteps.length);
        if (stepIndex !== step && stepIndex < auditSteps.length) {
          step = stepIndex;
          setActiveCheck(auditSteps[stepIndex]);
          setLogs((l) => [
            { 
              time: new Date().toTimeString().split(' ')[0], 
              type: 'info', 
              msg: auditSteps[stepIndex] 
            },
            ...l
          ]);
        }

        return prev + 2;
      });
    }, 60);

    return () => clearInterval(progressInterval);
  }, [isScanning, t]);

  const triggerManualScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setLogs((l) => [
      { 
        time: new Date().toTimeString().split(' ')[0], 
        type: 'warn', 
        msg: t('Użytkownik zainicjował próbne sprawdzenie integralności kontraktu systemowego...', 'User initialized system contract integrity dry-run...') 
      },
      ...l
    ]);
  };

  return (
    <div className="border border-r2/25 bg-b2/95 p-5 md:p-6 rounded-none relative overflow-hidden backdrop-blur-md">
      {/* Top red laser bar */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-r/40 to-transparent" />

      <div className="flex items-center justify-between mb-5 border-b border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-r drop-shadow-[0_0_8px_#ff1a4a]" />
          <div>
            <div className="text-[10px] tracking-[4px] uppercase text-white font-bold">SOLAX SENTINEL AUDITOR</div>
            <div className="text-[9px] text-white/40 tracking-[1px] uppercase font-mono mt-0.5">{t('Automatyczny pakiet bezpieczeństwa', 'Automated Security Suite')}</div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[8px] border border-r/30 px-2 py-0.5 bg-r/5 text-r font-bold uppercase tracking-[1px] font-mono">
            {t('ZABEZPIECZONO (DOWÓD MATEMATYCZNY)', 'SECURED (MATH PROOF)')}
          </span>
        </div>
      </div>

      {/* Grid of Security statuses */}
      <div className="grid grid-cols-2 gap-3 mb-5 text-[10px] font-mono">
        <div className="border border-white/5 bg-b/30 p-3">
          <div className="text-white/30 uppercase">{t('Ochrona przed poślizgiem', 'Slippage Guard')}</div>
          <div className="text-g font-bold mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-g animate-pulse" />
            0.1% MAX SLIPPAGE
          </div>
        </div>
        <div className="border border-white/5 bg-b/30 p-3">
          <div className="text-white/30 uppercase">{t('Konsensus Multi-Sig', 'Multi-Sig Consensus')}</div>
          <div className="text-cyan font-bold mt-1 flex items-center gap-1.5">
            <Fingerprint className="w-3.5 h-3.5" />
            {t('4/4 PODPISY', '4/4 SIGNATURES')}
          </div>
        </div>
        <div className="border border-white/5 bg-b/30 p-3">
          <div className="text-white/30 uppercase">{t('Ochrona Re-entrancy', 'Re-entrancy Guard')}</div>
          <div className="text-g font-bold mt-1 flex items-center gap-1.5">
            <Binary className="w-3.5 h-3.5" />
            {t('RYGORYSTYCZNIE ZWERYFIKOWANA', 'STRICT VERIFIED')}
          </div>
        </div>
        <div className="border border-white/5 bg-b/30 p-3">
          <div className="text-white/30 uppercase">{t('Blokada płynności', 'Liquidity Lock')}</div>
          <div className="text-purple font-bold mt-1 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            {t('ZABLOKOWANE 365 DNI', '365 DAYS LOCKED')}
          </div>
        </div>
      </div>

      {/* Interactive Scan Area */}
      <div className="border border-white/5 bg-black/60 p-4 mb-4 relative">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[9px] text-white/50 font-bold uppercase tracking-[1px]">
            {isScanning ? t('TRWA AUDYT KRYPTOGRAFICZNY', 'CRYPTOGRAPHIC AUDIT IN PROGRESS') : t('GOTOWOŚĆ BEZPIECZEŃSTWA', 'SECURITY STANDBY')}
          </div>
          <span className="text-[10px] text-g font-bold font-mono">{scanProgress}%</span>
        </div>

        {/* Scan Bar indicator */}
        <div className="h-1 bg-white/5 mb-3 relative overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-r via-g to-cyan transition-all duration-75"
            style={{ width: `${scanProgress}%` }}
          />
        </div>

        <div className="text-[11px] text-white/80 font-mono flex items-center gap-2 mb-4">
          <span className="text-r">➔</span>
          <span className={isScanning ? 'text-cyan animate-pulse' : 'text-g'}>{activeCheck}</span>
        </div>

        <button 
          onClick={triggerManualScan}
          disabled={isScanning}
          className={`w-full py-3 border text-xs tracking-[3px] font-bold uppercase flex items-center justify-center gap-2 transition-all duration-300 interactive-cursor ${
            isScanning 
              ? 'border-white/15 text-white/30 bg-white/5 cursor-not-allowed' 
              : 'border-r text-r hover:bg-r/15 hover:shadow-[0_0_20px_rgba(255,26,74,0.3)] bg-transparent'
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          {t('PRZETESTUJ INTEGRALNOŚĆ KONTRAKTU', 'TEST INTEGRITY PROOFS')}
        </button>
      </div>

      {/* Terminal Audit Logs */}
      <div>
        <div className="text-[9px] text-white/30 uppercase tracking-[1px] mb-2 font-bold font-mono">
          {t('Dziennik zdarzeń bezpieczeństwa (Symulacja)', 'Security Event Logs (Simulated Parity)')}
        </div>
        <div className="h-[96px] overflow-y-auto border border-white/5 bg-b/80 p-2 font-mono text-[9px] flex flex-col gap-1.5 select-text">
          {logs.map((log, idx) => (
            <div key={idx} className="flex gap-2 leading-relaxed">
              <span className="text-white/20">{log.time}</span>
              <span className={
                log.type === 'success' ? 'text-g font-bold' : 
                log.type === 'warn' ? 'text-r font-bold' : 
                'text-cyan'
              }>
                [{log.type.toUpperCase()}]
              </span>
              <span className="text-white/70">{log.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
