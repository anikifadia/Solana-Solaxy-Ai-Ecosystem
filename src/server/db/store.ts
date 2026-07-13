import fs from "fs";
import path from "path";
import { GeneratedToken, PresaleData, Miner, MiningActivity, Withdrawal } from "../types";

const TOKENS_FILE = path.join(process.cwd(), "user_tokens.json");
const CONTRIBUTIONS_FILE = path.join(process.cwd(), "user_contributions.json");
const DEFAULT_RECEIVER = "7KBXwNo6Jv2kGKoWui7TaKQL8TKHG780BPQNK39UXIQN";

// 1. User tokens database
export let tokens: GeneratedToken[] = [];

export function loadTokens(): GeneratedToken[] {
  try {
    if (fs.existsSync(TOKENS_FILE)) {
      tokens = JSON.parse(fs.readFileSync(TOKENS_FILE, "utf8"));
      return tokens;
    }
  } catch (e) {
    console.error("Error reading tokens file:", e);
  }

  // Seed default high-quality projects
  tokens = [
    {
      name: "Solax Protocol Token",
      ticker: "$SLX",
      description: "Główny token protokołu SOLAX służący do stakowania, redukcji opłat i nagród w innowacyjnej kopalni. Prawdziwa pompa na Solanie!",
      supply: 1000000000,
      iconType: "Coins",
      colorGradient: "from-g to-cyan",
      anchorCode: `// SOLAX Anchor Smart Contract v1.0
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

declare_id!("SolaxProtocolTokenMint1111111111111111111");

#[program]
pub mod solax_token {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Solax Protocol Token initialized!");
        Ok(())
    }
}`,
      initialPool: 250000000,
      remainingPool: 184512900,
      priceSol: 0.000263,
      createdAt: Date.now() - 86400000 * 5,
    },
    {
      name: "GigaKoparka Token",
      ticker: "$KOPARKA",
      description: "Oficjalny token społeczności górników SOLAX, napędzający prędkość kopania o x10. Prawdziwy polski skarb kryptograficzny!",
      supply: 100000000,
      iconType: "Hammer",
      colorGradient: "from-yellow-400 to-amber-600",
      anchorCode: `// GigaKoparka Rust Program
use anchor_lang::prelude::*;
declare_id!("KoparkaMiningToken111111111111111111111");`,
      initialPool: 50000000,
      remainingPool: 34120850,
      priceSol: 0.00124,
      createdAt: Date.now() - 86400000 * 3,
    },
    {
      name: "Polski Pieróg",
      ticker: "$PIEROG",
      description: "Moneta memowa lecąca rakietą na księżyc. Każda porcja przynosi 2% auto-dystrybucji dla głodnych stakerów.",
      supply: 500000000,
      iconType: "Rocket",
      colorGradient: "from-r to-orange-500",
      anchorCode: `// PierogMeme Coin Anchor Code`,
      initialPool: 400000000,
      remainingPool: 398124000,
      priceSol: 0.000045,
      createdAt: Date.now() - 86400000 * 1,
    }
  ];

  try {
    fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2), "utf8");
  } catch (e) {
    console.error("Error seeding tokens file:", e);
  }
  return tokens;
}

export function saveTokens() {
  try {
    fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2), "utf8");
  } catch (e) {
    console.error("Error saving tokens:", e);
  }
}

// 2. Presale database
export let presaleData: PresaleData = {
  solRaisedBase: 0.00,
  targetSol: 20000,
  receiverAddress: DEFAULT_RECEIVER,
  contributions: []
};

export function loadPresale(): PresaleData {
  try {
    if (fs.existsSync(CONTRIBUTIONS_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(CONTRIBUTIONS_FILE, "utf8"));
      if (parsed.solRaisedBase === 14960.50) {
        console.log("Resetting legacy presale contributions data.");
      } else {
        presaleData = parsed;
        presaleData.receiverAddress = process.env.SOL_PRESALE_RECEIVER || DEFAULT_RECEIVER;
        return presaleData;
      }
    }
  } catch (e) {
    console.error("Error reading contributions file:", e);
  }

  presaleData = {
    solRaisedBase: 0.00,
    targetSol: 20000,
    receiverAddress: process.env.SOL_PRESALE_RECEIVER || DEFAULT_RECEIVER,
    contributions: []
  };
  savePresale();
  return presaleData;
}

export function savePresale() {
  try {
    fs.writeFileSync(CONTRIBUTIONS_FILE, JSON.stringify(presaleData, null, 2), "utf8");
  } catch (e) {
    console.error("Error saving contributions file:", e);
  }
}

export function calculateTotalSolRaised(): number {
  const newVerifiedAmount = presaleData.contributions
    .filter((c: any) => !["1", "2", "3", "4", "5"].includes(c.id))
    .reduce((sum: number, c: any) => sum + (Number(c.amountSol) || 0), 0);
  return Number((presaleData.solRaisedBase + newVerifiedAmount).toFixed(2));
}

