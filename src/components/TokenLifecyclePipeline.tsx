import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Cpu, Palette, Coins, Code, Globe, 
  Share2, ArrowDownUp, CheckCircle2, ShieldAlert,
  Sliders, Search, Layout, HelpCircle, Terminal
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export interface PipelineStep {
  id: string;
  namePl: string;
  nameEn: string;
  taglinePl: string;
  taglineEn: string;
  descPl: string;
  descEn: string;
  icon: React.ComponentType<any>;
  color: string;
  glowColor: string;
  pct: number;
  mockJson: Record<string, any>;
}

export const PIPELINE_STEPS: PipelineStep[] = [
  {
    id: 'prompt',
    namePl: '1. Prompt Pomysłu',
    nameEn: '1. Idea Prompting',
    taglinePl: 'Przetwarzanie intencji użytkownika w czasie rzeczywistym',
    taglineEn: 'Real-time parsing of user intent & concept themes',
    descPl: 'Użytkownik opisuje swój wymarzony projekt w prostym, ludzkim języku. Nasz zaawansowany parser NLP analizuje kluczowe intencje, motyw przewodni, mechanizmy DeFi i optymalizuje je pod kątem wiralowości.',
    descEn: 'The user describes their dream project in simple, natural language. Our advanced NLP parser extracts key intent, core themes, DeFi mechanics, and optimizes them for absolute virality.',
    icon: Sparkles,
    color: 'text-g',
    glowColor: 'rgba(0, 255, 136, 0.4)',
    pct: 10,
    mockJson: {
      "nlp_engine": "Gemini-Solaxy-NLP-v4",
      "sentiment_score": 0.998,
      "detected_motifs": ["meme", "cyberpunk", "high_yield"],
      "token_mood": "hyped_bullish"
    }
  },
  {
    id: 'analysis',
    namePl: '2. Analiza AI',
    nameEn: '2. AI Concept Analysis',
    taglinePl: 'Badanie nisz rynkowych i viral-potential',
    taglineEn: 'Market gap analysis & viral potential optimization',
    descPl: 'Sztuczna inteligencja Gemini bada aktualne trendy on-chain, analizuje konkurencję w danej kategorii i modeluje matematycznie wskaźniki zaangażowania społeczności dla Twojej monety.',
    descEn: 'Gemini AI scans active on-chain trends, evaluates competition in the selected category, and mathematically models community engagement indicators for your custom asset.',
    icon: Search,
    color: 'text-cyan',
    glowColor: 'rgba(0, 238, 255, 0.4)',
    pct: 20,
    mockJson: {
      "competitor_analysis": "completed",
      "target_audience": "Solana Degens & Meme Enthusiasts",
      "virality_coefficient": "x14.8_boost",
      "dynamic_shill_score": "98.9%"
    }
  },
  {
    id: 'branding',
    namePl: '3. Generowanie Logo',
    nameEn: '3. Logo & Branding AI',
    taglinePl: 'Projektowanie unikalnych wektorów i gradientów',
    taglineEn: 'Dynamic vector mapping & custom color matching',
    descPl: 'Zautomatyzowana kuźnia graficzna mapuje wygenerowany motyw, przyporządkowując mu pasującą matrycę ikony, barwny gradient wizualny oraz pozycję matrycy maskotki Solaxy.',
    descEn: 'Our automated graphic forge maps the generated theme, allocating a matching icon vector, customized color gradient, and specific mascot coordinates.',
    icon: Palette,
    color: 'text-purple',
    glowColor: 'rgba(123, 45, 255, 0.4)',
    pct: 30,
    mockJson: {
      "asset_type": "Metaplex_Vector_SVG",
      "gradient_from": "#00ff88",
      "gradient_to": "#00eeff",
      "app_icon_render_time": "14ms"
    }
  },
  {
    id: 'tokenomics',
    namePl: '4. Tokenomika AI',
    nameEn: '4. Tokenomics Design',
    taglinePl: 'Ustalanie zbalansowanej podaży i mechanizmów',
    taglineEn: 'Mathematical optimization of supply allocations',
    descPl: 'Matematyczny kalkulator modeluje zrównoważoną podaż, alokacje dla zespołu (0% dev-dump), limity transakcyjne, podatki marketingowe oraz deflacyjne mechanizmy spalania (auto-burn).',
    descEn: 'Our tokenomics engine models a highly balanced total supply, fair team allocations (0% dev dumping), tx transaction limits, and integrated deflationary burning rules.',
    icon: Coins,
    color: 'text-amber-400',
    glowColor: 'rgba(251, 191, 36, 0.4)',
    pct: 40,
    mockJson: {
      "total_supply": 1000000000,
      "burn_tax": "1.50%",
      "liquidity_allocation_pct": "80.00%",
      "vesting_period_months": 12
    }
  },
  {
    id: 'contract',
    namePl: '5. Smart Contract',
    nameEn: '5. Smart Contract code',
    taglinePl: 'Generowanie czystego kodu Anchor framework w Rust',
    taglineEn: 'Synthesizing audited Anchor Rust program code',
    descPl: 'AI projektuje i generuje w pełni gotowy, bezpieczny kod on-chain programu w języku Rust dla Solana Virtual Machine, zgodny ze standardami bezpieczeństwa i odporny na exploity.',
    descEn: 'The AI synthesizes fully complete, audited on-chain Rust code using the Anchor framework for the Solana Virtual Machine, certified secure against common reentrancy exploits.',
    icon: Code,
    color: 'text-r',
    glowColor: 'rgba(255, 26, 74, 0.4)',
    pct: 50,
    mockJson: {
      "framework": "Anchor_v0.29.0",
      "language": "Rust",
      "bytecode_target": "BPF_SVM_V3",
      "security_auditor_score": "100.00/100.00"
    }
  },
  {
    id: 'deployment',
    namePl: '6. Wdrożenie on-chain',
    nameEn: '6. SVM Deployment',
    taglinePl: 'Kompilacja Cargo, rent-exempt i rejestracja programu',
    taglineEn: 'Cargo compiling, account allocation & activation',
    descPl: 'Kompilacja kodu Rust, przesyłanie sygnatury transakcji, opłacanie zwolnienia z czynszu (rent-exempt) i utworzenie konta mennicy (Mint Account) na żywo w sieci Solana.',
    descEn: 'Compiling Rust code to BPF bytes, sending auth signatures, financing rent-exemption fees, and registering the Mint Account live on the Solana Virtual Machine.',
    icon: Cpu,
    color: 'text-g',
    glowColor: 'rgba(0, 255, 136, 0.4)',
    pct: 60,
    mockJson: {
      "program_address": "SLXForgevH1Yp92oWkMshv8q4982aQjKw9fH38s",
      "sol_gas_used": 0.01482,
      "network_epoch": 612,
      "confirmation_state": "finalized"
    }
  },
  {
    id: 'liquidity',
    namePl: '7. Dodanie płynności',
    nameEn: '7. Adding Liquidity',
    taglinePl: 'Automatyczna alokacja puli i locking LP',
    taglineEn: 'Constant-product AMM initialization & lock',
    descPl: 'Nasze AMM rezerwuje 80% całkowitej podaży tokenów i łączy ją w parę z SOL, tworząc nową, aktywną pulę płynności handlowej z trwale zablokowanym tokenem LP (renounce burn).',
    descEn: 'Our decentralized AMM takes 80% of the total minted supply and pairs it with SOL, initializing a liquid pool with permanently burned Liquidity Pool tokens.',
    icon: ArrowDownUp,
    color: 'text-cyan',
    glowColor: 'rgba(0, 238, 255, 0.4)',
    pct: 70,
    mockJson: {
      "amm_mechanism": "Solaxy_Constant_Product",
      "initial_sol_in_pool": 10.0,
      "liquidity_pool_address": "LP_92HjkXp92aKswW..._locked",
      "slippage_resistance": "99.8%"
    }
  },
  {
    id: 'webspace',
    namePl: '8. Uruchomienie strony',
    nameEn: '8. AI Landing Page',
    taglinePl: 'Dedykowana neonowa witryna dla społeczności',
    taglineEn: 'Generating decentralized web portal with widgets',
    descPl: 'Automatyczny generator stron Solaxy buduje unikalną, bezpieczną mikro-witrynę dla Twojego nowego tokenu, wyposażoną w dynamiczne wykresy cenowe oraz zintegrowany widget swap.',
    descEn: 'The Solaxy generator provisions a gorgeous, secure landing page subdomain for your token, packed with interactive charting and immediate swap routing tools.',
    icon: Globe,
    color: 'text-purple',
    glowColor: 'rgba(123, 45, 255, 0.4)',
    pct: 80,
    mockJson: {
      "website_subdomain": "meme-token.solaxy.dex",
      "hosting_nodes": ["IPFS", "Arweave"],
      "ssl_certificate": "active_lets_encrypt",
      "swap_widget": "enabled"
    }
  },
  {
    id: 'socials',
    namePl: '9. Publikacja Social',
    nameEn: '9. AI Social Broadcast',
    taglinePl: 'Automatyczne posty i viral marketing X / TG',
    taglineEn: 'Automated high-hype broadcast on X and TG',
    descPl: 'Zintegrowane boty AI automatycznie generują chwytliwe materiały promocyjne, tworząc zapowiedzi na platformach Twitter (X), Telegram oraz Reddit, aby przyciągnąć pierwszych kupujących.',
    descEn: 'AI agents immediately formulate highly engaging, localized promotional copy and broadcast launching announcements to X (Twitter), Telegram, and community hubs.',
    icon: Share2,
    color: 'text-pink-500',
    glowColor: 'rgba(236, 72, 153, 0.4)',
    pct: 90,
    mockJson: {
      "tweet_status": "SENT",
      "telegram_channel_broadcast": "completed",
      "ai_copywriters": ["DeFi_Hype_Agent", "Meme_Shill_V3"],
      "estimated_reach_impressions": "15,000+"
    }
  },
  {
    id: 'dexlisting',
    namePl: '10. Listing na DEX',
    nameEn: '10. DEX Directory Listing',
    taglinePl: 'Rejestracja w indeksach i natychmiastowy trading',
    taglineEn: 'Syncing token directory with DEX search index',
    descPl: 'Nowy token zostaje wpisany do głównego rejestru rynków Solaxy DEX, dając mu pełną ekspozycję i pozwalając tysiącom aktywnych inwestorów na jego natychmiastowy zakup.',
    descEn: 'Your new asset gets index-registered in the main Solaxy ecosystem list, ensuring immediate discoverability and real-time transaction tracking for our entire userbase.',
    icon: CheckCircle2,
    color: 'text-amber-400',
    glowColor: 'rgba(251, 191, 36, 0.4)',
    pct: 95,
    mockJson: {
      "solaxy_dex_listing_id": "SLX_DIR_M41",
      "api_index_status": "synced",
      "search_keywords": ["meme", "ai_crafted", "hot_gem"],
      "ticker_display": "ENABLED"
    }
  },
  {
    id: 'governance',
    namePl: '11. Panel Zarządzania',
    nameEn: '11. Admin Management',
    taglinePl: 'Uruchomienie konsoli administratora, stakingu i burna',
    taglineEn: 'Initializing active console for token owners',
    descPl: 'Ostatni krok aktywuje dedykowany panel zarządzania dla twórcy projektu, dający kontrolę nad parametrami APY stakingu, ręcznym wyzwalaniem spalania oraz śledzeniem holderów.',
    descEn: 'The final step unlocks your personalized management dashboard to initiate custom community staking programs, launch manual token burning, and view holders charts.',
    icon: Sliders,
    color: 'text-r',
    glowColor: 'rgba(255, 26, 74, 0.4)',
    pct: 100,
    mockJson: {
      "admin_privileges": "owner_active",
      "holder_chart": "live",
      "staking_incentives": "configurable",
      "deflation_module": "online"
    }
  }
];

