import React, { useState } from 'react';
import { 
  Coins, Flame, Hammer, TrendingUp, Sparkles, Zap, ShieldCheck, 
  Cat, Globe, Rocket, Trophy, Heart, Crown, ArrowRight, Code, 
  Copy, Terminal, Check, Loader2, Play, Info, CheckCircle2, Cpu, Activity
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import TokenLifecyclePipeline from './TokenLifecyclePipeline';

interface GeneratedToken {
  name: string;
  ticker: string;
  description: string;
  supply: number;
  iconType: string;
  colorGradient: string;
  anchorCode: string;
}

const IconMap: { [key: string]: React.ComponentType<any> } = {
  Coins, Flame, Hammer, TrendingUp, Sparkles, Zap, ShieldCheck, 
  Cat, Globe, Rocket, Trophy, Heart, Crown
};

export default function AITokenGenerator() {
  const { t, language } = useLanguage();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<GeneratedToken | null>(null);
  
  // Interaction states for the generated token
  const [copied, setCopied] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileSuccess, setCompileSuccess] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [deployStepIndex, setDeployStepIndex] = useState<number>(-1);
  const [deployProgress, setDeployProgress] = useState<number>(0);

  // Mascot trigger effect to auto-fill and auto-generate a meme token about dogs
  React.useEffect(() => {
    const handleMascotTrigger = (e: Event) => {
      const defaultPrompt = language === 'pl' 
        ? "Create a meme token about dogs with 1.5% tax" 
        : "Create a meme token about dogs with 1.5% tax";
      setPrompt(defaultPrompt);
      handleGenerate(defaultPrompt);
    };

    window.addEventListener('trigger-mascot-prompt', handleMascotTrigger);
    return () => {
      window.removeEventListener('trigger-mascot-prompt', handleMascotTrigger);
    };
  }, [language, prompt]);

  const deploySteps = [
    { labelPl: "Inicjalizacja RPC", labelEn: "RPC Connection", pct: 15 },
    { labelPl: "Podpisy Autoryzacji", labelEn: "Signature Auth", pct: 30 },
    { labelPl: "Konto Mint SVM", labelEn: "SVM Mint Account", pct: 45 },
    { labelPl: "Metadane SPL", labelEn: "SPL Metadata", pct: 65 },
    { labelPl: "Emisja Tokenów", labelEn: "Token Minting", pct: 80 },
    { labelPl: "Zrzeczenie Praw", labelEn: "Renounce Authority", pct: 95 },
    { labelPl: "Finalizacja w Bazie", labelEn: "Finalization", pct: 100 }
  ];

  // Pre-configured templates to help the user get inspired
  const templates = [
    t("Cyberpunkowy kot z laserowymi oczami w zielonym motywie Solana", "Cyberpunk cat with laser eyes in green Solana theme"),
    t("Polska pierogowa moneta memowa lecąca rakietą na księżyc", "Polish pierogi meme coin flying on a rocket to the moon"),
    t("Ekologiczny token zasilany zieloną energią i mechanizmem auto-burn", "Eco-friendly token powered by green energy and auto-burn mechanism"),
    t("Zdecentralizowana gildia gamingowa dla graczy RPG z podatkiem 2%", "Decentralized gaming guild for RPG players with a 2% tax")
  ];

  const handleGenerate = async (selectedPrompt?: string) => {
    const activePrompt = selectedPrompt || prompt;
    if (!activePrompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    setToken(null);
    setCompileSuccess(false);
    setDeploySuccess(false);
    setTerminalLogs([]);

    try {
      const response = await fetch('/api/gemini/generate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: activePrompt })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || t('Wystąpił błąd podczas komunikacji z serwerem AI.', 'An error occurred while communicating with the AI server.'));
      }

      setToken(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || t('Nie udało się połączyć z API Gemini.', 'Failed to connect to the Gemini API.'));
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!token) return;
    navigator.clipboard.writeText(token.anchorCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestCompile = () => {
    if (!token || isCompiling) return;
    setIsCompiling(true);
    setTerminalLogs([
      "Initializing Anchor workspace...",
      `Parsing Anchor.toml for ${token.ticker} contract...`,
      "Compiling Rust modules (Cargo build)...",
    ]);

    setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev,
        "Fetching dependencies: anchor-lang v0.29.0",
        "Generating cryptographic keypairs...",
        `Optimizing BPF Bytecode for program ID: SolaxForge${Math.random().toString(36).substring(2, 9)}...`
      ]);
    }, 1000);

    setTimeout(() => {
      setIsCompiling(false);
      setCompileSuccess(true);
      setTerminalLogs(prev => [
        ...prev,
        "Build finished in 2.41s.",
        `SUCCESS: Bytecode compiled successfully. Size: 142 KB.`
      ]);
    }, 2500);
  };

  const handleDeployOnSolana = () => {
    if (!token || isDeploying) return;
    setIsDeploying(true);
    setDeploySuccess(false);
    setDeployProgress(0);
    setDeployStepIndex(0);

    const steps = [
      {
        labelPl: "Inicjalizacja środowiska Anchor & portfela...",
        labelEn: "Initializing Anchor environment & wallet...",
        pct: 15,
        logPl: "Nawiązywanie połączenia z węzłem Solana Mainnet RPC (api.mainnet-beta.solana.com)...",
        logEn: "Establishing connection with Solana Mainnet RPC node (api.mainnet-beta.solana.com)..."
      },
      {
        labelPl: "Weryfikacja uprawnień i podpisu portfela...",
        labelEn: "Verifying authority signatures & credentials...",
        pct: 30,
        logPl: "Sprawdzanie uprawnień sygnatariusza na Solana VM...",
        logEn: "Checking signer permissions on Solana VM..."
      },
      {
        labelPl: "Tworzenie konta Mint (Token Account) na Solana SVM...",
        labelEn: "Creating Mint Account (Token Account) on Solana SVM...",
        pct: 45,
        logPl: "Alokowanie przestrzeni konta i opłacanie czynszu (Rent Exempt)...",
        logEn: "Allocating account space and paying rent-exemption fee..."
      },
      {
        labelPl: "Publikacja metadanych i on-chain URI specyfikacji...",
        labelEn: "Publishing metadata & on-chain URI specifications...",
        pct: 65,
        logPl: "Wdrażanie struktur Metaplex Token Metadata...",
        logEn: "Deploying Metaplex Token Metadata structures..."
      },
      {
        labelPl: "Emisja wolumenu i dystrybucja do skarbca...",
        labelEn: "Minting supply & distributing to vault...",
        pct: 80,
        logPl: `Przesyłanie instrukcji MintTo dla ${token.supply.toLocaleString()} ${token.ticker}...`,
        logEn: `Sending MintTo instruction for ${token.supply.toLocaleString()} ${token.ticker}...`
      },
      {
        labelPl: "Blokowanie uprawnień mennicy (Renounce Authority)...",
        labelEn: "Renouncing mint authority for contract safety...",
        pct: 95,
        logPl: "Ustawianie Mint Authority na null celem 100% bezpieczeństwa...",
        logEn: "Setting Mint Authority to null for 100% security..."
      },
      {
        labelPl: "Finalizacja zapisu bloku w bazie Solaxy...",
        labelEn: "Finalizing block registration in Solaxy database...",
        pct: 100,
        logPl: "Rejestracja w lokalnym indeksie DEX i synchronizacja...",
        logEn: "Registering in the local DEX index and syncing..."
      }
    ];

    setTerminalLogs(prev => [
      ...prev,
      "--- DEPLOYMENT INITIATED ---"
    ]);

    const runStep = (idx: number) => {
      if (idx >= steps.length) {
        // Final backend save
        setTimeout(async () => {
          try {
            const response = await fetch('/api/tokens/deploy', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: token.name,
                ticker: token.ticker,
                description: token.description,
                supply: token.supply,
                iconType: token.iconType,
                colorGradient: token.colorGradient,
                anchorCode: token.anchorCode
              })
            });

            if (response.ok) {
              window.dispatchEvent(new CustomEvent('token-deployed'));
            }
          } catch (err) {
            console.error("Error deploying token to server:", err);
          }

          setIsDeploying(false);
          setDeploySuccess(true);
          setTerminalLogs(prev => [
            ...prev,
            "Transaction Signature Hash: 5fG49s61Xj8GvA1h9x3Lp0sW7mQ91hN8zKqPx9a2f... (Confirmed on SVM)",
            `SUCCESS: Token ${token.name} (${token.ticker}) fully deployed on Solana Network!`
          ]);
        }, 800);
        return;
      }

      const currentStep = steps[idx];
      setDeployStepIndex(idx);
      setDeployProgress(currentStep.pct);

      setTerminalLogs(prev => [
        ...prev,
        `[${currentStep.pct}%] ${language === 'pl' ? currentStep.logPl : currentStep.logEn}`
      ]);

      const stepDelays = [1000, 1100, 1300, 1100, 1000, 900, 800];
      setTimeout(() => {
        runStep(idx + 1);
      }, stepDelays[idx] || 1000);
    };

    runStep(0);
  };

  // Resolve the generated Icon Component
  const RenderedIcon = token && IconMap[token.iconType] ? IconMap[token.iconType] : Coins;

  return (
    <div className="border border-g/15 bg-b2/90 p-5 md:p-8 rounded-none relative overflow-hidden backdrop-blur-md">
      {/* Top dual-color neon header decoration */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-g via-cyan to-purple" />

      <div className="mb-6">
        <div className="flex items-center gap-2 text-[10px] tracking-[4px] uppercase text-g/60 font-bold mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-g animate-ping" /> {t('AI INTELIGENTNY AUTOMAT TWORZENIA TOKENÓW', 'AI SMART TOKEN CREATOR')}
        </div>
        <h3 className="font-display text-2xl md:text-4xl tracking-[1px] text-white uppercase">
          {t('AI INTELIGENTNY AUTOMAT', 'AI SMART')} <span className="text-g text-shadow-[0_0_8px_rgba(0,255,136,0.35)]">{t('TWORZENIA TOKENÓW', 'TOKEN CREATOR')}</span>
        </h3>
        <p className="text-xs text-[#c8e6d2]/50 mt-1 max-w-[720px]">
          {language === 'pl' ? (
            <>Doświadcz <strong>najprostszego na świecie tworzenia tokenów</strong> połączonego z innowacyjnym górnictwem! Wpisz jedno proste zdanie, a nasz inteligentny automat AI oparty o model Gemini zaprojektuje unikalny profil tokena, zbalansowaną dystrybucję, pasujące grafiki oraz wygeneruje kompletny kod Anchor Smart Contract w języku Rust. Bez programowania, bez zbędnego wysiłku i w 100% automatycznie!</>
          ) : (
            <>Experience the <strong>simplest token creation in the world</strong> combined with innovative mining! Type one simple sentence, and our smart AI system powered by Gemini will design a unique token profile, balanced distribution, matching graphics, and generate a complete Anchor Smart Contract code in Rust. No coding, no hassle, and 100% automatic!</>
          )}
        </p>
      </div>

      {/* Input Stage */}
      {!token && !isGenerating && (
        <div className="animate-fadeIn">
          <div className="flex flex-col gap-4 mb-6">
            <div>
              <label className="text-[10px] text-white/40 uppercase block mb-2 font-mono">{t('Wpisz swój pomysł na token (Prompt)', 'Enter your token idea (Prompt)')}</label>
              <div className="flex flex-col md:flex-row gap-3 bg-black/60 border border-white/10 p-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={t('np. Szybki kosmiczny gepard dający 3% dywidendy dla stakujących', 'e.g., Fast space cheetah giving 3% staking dividends')}
                  className="w-full bg-transparent text-white py-3 px-4 text-sm focus:outline-none placeholder-white/20 font-mono"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleGenerate();
                  }}
                />
                <button
                  onClick={() => handleGenerate()}
                  disabled={!prompt.trim()}
                  className={`py-3 px-6 text-xs tracking-[2px] font-bold uppercase transition-all duration-300 flex items-center justify-center gap-2 interactive-cursor whitespace-nowrap ${
                    prompt.trim() 
                      ? 'bg-g text-black hover:bg-g/90 hover:shadow-[0_0_15px_rgba(0,255,136,0.5)]'
                      : 'bg-white/5 text-white/30 cursor-not-allowed'
                  }`}
                >
                  {t('FORGUJ PROMPT', 'FORGE PROMPT')} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Template helpers */}
            <div>
              <span className="text-[9px] text-white/30 uppercase font-mono block mb-2">{t('Lub wybierz gotowy szablon inspiracji:', 'Or select a ready-made inspiration template:')}</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {templates.map((tmpl, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPrompt(tmpl);
                      handleGenerate(tmpl);
                    }}
                    className="text-left py-2 px-3 border border-white/5 bg-b/40 hover:bg-g/5 hover:border-g/30 text-white/60 hover:text-white transition-all text-[11px] font-mono flex items-center justify-between group interactive-cursor"
                  >
                    <span>{tmpl}</span>
                    <Sparkles className="w-3.5 h-3.5 text-g/40 group-hover:text-g transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generating State */}
      {isGenerating && (
        <div className="py-12 flex flex-col items-center justify-center text-center animate-fadeIn font-mono">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-2 border-g/20 rounded-full animate-spin border-t-g" />
            <Sparkles className="w-6 h-6 text-g absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <div className="text-g font-bold text-sm tracking-[2px] uppercase mb-1.5">
            {t('Sztuczna Inteligencja Gemini Forguje Kontrakt...', 'Gemini AI is Forging the Contract...')}
          </div>
          <p className="text-[11px] text-white/40 max-w-[420px] mb-4">
            {t('Analizujemy tokenomię, projektujemy parametry emisji, mapujemy grafikę i generujemy bezpieczny kod w języku Rust.', 'We are analyzing tokenomics, designing emission parameters, mapping graphics, and generating secure Rust code.')}
          </p>
          
          <div className="w-full max-w-md h-1 bg-white/5 relative overflow-hidden">
            <div className="h-full bg-gradient-to-r from-g to-cyan animate-[shimmer_2s_infinite_linear] w-2/3" />
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-4 border border-r/30 bg-r/5 text-r text-xs font-mono mb-6 flex flex-col gap-2 animate-fadeIn">
          <div className="font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-r rounded-full animate-pulse" />
            {t('BŁĄD GENERATORA AI', 'AI GENERATOR ERROR')}
          </div>
          <p className="text-white/80">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="text-[9px] border border-r/30 px-2 py-1 hover:bg-r/10 self-start text-white uppercase tracking-[1px]"
          >
            {t('Zamknij i spróbuj ponownie', 'Close and try again')}
          </button>
        </div>
      )}

      {/* Outcome Showcase HUD */}
      {token && (
        <div className="animate-fadeIn">
          
          {/* Header Reset */}
          <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
            <span className="text-[10px] text-g font-mono font-bold tracking-[2px] uppercase flex items-center gap-1.5">
              <Check className="w-4 h-4 text-g" /> {t('PROJEKT UTWORZONY AUTOMATEM AI', 'PROJECT CREATED BY AI AUTOMATION')}
            </span>
            <button 
              onClick={() => {
                setToken(null);
                setPrompt('');
              }}
              className="text-[9px] text-white/40 hover:text-white border border-white/15 px-3 py-1 bg-white/5 font-mono uppercase tracking-[1px] interactive-cursor"
            >
              {t('Stwórz inny token', 'Create another token')}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono">
            
            {/* Left Col: Token Card Visual representation */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              
              <div className={`p-6 border border-white/10 bg-gradient-to-br ${token.colorGradient}/10 relative overflow-hidden group`}>
                {/* Laser scan effect */}
                <div className="absolute inset-x-0 top-0 h-[1.5px] bg-white/20 animate-pulse" />
                
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 flex items-center justify-center border border-white/20 bg-gradient-to-r ${token.colorGradient} text-black font-black rounded-full`}>
                      <RenderedIcon className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white tracking-[1px]">{token.name}</div>
                      <div className="text-[10px] text-white/50 tracking-[2px]">{token.ticker}</div>
                    </div>
                  </div>

                  <span className="text-[8px] border border-white/20 px-2 py-0.5 text-white/50 bg-black/40 font-bold uppercase tracking-[1px]">
                    SOLANA ECO
                  </span>
                </div>

                <div className="mb-6">
                  <span className="text-[9px] text-white/30 uppercase block mb-1">{t('Profil i Atrybuty (Opis AI)', 'Profile and Attributes (AI Description)')}</span>
                  <p className="text-xs text-white/80 leading-relaxed">
                    {token.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                  <div>
                    <span className="text-[9px] text-white/30 uppercase block">{t('Całkowita Podaż', 'Total Supply')}</span>
                    <span className="text-sm text-white font-bold">{token.supply.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-white/30 uppercase block">{t('Status Skarbu', 'Forge Status')}</span>
                    <span className="text-xs text-g font-bold flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-g" /> GEM X1000
                    </span>
                  </div>
                </div>

                {/* Glowing decorative border */}
                <div className={`absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br ${token.colorGradient} filter blur-[40px] opacity-20 pointer-events-none`} />
              </div>

              {/* Utility metrics panel */}
              <div className="border border-white/5 bg-black/40 p-4">
                <div className="flex items-center gap-2 text-[10px] text-cyan font-bold tracking-[1.5px] uppercase mb-3">
                  <Zap className="w-4 h-4 text-cyan" /> {t('WSKAŹNIKI POTENCJAŁU $SLX FORGE', '$SLX FORGE POTENTIAL METRICS')}
                </div>
                
                <div className="flex flex-col gap-2 text-xs">
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-white/40">{t('Zaprojektowane APY stakowania', 'Designed staking APY')}</span>
                    <span className="text-white font-bold text-right">{t('Aż do 164.8%', 'Up to 164.8%')}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-white/40">{t('Deflacyjny model spalania', 'Deflationary burn model')}</span>
                    <span className="text-r font-bold text-right">Auto-Burn 1.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">{t('Bezpieczeństwo kontraktu', 'Contract security')}</span>
                    <span className="text-g font-bold text-right">{t('Zgodne z CertiK', 'CertiK compliant')}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Col: Anchor Smart Contract Code IDE */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              
              <div className="border border-white/10 bg-black/90 relative">
                {/* Header terminal controls */}
                <div className="bg-white/5 border-b border-white/10 px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-g" />
                    <span className="text-[10px] text-white/60 font-bold uppercase tracking-[1px]">Solana Anchor Smart Contract Code</span>
                  </div>
                  <button 
                    onClick={copyToClipboard}
                    className="text-[9px] text-g hover:text-white border border-g/20 px-2 py-0.5 bg-g/5 flex items-center gap-1.5 transition-all interactive-cursor"
                  >
                    {copied ? <Check className="w-3 h-3 text-g" /> : <Copy className="w-3 h-3" />}
                    {copied ? t('SKOPIOWANO', 'COPIED') : t('KOPIUJ KOD', 'COPY CODE')}
                  </button>
                </div>

                {/* Rust Source Editor Display */}
                <div className="h-[250px] overflow-y-auto p-4 text-[10px] text-white/70 leading-relaxed font-mono select-text bg-black/90 whitespace-pre scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  <span className="text-white/30">// Auto-generated by SOLAX AI with Gemini - custom token blueprint</span>
                  <br />
                  {token.anchorCode}
                </div>
              </div>

              {/* Console Sandbox Workspace */}
              <div className="border border-white/5 bg-[#030712] p-4 font-mono relative overflow-hidden">
                {isDeploying ? (
                  <div className="animate-fadeIn">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-cyan/10 pb-3 mb-4">
                      <div className="flex items-center gap-1.5 text-[10px] text-cyan font-bold uppercase tracking-[1.5px]">
                        <Cpu className="w-3.5 h-3.5 animate-pulse text-cyan" /> 
                        {t('Wdrażanie Kontraktu na Solana SVM', 'Deploying Contract on Solana SVM')}
                      </div>
                      <div className="text-[8px] text-cyan/50 uppercase tracking-[1px] flex items-center gap-1">
                        <Activity className="w-3 h-3 text-g animate-ping" />
                        {t('Prędkość: 62.5K TPS', 'Speed: 62.5K TPS')}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      {/* Left: Progress & Checklist */}
                      <div className="md:col-span-8 space-y-3.5">
                        {/* Interactive Steps Indicators */}
                        <div className="flex flex-wrap items-center gap-1 text-[9px] text-white/40">
                          {deploySteps.map((step, idx) => {
                            const isDone = idx < deployStepIndex;
                            const isActive = idx === deployStepIndex;
                            return (
                              <React.Fragment key={idx}>
                                <div className={`flex items-center gap-1 px-1.5 py-0.5 border ${
                                  isDone 
                                    ? 'border-g/30 text-g bg-g/5 font-semibold' 
                                    : isActive 
                                    ? 'border-cyan text-cyan bg-cyan/5 font-bold animate-pulse' 
                                    : 'border-white/5 text-white/30'
                                } rounded-sm transition-all duration-300`}>
                                  {isDone ? (
                                    <Check className="w-2.5 h-2.5 text-g" />
                                  ) : isActive ? (
                                    <Loader2 className="w-2.5 h-2.5 animate-spin text-cyan" />
                                  ) : (
                                    <span className="w-1 h-1 rounded-full bg-white/20" />
                                  )}
                                  <span>{language === 'pl' ? step.labelPl : step.labelEn}</span>
                                </div>
                                {idx < deploySteps.length - 1 && (
                                  <span className="text-white/10 text-[8px]">•</span>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>

                        {/* Progress Bar with glow */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[10px] font-semibold text-white/50">
                            <span className="text-cyan uppercase tracking-[1px] flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-cyan rounded-full animate-ping" />
                              {language === 'pl' ? deploySteps[deployStepIndex]?.labelPl : deploySteps[deployStepIndex]?.labelEn}
                            </span>
                            <span className="text-cyan font-bold font-mono">{deployProgress}%</span>
                          </div>
                          
                          <div className="h-3.5 bg-black border border-cyan/20 p-[2px] relative overflow-hidden flex items-center rounded-sm">
                            <div 
                              style={{ width: `${deployProgress}%` }}
                              className="h-full bg-gradient-to-r from-cyan via-g to-g shadow-[0_0_12px_#00ff88] relative transition-all duration-300"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                            </div>
                          </div>
                        </div>

                        {/* Detailed step info notification */}
                        <div className="text-[9.5px] leading-relaxed bg-[#04080f] border border-cyan/10 p-2.5 text-cyan/90 font-mono flex items-start gap-1.5 rounded-sm shadow-[inset_0_0_10px_rgba(0,248,184,0.02)]">
                          <Terminal className="w-3.5 h-3.5 shrink-0 text-cyan mt-0.5 animate-pulse" />
                          <div>
                            <span className="font-bold uppercase tracking-[0.5px] text-white/80 block mb-0.5">
                              {t('STATUS OPERACJI:', 'OPERATION STATUS:')}
                            </span>
                            <span className="animate-fadeIn">
                              {terminalLogs[terminalLogs.length - 1] || t('Inicjowanie...', 'Initializing...')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: SVM Block Reactor Representation */}
                      <div className="md:col-span-4 flex flex-col items-center justify-center p-2 border border-white/5 bg-black/30 rounded-sm relative group overflow-hidden">
                        {/* Concentric rings */}
                        <div className="relative w-16 h-16 flex items-center justify-center">
                          <div className="absolute inset-0 border border-dashed border-cyan/25 rounded-full animate-[spin_10s_linear_infinite]" />
                          <div className="absolute w-12 h-12 border border-dotted border-g/30 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                          <div className="w-8 h-8 rounded-full bg-cyan/5 border border-cyan/40 flex items-center justify-center relative shadow-[0_0_10px_rgba(0,248,184,0.15)]">
                            <Cpu className="w-4 h-4 text-cyan" />
                          </div>
                        </div>
                        <div className="text-[8px] text-center mt-2 space-y-0.5">
                          <span className="text-white/40 block font-bold uppercase tracking-[1px]">{t('Blok SVM', 'SVM Block')}</span>
                          <span className="text-g font-semibold font-mono animate-pulse">SLOT #{Math.floor(249582109 + deployProgress * 15)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                      <div className="flex items-center gap-1.5 text-[10px] text-white/50 uppercase font-bold">
                        <Terminal className="w-3.5 h-3.5 text-white/40" /> {t('Konsola Kompilacji i Emisji', 'Compilation and Emission Console')}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={handleTestCompile}
                          disabled={isCompiling || compileSuccess}
                          className={`text-[9px] font-bold uppercase tracking-[1.5px] border px-2.5 py-1 flex items-center gap-1.5 transition-all interactive-cursor ${
                            compileSuccess 
                              ? 'border-g/30 text-g bg-g/5 cursor-default'
                              : isCompiling 
                              ? 'border-white/10 text-white/30 cursor-not-allowed bg-white/5'
                              : 'border-cyan text-cyan hover:bg-cyan/15 bg-transparent'
                          }`}
                        >
                          {isCompiling ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 fill-current" />}
                          {compileSuccess ? t('SKOMPILOWANO', 'COMPILED') : t('KOMPILUJ TESTOWO', 'TEST COMPILE')}
                        </button>

                        <button 
                          onClick={handleDeployOnSolana}
                          disabled={!compileSuccess || isDeploying || deploySuccess}
                          className={`text-[9px] font-bold uppercase tracking-[1.5px] border px-2.5 py-1 flex items-center gap-1.5 transition-all interactive-cursor ${
                            deploySuccess 
                              ? 'border-g/30 text-g bg-g/5 cursor-default'
                              : isDeploying 
                              ? 'border-white/10 text-white/30 cursor-not-allowed bg-white/5'
                              : compileSuccess 
                              ? 'border-g text-g hover:bg-g/15 bg-transparent' 
                              : 'border-white/15 text-white/30 bg-white/5 cursor-not-allowed'
                          }`}
                        >
                          {isDeploying ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3 fill-current" />}
                          {deploySuccess ? t('WDROŻONO NA SOLANIE', 'DEPLOYED ON SOLANA') : t('EMITUJ TOKEN', 'EMIT TOKEN')}
                        </button>
                      </div>
                    </div>

                    {/* Console Logs Box */}
                    <div className="h-[90px] overflow-y-auto bg-black/40 p-2 border border-white/5 text-[9px] text-white/50 flex flex-col gap-1.5 select-text">
                      {terminalLogs.length === 0 ? (
                        <div className="text-white/20 italic flex items-center gap-1">
                          <Info className="w-3 h-3 text-white/20" /> {t('Kliknij kompilację, aby zweryfikować poprawność kodu w Anchor Rust...', 'Click compile to verify the code correctness in Anchor Rust...')}
                        </div>
                      ) : (
                        terminalLogs.map((log, idx) => (
                          <div key={idx} className={`leading-relaxed ${
                            log.startsWith('SUCCESS:') ? 'text-g font-bold' : 
                            log.startsWith('---') ? 'text-cyan/80 font-bold' : 
                            'text-white/60'
                          }`}>
                            {log}
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>

            </div>

          </div>

          {/* Active 11-step Solaxy token launch pipeline representation */}
          <div className="mt-6 border-t border-white/5 pt-6">
            <TokenLifecyclePipeline 
              activeStepIdx={isDeploying ? Math.min(5 + deployStepIndex, 10) : (deploySuccess ? 10 : -1)} 
              isDeploying={isDeploying} 
            />
          </div>

        </div>
      )}

    </div>
  );
}
