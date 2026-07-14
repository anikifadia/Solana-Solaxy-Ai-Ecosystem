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
      description: "The main SOLAX protocol token used for staking, fee reduction, and rewards in the innovative forge. A true gem on Solana!",
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
      description: "Official token of the SOLAX miner community, boosting mining speed by x10. A true cryptographic treasure!",
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
      name: "Space Cheetah",
      ticker: "$PIEROG",
      description: "Meme coin rocketing to the moon. Each transaction brings 2% auto-distribution to hungry stakers.",
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
export const activeMiners: Record<string, Miner> = {};

export const miningHistory: MiningActivity[] = [];

export const withdrawalsHistory: Withdrawal[] = [];

// Start background dynamic miner simulator - turned off to prevent fake simulated records
export function startSimulationLoop() {
  console.log("[Simulation] Fictional mining simulation is disabled. All mining and histories are authentic.");
}
