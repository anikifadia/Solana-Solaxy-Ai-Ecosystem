const fs = require('fs');
let code = fs.readFileSync('src/components/PresalePage.tsx', 'utf-8');

const newUtils = `  const utilities = [
    {
      titlePl: 'Kredyty AI (AI Credits)',
      titleEn: 'AI Credits',
      descPl: 'Używaj $SLX jako paliwa do uruchamiania zapytań AI, generowania tokenów, analiz i generowania smart kontraktów.',
      descEn: 'Use $SLX as fuel to run AI queries, generate tokens, perform analytics, and generate smart contracts.',
      icon: Cpu,
      color: 'text-g',
    },
    {
      titlePl: 'Premium AI Access',
      titleEn: 'Premium AI Access',
      descPl: 'Odblokuj najbardziej zaawansowane modele językowe, nielimitowane raporty i priorytetowe wdrażanie.',
      descEn: 'Unlock the most advanced language models, unlimited reports, and priority deployment.',
      icon: Zap,
      color: 'text-cyan',
    },
    {
      titlePl: 'Staking & Yield',
      titleEn: 'Staking & Yield',
      descPl: 'Blokuj tokeny $SLX w pulach Staking Vault i zdobywaj pasywny dochód ze stakowania płynności.',
      descEn: 'Lock $SLX tokens in Staking Vault pools and earn passive income from liquidity staking.',
      icon: Coins,
      color: 'text-purple-400',
    },
    {
      titlePl: 'Governance (DAO)',
      titleEn: 'Governance (DAO)',
      descPl: 'Głosuj w kluczowych decyzjach rozwoju platformy, zmianach parametrów deflacji i nowych integracjach AI.',
      descEn: 'Vote on key platform development decisions, deflation parameter changes, and new AI integrations.',
      icon: Vote,
      color: 'text-g',
    },
    {
      titlePl: 'Marketplace Agentów AI',
      titleEn: 'AI Agent Marketplace',
      descPl: 'Kupuj, licencjonuj i wynajmuj dedykowane boty analityczne oraz agentów AI na otwartym rynku Solaxy.',
      descEn: 'Buy, license, and rent dedicated analytics bots and AI agents on the open Solaxy marketplace.',
      icon: Rocket,
      color: 'text-cyan',
    },
    {
      titlePl: 'Zniżki na Opłaty (Fee Discounts)',
      titleEn: 'Fee Discounts',
      descPl: 'Posiadanie $SLX gwarantuje stałe zniżki na opłaty transakcyjne, podatki DEX oraz koszty deploymentu.',
      descEn: 'Holding $SLX guarantees permanent discounts on transaction fees, DEX taxes, and deployment costs.',
      icon: Landmark,
      color: 'text-rose-400',
    }
  ];`;

code = code.replace(/const utilities = \[[\s\S]*?icon: Share2,\s*color: 'text-purple',\s*}\s*\];/, newUtils);
fs.writeFileSync('src/components/PresalePage.tsx', code);
