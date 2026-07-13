import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { PresaleSection } from './PresaleSection';
import TokenOrb from './TokenOrb';
import SecuritySentinel from './SecuritySentinel';
import { useLanguage } from '../LanguageContext';
import ScrollReveal from './ScrollReveal';
import { 
  Flame, ShieldCheck, Cpu, Vote, TrendingUp, Sparkles, Zap, 
  Layers, Coins, Anchor, RefreshCw, BarChart3, HelpCircle, 
  ArrowRight, Landmark, Share2, Compass, Award, Terminal, Lock, Rocket
} from 'lucide-react';

interface PresalePageProps {
  t: (pl: string, en: string) => string;
}

interface TokenomicsCategory {
  namePl: string;
  nameEn: string;
  pct: number;
  amount: string;
  color: string;
  borderColor: string;
  shadowColor: string;
  vestingPl: string;
  vestingEn: string;
  descPl: string;
  descEn: string;
}

export default function PresalePage({ t }: PresalePageProps) {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'distribution' | 'utility' | 'deflation' | 'governance' | 'roadmap'>('distribution');
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [vestingSimMonths, setVestingSimMonths] = useState<number>(0);

  // 10 Billion $SLX Fixed Supply
  const totalSupply = 10000000000;

  const categories: TokenomicsCategory[] = [
    {
      namePl: 'Nagrody dla Społeczności',
      nameEn: 'Community Rewards',
      pct: 28,
      amount: '2,800,000,000',
      color: 'bg-[#00ff88]',
      borderColor: 'border-[#00ff88]',
      shadowColor: 'rgba(0, 255, 136, 0.4)',
      vestingPl: 'Brak blokady. Rozdysponowywane cyklicznie dla aktywnych użytkowników, stakerów i górników.',
      vestingEn: 'No lock. Disbursed periodically to active users, stakers, and miners.',
      descPl: 'Fundusz wspierający programy miningowe, staking, zrzuty (airdropy) oraz konkursy i aktywność społeczności.',
      descEn: 'Fund supporting mining programs, staking, drops (airdrops), as well as competitions and community activity.'
    },
    {
      namePl: 'Skarbiec Ekosystemu',
      nameEn: 'Ecosystem Treasury',
      pct: 20,
      amount: '2,000,000,000',
      color: 'bg-[#00eeff]',
      borderColor: 'border-[#00eeff]',
      shadowColor: 'rgba(0, 238, 255, 0.4)',
      vestingPl: 'Zarządzany w pełni przez DAO. Odblokowanie wyłącznie na drodze publicznego głosowania społeczności.',
      vestingEn: 'Fully DAO managed. Unlockable strictly via public community voting.',
      descPl: 'Rezerwy finansowe na długoterminowe partnerstwa strategiczne, płynność giełdową oraz kluczowe granty.',
      descEn: 'Financial reserves for long-term strategic partnerships, exchange liquidity, and key grants.'
    },
    {
      namePl: 'Nagrody za Staking',
      nameEn: 'Staking Rewards',
      pct: 16,
      amount: '1,600,000,000',
      color: 'bg-[#a855f7]',
      borderColor: 'border-[#a855f7]',
      shadowColor: 'rgba(168, 85, 247, 0.4)',
      vestingPl: 'Uwalniane dynamicznie w zależności od wolumenu stakowanych tokenów w sieci.',
      vestingEn: 'Released dynamically depending on the volume of staked tokens in the network.',
      descPl: 'Długofalowy program nagradzania użytkowników blokujących swoje tokeny w celu stabilizacji ekosystemu.',
      descEn: 'Long-term program for rewarding users who lock their tokens to stabilize the ecosystem.'
    },
    {
      namePl: 'Płynność (DEX/CEX)',
      nameEn: 'Liquidity',
      pct: 10,
      amount: '1,000,000,000',
      color: 'bg-[#facc15]',
      borderColor: 'border-[#facc15]',
      shadowColor: 'rgba(250, 204, 21, 0.4)',
      vestingPl: '100% odblokowane przy starcie projektu, przeznaczone bezpośrednio do pul płynności.',
      vestingEn: '100% unlocked at project launch, allocated directly to liquidity pools.',
      descPl: 'Gwarancja minimalnego poślizgu cenowego na zdecentralizowanych i scentralizowanych giełdach.',
      descEn: 'Guarantee of minimal price slippage on decentralized and centralized exchanges.'
    },
    {
      namePl: 'Fundusz Rozwoju AI',
      nameEn: 'AI Development Fund',
      pct: 8,
      amount: '800,000,000',
      color: 'bg-[#f43f5e]',
      borderColor: 'border-[#f43f5e]',
      shadowColor: 'rgba(244, 63, 94, 0.4)',
      vestingPl: 'Liniowy vesting przez 24 miesiące, z przeznaczeniem na infrastrukturę AI oraz badania naukowe.',
      vestingEn: 'Linear vesting over 24 months, dedicated to AI infrastructure and research.',
      descPl: 'Zabezpieczenie środków na serwery LLM, procesory graficzne (GPU) oraz ulepszanie modeli Solaxy AI.',
      descEn: 'Securing resources for LLM servers, graphics processors (GPUs), and upgrading Solaxy AI models.'
    },
    {
      namePl: 'Partnerzy Strategiczni',
      nameEn: 'Strategic Partners',
      pct: 7,
      amount: '700,000,000',
      color: 'bg-[#fb923c]',
      borderColor: 'border-[#fb923c]',
      shadowColor: 'rgba(251, 146, 60, 0.4)',
      vestingPl: '6 miesięcy Cliff (całkowita blokada), następnie odblokowanie liniowe przez kolejne 24 miesiące.',
      vestingEn: '6 months Cliff (total lock), followed by linear unlock over the next 24 months.',
      descPl: 'Środki dla kluczowych inwestorów, doradców technologicznych i integracji z zewnętrznymi blockchainami.',
      descEn: 'Funds for key investors, technology advisors, and integrations with external blockchains.'
    },
    {
      namePl: 'Zespół Deweloperski',
      nameEn: 'Team',
      pct: 6,
      amount: '600,000,000',
      color: 'bg-[#ec4899]',
      borderColor: 'border-[#ec4899]',
      shadowColor: 'rgba(236, 72, 153, 0.4)',
      vestingPl: '12 miesięcy Cliff (pełna blokada), po którym następuje liniowe uwalnianie przez 36 miesięcy (Łącznie 4 lata).',
      vestingEn: '12 months Cliff (full lock), followed by linear release over 36 months (Total 4 years).',
      descPl: 'Zabezpieczenie ciągłości rozwoju kodu, twórców platformy oraz motywacja dla inżynierów Solaxy.',
      descEn: 'Ensuring continuous code development, platform creators, and motivation for Solaxy engineers.'
    },
    {
      namePl: 'Marketing i Wzrost',
      nameEn: 'Marketing & Growth',
      pct: 3,
      amount: '300,000,000',
      color: 'bg-[#14b8a6]',
      borderColor: 'border-[#14b8a6]',
      shadowColor: 'rgba(20, 184, 166, 0.4)',
      vestingPl: 'Liniowy vesting uwalniany co miesiąc przez okres 36 miesięcy.',
      vestingEn: 'Linear vesting released monthly over a period of 36 months.',
      descPl: 'Budżet na globalne kampanie marketingowe, partnerstwa z influencerami, targi Web3 i ekspansję.',
      descEn: 'Budget for global marketing campaigns, influencer partnerships, Web3 trade shows, and expansion.'
    },
    {
      namePl: 'Rezerwa Bezpieczeństwa',
      nameEn: 'Security Reserve',
      pct: 2,
      amount: '200,000,000',
      color: 'bg-[#6366f1]',
      borderColor: 'border-[#6366f1]',
      shadowColor: 'rgba(99, 102, 241, 0.4)',
      vestingPl: 'Zablokowane na wypadek incydentów sieciowych lub potrzeb nagłego audytu smart kontraktów.',
      vestingEn: 'Locked for network incidents or emergency smart contract audit needs.',
      descPl: 'Fundusz ubezpieczeniowy oraz rezerwa dla audytorów bezpieczeństwa i badaczy (Bug Bounty) dbających o stabilność Solaxy.',
      descEn: 'Insurance fund and reserve for security auditors and researchers (Bug Bounty) maintaining Solaxy stability.'
    }
  ];

  const utilities = [
    {
      titlePl: 'AI Launchpad',
      titleEn: 'AI Launchpad',
      descPl: 'Priorytetowy dostęp i alokacja w nowych projektach wypuszczanych przez AI.',
      descEn: 'Priority access and allocation in new projects launched by AI.',
      icon: Rocket,
      color: 'text-g',
    },
    {
      titlePl: 'Rynek Agentów AI',
      titleEn: 'AI Agent Marketplace',
      descPl: 'Waluta rozliczeniowa przy zakupie, sprzedaży i licencjonowaniu wyspecjalizowanych botów.',
      descEn: 'Settlement currency for purchasing, selling, and licensing specialized bots.',
      icon: Cpu,
      color: 'text-cyan',
    },
    {
      titlePl: 'Automatyzacja AI',
      titleEn: 'AI Automation',
      descPl: 'Opłacanie cyklicznych zadań marketingowych, analitycznych i handlowych wykonywanych przez AI.',
      descEn: 'Paying for recurring marketing, analytical, and trading tasks executed by AI.',
      icon: Zap,
      color: 'text-purple',
    },
    {
      titlePl: 'Wdrożenia Tokenów',
      titleEn: 'Token Launch',
      descPl: 'Tworzenie i wdrażanie własnych tokenów wymaga posiadania i zablokowania $SLX.',
      descEn: 'Creating and deploying your own tokens requires holding and locking $SLX.',
      icon: Coins,
      color: 'text-g',
    },
    {
      titlePl: 'Staking',
      titleEn: 'Staking',
      descPl: 'Blokuj tokeny w celu zabezpieczenia sieci i odbieraj do 30% przychodów z opłat platformy.',
      descEn: 'Lock tokens to secure the network and receive up to 30% of platform fee revenues.',
      icon: Anchor,
      color: 'text-cyan',
    },
    {
      titlePl: 'Zarządzanie DAO',
      titleEn: 'Governance',
      descPl: 'Współdecyduj o kierunkach rozwoju platformy, zmianach opłat i dysponowaniu Skarbcem.',
      descEn: 'Co-decide on platform development directions, fee updates, and Treasury allocations.',
      icon: Vote,
      color: 'text-purple',
    },
    {
      titlePl: 'Premium Dashboard',
      titleEn: 'Premium Dashboard',
      descPl: 'Dostęp do zaawansowanych metryk rynkowych i analityki on-chain w czasie rzeczywistym.',
      descEn: 'Access to advanced market metrics and on-chain analytics in real time.',
      icon: BarChart3,
      color: 'text-g',
    },
    {
      titlePl: 'Kredyty API AI',
      titleEn: 'AI API Credits',
      descPl: 'Bezpośrednia integracja deweloperska z naszymi modelami AI dla zewnętrznych aplikacji.',
      descEn: 'Direct developer integration with our AI models for external applications.',
      icon: Terminal,
      color: 'text-cyan',
    },
    {
      titlePl: 'Emisje NFT',
      titleEn: 'NFT Mint',
      descPl: 'Generowanie grafik HD oraz mintowanie unikalnych NFT reprezentujących cyfrową tożsamość.',
      descEn: 'Generating HD graphics and minting unique NFTs representing digital identity.',
      icon: Award,
      color: 'text-purple',
    },
    {
      titlePl: 'Most Cross-chain',
      titleEn: 'Cross-chain Bridge',
      descPl: 'Opłaty za natychmiastowe transfery płynności między Solaną a innymi głównymi sieciami EVM.',
      descEn: 'Fees for instant liquidity transfers between Solana and other major EVM networks.',
      icon: RefreshCw,
      color: 'text-g',
    },
    {
      titlePl: 'Opłaty Giełdowe',
      titleEn: 'Marketplace Fees',
      descPl: 'Zniżki do 50% na opłaty transakcyjne na DEX Solaxy przy pokrywaniu ich w $SLX.',
      descEn: 'Discounts up to 50% on trading fees on Solaxy DEX when covered in $SLX.',
      icon: Landmark,
      color: 'text-cyan',
    },
    {
      titlePl: 'Nagrody Twórców',
      titleEn: 'Creator Rewards',
      descPl: 'Bezpośrednie wsparcie i tipping dla autorów najlepszych pomysłów i promptów w ekosystemie.',
      descEn: 'Direct support and tipping for authors of the best ideas and prompts in the ecosystem.',
      icon: Share2,
      color: 'text-purple',
    }
  ];

  const deflationMechs = [
    {
      titlePl: 'Skup i Spalanie (20%)',
      titleEn: 'Buyback & Burn (20%)',
      descPl: '20% wszystkich opłat z transakcji, wdrożeń i giełdy jest automatycznie przeznaczane na odkupienie $SLX z rynku i ich trwałe usunięcie (spalenie).',
      descEn: '20% of all fees from transactions, deployments, and marketplace is automatically used to buy back $SLX from the market and permanently burn them.',
      metric: '20% Fees',
      icon: Flame,
      color: 'text-red-500'
    },
    {
      titlePl: 'Revenue Sharing (30%)',
      titleEn: 'Revenue Sharing (30%)',
      descPl: '30% przychodów generowanych przez ekosystem Solaxy trafia bezpośrednio do puli stakingowej jako nagroda dla lojalnych posiadaczy tokenów.',
      descEn: '30% of revenues generated by the Solaxy ecosystem goes directly into the staking pool as a reward for loyal token holders.',
      metric: '30% Revenue',
      icon: Share2,
      color: 'text-g'
    },
    {
      titlePl: 'Automatyczny Buyback',
      titleEn: 'Automatic Buyback',
      descPl: 'Zautomatyzowane algorytmy monitorują napływ kapitału i aktywują mechanizmy skupowania tokena z rynku przy wysokich zyskach platformy.',
      descEn: 'Automated algorithms monitor capital inflow and activate market buyback mechanisms during periods of high platform earnings.',
      metric: 'Smart Trigger',
      icon: RefreshCw,
      color: 'text-cyan'
    },
    {
      titlePl: 'Blokady Twórców (Lock)',
      titleEn: 'Creator Locks',
      descPl: 'Uruchomienie jakiegokolwiek projektu na naszym AI Launchpadzie wymaga od dewelopera zablokowania określonej ilości $SLX na czas trwania presale.',
      descEn: 'Launching any project on our AI Launchpad requires the developer to lock a specified amount of $SLX for the duration of the presale.',
      metric: 'Anti-Rug Lock',
      icon: Lock,
      color: 'text-purple'
    }
  ];

  const aiEconomyAgents = [
    { name: 'Social AI', rolePl: 'Generowanie postów i virali', roleEn: 'Post & viral generation', fee: '0.05 $SLX / prompt' },
    { name: 'Trading AI', rolePl: 'Autonomiczny trading na DEX', roleEn: 'Autonomous DEX trading', fee: '0.1% volume' },
    { name: 'Marketing AI', rolePl: 'Prowadzenie kampanii reklamowych', roleEn: 'Ad campaign management', fee: '5.00 $SLX / day' },
    { name: 'Security AI', rolePl: 'Audytowanie smart kontraktów', roleEn: 'Smart contract auditing', fee: '25.00 $SLX / audit' },
    { name: 'Analytics AI', rolePl: 'Analiza on-chain i sentymentu', roleEn: 'On-chain & sentiment analysis', fee: '0.02 $SLX / query' }
  ];

  const governanceTopics = [
    {
      titlePl: 'Wdrażanie Nowych Funkcji',
      titleEn: 'New Feature Deployments',
      descPl: 'Głosuj na to, które moduły AI i innowacje deweloperskie powinny zostać wdrożone w następnej kolejności.',
      descEn: 'Vote on which AI modules and developer innovations should be implemented next.'
    },
    {
      titlePl: 'Dysponowanie Skarbcem',
      titleEn: 'Treasury Management',
      descPl: 'DAO decyduje o wysokości grantów dla zewnętrznych deweloperów oraz alokacjach rezerw.',
      descEn: 'The DAO decides on the amount of grants for external developers and reserve allocations.'
    },
    {
      titlePl: 'Konfiguracja Opłat i Spaleń',
      titleEn: 'Fee & Burn Configurations',
      descPl: 'Dostosowywanie procentu opłat przeznaczanych na staking (Revenue Sharing) oraz bezpośrednie spalanie.',
      descEn: 'Adjusting the percentage of fees allocated for staking (Revenue Sharing) and direct burning.'
    }
  ];

  const roadmapPhases = [
    {
      phase: 'FAZA 1',
      titlePl: 'Fundamenty Ekosystemu',
      titleEn: 'Ecosystem Foundations',
      pointsPl: [
        'Uruchomienie oficjalnego protokołu Solaxy i rozpoczęcie presale $SLX.',
        'Wdrożenie bezpiecznych pul stakingowych o zmiennym APY.',
        'Integracja cross-chain bridge do szybkich transferów EVM.',
        'Premiera interaktywnego panelu analitycznego Live AI Dashboard.'
      ],
      pointsEn: [
        'Launch of the official Solaxy protocol and start of $SLX presale.',
        'Implementation of secure staking pools with variable APY.',
        'Integration of a cross-chain bridge for rapid EVM transfers.',
        'Premiere of the interactive Live AI Dashboard.'
      ]
    },
    {
      phase: 'FAZA 2',
      titlePl: 'Wielka Eksplozja AI',
      titleEn: 'AI Great Explosion',
      pointsPl: [
        'Uruchomienie rynku Agentów AI (AI Agent Marketplace).',
        'Premiera generatora tokenów i smart kontraktów AI Token Factory.',
        'Wdrożenie asystenta AI ze wsparciem dla promptów głosowych.',
        'Przekazanie uprawnień decyzyjnych do zdecentralizowanego Solaxy DAO.'
      ],
      pointsEn: [
        'Launch of the AI Agent Marketplace.',
        'Premiere of the token and smart contract generator, AI Token Factory.',
        'Implementation of the AI assistant supporting voice prompts.',
        'Transfer of decision-making authority to the decentralized Solaxy DAO.'
      ]
    },
    {
      phase: 'FAZA 3',
      titlePl: 'Ekspansja i Mobilność',
      titleEn: 'Expansion & Mobility',
      pointsPl: [
        'Wydanie dedykowanej aplikacji mobilnej Solaxy na systemy iOS i Android.',
        'Integracja płatności fiat i rozszerzenie mostów międzyłańcuchowych.',
        'Oficjalne listingi tokena $SLX na największych giełdach Tier-1 CEX.',
        'Udostępnienie publicznego API dla zewnętrznych programistów.'
      ],
      pointsEn: [
        'Release of the dedicated Solaxy mobile app on iOS and Android.',
        'Fiat payment integration and expansion of cross-chain bridges.',
        'Official listings of the $SLX token on leading Tier-1 CEXs.',
        'Providing public API access for third-party developers.'
      ]
    },
    {
      phase: 'FAZA 4',
      titlePl: 'Autonomiczna Dominacja',
      titleEn: 'Autonomous Dominance',
      pointsPl: [
        'Ekosystem staje się w pełni autonomiczny, zarządzany w 100% przez DAO.',
        'Uruchomienie globalnego funduszu grantowego dla twórców aplikacji AI.',
        'Strategiczne partnerstwa rządowe i korporacyjne w zakresie AI.',
        'Ekspansja na nowe technologie sieciowe i rozwiązania warstwy 2 (Layer 2).'
      ],
      pointsEn: [
        'Ecosystem becomes fully autonomous, managed 100% by the DAO.',
        'Launch of a global grant fund for AI application creators.',
        'Strategic government and corporate AI partnerships.',
        'Expansion to new network technologies and Layer 2 solutions.'
      ]
    }
  ];

  // Calculate simulated unlocked tokens based on selected Category and selected Month
  const getSimulatedUnlock = () => {
    const cat = categories[selectedCategory];
    const rawVal = parseFloat(cat.amount.replace(/,/g, ''));
    if (cat.nameEn === 'Team') {
      if (vestingSimMonths < 12) return 0;
      const linearMonths = Math.min(vestingSimMonths - 12, 36);
      return Math.floor((rawVal * linearMonths) / 36);
    } else if (cat.nameEn === 'Strategic Partners') {
      if (vestingSimMonths < 6) return 0;
      const linearMonths = Math.min(vestingSimMonths - 6, 24);
      return Math.floor((rawVal * linearMonths) / 24);
    } else if (cat.nameEn === 'Marketing & Growth') {
      const linearMonths = Math.min(vestingSimMonths, 36);
      return Math.floor((rawVal * linearMonths) / 36);
    } else if (cat.nameEn === 'AI Development Fund') {
      const linearMonths = Math.min(vestingSimMonths, 24);
      return Math.floor((rawVal * linearMonths) / 24);
    } else if (cat.nameEn === 'Community Rewards' || cat.nameEn === 'Liquidity' || cat.nameEn === 'Security Reserve' || cat.nameEn === 'Staking Rewards' || cat.nameEn === 'Ecosystem Treasury') {
      // Unlocked or dynamic
      return rawVal;
    }
    return rawVal;
  };

  return (
    <div className="pt-[110px] bg-gradient-to-b from-[#020612] via-[#04091a] to-[#01050e] text-white min-h-screen">
      
      {/* ══ PRESALE SECTION WITH ANIMATED COUNTDOWN TIMER ══ */}
      <div className="pt-8">
        <PresaleSection />
      </div>

      {/* ══ QUANTUM TOKENOMICS DASHBOARD SECTION ══ */}
      <motion.section 
        id="token" 
        className="relative z-[10] py-16 sm:py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto border-t border-g/10"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        
        {/* Glow behind section title */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-96 h-96 bg-g/5 rounded-full blur-[150px] pointer-events-none" />

        <ScrollReveal direction="up" delay={50} duration={900}>
          <div className="text-center mb-16 relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-g/5 border border-g/15 rounded-full text-[9px] tracking-[3px] text-g uppercase mb-4 font-mono">
              <span className="w-1.5 h-1.5 bg-g rounded-full animate-ping" />
              {t('SPRAWIEDLIWA EMISJA & ARCHITEKTURA SYGNOWANA AI', 'FAIR LAUNCH & AI SIGNED ARCHITECTURE')}
            </div>
            <h2 className="font-display text-4xl sm:text-6xl uppercase tracking-[2px] font-black">
              Tokenomika <span className="text-g text-shadow-[0_0_15px_rgba(0,255,136,0.3)]">$SLX</span>
            </h2>
            <p className="text-sm text-[#c8e6d2]/60 max-w-3xl mx-auto mt-4 leading-relaxed">
              {t(
                'Projekt Solaxy został zaprojektowany z myślą o wieloletnim wzroście i maksymalizacji realnej użyteczności. Całkowita, stała podaż wynosi 10 000 000 000 $SLX bez możliwości ponownego wybicia (mintowania). Każdy mechanizm wspiera deflację i lojalnych stakerów.',
                'The Solaxy project is engineered for long-term compounding growth and absolute utility. Total fixed supply is capped at 10,000,000,000 $SLX with no reminting capabilities. Every mechanism supports deflation and loyal stakers.'
              )}
            </p>
          </div>
        </ScrollReveal>

        {/* TAB NAVIGATION FOR PREMIUM DASHBOARD */}
        <ScrollReveal direction="up" delay={150} duration={850}>
          <div className="flex flex-wrap justify-center gap-2 mb-12 border-b border-white/10 pb-4 relative z-10">
            {[
              { id: 'distribution', labelPl: 'Dystrybucja i Vesting', labelEn: 'Distribution & Vesting', icon: Layers },
              { id: 'utility', labelPl: 'Użyteczność Tokena', labelEn: 'Token Utility', icon: Coins },
              { id: 'deflation', labelPl: 'Mechanizmy Deflacyjne', labelEn: 'Deflationary Engine', icon: Flame },
              { id: 'governance', labelPl: 'Zarządzanie DAO', labelEn: 'DAO Governance', icon: Vote },
              { id: 'roadmap', labelPl: 'Strategia Rozwoju', labelEn: 'Roadmap Strategy', icon: Compass }
            ].map((tab) => {
              const TabIcon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono uppercase tracking-[1px] border transition-all duration-300 select-none cursor-pointer ${
                    active 
                      ? 'border-g bg-g/5 text-g shadow-[0_0_15px_rgba(0,255,136,0.15)]' 
                      : 'border-white/10 bg-white/[0.02] text-white/50 hover:text-white hover:border-white/20'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span>{t(tab.labelPl, tab.labelEn)}</span>
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* TAB 1: DISTRIBUTION & VESTING (INTERACTIVE GRAPHICAL MATRIX) */}
        {activeTab === 'distribution' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
          >
            
            {/* Interactive SVG Pie/Donut Chart Visualizer & Info Banner */}
            <ScrollReveal direction="left" delay={50} duration={850} className="lg:col-span-5 flex flex-col">
              <div className="w-full h-full border border-white/10 bg-black/40 backdrop-blur-md p-6 flex flex-col justify-between relative overflow-hidden rounded-lg">
              <div className="absolute top-0 right-0 w-32 h-[1px] bg-gradient-to-r from-transparent to-g shadow-[0_0_8px_#00ff88]" />
              <div className="absolute bottom-0 left-0 w-32 h-[1px] bg-gradient-to-r from-g to-transparent shadow-[0_0_8px_#00ff88]" />

              <div className="mb-6">
                <span className="text-[9px] font-mono tracking-[3px] text-g uppercase block mb-1">
                  {t('NATYWNY SYMULATOR STRUKTURY', 'NATIVE STRUCTURE SIMULATOR')}
                </span>
                <h3 className="font-display text-lg text-white font-extrabold uppercase tracking-[1px]">
                  {t('ALOKACJA ŚRODKÓW $SLX', '$SLX ASSET ALLOCATION')}
                </h3>
              </div>

              {/* Responsive SVG Donut Chart */}
              <div className="relative flex items-center justify-center my-6 h-[260px]">
                <svg className="w-56 h-56 transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background tracks */}
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="11" />
                  
                  {/* Segments calculation */}
                  {(() => {
                    let accumulatedPercent = 0;
                    return categories.map((cat, idx) => {
                      const strokeDashArray = `${cat.pct} ${100 - cat.pct}`;
                      const strokeDashOffset = 100 - accumulatedPercent;
                      accumulatedPercent += cat.pct;
                      const isHovered = hoveredCategory === idx || selectedCategory === idx;
                      
                      // Convert tailwind color class to hex approximation for SVG
                      let colorHex = '#00ff88';
                      if (cat.color.includes('cyan')) colorHex = '#00eeff';
                      else if (cat.color.includes('purple')) colorHex = '#a855f7';
                      else if (cat.color.includes('yellow')) colorHex = '#facc15';
                      else if (cat.color.includes('rose') || cat.color.includes('red') || cat.color.includes('f43f5e')) colorHex = '#f43f5e';
                      else if (cat.color.includes('orange') || cat.color.includes('fb923c')) colorHex = '#fb923c';
                      else if (cat.color.includes('pink') || cat.color.includes('ec4899')) colorHex = '#ec4899';
                      else if (cat.color.includes('teal')) colorHex = '#14b8a6';
                      else if (cat.color.includes('indigo')) colorHex = '#6366f1';

                      return (
                        <circle
                          key={idx}
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke={colorHex}
                          strokeWidth={isHovered ? '13' : '10'}
                          strokeDasharray={strokeDashArray}
                          strokeDashoffset={strokeDashOffset}
                          className="transition-all duration-300 cursor-pointer"
                          onMouseEnter={() => setHoveredCategory(idx)}
                          onMouseLeave={() => setHoveredCategory(null)}
                          onClick={() => setSelectedCategory(idx)}
                          pathLength="100"
                        />
                      );
                    });
                  })()}
                </svg>

                {/* Inner Text overlay with active category percent */}
                <div className="absolute text-center select-none pointer-events-none">
                  <span className="font-mono text-3xl font-black text-white leading-none block">
                    {categories[selectedCategory].pct}%
                  </span>
                  <span className="text-[8px] font-mono tracking-[2px] text-g/60 uppercase block mt-1">
                    $SLX POWERED
                  </span>
                </div>
              </div>

              {/* Total Supply Display */}
              <div className="border border-g/15 bg-g/5 p-4 rounded text-center">
                <div className="font-mono text-2xl font-bold tracking-[1.5px] text-g text-shadow-[0_0_10px_rgba(0,255,136,0.3)]">
                  10,000,000,000
                </div>
                <div className="text-[9px] font-mono text-white/40 uppercase tracking-[3px] mt-1">
                  {t('STAŁA CAŁKOWITA PODAŻ', 'FIXED TOTAL SUPPLY')}
                </div>
                <div className="text-[8px] text-g/60 font-mono mt-1 uppercase">
                  {t('BRAK MOŻLIWOŚCI DODATKOWEGO MINTERA', 'ZERO REMINTING ALLOWED')}
                </div>
              </div>

            </div>
            </ScrollReveal>

            {/* Distribution Categories Interactive Stack and Vesting Calculator */}
            <ScrollReveal direction="right" delay={150} duration={850} className="lg:col-span-7 flex flex-col">
              <div className="w-full h-full flex flex-col gap-6">
              
              {/* Categories scrollable/interactive list */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {categories.map((cat, idx) => {
                  const active = selectedCategory === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedCategory(idx)}
                      onMouseEnter={() => setHoveredCategory(idx)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      className={`text-left p-3 border transition-all duration-300 select-none cursor-pointer flex flex-col justify-between h-28 relative rounded ${
                        active 
                          ? 'border-g bg-g/5 shadow-[0_0_15px_rgba(0,255,136,0.08)]' 
                          : 'border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.02]'
                      }`}
                    >
                      {/* Left glowing border for active element */}
                      {active && <span className="absolute top-0 left-0 bottom-0 w-[2px] bg-g shadow-[0_0_6px_#00ff88]" />}
                      
                      <div className="flex justify-between items-start gap-1">
                        <span className="text-[10px] font-display text-white/80 font-bold leading-tight group-hover:text-white uppercase truncate">
                          {t(cat.namePl, cat.nameEn)}
                        </span>
                        <span className={`w-2 h-2 rounded-full ${cat.color} flex-shrink-0 mt-1 shadow-[0_0_6px_currentColor]`} />
                      </div>

                      <div>
                        <div className="font-mono text-base font-bold text-white tracking-[0.5px]">
                          {cat.amount}
                        </div>
                        <div className="flex justify-between items-center text-[9px] font-mono text-white/40 mt-1">
                          <span>$SLX Allocated</span>
                          <span className="text-g font-extrabold">{cat.pct}%</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Detailed Active Category Card with interactive Vesting Simulator */}
              <div className="border border-white/10 bg-[#050b18]/90 p-5 rounded-lg relative overflow-hidden flex-1">
                <div className="absolute top-0 right-0 p-3 text-[9px] font-mono text-white/20 uppercase tracking-[1px] border-l border-b border-white/5 bg-black/20">
                  {t('MODUŁ SZCZEGÓŁOWY', 'DETAILED CONSOLE')}
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <span className={`w-3 h-3 rounded-full ${categories[selectedCategory].color}`} />
                  <h4 className="font-display text-base font-bold text-white uppercase tracking-[1px]">
                    {t(categories[selectedCategory].namePl, categories[selectedCategory].nameEn)}
                  </h4>
                </div>

                <p className="text-xs text-[#c8e6d2]/60 leading-relaxed mb-6 border-b border-white/5 pb-4">
                  {t(categories[selectedCategory].descPl, categories[selectedCategory].descEn)}
                </p>

                {/* Vesting Schedule Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-[2px] text-g mb-2 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      {t('POLITYKA VESTINGU (ZABEZPIECZENIA)', 'VESTING POLICY & SECURITY')}
                    </div>
                    <p className="text-xs text-[#c8e6d2]/50 leading-relaxed bg-white/[0.01] border border-white/5 p-3 font-mono rounded">
                      {t(categories[selectedCategory].vestingPl, categories[selectedCategory].vestingEn)}
                    </p>
                  </div>

                  {/* Vesting Interactive Month Slider */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-[2px] text-cyan mb-2 flex justify-between">
                        <span>{t('SYMULATOR UWALNIANIA', 'RELEASE SIMULATOR')}</span>
                        <span className="text-white font-bold">{vestingSimMonths} {t('Mies.', 'Mo.')}</span>
                      </div>
                      
                      <input 
                        type="range" 
                        min="0" 
                        max="48" 
                        value={vestingSimMonths}
                        onChange={(e) => setVestingSimMonths(parseInt(e.target.value))}
                        className="w-full accent-[#00eeff] cursor-pointer bg-white/10 h-1 rounded-lg outline-none"
                      />
                      
                      <div className="flex justify-between text-[8px] font-mono text-white/30 mt-1">
                        <span>T0 (Start)</span>
                        <span>12m (Cliff Ends)</span>
                        <span>24m</span>
                        <span>36m</span>
                        <span>48m (Max)</span>
                      </div>
                    </div>

                    <div className="bg-cyan/5 border border-cyan/15 p-3 rounded mt-4 flex justify-between items-center">
                      <div>
                        <div className="text-[9px] font-mono text-cyan/60 uppercase tracking-[1px]">
                          {t('Odblokowane w miesiącu', 'Unlocked by month')} {vestingSimMonths}:
                        </div>
                        <div className="font-mono text-sm font-bold text-white mt-0.5">
                          {getSimulatedUnlock().toLocaleString()} $SLX
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-mono text-white/30 block uppercase">
                          {t('Procentowo', 'Percentage')}
                        </span>
                        <span className="text-cyan font-bold font-mono text-sm">
                          {((getSimulatedUnlock() / parseFloat(categories[selectedCategory].amount.replace(/,/g, ''))) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>

                  </div>
                </div>

              </div>

              </div>
            </ScrollReveal>

          </motion.div>
        )}

        {/* TAB 2: TOKEN UTILITY MATRIX */}
        {activeTab === 'utility' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-center mb-10">
              <span className="text-[9px] font-mono tracking-[4px] text-g uppercase block mb-1">
                {t('EKOSYSTEM PRAWDZIWEGO POPYTU', 'REAL DEMAND ECOSYSTEM')}
              </span>
              <h3 className="font-display text-xl text-white font-black uppercase tracking-[1px]">
                {t('UŻYTECZNOŚĆ TOKENA $SLX W SOLAXY', '$SLX TOKEN UTILITY CHANNELS')}
              </h3>
              <p className="text-xs text-[#c8e6d2]/50 max-w-2xl mx-auto mt-2">
                {t(
                  '$SLX nie jest kolejnym tokenem spekulacyjnym. Każda funkcja, agent AI, wdrożenie i akcja w ekosystemie Solaxy wymaga zaangażowania natywnego tokena.',
                  '$SLX is not another speculative token. Every feature, AI agent, deployment, and action in the Solaxy ecosystem requires engagement with the native token.'
                )}
              </p>
            </div>

            <ScrollReveal direction="up" delay={50} duration={800}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {utilities.map((ut, idx) => {
                  const IconComp = ut.icon;
                  return (
                    <div 
                      key={idx}
                      className="p-4 bg-white/[0.01] border border-white/5 hover:border-g/30 hover:bg-g/[0.02] transition-all duration-300 relative group rounded"
                    >
                      <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-white/15 group-hover:border-g transition-colors" />
                      <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-white/15 group-hover:border-g transition-colors" />
                      
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-white/5 border border-white/10 group-hover:bg-g/10 group-hover:border-g/20 transition-all rounded-sm">
                          <IconComp className={`w-4 h-4 ${ut.color}`} />
                        </div>
                        <h4 className="font-display text-[11.5px] font-extrabold text-white uppercase tracking-[0.5px]">
                          {t(ut.titlePl, ut.titleEn)}
                        </h4>
                      </div>

                      <p className="text-[10.5px] text-[#c8e6d2]/50 leading-relaxed group-hover:text-white/80 transition-colors">
                        {t(ut.descPl, ut.descEn)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </ScrollReveal>
          </motion.div>
        )}

        {/* TAB 3: DEFLATIONARY ENGINE & REVENUE SHARING */}
        {activeTab === 'deflation' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
          >
            
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="mb-2">
                <span className="text-[9px] font-mono tracking-[4px] text-g uppercase block mb-1">
                  {t('SZYBKOBIEŻNA DEFLACJA', 'HIGH VELOCITY DEFLATION')}
                </span>
                <h3 className="font-display text-xl text-white font-extrabold uppercase tracking-[1px]">
                  {t('MECHANIZMY SYSTEMU HIPER-DEFLACYJNEGO', 'HYPER-DEFLATIONARY SYSTEM MECHANICS')}
                </h3>
                <p className="text-xs text-[#c8e6d2]/50 mt-2 leading-relaxed">
                  {t(
                    'Każda interakcja sieciowa nakłada podatki oraz generuje mikro-prowizje, które są natychmiastowo kierowane do trwałych mechanizmów redukcji podaży oraz nagradzania inwestorów.',
                    'Every network interaction levies micro-fees that are instantly routed to permanent supply reduction mechanisms and investor reward distribution.'
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {deflationMechs.map((df, idx) => {
                  const IconComp = df.icon;
                  return (
                    <div 
                      key={idx}
                      className="p-4 bg-white/[0.01] border border-white/5 hover:border-cyan/30 hover:bg-cyan/[0.02] transition-all duration-300 relative rounded"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="p-2 bg-white/5 border border-white/10 rounded-sm">
                          <IconComp className={`w-4 h-4 ${df.color}`} />
                        </div>
                        <span className="px-2 py-0.5 border border-cyan/20 font-mono text-[8px] font-bold text-cyan bg-cyan/5 tracking-[1px] uppercase">
                          {df.metric}
                        </span>
                      </div>

                      <h4 className="font-display text-xs font-bold text-white uppercase tracking-[0.5px] mb-2">
                        {t(df.titlePl, df.titleEn)}
                      </h4>
                      
                      <p className="text-[10px] text-[#c8e6d2]/50 leading-relaxed">
                        {t(df.descPl, df.descEn)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Economy Fees Tracker Panel */}
            <div className="lg:col-span-5 border border-white/10 bg-[#040811]/90 p-5 rounded-lg relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-g" />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-g" />
              <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-g" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-g" />

              <div>
                <div className="flex justify-between items-center border-b border-white/15 pb-3 mb-4">
                  <h4 className="font-display text-xs font-extrabold text-white uppercase tracking-[1px] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-g rounded-full animate-pulse" />
                    {t('CENNIK AI ECONOMY FEES', 'AI ECONOMY FEES SCHEDULE')}
                  </h4>
                  <span className="text-[8px] font-mono text-g uppercase tracking-[1px]">
                    {t('STAWKI W TRASIE', 'ACTIVE RATES')}
                  </span>
                </div>

                <p className="text-[10.5px] text-[#c8e6d2]/50 leading-relaxed mb-4">
                  {t(
                    'Agenci AI działający w naszej sieci generują cykliczne przychody, z których aż do 50% jest kierowane na buyback i pule stakingowe.',
                    'AI agents operating in our network generate periodic revenues, with up to 50% routed directly to buybacks and staking pools.'
                  )}
                </p>

                <div className="flex flex-col gap-2">
                  {aiEconomyAgents.map((ag, idx) => (
                    <div 
                      key={idx}
                      className="flex justify-between items-center p-2.5 bg-white/[0.01] border border-white/5 hover:border-white/10 rounded font-mono text-xs"
                    >
                      <div>
                        <span className="text-white font-bold block">{ag.name}</span>
                        <span className="text-[9px] text-[#c8e6d2]/40 block mt-0.5">{t(ag.rolePl, ag.roleEn)}</span>
                      </div>
                      <span className="text-g font-bold bg-g/5 border border-g/15 px-2 py-1 rounded">
                        {ag.fee}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-white/5 text-[9.5px] text-white/40 leading-relaxed font-mono">
                {t(
                  'Przychód jest automatycznie księgowany w łańcuchu bloków w celu transparentnego podziału.',
                  'Revenue is automatically audited and ledgered on-chain for transparent distribution.'
                )}
              </div>

            </div>

          </motion.div>
        )}

        {/* TAB 4: DAO GOVERNANCE PORTAL */}
        {activeTab === 'governance' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
          >
            
            {/* DAO Intro and categories */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-mono tracking-[4px] text-g uppercase block mb-1">
                  {t('ZDECENTRALIZOWANA DEMOKRACJA', 'DECENTRALIZED DEMOCRACY')}
                </span>
                <h3 className="font-display text-xl text-white font-extrabold uppercase tracking-[1px] mb-4">
                  {t('STRUKTURA GŁOSOWANIA SOLAXY DAO', 'SOLAXY DAO VOTING STRUCTURE')}
                </h3>
                <p className="text-xs text-[#c8e6d2]/50 leading-relaxed mb-6">
                  {t(
                    'Inwestując w $SLX, stajesz się bezpośrednim współwłaścicielem protokołu. Twój głos ma realne przełożenie na decyzje systemowe. Każdy posiadacz tokenów może zgłaszać własne propozycje zmian (BIP).',
                    'By investing in $SLX, you become an active co-owner of the protocol. Your vote has weight on-chain. Every token holder can submit improvement proposals (BIPs).'
                  )}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {governanceTopics.map((tp, idx) => (
                  <div 
                    key={idx}
                    className="p-4 bg-white/[0.01] border border-white/5 hover:border-g/20 rounded relative"
                  >
                    <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-g/40" />
                    <h4 className="font-display text-xs font-bold text-white uppercase tracking-[0.5px] mb-1.5">
                      {t(tp.titlePl, tp.titleEn)}
                    </h4>
                    <p className="text-[10px] text-[#c8e6d2]/50 leading-relaxed">
                      {t(tp.descPl, tp.descEn)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated Live Governance Voting interface */}
            <div className="lg:col-span-5 border border-white/10 bg-[#050b18]/90 p-5 rounded-lg relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-2.5 text-[8px] font-mono text-g bg-g/5 border-l border-b border-g/15 uppercase tracking-[1px]">
                {t('INTERAKTYWNY PANEL', 'INTERACTIVE DECK')}
              </div>

              <div>
                <div className="text-[10px] font-mono tracking-[3px] text-g uppercase mb-2">
                  PROPOSAL #0412
                </div>
                <h4 className="font-display text-sm font-extrabold text-white uppercase tracking-[0.5px] leading-snug mb-3">
                  {t(
                    'Zwiększyć buyback & burn z opłat AI z 20% do 25% na najbliższy kwartał?',
                    'Increase AI fees buyback & burn rate from 20% to 25% for the upcoming quarter?'
                  )}
                </h4>

                <div className="space-y-4 my-6">
                  {/* Option 1 */}
                  <div>
                    <div className="flex justify-between text-[11px] font-mono mb-1">
                      <span className="text-g font-bold">{t('TAK (Zwiększyć)', 'YES (Increase)')}</span>
                      <span className="text-white/60">74.2% (12.4M $SLX)</span>
                    </div>
                    <div className="h-[4px] bg-white/10">
                      <div className="h-full bg-g shadow-[0_0_8px_#00ff88]" style={{ width: '74.2%' }} />
                    </div>
                  </div>

                  {/* Option 2 */}
                  <div>
                    <div className="flex justify-between text-[11px] font-mono mb-1">
                      <span className="text-purple font-bold">{t('NIE (Pozostawić)', 'NO (Keep current)')}</span>
                      <span className="text-white/60">25.8% (4.3M $SLX)</span>
                    </div>
                    <div className="h-[4px] bg-white/10">
                      <div className="h-full bg-purple shadow-[0_0_8px_#a855f7]" style={{ width: '25.8%' }} />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => alert(t('Oddano głos na TAK!', 'Voted YES successfully!'))}
                    className="flex-1 bg-g/10 border border-g/20 hover:bg-g/20 text-g font-mono text-[10px] font-bold py-2 uppercase tracking-[1px] select-none cursor-pointer text-center rounded transition-colors"
                  >
                    {t('Głosuj TAK', 'Vote YES')}
                  </button>
                  <button 
                    onClick={() => alert(t('Oddano głos na NIE!', 'Voted NO successfully!'))}
                    className="flex-1 bg-purple/10 border border-purple/20 hover:bg-purple/20 text-purple font-mono text-[10px] font-bold py-2 uppercase tracking-[1px] select-none cursor-pointer text-center rounded transition-colors"
                  >
                    {t('Głosuj NIE', 'Vote NO')}
                  </button>
                </div>
              </div>

              <div className="mt-5 border-t border-white/5 pt-3 flex justify-between items-center text-[9px] font-mono text-white/40">
                <span>{t('Koniec głosowania: Za 3 dni', 'Ends in: 3 days')}</span>
                <span>{t('Kwidura quorum: Spełnione', 'Quorum status: MET')}</span>
              </div>

            </div>

          </motion.div>
        )}

        {/* TAB 5: LONG-TERM STRATEGY & ROADMAP */}
        {activeTab === 'roadmap' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-center mb-10">
              <span className="text-[9px] font-mono tracking-[4px] text-g uppercase block mb-1">
                {t('HORYZONT WIELOLETNI', 'LONG TERM HORIZON')}
              </span>
              <h3 className="font-display text-xl text-white font-black uppercase tracking-[1px]">
                {t('FAZY STRATEGICZNEGO ROZWOJU SOLAXY', 'STRATEGIC ROZWOOD ROADMAP PHASES')}
              </h3>
              <p className="text-xs text-[#c8e6d2]/50 max-w-2xl mx-auto mt-2">
                {t(
                  'Przewidujemy stabilny, wieloletni program wzrostu. Budujemy kompletny ekosystem, w którym technologia stale napędza popyt na naszą kryptowalutę.',
                  'We anticipate a robust, multi-year compounding roadmap. We are building a complete suite where technology continuously feeds demand for the native asset.'
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {/* Decorative timeline connecting line on desktop */}
              <div className="hidden lg:block absolute top-[44px] left-8 right-8 h-[1px] bg-gradient-to-r from-g/10 via-g/40 to-cyan/10 z-0" />

              {roadmapPhases.map((rp, idx) => (
                <div 
                  key={idx}
                  className="bg-white/[0.01] border border-white/5 p-5 relative z-10 hover:border-g/20 transition-all duration-300 rounded"
                >
                  {/* Phase bubble */}
                  <div className="inline-block px-2.5 py-1 bg-g/5 border border-g/20 font-mono text-[9px] font-bold text-g tracking-[1px] uppercase mb-4 rounded-sm">
                    {rp.phase}
                  </div>

                  <h4 className="font-display text-xs font-black text-white uppercase tracking-[0.5px] mb-3">
                    {t(rp.titlePl, rp.titleEn)}
                  </h4>

                  <ul className="space-y-2 text-[10px] text-[#c8e6d2]/50 leading-relaxed font-mono">
                    {(language === 'pl' ? rp.pointsPl : rp.pointsEn).map((pt, pIdx) => (
                      <li key={pIdx} className="flex gap-2 items-start">
                        <span className="text-g mt-0.5">▪</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Security Sentinel Trigger Hub */}
        <div className="mt-16 reveal-trigger" id="sentinel-hub">
          <SecuritySentinel />
        </div>

      </motion.section>
    </div>
  );
}