// 3. In-memory databases for active miners
export const activeMiners: Record<string, Miner> = {
  "CryptoJanusz": { username: "CryptoJanusz", hashRate: 245.8, balance: 421.5, lastSeen: Date.now(), isOnline: true, totalMined: 500 },
  "GemHunterPL": { username: "GemHunterPL", hashRate: 512.1, balance: 890.3, lastSeen: Date.now(), isOnline: true, totalMined: 1200 },
  "GigaKoparka_x1000": { username: "GigaKoparka_x1000", hashRate: 1024.0, balance: 3412.5, lastSeen: Date.now(), isOnline: true, totalMined: 4000 },
  "SolanaPompa": { username: "SolanaPompa", hashRate: 180.4, balance: 12.4, lastSeen: Date.now() - 3600000, isOnline: false, totalMined: 250 },
  "KryptoSkarb": { username: "KryptoSkarb", hashRate: 95.2, balance: 88.1, lastSeen: Date.now() - 7200000, isOnline: false, totalMined: 120 }
};

export const miningHistory: MiningActivity[] = [
  { id: "1", username: "GigaKoparka_x1000", action: "ZAPIS_PLONU", amount: 24.5, timestamp: new Date(Date.now() - 300000).toLocaleTimeString() },
  { id: "2", username: "CryptoJanusz", action: "ZAPIS_PLONU", amount: 3.12, timestamp: new Date(Date.now() - 600000).toLocaleTimeString() },
  { id: "3", username: "GemHunterPL", action: "ZAPIS_PLONU", amount: 15.8, timestamp: new Date(Date.now() - 1200000).toLocaleTimeString() },
  { id: "4", username: "SolanaPompa", action: "REJESTRACJA", amount: 0, timestamp: new Date(Date.now() - 3600000).toLocaleTimeString() },
  { id: "5", username: "KryptoSkarb", action: "ZAPIS_PLONU", amount: 4.5, timestamp: new Date(Date.now() - 7200000).toLocaleTimeString() }
];

export const withdrawalsHistory: Withdrawal[] = [
  { id: "tx_01", username: "CryptoJanusz", amount: 150.0, timestamp: new Date(Date.now() - 400000).toLocaleTimeString(), wallet: "SolJan...x92A", status: "ZAKOŃCZONE" },
  { id: "tx_02", username: "GemHunterPL", amount: 450.0, timestamp: new Date(Date.now() - 1500000).toLocaleTimeString(), wallet: "SolGem...F38d", status: "ZAKOŃCZONE" },
  { id: "tx_03", username: "GigaKoparka_x1000", amount: 1500.0, timestamp: new Date(Date.now() - 3200000).toLocaleTimeString(), wallet: "SolGig...91Ka", status: "ZAKOŃCZONE" },
  { id: "tx_04", username: "SolanaPompa", amount: 75.5, timestamp: new Date(Date.now() - 5400000).toLocaleTimeString(), wallet: "SolPmp...u87s", status: "ZAKOŃCZONE" },
  { id: "tx_05", username: "KryptoSkarb", amount: 45.0, timestamp: new Date(Date.now() - 10000000).toLocaleTimeString(), wallet: "SolSkb...v292", status: "ZAKOŃCZONE" }
];

// Start background dynamic miner simulator
export function startSimulationLoop() {
  setInterval(() => {
    const minersKeys = Object.keys(activeMiners);
    const randomMinerKey = minersKeys[Math.floor(Math.random() * minersKeys.length)];
    const miner = activeMiners[randomMinerKey];
    
    if (miner.isOnline) {
      miner.hashRate = Number((miner.hashRate * (1 + (Math.random() - 0.5) * 0.05)).toFixed(1));
      const minedAmount = Number((Math.random() * 0.8 + 0.1).toFixed(4));
      miner.balance = Number((miner.balance + minedAmount).toFixed(4));
      miner.totalMined = Number((miner.totalMined + minedAmount).toFixed(4));
      miner.lastSeen = Date.now();

      // Occassionally perform a withdrawal (WYPŁATA)
      if (Math.random() < 0.15 && miner.balance > 15) {
        const withdrawAmount = Number((miner.balance * 0.2).toFixed(4));
        miner.balance = Number((miner.balance - withdrawAmount).toFixed(4));
        
        withdrawalsHistory.unshift({
          id: "tx_" + Math.random().toString(36).substring(2, 8).toUpperCase(),
          username: miner.username,
          amount: withdrawAmount,
          timestamp: new Date().toLocaleTimeString(),
          wallet: `Sol${miner.username.substring(0, 3)}...${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
          status: "ZAKOŃCZONE"
        });

        miningHistory.unshift({
          id: Math.random().toString(36).substring(2, 11),
          username: miner.username,
          action: "WYPŁATA",
          amount: withdrawAmount,
          timestamp: new Date().toLocaleTimeString()
        });

        if (withdrawalsHistory.length > 20) {
          withdrawalsHistory.pop();
        }
      } else if (Math.random() < 0.25) {
        // Occassionally add harvest to activity
        miningHistory.unshift({
          id: Math.random().toString(36).substring(2, 11),
          username: miner.username,
          action: "ZAPIS_PLONU",
          amount: minedAmount,
          timestamp: new Date().toLocaleTimeString()
        });
        if (miningHistory.length > 50) {
          miningHistory.pop();
        }
      }
    } else {
      // Miner reconnect chance
      if (Math.random() < 0.1) {
        miner.isOnline = true;
        miner.lastSeen = Date.now();
        miningHistory.unshift({
          id: Math.random().toString(36).substring(2, 11),
          username: miner.username,
          action: "REJESTRACJA",
          amount: 0,
          timestamp: new Date().toLocaleTimeString()
        });
      }
    }
  }, 5000);
}
