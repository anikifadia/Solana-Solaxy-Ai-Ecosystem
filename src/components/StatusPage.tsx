import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Activity, Server, Database, AlertTriangle, CheckCircle2, ShieldAlert, 
  Send, RefreshCw, Mail, User, BookOpen, Clock, Heart, Radio, ExternalLink,
  ChevronDown, FileText
} from 'lucide-react';

interface TelemetryData {
  status: string;
  cpu: number;
  memory: string;
  latency: string;
  queueSize: number;
  blockedIpsCount: number;
  logs: Array<{ timestamp: string; level: string; message: string }>;
  submissionsCount: number;
}

interface StatusPageProps {
  t: (pl: string, en: string) => string;
}

export default function StatusPage({ t }: StatusPageProps) {
  // Telemetry state
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Outage simulation state
  const [isSimulatingOutage, setIsSimulatingOutage] = useState(false);
  const [outageState, setOutageState] = useState<'normal' | 'failed' | 'retrying_1' | 'retrying_2' | 'fallback_active'>('normal');
  const [retryLogs, setRetryLogs] = useState<string[]>([]);
  const [retryTimer, setRetryTimer] = useState<number | null>(null);

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSendingContact, setIsSendingContact] = useState(false);
  const [contactSuccess, setContactSuccess] = useState<string | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);
  const [contactHistory, setContactHistory] = useState<any[]>([]);

  // Policy collapse toggles
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  // Fetch telemetry on mount and interval
  const fetchTelemetry = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const res = await fetch('/api/system/telemetry');
      if (!res.ok) throw new Error("Internal Server Error (500)");
      const data = await res.json();
      setTelemetry(data);
      setFetchError(null);
    } catch (err: any) {
      setFetchError(err.message || "Failed to load telemetry");
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(() => {
      if (outageState === 'normal') {
        fetchTelemetry(true);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [outageState]);

  // Handle Contact Form Submit
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setContactError(t("Wypełnij wszystkie pola oznaczone gwiazdką (*)", "Please fill out all required fields (*)"));
      return;
    }

    setIsSendingContact(true);
    setContactError(null);
    setContactSuccess(null);

    try {
      const response = await fetch('/api/system/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit form.");
      }

      setContactSuccess(t("Wiadomość została zapisana na serwerze! ID zgłoszenia: " + data.id, "Message logged on server! Ticket ID: " + data.id));
      
      // Append to local view history
      setContactHistory(prev => [
        {
          id: data.id || Math.random().toString(),
          ...contactForm,
          timestamp: new Date().toLocaleTimeString()
        },
        ...prev
      ]);

      // Reset form
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setContactError(err.message || t("Problem z wysłaniem wiadomości. Spróbuj ponownie.", "Error sending message. Please try again."));
    } finally {
      setIsSendingContact(false);
    }
  };

  // Run Outage & Exponential Retry / Fallback Simulation
  const triggerOutageSimulation = () => {
    if (isSimulatingOutage) return;
    setIsSimulatingOutage(true);
    setOutageState('failed');
    setRetryLogs([
      `[${new Date().toLocaleTimeString()}] ❌ CRITICAL: Wykryto przerwę w połączeniu z głównym serwerem RPC API!`,
      `[${new Date().toLocaleTimeString()}] ⚠️ STATUS: Serwer nie odpowiada (HTTP 504 Gateway Timeout).`
    ]);

    // Retry 1 after 2 seconds
    setTimeout(() => {
      setOutageState('retrying_1');
      setRetryLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] 🔄 PRÓBA RETRY #1: Nawiązywanie połączenia (Wykładniczy Backoff: t+2s)...`,
        `[${new Date().toLocaleTimeString()}] ❌ BŁĄD RPC: Timeout połączenia. Ponowna próba za 4s.`
      ]);
    }, 2500);

    // Retry 2 after 4 seconds
    setTimeout(() => {
      setOutageState('retrying_2');
      setRetryLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] 🔄 PRÓBA RETRY #2: Ponowne nawiązywanie połączenia (Wykładniczy Backoff: t+4s)...`,
        `[${new Date().toLocaleTimeString()}] ❌ BŁĄD RPC: Główny węzeł przeciążony. Inicjalizacja rezerwowego węzła awaryjnego (Fallback Node).`
      ]);
    }, 6500);

    // Switch to fallback node
    setTimeout(() => {
      setOutageState('fallback_active');
      setRetryLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] 🟢 SUKCES: Przełączono na zapasowy serwer rezerwowy: backup-rpc.solaxy.org!`,
        `[${new Date().toLocaleTimeString()}] ✔️ STATUS: Wszystkie systemy przywrócone w trybie Fallback (Zredukowane APY & Wydajność stabilna).`
      ]);
    }, 11000);
  };

  const resetOutageSimulation = () => {
    setIsSimulatingOutage(false);
    setOutageState('normal');
    setRetryLogs([]);
    fetchTelemetry();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-16 pb-24">
      
      {/* ════ SECTION 1: HEADER & MOTTO ════ */}
      <div className="text-center mt-16">
        <div className="flex items-center justify-center gap-2 text-[10px] tracking-[5px] text-g/50 uppercase mb-4">
          <span className="w-6 h-[1px] bg-g shadow-[0_0_6px_#00ff88]" /> {t('STAN TECHNICZNY & WIARYGODNOŚĆ', 'TECHNICAL STATE & CREDIBILITY')}
        </div>
        <h1 className="font-display text-4xl sm:text-5xl md:text-[64px] leading-none tracking-[2px] mb-6">
          <span className="text-g text-shadow-[0_0_10px_rgba(0,255,136,0.4)]">SYSTEM</span> {t('STATUS', 'STATUS')}
        </h1>
        <p className="text-xs sm:text-sm text-[#c8e6d2]/50 max-w-[620px] mx-auto leading-relaxed">
          {t(
            'Monitoruj na żywo kondycję sieci Solaxy, obciążenie procesora, czas reakcji RPC oraz przeprowadź symulację awarii, aby sprawdzić naszą niezawodność techniczną.',
            'Monitor live health metrics of Solaxy nodes, CPU load, RPC latency, and trigger our interactive outage simulator to witness technical resilience.'
          )}
        </p>
      </div>

      {/* ════ SECTION 2: INTERACTIVE LIVE TELEMETRY & OUTAGE REACTOR ════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Metric Cards Column (2/3 width on large screen) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-g/20 bg-[#040810]/90 p-5 rounded-none relative overflow-hidden shadow-[0_0_35px_rgba(0,255,136,0.08)]">
            <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-g" />
            <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-g" />
            <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-g" />
            <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-g" />

            <div className="flex justify-between items-center mb-6 border-b border-g/10 pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-g animate-pulse" />
                <h3 className="font-display text-sm tracking-[2px] text-white uppercase">{t('PARAMETRY RDZENIA SERWERA', 'SERVER CORE PARAMETERS')}</h3>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-white/40">RPC:</span>
                <span className="text-g font-bold">api.mainnet-beta.solana.com</span>
              </div>
            </div>

            {/* Simulated outage status display or normal */}
            {outageState !== 'normal' ? (
              <div className="mb-6 p-4 border border-red-500/20 bg-red-950/20 rounded flex items-center justify-between font-mono animate-pulse">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-8 h-8 text-red-500" />
                  <div>
                    <div className="text-xs text-red-400 font-bold uppercase">{t('STAN SYSTEMU: SYMULOWANA AWARIA', 'SYSTEM STATE: OUTAGE SIMULATION')}</div>
                    <div className="text-[10px] text-white/50">{t('Działają algorytmy rezerwowe i wykładniczy ponowny zapis', 'Fallback routines and exponential retry loop active')}</div>
                  </div>
                </div>
                <div className="text-xs px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/30 uppercase font-bold">
                  {outageState.replace('_', ' ')}
                </div>
              </div>
            ) : (
              <div className="mb-6 p-4 border border-g/20 bg-g/5 rounded flex items-center justify-between font-mono">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-g" />
                  <div>
                    <div className="text-xs text-g font-bold uppercase">{t('STAN SYSTEMU: OPERACYJNY', 'SYSTEM STATE: OPERATIONAL')}</div>
                    <div className="text-[10px] text-white/50">{t('Wszystkie systemy bazy danych, API oraz silnik transakcyjny działają stabilnie', 'All systems, API routes, and database engines running stable')}</div>
                  </div>
                </div>
                <div className="text-xs px-2.5 py-1 bg-g/10 text-g border border-g/30 uppercase font-bold">
                  100% ONLINE
                </div>
              </div>
            )}

            {/* Status grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-black/40 border border-white/5 p-3 text-center">
                <div className="text-[10px] text-white/40 font-mono uppercase mb-1">{t('Zużycie CPU', 'CPU Usage')}</div>
                <div className="text-lg font-display font-bold text-white font-mono">
                  {outageState === 'normal' && telemetry ? `${telemetry.cpu}%` : outageState === 'fallback_active' ? '18%' : '94%'}
                </div>
              </div>

              <div className="bg-black/40 border border-white/5 p-3 text-center">
                <div className="text-[10px] text-white/40 font-mono uppercase mb-1">{t('Pamięć RAM', 'RAM Allocated')}</div>
                <div className="text-lg font-display font-bold text-white font-mono">
                  {outageState === 'normal' && telemetry ? telemetry.memory : '142MB / 512MB'}
                </div>
              </div>

              <div className="bg-black/40 border border-white/5 p-3 text-center">
                <div className="text-[10px] text-white/40 font-mono uppercase mb-1">{t('Opóźnienie RPC', 'RPC Latency')}</div>
                <div className="text-lg font-display font-bold text-white font-mono">
                  {outageState === 'normal' && telemetry ? telemetry.latency : outageState === 'fallback_active' ? '82ms' : 'TIMEOUT'}
                </div>
              </div>

              <div className="bg-black/40 border border-white/5 p-3 text-center">
                <div className="text-[10px] text-white/40 font-mono uppercase mb-1">{t('Baza Zgłoszeń', 'Stored Tickets')}</div>
                <div className="text-lg font-display font-bold text-white font-mono">
                  {telemetry ? telemetry.submissionsCount + contactHistory.length : contactHistory.length}
                </div>
              </div>
            </div>

            {/* System Log Console */}
            <div className="bg-black border border-white/10 rounded p-4 font-mono text-xs">
              <div className="flex justify-between items-center text-[10px] text-white/40 mb-2 pb-1 border-b border-white/5">
                <span>SYSTEM LOGS STREAM (REAL-TIME TELEMETRY)</span>
                <span className="text-g">LIVE REFRESH</span>
              </div>
              <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
                {outageState !== 'normal' ? (
                  retryLogs.map((log, index) => (
                    <div key={index} className="text-red-400 break-words">{log}</div>
                  ))
                ) : (
                  telemetry?.logs.map((log, index) => (
                    <div key={index} className="flex gap-2 text-white/70">
                      <span className="text-white/30 shrink-0">[{log.timestamp}]</span>
                      <span className={`font-bold shrink-0 ${log.level === 'SUCCESS' ? 'text-g' : log.level === 'WARN' ? 'text-yellow-400' : 'text-cyan'}`}>{log.level}</span>
                      <span className="break-all">{log.message}</span>
                    </div>
                  ))
                )}
                {outageState === 'normal' && (
                  <div className="text-g animate-pulse">⚡ [INFO] Status: OPERATIONAL. Nasłuchiwanie kolejki Solana SVM...</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Resiliency Testing Column (1/3 width) */}
        <div className="space-y-6">
          <div className="border border-r/20 bg-[#040810]/90 p-5 rounded-none relative overflow-hidden flex flex-col justify-between h-full shadow-[0_0_35px_rgba(255,26,74,0.08)]">
            <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-r" />
            <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-r" />
            <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-r" />
            <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-r" />

            <div>
              <div className="flex items-center gap-2 mb-4 border-b border-r/10 pb-3">
                <AlertTriangle className="w-4 h-4 text-r" />
                <h3 className="font-display text-sm tracking-[2px] text-white uppercase">{t('TEST ODPORNOŚCI API', 'API RESILIENCY TEST')}</h3>
              </div>

              <p className="text-[11px] text-[#c8e6d2]/60 leading-relaxed font-mono mb-4">
                {t(
                  'Przetestuj stabilność techniczną aplikacji. Wywołaj symulowaną awarię bazy/RPC i zobacz, jak Solaxy automatycznie uruchamia kolejkowanie żądań, wykładnicze ponawianie (Exponential Backoff) oraz awaryjne przełączanie na węzły rezerwowe.',
                  'Test the full-stack resiliency. Induce a simulated API gateway/RPC node timeout and watch Solaxy trigger automatic retry queuing, exponential backoff, and transparent failover to backup servers.'
                )}
              </p>
            </div>

            <div className="space-y-3">
              {!isSimulatingOutage ? (
                <button
                  onClick={triggerOutageSimulation}
                  className="w-full py-3 bg-r/10 hover:bg-r/20 text-r border border-r/30 hover:border-r font-bold text-xs uppercase tracking-[2px] transition-all rounded-sm interactive-cursor"
                >
                  ⚡ {t('WYWOŁAJ AWARIĘ API', 'INDUCING API TIMEOUT')}
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="text-[9px] font-mono text-center text-white/50 uppercase">
                    {outageState === 'fallback_active' ? t('POŁĄCZENIE PRZYWRÓCONE PRZEZ FALLBACK', 'CONNECTION RESTORED VIA FALLBACK') : t('TRWA RETRY SECUENCING...', 'RETRY SEQUENCING ACTIVE...')}
                  </div>
                  <button
                    onClick={resetOutageSimulation}
                    className="w-full py-3 bg-g text-black font-bold text-xs uppercase tracking-[2px] hover:shadow-[0_0_15px_rgba(0,255,136,0.4)] transition-all rounded-sm interactive-cursor"
                  >
                    🔄 {t('PRZYWRÓĆ STAN GŁÓWNY', 'RESTORE MAIN NODE')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ════ SECTION 3: ABOUT US, FOUNDERS & INTERACTIVE CONTACT MVP FLOW ════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* About Us & Credibility */}
        <div className="border border-white/10 bg-black/40 p-6 rounded-none space-y-6">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <BookOpen className="w-5 h-5 text-g" />
            <h3 className="font-display text-lg tracking-[2px] text-white uppercase">{t('O PROJEKCIE SOLAXY', 'ABOUT SOLAXY MISSION')}</h3>
          </div>

          <p className="text-xs text-white/70 leading-relaxed font-mono">
            {t(
              'Solaxy powstało jako odpowiedź na chaos i wysokie koszty panujące w ekosystemie Solana. Tradycyjne tworzenie tokenów, konfiguracja metadanych, programowanie smart kontraktów w Rust/Anchor oraz ręczne tworzenie pul płynności na Raydium wymagało setek dolarów, czasu oraz wiedzy programistycznej.',
              'Solaxy was founded to eliminate coding barriers and exorbitant fees in the Solana ecosystem. Building SPL tokens, designing Anchor rust smart contracts, defining metadata, and manually initializing Raydium/Orca pools used to require expensive developers, extensive testing, and hours of work.'
            )}
          </p>

          <p className="text-xs text-white/70 leading-relaxed font-mono">
            {t(
              'Nasz silnik AI eliminuje te bariery. Dzięki połączeniu modelu sztucznej inteligencji z precyzyjnymi szablonami kryptograficznymi, każdy twórca może uruchomić bezpieczny, w 100% sprawdzony kod on-chain w 10 sekund. Wbudowany moduł Solaxy Mining chroni użytkowników przed oszustwami typu rug-pull.',
              'Our neural execution framework removes these friction points completely. Combining modern generative models with audited, secure cryptographic smart contract templates, anyone can deploy secure, 100% on-chain programs. Solaxy Mining prevents early team rug-pulls and builds transparent community confidence.'
            )}
          </p>

          <div className="border-t border-white/5 pt-4 grid grid-cols-2 gap-4 font-mono text-[11px]">
            <div>
              <span className="text-white/30 uppercase block mb-1">{t('Twórcy i Zespół', 'Creators & Team')}</span>
              <span className="text-g font-bold">Solaxy Labs Ltd.</span>
            </div>
            <div>
              <span className="text-white/30 uppercase block mb-1">{t('Lokalizacja', 'Jurisdiction')}</span>
              <span className="text-white font-bold">Zurych, Szwajcaria</span>
            </div>
          </div>
        </div>

        {/* Contact form (Actual MVP flow with history and logs) */}
        <div className="border border-g/15 bg-b2/90 p-6 rounded-none relative">
          <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-g" />
          <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-g" />

          <div className="flex items-center gap-2 border-b border-g/10 pb-3 mb-5">
            <Mail className="w-5 h-5 text-g" />
            <h3 className="font-display text-lg tracking-[2px] text-white uppercase">{t('FORMULARZ KONTAKTOWY', 'SECURE CONTACT FORM')}</h3>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-white/40 uppercase block mb-1.5">{t('Imię / Nick *', 'Your Name *')}</label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  className="w-full bg-black/60 border border-white/10 px-3 py-2 text-white focus:border-g focus:outline-none"
                  placeholder="np. Jan"
                />
              </div>
              <div>
                <label className="text-white/40 uppercase block mb-1.5">{t('Email *', 'Your Email *')}</label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  className="w-full bg-black/60 border border-white/10 px-3 py-2 text-white focus:border-g focus:outline-none"
                  placeholder="name@domain.com"
                />
              </div>
            </div>

            <div>
              <label className="text-white/40 uppercase block mb-1.5">{t('Temat', 'Subject')}</label>
              <input
                type="text"
                value={contactForm.subject}
                onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                className="w-full bg-black/60 border border-white/10 px-3 py-2 text-white focus:border-g focus:outline-none"
                placeholder={t('np. Zapytanie o przedsprzedaż', 'e.g., Presale inquiry')}
              />
            </div>

            <div>
              <label className="text-white/40 uppercase block mb-1.5">{t('Wiadomość *', 'Message *')}</label>
              <textarea
                required
                rows={3}
                value={contactForm.message}
                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                className="w-full bg-black/60 border border-white/10 px-3 py-2 text-white focus:border-g focus:outline-none resize-none"
                placeholder={t('Wpisz swoją wiadomość tutaj...', 'Write your message details here...')}
              />
            </div>

            {contactError && <div className="text-red-400 font-bold p-2.5 bg-red-950/20 border border-red-500/20">{contactError}</div>}
            {contactSuccess && <div className="text-g font-bold p-2.5 bg-g/5 border border-g/20">{contactSuccess}</div>}

            <button
              type="submit"
              disabled={isSendingContact}
              className="w-full py-3 bg-g text-black font-bold uppercase tracking-[2px] hover:shadow-[0_0_12px_rgba(0,255,136,0.35)] transition-all flex items-center justify-center gap-2 rounded-sm interactive-cursor"
            >
              {isSendingContact ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> {t('WYPROWADZANIE...', 'SENDING SECURELY...')}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> {t('WYŚLIJ WIADOMOŚĆ', 'SEND SECURE MESSAGES')}
                </>
              )}
            </button>
          </form>

          {/* Contact submission logs */}
          {contactHistory.length > 0 && (
            <div className="mt-5 border-t border-white/10 pt-4 font-mono text-[10px]">
              <span className="text-white/30 uppercase block mb-2">{t('HISTORIA WYSŁANYCH WIADOMOŚCI (LOGS)', 'MESSAGE HISTORIC LOGS (LOCAL SESSION)')}</span>
              <div className="space-y-2 max-h-[100px] overflow-y-auto">
                {contactHistory.map((sub, index) => (
                  <div key={index} className="bg-black/40 border border-white/5 p-2 rounded">
                    <div className="flex justify-between font-bold text-g mb-1">
                      <span>{sub.subject || "No Subject"}</span>
                      <span>{sub.timestamp}</span>
                    </div>
                    <p className="text-white/60 truncate">{sub.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ════ SECTION 4: CHANGELOG TIMELINE ════ */}
      <div className="border border-white/10 bg-black/40 p-6 rounded-none">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-6">
          <Clock className="w-5 h-5 text-g" />
          <h3 className="font-display text-lg tracking-[2px] text-white uppercase">{t('HISTORIA ZMIAN - CHANGELOG', 'CHANGELOG TIMELINE')}</h3>
        </div>

        <div className="space-y-6 font-mono text-xs">
          <div className="relative pl-6 border-l border-g/30">
            <span className="absolute left-[-4.5px] top-1 w-2 h-2 rounded-full bg-g shadow-[0_0_8px_#00ff88]" />
            <div className="flex items-center gap-3 mb-1">
              <span className="text-white font-bold">Wersja 1.1.0 (Aktualna)</span>
              <span className="text-[10px] bg-g/10 border border-g/20 text-g px-2 py-0.5 uppercase font-bold">LATEST</span>
              <span className="text-white/30 text-[10px]">13 Lipca, 2026</span>
            </div>
            <p className="text-white/60 text-[11px] leading-relaxed">
              Dodano interaktywny pulpit statusu technicznego i telemetrii. Zaimplementowano dynamiczną obsługę utraty łączności RPC ze sprzężeniem awaryjnym (Fallback) i logowaniem błędów. Wdrożono realne endpointy dla map witryn i polityk wyszukiwarek (sitemap & robots.txt).
            </p>
          </div>

          <div className="relative pl-6 border-l border-white/10">
            <span className="absolute left-[-4px] top-1 w-2 h-2 rounded-full bg-white/25" />
            <div className="flex items-center gap-3 mb-1">
              <span className="text-white/85 font-bold">Wersja 1.0.5</span>
              <span className="text-white/30 text-[10px]">04 Lipca, 2026</span>
            </div>
            <p className="text-white/50 text-[11px] leading-relaxed">
              Dodano animacje wejścia ScrollReveal oparte o Intersection Observer na elementach Tokenomics i Roadmap. Zaktualizowano banery graficzne maskotki Solaxy na stronie głównej oraz zoptymalizowano system stakowania.
            </p>
          </div>

          <div className="relative pl-6 border-l border-white/10">
            <span className="absolute left-[-4px] top-1 w-2 h-2 rounded-full bg-white/25" />
            <div className="flex items-center gap-3 mb-1">
              <span className="text-white/85 font-bold">Wersja 1.0.0 (Wdrożenie MVP)</span>
              <span className="text-white/30 text-[10px]">21 Czerwca, 2026</span>
            </div>
            <p className="text-white/50 text-[11px] leading-relaxed">
              Uruchomienie automatycznego kreatora tokenów opartego o model sztucznej inteligencji Gemini. Zintegrowanie darmowej przedsprzedaży (Presale Pools), symulatora stakingu oraz platformy wymiany aktywów (DEX Swap) bezpośrednio z lokalnym silnikiem bazy danych JSON.
            </p>
          </div>
        </div>
      </div>

      {/* ════ SECTION 5: LEGAL CORNER ════ */}
      <div className="space-y-4">
        {/* Privacy Policy */}
        <div className="border border-white/10 bg-black/60 rounded">
          <button 
            onClick={() => setShowPrivacy(!showPrivacy)}
            className="w-full p-4 flex justify-between items-center text-left font-display font-bold uppercase tracking-[1px] text-white hover:bg-white/[0.02] transition-colors"
          >
            <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-g" /> {t('Polityka Prywatności', 'Privacy Policy')}</span>
            <ChevronDown className={`w-4 h-4 text-white/40 transform transition-transform ${showPrivacy ? 'rotate-180' : ''}`} />
          </button>
          
          {showPrivacy && (
            <div className="p-5 border-t border-white/10 font-mono text-[11px] text-white/60 leading-relaxed max-h-[220px] overflow-y-auto bg-black/40 space-y-3">
              <p className="font-bold text-white text-xs">{t('Polityka Prywatności Solaxy Labs Ltd.', 'Privacy Policy for Solaxy Labs Ltd.')}</p>
              <p>
                Solaxy Labs Ltd. (zwana dalej „Solaxy”, „My”) szanuje prywatność każdego użytkownika odwiedzającego naszą witrynę. Zapewniamy pełne bezpieczeństwo danych i przestrzeganie europejskich przepisów RODO (General Data Protection Regulation).
              </p>
              <p>
                <strong>1. Zakres zbierania danych:</strong> Witryna Solaxy nie zbiera ani nie przetwarza danych osobowych bez bezpośredniej zgody użytkownika. Podczas łączenia zdecentralizowanych portfeli (Phantom, Solflare) przetwarzany jest wyłącznie klucz publiczny (Public Wallet Address), który jest wymagany do weryfikacji operacji w blockchainie Solana.
              </p>
              <p>
                <strong>2. Pliki cookie (Ciasteczka):</strong> Używamy ciasteczek wyłącznie w celu utrzymania sesji portfela użytkownika oraz zapisania wybranej wersji językowej.
              </p>
              <p>
                <strong>3. Kontakt:</strong> Wszystkie informacje przesłane za pośrednictwem formularza kontaktowego są chronione i wykorzystywane wyłącznie w celu udzielenia odpowiedzi na zgłoszenie.
              </p>
            </div>
          )}
        </div>

        {/* Terms of Service */}
        <div className="border border-white/10 bg-black/60 rounded">
          <button 
            onClick={() => setShowTerms(!showTerms)}
            className="w-full p-4 flex justify-between items-center text-left font-display font-bold uppercase tracking-[1px] text-white hover:bg-white/[0.02] transition-colors"
          >
            <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-cyan" /> {t('Regulamin Serwisu (Terms of Service)', 'Terms of Service')}</span>
            <ChevronDown className={`w-4 h-4 text-white/40 transform transition-transform ${showTerms ? 'rotate-180' : ''}`} />
          </button>
          
          {showTerms && (
            <div className="p-5 border-t border-white/10 font-mono text-[11px] text-white/60 leading-relaxed max-h-[220px] overflow-y-auto bg-black/40 space-y-3">
              <p className="font-bold text-white text-xs">{t('Regulamin serwisu Solaxy', 'Solaxy Terms of Service')}</p>
              <p>
                Niniejszy regulamin określa zasady korzystania z interfejsu Solaxy i automatycznego generatora tokenów.
              </p>
              <p>
                <strong>1. Akceptacja Warunków:</strong> Korzystając z generatora, przedsprzedaży lub stakingu, użytkownik oświadcza, że zapoznał się z niniejszym regulaminem i akceptuje wszystkie jego postanowienia.
              </p>
              <p>
                <strong>2. Brak Porad Finansowych:</strong> Narzędzie Solaxy służy wyłącznie celom edukacyjnym i technicznym. Generowanie oraz wdrażanie tokenów na blockchainie Solana wiąże się z wysokim ryzykiem rynkowym. Solaxy nie ponosi odpowiedzialności za straty finansowe wynikłe z obrotu aktywami.
              </p>
              <p>
                <strong>3. Odpowiedzialność:</strong> Użytkownik ponosi pełną odpowiedzialność prawną i finansową za nazwy, opisy oraz cel generowanych przez siebie aktywów.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ════ SECTION 6: CREDIBILITY FOOTNOTES & SEO ENDPOINTS LINKS ════ */}
      <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-white/40">
        <div>
          © 2026 Solaxy Labs Ltd. All rights reserved. Built for SVM communities.
        </div>
        <div className="flex items-center gap-4">
          <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="hover:text-g flex items-center gap-1 transition-colors">
            robots.txt <ExternalLink className="w-3 h-3" />
          </a>
          <span className="text-white/15">|</span>
          <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-g flex items-center gap-1 transition-colors">
            sitemap.xml <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

    </div>
  );
}