interface TokenLifecyclePipelineProps {
  activeStepIdx: number; // Current deploy index or overall step
  isDeploying: boolean;  // Whether currently emitting
  token?: any | null;    // Dynamic token context
}

function getDynamicTelemetry(stepId: string, token: any, defaultMockJson: any) {
  if (!token) return defaultMockJson;

  const tickerClean = (token.ticker || '$TOKEN').replace('$', '');
  const nameClean = (token.name || 'Token').replace(/[^a-zA-Z0-9]/g, '');

  switch (stepId) {
    case 'prompt':
      return {
        "nlp_engine": "Gemini-3.5-Solaxy-NLP-v9",
        "sentiment_score": 0.9992,
        "input_prompt_length": (token.description || "").length + 15,
        "detected_motifs": [
          "meme_coin",
          (token.colorGradient || "").includes('g') ? 'solana_green' : 'cyber_cyan',
          "deflationary",
          "fair_launch"
        ],
        "token_mood": "hyper_bullish",
        "semantic_integrity": "99.8%"
      };
    case 'analysis':
      return {
        "competitor_analysis": "COMPLETED - NO DIRECT MATCH",
        "market_gap_discovered": "High potential meme-narrative",
        "target_audience": (token.description || "").toLowerCase().match(/(kot|dog|pies|cat|doge|puppy)/) ? "Solana Degens & Animal Lovers" : "DeFi Yield & Staking Community",
        "virality_coefficient": "x28.4_hype_amplifier",
        "dynamic_shill_score": "99.4%",
        "market_sentiment": "OPTIMISTIC"
      };
    case 'branding':
      return {
        "asset_type": "Solaxy_HD_Vector_SVG_Engine_v2",
        "color_palette_gradient": token.colorGradient || "from-g to-cyan",
        "glow_intensity_rating": "9.8/10",
        "icon_type_resolved": token.iconType || "Coins",
        "app_icon_render_time": "8.4ms",
        "dimensions": "1024x1024px HD"
      };
    case 'tokenomics':
      return {
        "total_supply": token.supply || 1000000000,
        "liquidity_allocation_pct": "80.00%",
        "liquidity_allocation_tokens": Math.floor((token.supply || 1000000000) * 0.8),
        "marketing_burn_tax": "1.50% (Auto-Burn on Transfer)",
        "team_dev_allocation": "0.00% (No Dev Dump Guarantee)",
        "liquidity_lock_duration": "PERPETUAL (Permanently Burned LP)"
      };
    case 'contract':
      return {
        "anchor_version": "Anchor_v0.29.0",
        "compiler_target": "BPF_Solana_SVM_v3",
        "optimization_level": "Codegen optimized (O3)",
        "lines_of_rust_code": (token.anchorCode || "").split('\n').length,
        "security_score_certik": "100.00/100.00 (Flawless Audit)",
        "custom_mechanics_enabled": ["StakingRewards", "AutoBurn", "TaxDistribution"]
      };
    case 'deployment':
      return {
        "program_address": `SLX${tickerClean}vH1Y9x3Lp${tickerClean}eWks`,
        "sol_rent_exemption_fee": "0.01482 SOL",
        "epoch_at_deployment": 612,
        "gas_used_lamports": 458000,
        "transaction_signature": "5fG49s61Xj8GvA1h9x3Lp0sW7mQ91hN8zKqPx9a2fB81c",
        "confirmation_state": "finalized_on_chain"
      };
    case 'liquidity':
      return {
        "amm_pool_mechanism": "Solaxy_Constant_Product_V2",
        "paired_asset_sol": "10.0 SOL",
        "paired_token_supply": Math.floor((token.supply || 1000000000) * 0.8),
        "lp_token_address": `LP_${tickerClean}SOL_92HjKp99`,
        "liquidity_pool_status": "LOCKED_AND_BURNED",
        "slippage_resistance": "99.94%"
      };
    case 'webspace':
      return {
        "website_subdomain": `https://${(token.name || 'token').toLowerCase().replace(/[^a-z0-9]/g, '')}.solaxy.dex`,
        "hosting_nodes": ["IPFS_Decentralized", "Arweave_Permanent"],
        "ssl_certificate": "active_lets_encrypt_v2",
        "live_trading_widget": "ENABLED",
        "integrated_charting": "TRADINGVIEW_SVM"
      };
    case 'socials':
      return {
        "tweet_broadcast_status": "SENT_AUTOMATIC",
        "tweet_payload_chars": 234,
        "telegram_broadcast_channel_id": "@SolaxyDEX_New_Launches",
        "automated_reddit_shill": "completed_on_r/solana",
        "estimated_hype_impressions": "28,500+ (Extreme exposure)"
      };
    case 'dexlisting':
      return {
        "solaxy_dex_listing_id": `SLX_DIR_${tickerClean}_DEX`,
        "api_index_sync_status": "synced_fully",
        "search_keywords": ["meme", "ai_forged", tickerClean.toLowerCase(), "solaxy_ecosystem"],
        "dex_trading_pairs": [`${token.ticker || '$TOKEN'}/SOL`],
        "orderbook_initialized": "true"
      };
    case 'governance':
      return {
        "admin_console_access": "OWNER_AUTHORIZED",
        "holder_charts": "live_real_time",
        "staking_yield_apy": "164.8% (Dynamic)",
        "burn_mechanism_status": "ACTIVE",
        "dev_wallet_balance": "0.00 $SLX"
      };
    default:
      return defaultMockJson;
  }
}

