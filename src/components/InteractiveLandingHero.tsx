import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, Code2, Coins, Palette, Layout, Megaphone, Share2, FileText,
  Wallet, TrendingUp, Pickaxe, ArrowRightLeft, Rocket, BarChart3, ShieldCheck, MessageSquare, Play, Sparkles
} from 'lucide-react';
import { SolaxyEmoticon } from './SolaxyLogo';

interface Props {
  t: (pl: string, en: string) => string;
  scrollToSection: (id: string) => void;
  setCurrentPage: (page: string) => void;
}

export default function InteractiveLandingHero({ t, scrollToSection, setCurrentPage }: Props) {
  const [demoPrompt, setDemoPrompt] = useState('');
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  const startDemo = () => {
    if (!demoPrompt.trim()) return;
    setIsDemoRunning(true);
    setDemoStep(1);
    
    // Simulate steps
    const steps = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    steps.forEach((step, index) => {
      setTimeout(() => {
        setDemoStep(step);
      }, (index + 1) * 1200);
    });
    
    setTimeout(() => {
      setIsDemoRunning(false);
      setDemoStep(0);
      setDemoPrompt('');
    }, steps.length * 1200 + 2000);
  };

  const aiMenu = [
    { icon: Bot, label: t('AI Token Generator', 'AI Token Generator'), action: () => setCurrentPage('generator') },
    { icon: Code2, label: t('Smart Contract Generator', 'Smart Contract Generator'), action: () => setCurrentPage('generator') },
    { icon: Coins, label: t('Tokenomics Generator', 'Tokenomics Generator'), action: () => setCurrentPage('generator') },
    { icon: Palette, label: t('Logo & Branding AI', 'Logo & Branding AI'), action: () => setCurrentPage('generator') },
    { icon: Layout, label: t('Landing Page AI', 'Landing Page AI'), action: () => setCurrentPage('generator') },
    { icon: Megaphone, label: t('Marketing AI', 'Marketing AI'), action: () => setCurrentPage('generator') },
    { icon: Share2, label: t('Social Media AI', 'Social Media AI'), action: () => setCurrentPage('generator') },
    { icon: FileText, label: t('Whitepaper AI', 'Whitepaper AI'), action: () => setCurrentPage('generator') }
  ];

  const ecoMenu = [
    { icon: Wallet, label: t('Wallet', 'Wallet'), action: () => {} },
    { icon: Rocket, label: t('Presale', 'Presale'), action: () => scrollToSection('presale') },
    { icon: Pickaxe, label: t('Staking', 'Staking'), action: () => setCurrentPage('forge') },
    { icon: ArrowRightLeft, label: t('Bridge', 'Bridge'), action: () => setCurrentPage('network') },
    { icon: ShieldCheck, label: t('Launchpad', 'Launchpad'), action: () => scrollToSection('presale') },
    { icon: BarChart3, label: t('Analytics', 'Analytics'), action: () => setCurrentPage('swap') },
    { icon: MessageSquare, label: t('Governance', 'Governance'), action: () => {} },
    { icon: Sparkles, label: t('AI Assistant', 'AI Assistant'), action: () => setCurrentPage('generator') }
  ];

  const demoStepsInfo = [
    t("Oczekiwanie...", "Waiting..."),
    t("AI analizuje pomysł...", "AI analyzing concept..."),
    t("Generowanie logo...", "Generating logo..."),
    t("Generowanie tokenomiki...", "Generating tokenomics..."),
    t("Tworzenie smart kontraktu...", "Writing smart contract..."),
    t("Wdrożenie na blockchain...", "Deploying to blockchain..."),
    t("Dodanie płynności...", "Adding liquidity..."),
    t("Uruchomienie strony...", "Launching website..."),
    t("Publikacja w mediach społecznościowych...", "Publishing to social media..."),
    t("Listing na DEX...", "Listing on DEX..."),
    t("Panel zarządzania tokenem gotowy!", "Token dashboard ready!"),
  ];

  return (
    <section className="relative w-full max-w-7xl mx-auto min-h-[85vh] flex flex-col justify-center items-center py-12 px-4 z-10 overflow-hidden">
      
      {/* Background Particles & Galaxy (CSS/Motion driven) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-g/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan/5 rounded-full blur-[80px]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full relative z-10">
        
        {/* LEFT PANEL: AI Factory */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-2">
          <div className="text-[10px] tracking-[3px] text-g font-bold uppercase mb-4 px-2">{t('AI FACTORY', 'AI FACTORY')}</div>
          {aiMenu.map((item, i) => (
            <button 
              key={i} 
              onClick={item.action}
              className="flex items-center gap-3 px-4 py-3 bg-b/40 border border-g/10 hover:border-g/40 hover:bg-g/5 transition-all text-left group rounded"
            >
              <item.icon className="w-4 h-4 text-g/60 group-hover:text-g transition-colors" />
              <span className="text-xs text-white/80 group-hover:text-white font-mono tracking-wider">{item.label}</span>
            </button>
          ))}
        </div>

        {/* CENTER PANEL: Hero */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center text-center px-4">
          
          <motion.div 
            animate={{ y: [0, -10, 0] }} 
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="mb-8"
          >
            <SolaxyEmoticon className="w-24 h-24 md:w-32 md:h-32 text-g drop-shadow-[0_0_20px_rgba(0,255,136,0.6)]" />
          </motion.div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-[4px] uppercase mb-4 leading-none">
            CREATE <span className="text-g">•</span> LAUNCH <span className="text-r">•</span> DOMINATE
          </h1>
          
          <p className="text-white/50 text-xs sm:text-sm max-w-[400px] mb-8 font-mono tracking-wider">
            {t("W pełni zautomatyzowana fabryka tokenów Web3. Wygeneruj i wdróż własny projekt w 10 sekund.", "Fully automated Web3 token factory. Generate and deploy your project in 10 seconds.")}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <button 
              onClick={() => scrollToSection('presale')}
              className="px-6 py-3 bg-g text-black font-bold uppercase tracking-[2px] text-xs hover:bg-g/80 hover:shadow-[0_0_20px_rgba(0,255,136,0.5)] transition-all"
            >
              {t("Start Presale", "Start Presale")}
            </button>
            <button 
              onClick={() => setCurrentPage('generator')}
              className="px-6 py-3 bg-black border border-g text-g font-bold uppercase tracking-[2px] text-xs hover:bg-g/10 transition-all"
            >
              {t("Create Token", "Create Token")}
            </button>
            <button 
              onClick={() => scrollToSection('pools')}
              className="px-6 py-3 bg-black border border-white/20 text-white/80 font-bold uppercase tracking-[2px] text-xs hover:bg-white/5 hover:text-white transition-all flex items-center gap-2"
            >
              <Play className="w-3 h-3" /> {t("Watch Demo", "Watch Demo")}
            </button>
          </div>

          {/* LIVE AI DEMO */}
          <div className="w-full max-w-[500px] border border-g/20 bg-black/60 backdrop-blur-xl p-1 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {!isDemoRunning ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <input 
                    type="text" 
                    value={demoPrompt}
                    onChange={(e) => setDemoPrompt(e.target.value)}
                    placeholder={t("Create a meme token about dogs...", "Create a meme token about dogs...")}
                    className="flex-1 bg-transparent border-none text-white text-sm font-mono p-3 outline-none placeholder:text-white/30"
                    onKeyDown={(e) => e.key === 'Enter' && startDemo()}
                  />
                  <button 
                    onClick={startDemo}
                    disabled={!demoPrompt.trim()}
                    className="p-3 bg-g/10 hover:bg-g/20 text-g transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Sparkles className="w-5 h-5" />
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="p-4 flex flex-col items-center justify-center min-h-[60px]"
                >
                  <div className="text-g font-mono tracking-wider text-xs mb-2">
                    {demoStepsInfo[demoStep] || demoStepsInfo[demoStepsInfo.length - 1]}
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-g"
                      initial={{ width: 0 }}
                      animate={{ width: `${(demoStep / (demoStepsInfo.length - 1)) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* RIGHT PANEL: Ecosystem */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-2">
          <div className="text-[10px] tracking-[3px] text-cyan font-bold uppercase mb-4 px-2 text-right">{t('ECOSYSTEM', 'ECOSYSTEM')}</div>
          {ecoMenu.map((item, i) => (
            <button 
              key={i} 
              onClick={item.action}
              className="flex items-center justify-end gap-3 px-4 py-3 bg-b/40 border border-cyan/10 hover:border-cyan/40 hover:bg-cyan/5 transition-all text-right group rounded"
            >
              <span className="text-xs text-white/80 group-hover:text-white font-mono tracking-wider">{item.label}</span>
              <item.icon className="w-4 h-4 text-cyan/60 group-hover:text-cyan transition-colors" />
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