export default function TokenLifecyclePipeline({ activeStepIdx, isDeploying, token }: TokenLifecyclePipelineProps) {
  const { t, language } = useLanguage();
  const [selectedStepIdx, setSelectedStepIdx] = useState<number>(0);

  // Sync selected index with active deployment step
  useEffect(() => {
    if (activeStepIdx >= 0) {
      setSelectedStepIdx(activeStepIdx);
    }
  }, [activeStepIdx]);

  const selectedStep = PIPELINE_STEPS[selectedStepIdx];
  const StepIcon = selectedStep.icon;

  return (
    <div className="border border-g/15 bg-black/60 p-5 font-mono relative overflow-hidden mt-6 rounded">
      {/* HUD aesthetics */}
      <span className="absolute top-0 left-0 w-3 h-[1px] bg-g shadow-[0_0_8px_#00ff88]" />
      <span className="absolute bottom-0 right-0 w-3 h-[1px] bg-g shadow-[0_0_8px_#00ff88]" />

      <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4 text-[10px]">
        <span className="text-g font-bold uppercase tracking-[2px] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-g animate-pulse" />
          {t('SOLAXY AUTOPILOT LAUNCH LIFE-CYCLE PIPELINE', 'SOLAXY AUTOPILOT LAUNCH LIFE-CYCLE PIPELINE')}
        </span>
        <span className="text-white/40 tracking-[1.5px] uppercase">
          {isDeploying ? t('STAN: TRWA EMISJA', 'STATUS: EMITTING LIVE') : t('STAN: GOTOWY', 'STATUS: STANDBY')}
        </span>
      </div>

      {/* Steps Track (Endless horizontal scroll or responsive layout) */}
      <div className="overflow-x-auto pb-4 pt-1 flex items-center gap-2 scrollbar-thin scrollbar-thumb-g/20 scrollbar-track-transparent">
        {PIPELINE_STEPS.map((step, idx) => {
          const StepNodeIcon = step.icon;
          const isSelected = selectedStepIdx === idx;
          
          // Determine status based on active deployment progress
          let isComplete = idx < activeStepIdx;
          let isActive = idx === activeStepIdx;
          
          // If not actively deploying, we simulate complete for steps 0-4 (since contract exists)
          if (!isDeploying && activeStepIdx === -1) {
            isComplete = idx <= 4;
            isActive = idx === 0;
          }

          return (
            <button
              key={step.id}
              onClick={() => setSelectedStepIdx(idx)}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 border relative transition-all duration-300 select-none cursor-pointer text-left outline-none ${
                isSelected 
                  ? 'border-g bg-g/5 text-white shadow-[0_0_12px_rgba(0,255,136,0.12)]' 
                  : isActive
                  ? 'border-cyan bg-cyan/5 text-cyan animate-pulse'
                  : isComplete
                  ? 'border-g/30 text-g/70 bg-g/[0.01]'
                  : 'border-white/5 text-white/30 hover:border-white/20 hover:text-white/60 bg-black/20'
              }`}
            >
              {/* Dynamic light connection indicator */}
              {isSelected && (
                <span className="absolute bottom-0 inset-x-0 h-[2px] bg-g shadow-[0_0_6px_#00ff88]" />
              )}

              <div className={`p-1 border rounded-sm shrink-0 ${
                isSelected ? 'bg-g/15 border-g/30' : 'bg-white/5 border-white/10'
              }`}>
                <StepNodeIcon className={`w-3.5 h-3.5 ${isSelected ? step.color : 'text-current'}`} />
              </div>

              <div>
                <div className="text-[9px] font-bold uppercase tracking-[0.5px]">
                  {language === 'pl' ? step.namePl.replace(/^\d+\.\s*/, '') : step.nameEn.replace(/^\d+\.\s*/, '')}
                </div>
                <div className="text-[7px] text-white/30 uppercase tracking-[1px] mt-0.5">
                  {isComplete ? (
                    <span className="text-g font-bold">✓ {t('ZAKOŃCZONO', 'COMPLETED')}</span>
                  ) : isActive ? (
                    <span className="text-cyan font-bold animate-pulse">➔ {t('ACTIVE', 'ACTIVE')}</span>
                  ) : (
                    <span>STAGE #0{idx + 1}</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Step Details Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedStep.id}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch bg-black/40 border border-white/5 p-4 rounded-sm"
        >
          {/* Left: Explanation and details */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className={`p-2 border border-white/10 bg-white/5 rounded-sm`}>
                  <StepIcon className={`w-5 h-5 ${selectedStep.color}`} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-[1px]">
                    {language === 'pl' ? selectedStep.namePl : selectedStep.nameEn}
                  </h4>
                  <div className="text-[9px] text-[#c8e6d2]/50 uppercase font-bold tracking-[1px] mt-0.5">
                    {language === 'pl' ? selectedStep.taglinePl : selectedStep.taglineEn}
                  </div>
                </div>
              </div>

              <p className="text-xs text-white/70 leading-relaxed font-mono mt-3">
                {language === 'pl' ? selectedStep.descPl : selectedStep.descEn}
              </p>
            </div>

            <div className="text-[8px] text-white/30 uppercase mt-4 border-t border-white/5 pt-2 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-white/30" />
              {t('KLIKNIJ DOWOLNY KROK POWYŻEJ, ABY ZADAĆ DIAGNOSTYKĘ', 'CLICK ANY LIFECYCLE NODE ABOVE TO EXAMINE THE BLUEPRINT')}
            </div>
          </div>

          {/* Right: Simulated futuristic telemetry HUD */}
          <div className="lg:col-span-5 flex flex-col bg-[#03060f] border border-white/5 p-3 font-mono relative overflow-hidden rounded-sm">
            <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-2 text-[8px] tracking-[1.5px] text-white/40 font-bold uppercase">
              <span className="flex items-center gap-1">
                <Terminal className="w-3 h-3 text-cyan" /> {t('TELEMTRIA PROCESU AI', 'AI PROCESS TELEMETRY')}
              </span>
              <span className="text-g">{t('DANE_STAŁE', 'STATIC_DATA')}</span>
            </div>

            <div className="flex-1 overflow-y-auto text-[9.5px] leading-relaxed text-cyan/80 p-1 select-text scrollbar-thin scrollbar-thumb-white/15 scrollbar-track-transparent max-h-[140px]">
              <pre className="whitespace-pre-wrap font-mono">
                {JSON.stringify(getDynamicTelemetry(selectedStep.id, token, selectedStep.mockJson), null, 2)}
              </pre>
            </div>

            <div className="border-t border-white/5 pt-2 mt-2 flex justify-between items-center text-[7.5px] text-white/30 tracking-[1.5px] uppercase font-bold">
              <span>{t('BUFOR TELEMETRII: OK', 'TELEMETRY BUFFER: OK')}</span>
              <span className="text-cyan animate-pulse">0x9F_SYNC_SYS</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
