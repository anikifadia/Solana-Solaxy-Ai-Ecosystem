import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { Connection, PublicKey } from "@solana/web3.js";

dotenv.config();

// Initialize server-side Gemini API key dynamically in the route to avoid crashes on startup if the key is missing
async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add robust CORS middleware
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    } else {
      res.setHeader("Access-Control-Allow-Origin", "*");
    }
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  app.use(express.json());

  app.post("/api/gemini/generate-token", async (req, res) => {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Proszę podać poprawny prompt." });
    }

    const currentApiKey = process.env.GEMINI_API_KEY;
    if (!currentApiKey) {
      return res.status(500).json({ 
        error: "Brak skonfigurowanego klucza GEMINI_API_KEY. Skonfiguruj go w Settings > Secrets." 
      });
    }

    const ai = new GoogleGenAI({
      apiKey: currentApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const modelsToTry = ["gemini-3.5-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
    let lastError: any = null;
    let tokenData: any = null;

    for (const modelName of modelsToTry) {
      let attempts = 2;
      let delay = 1000;

      for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
          console.log(`[Gemini Forge] Model: ${modelName}, Attempt: ${attempt}/${attempts}`);
          const response = await ai.models.generateContent({
            model: modelName,
            contents: `Create a comprehensive Solana SPL token profile based on this user description: "${prompt}". Highlight its extreme potential (x1000 gem) in Polish, since the marketing language of Polish meme/crypto enthusiasts likes words like "gem", "pompa", "moon", "skarb", "krypto". Ensure the descriptions are catchy and fully localized.`,
            config: {
              systemInstruction: "You are an elite Solana tokenomics designer and Rust smart-contract engineer. You must generate structured token details and write full, functional Solana Anchor framework Rust code for a custom SPL token or meme token. Return the output strictly in JSON according to the schema provided.",
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  name: {
                    type: Type.STRING,
                    description: "The name of the token, e.g. 'Cyber Dog' or 'Giga Chad Solana'"
                  },
                  ticker: {
                    type: Type.STRING,
                    description: "The token ticker, e.g. '$CYDOG' or '$GCHAD'. Must start with $"
                  },
                  description: {
                    type: Type.STRING,
                    description: "Catchy Polish description of the token explaining why it has x1000 growth potential (gem, unikalność, pompa, deflationary aspect)."
                  },
                  supply: {
                    type: Type.NUMBER,
                    description: "Total token supply, e.g. 1000000000"
                  },
                  iconType: {
                    type: Type.STRING,
                    description: "One of these specific Lucide React icon names: Coins, Flame, Hammer, TrendingUp, Sparkles, Zap, ShieldCheck, Cat, Globe, Rocket, Trophy, Heart, Crown"
                  },
                  colorGradient: {
                    type: Type.STRING,
                    description: "Tailwind CSS gradient from-to class, e.g., 'from-cyan to-purple', 'from-g to-cyan', 'from-r to-orange-500', 'from-yellow-400 to-amber-600'"
                  },
                  anchorCode: {
                    type: Type.STRING,
                    description: "Fully readable, beautiful Solana Anchor framework Rust smart contract program code to instantiate, mint, and control this custom SPL token. Use code comments."
                  }
                },
                required: ["name", "ticker", "description", "supply", "iconType", "colorGradient", "anchorCode"]
              }
            }
          });

          const text = response.text;
          if (!text) {
            throw new Error("Pusty dokument zwrócony przez API");
          }

          tokenData = JSON.parse(text.trim());
          break; // Success! Break out of attempts loop

        } catch (error: any) {
          lastError = error;
          console.error(`Error on model ${modelName}, attempt ${attempt}:`, error?.message || error);
          
          if (modelName === modelsToTry[modelsToTry.length - 1] && attempt === attempts) {
            break; // If absolutely last attempt fails, exit
          }
          
          // Wait briefly before retrying
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 1.5; // Exponential backoff
        }
      }

      if (tokenData) {
        break; // Successfully got token data, exit models loop
      }
    }

    if (tokenData) {
      return res.json(tokenData);
    } else {
      console.error("All Gemini API models failed during token generation:", lastError);
      return res.status(500).json({ 
        error: "Nie udało się wygenerować tokenu przez AI. Usługa Gemini jest aktualnie przeciążona. Spróbuj ponownie za chwilę.",
        details: lastError?.message || lastError
      });
    }
  });

  // Persistent Local JSON Database for User-Created Tokens & Pools
  const TOKENS_FILE = path.join(process.cwd(), "user_tokens.json");

  function loadTokens() {
    try {
      if (fs.existsSync(TOKENS_FILE)) {
        return JSON.parse(fs.readFileSync(TOKENS_FILE, "utf8"));
      }
    } catch (e) {
      console.error("Error reading tokens file:", e);
    }

    // Seed initial list of high-quality tokens (including SLX protocol itself)
    const seedTokens = [
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
      fs.writeFileSync(TOKENS_FILE, JSON.stringify(seedTokens, null, 2), "utf8");
    } catch (e) {
      console.error("Error seeding tokens file:", e);
    }
    return seedTokens;
  }

  let tokens = loadTokens();

  function saveTokens() {
    try {
      fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2), "utf8");
    } catch (e) {
      console.error("Error saving tokens:", e);
    }
  }

  // Persistent Presale Store
  const CONTRIBUTIONS_FILE = path.join(process.cwd(), "user_contributions.json");
  const DEFAULT_RECEIVER = "7KBXwNo6Jv2kGKoWui7TaKQL8TKHG780BPQNK39UXIQN";
  
  function loadPresale() {
    try {
      if (fs.existsSync(CONTRIBUTIONS_FILE)) {
        return JSON.parse(fs.readFileSync(CONTRIBUTIONS_FILE, "utf8"));
      }
    } catch (e) {
      console.error("Error reading contributions file:", e);
    }
    
    // Default initial data
    return {
      solRaisedBase: 14960.50,
      targetSol: 20000,
      receiverAddress: process.env.SOL_PRESALE_RECEIVER || DEFAULT_RECEIVER,
      contributions: [
        { id: "1", address: "4a8v...K9p1", amountSol: 15.5, amountSlx: 103333, timestamp: Date.now() - 120000 },
        { id: "2", address: "D3xj...pL2o", amountSol: 8.0, amountSlx: 53333, timestamp: Date.now() - 300000 },
        { id: "3", address: "Solf...8zKq", amountSol: 25.0, amountSlx: 166666, timestamp: Date.now() - 720000 },
        { id: "4", address: "9a2f...1x8p", amountSol: 4.5, amountSlx: 30000, timestamp: Date.now() - 1080000 },
        { id: "5", address: "Phan...w4eR", amountSol: 42.0, amountSlx: 280000, timestamp: Date.now() - 1440000 }
      ]
    };
  }

  const presaleData = loadPresale();

  function savePresale() {
    try {
      fs.writeFileSync(CONTRIBUTIONS_FILE, JSON.stringify(presaleData, null, 2), "utf8");
    } catch (e) {
      console.error("Error saving contributions file:", e);
    }
  }

  function calculateTotalSolRaised() {
    const newVerifiedAmount = presaleData.contributions
      .filter((c: any) => !["1", "2", "3", "4", "5"].includes(c.id))
      .reduce((sum: number, c: any) => sum + (Number(c.amountSol) || 0), 0);
    return Number((presaleData.solRaisedBase + newVerifiedAmount).toFixed(2));
  }

  // Verify Solana Tx Signature on-chain
  async function verifySolanaTx(signature: string, expectedReceiver: string, expectedAmountSol?: number) {
    try {
      const rpcUrls = [
        "https://api.mainnet-beta.solana.com",
        "https://api.devnet.solana.com"
      ];
      
      let txInfo: any = null;
      for (const rpcUrl of rpcUrls) {
        try {
          const connection = new Connection(rpcUrl, "confirmed");
          txInfo = await connection.getParsedTransaction(signature, {
            maxSupportedTransactionVersion: 0
          });
          if (txInfo) break;
        } catch (e) {
          console.warn(`RPC ${rpcUrl} check failed:`, e);
        }
      }

      if (!txInfo) {
        return { verified: false, error: "Transakcja nie została jeszcze odnaleziona w sieci Solana (może potrwać kilka sekund)." };
      }

      if (txInfo.meta?.err) {
        return { verified: false, error: "Ta transakcja zakończyła się błędem na blockchainie." };
      }

      const accountKeys = txInfo.transaction.message.accountKeys;
      let amountTransferredLamports = 0;
      let foundReceiver = false;

      // Access instructions
      const instructions = txInfo.transaction.message.instructions;
      instructions.forEach((instruction: any) => {
        if (instruction.program === "system" && instruction.parsed?.type === "transfer") {
          const info = instruction.parsed.info;
          if (info.destination === expectedReceiver) {
            foundReceiver = true;
            amountTransferredLamports += info.lamports;
          }
        }
      });

      if (txInfo.meta?.innerInstructions) {
        txInfo.meta.innerInstructions.forEach((inner: any) => {
          inner.instructions.forEach((instruction: any) => {
            if (instruction.parsed?.type === "transfer" && instruction.parsed?.info?.destination === expectedReceiver) {
              foundReceiver = true;
              amountTransferredLamports += instruction.parsed.info.lamports;
            }
          });
        });
      }

      if (!foundReceiver) {
        return { verified: false, error: `Transakcja nie zawiera transferu środków na adres przedsprzedaży (${expectedReceiver}).` };
      }

      const solAmount = amountTransferredLamports / 1e9;
      
      if (expectedAmountSol && Math.abs(solAmount - expectedAmountSol) > 0.05) {
        return { verified: false, error: `Niezgodność kwoty: transakcja opiewa na ${solAmount} SOL, a oczekiwano ${expectedAmountSol} SOL.` };
      }

      // Check if accountKeys is an array of public keys or objects
      const sender = typeof accountKeys[0] === 'string' 
        ? accountKeys[0] 
        : (accountKeys[0].pubkey ? accountKeys[0].pubkey.toString() : accountKeys[0].toString());

      return {
        verified: true,
        solAmount,
        sender,
        timestamp: txInfo.blockTime ? txInfo.blockTime * 1000 : Date.now()
      };

    } catch (e: any) {
      console.error("Error in verifySolanaTx:", e);
      return { verified: false, error: "Wystąpił błąd podczas odpytywania sieci Solana RPC: " + e.message };
    }
  }

  // In-memory Database for Active Miners & History
  const activeMiners: Record<string, any> = {
    "CryptoJanusz": { username: "CryptoJanusz", hashRate: 245.8, balance: 421.5, lastSeen: Date.now(), isOnline: true, totalMined: 500 },
    "GemHunterPL": { username: "GemHunterPL", hashRate: 512.1, balance: 890.3, lastSeen: Date.now(), isOnline: true, totalMined: 1200 },
    "GigaKoparka_x1000": { username: "GigaKoparka_x1000", hashRate: 1024.0, balance: 3412.5, lastSeen: Date.now(), isOnline: true, totalMined: 4000 },
    "SolanaPompa": { username: "SolanaPompa", hashRate: 180.4, balance: 12.4, lastSeen: Date.now() - 3600000, isOnline: false, totalMined: 250 },
    "KryptoSkarb": { username: "KryptoSkarb", hashRate: 95.2, balance: 88.1, lastSeen: Date.now() - 7200000, isOnline: false, totalMined: 120 }
  };

  const miningHistory: any[] = [
    { id: "1", username: "GigaKoparka_x1000", action: "ZAPIS_PLONU", amount: 24.5, timestamp: new Date(Date.now() - 300000).toLocaleTimeString() },
    { id: "2", username: "CryptoJanusz", action: "ZAPIS_PLONU", amount: 3.12, timestamp: new Date(Date.now() - 600000).toLocaleTimeString() },
    { id: "3", username: "GemHunterPL", action: "ZAPIS_PLONU", amount: 15.8, timestamp: new Date(Date.now() - 1200000).toLocaleTimeString() },
    { id: "4", username: "SolanaPompa", action: "REJESTRACJA", amount: 0, timestamp: new Date(Date.now() - 3600000).toLocaleTimeString() },
    { id: "5", username: "KryptoSkarb", action: "ZAPIS_PLONU", amount: 4.5, timestamp: new Date(Date.now() - 7200000).toLocaleTimeString() }
  ];

  const withdrawalsHistory: any[] = [
    { id: "tx_01", username: "CryptoJanusz", amount: 150.0, timestamp: new Date(Date.now() - 400000).toLocaleTimeString(), wallet: "SolJan...x92A", status: "ZAKOŃCZONE" },
    { id: "tx_02", username: "GemHunterPL", amount: 450.0, timestamp: new Date(Date.now() - 1500000).toLocaleTimeString(), wallet: "SolGem...F38d", status: "ZAKOŃCZONE" },
    { id: "tx_03", username: "GigaKoparka_x1000", amount: 1500.0, timestamp: new Date(Date.now() - 3200000).toLocaleTimeString(), wallet: "SolGig...91Ka", status: "ZAKOŃCZONE" },
    { id: "tx_04", username: "SolanaPompa", amount: 75.5, timestamp: new Date(Date.now() - 5400000).toLocaleTimeString(), wallet: "SolPmp...u87s", status: "ZAKOŃCZONE" },
    { id: "tx_05", username: "KryptoSkarb", amount: 45.0, timestamp: new Date(Date.now() - 10000000).toLocaleTimeString(), wallet: "SolSkb...v292", status: "ZAKOŃCZONE" }
  ];

  // Periodic random simulator of other miners to make the system alive
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
        // Occassionally add to history
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
      // 10% chance a miner goes online
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

  // API Endpoints for mining database
  app.get("/api/mining/status", (req, res) => {
    const minersList = Object.values(activeMiners).map(m => {
      const isOnline = m.isOnline && (Date.now() - m.lastSeen < 60000 || ["CryptoJanusz", "GemHunterPL", "GigaKoparka_x1000"].includes(m.username));
      return { ...m, isOnline };
    });

    const solPrice = 182.74;
    // Calculate total mined value in Sol (active miner balances + initial seeds)
    const totalMinedSol = Object.values(activeMiners).reduce((sum, m: any) => sum + (Number(m.balance) || 0), 0);
    // Calculate total pool liquidity value in Sol (sum of remainingPool * priceSol)
    const totalPoolsValueSol = tokens.reduce((sum, t) => sum + (t.remainingPool * t.priceSol), 0);
    
    // Total TVL in USD (scaled with base to feel authentic and matching the landing page)
    const tvlUsd = 4700000000 + (tokens.length * 1500000) + (totalMinedSol * solPrice);
    
    // Volume 24h: base + real trades * multiplier
    const tradesCount = miningHistory.length;
    const volumeUsd = 280000000 + (tradesCount * 120000);
    
    // Trades / 24h: in millions, e.g. 1.2M base + real trades * 500
    const trades24h = 1.2 + (tradesCount * 0.001);

    res.json({
      miners: minersList,
      history: miningHistory,
      withdrawals: withdrawalsHistory,
      tokens: tokens,
      presale: {
        solRaised: calculateTotalSolRaised(),
        targetSol: presaleData.targetSol,
        receiverAddress: presaleData.receiverAddress,
        contributions: presaleData.contributions
      },
      stats: {
        tvlUsd,
        volumeUsd,
        trades24h,
        tokensCount: tokens.length,
        activeUsersCount: Object.keys(activeMiners).length
      }
    });
  });

  app.post("/api/presale/submit", async (req, res) => {
    const { signature, userAddress, amountSol, isDemo } = req.body;
    
    if (!signature || !userAddress) {
      return res.status(400).json({ error: "Signature and userAddress are required" });
    }

    // Check if transaction signature already exists
    if (presaleData.contributions.some((c: any) => c.signature === signature)) {
      return res.status(400).json({ error: "Ta transakcja została już zarejestrowana!" });
    }

    let verificationResult;
    if (signature.startsWith("demo_") || isDemo) {
      // Simulate/Demo purchase
      const demoAmount = Number(amountSol) || 2.5;
      verificationResult = {
        verified: true,
        solAmount: demoAmount,
        sender: userAddress,
        timestamp: Date.now()
      };
    } else {
      // Real Solana blockchain verification
      verificationResult = await verifySolanaTx(signature, presaleData.receiverAddress, Number(amountSol));
    }

    if (!verificationResult.verified) {
      return res.status(400).json({ error: verificationResult.error });
    }

    // Rate: 1 SOL = ~6666.67 $SLX
    const rate = 6666.67;
    const tokensReceived = Math.round(verificationResult.solAmount * rate);

    const newContribution = {
      id: "tx_" + signature.substring(0, 8),
      address: verificationResult.sender.substring(0, 6) + "..." + verificationResult.sender.substring(verificationResult.sender.length - 4),
      amountSol: verificationResult.solAmount,
      amountSlx: tokensReceived,
      timestamp: verificationResult.timestamp,
      signature: signature
    };

    // Insert at front of contributions
    presaleData.contributions.unshift(newContribution);
    
    // Maintain max 50 entries
    if (presaleData.contributions.length > 50) {
      presaleData.contributions.pop();
    }

    savePresale();

    // Log this purchase in miningHistory so it is visible in real-time
    miningHistory.unshift({
      id: Math.random().toString(36).substring(2, 11),
      username: newContribution.address,
      action: "ZAPIS_PLONU",
      amount: Number(verificationResult.solAmount),
      timestamp: new Date().toLocaleTimeString(),
      details: `Kupił ${tokensReceived.toLocaleString()} $SLX`
    });

    res.json({
      success: true,
      contribution: newContribution,
      totalSolRaised: calculateTotalSolRaised()
    });
  });

  app.post("/api/tokens/deploy", (req, res) => {
    const { name, ticker, description, supply, iconType, colorGradient, anchorCode } = req.body;
    if (!name || !ticker || !supply) {
      return res.status(400).json({ error: "Niepełne dane tokenu" });
    }

    const formattedTicker = ticker.startsWith('$') ? ticker : `$${ticker}`;

    // check if token with this ticker already exists
    if (tokens.some(t => t.ticker.toUpperCase() === formattedTicker.toUpperCase())) {
      return res.status(400).json({ error: "Token o tym tickerze już istnieje w pulach!" });
    }

    const supplyNum = Number(supply);
    const initialPool = Math.floor(supplyNum * 0.8);

    const newToken = {
      name,
      ticker: formattedTicker,
      description,
      supply: supplyNum,
      iconType: iconType || "Coins",
      colorGradient: colorGradient || "from-g to-cyan",
      anchorCode: anchorCode || "",
      initialPool, // 80% goes to liquidity pool
      remainingPool: initialPool,
      priceSol: 0.00001 + Math.random() * 0.0005, // random price in SOL
      createdAt: Date.now()
    };

    tokens.push(newToken);
    saveTokens();

    // Log the event in mining history so it is visible in real-time
    miningHistory.unshift({
      id: Math.random().toString(36).substring(2, 11),
      username: "SYSTEM_DEX",
      action: "EMISJA",
      amount: supplyNum,
      timestamp: new Date().toLocaleTimeString(),
      details: `Token ${newToken.name} (${newToken.ticker})`
    });

    res.json({ success: true, token: newToken });
  });

  app.post("/api/tokens/trade", (req, res) => {
    const { ticker, type, amountSol } = req.body;
    if (!ticker || !type || typeof amountSol !== "number" || amountSol <= 0) {
      return res.status(400).json({ error: "Niepoprawne parametry transakcji." });
    }

    const token = tokens.find(t => t.ticker.toUpperCase() === ticker.toUpperCase());
    if (!token) {
      return res.status(404).json({ error: "Token nie został znaleziony w pulach." });
    }

    const currentPriceSol = token.priceSol;
    const tokenAmount = amountSol / currentPriceSol;

    if (type === "BUY") {
      if (token.remainingPool < tokenAmount) {
        return res.status(400).json({ 
          error: `Niewystarczająca płynność w puli! Pozostało tylko ${token.remainingPool.toLocaleString()} ${token.ticker}.` 
        });
      }
      token.remainingPool = Math.floor(token.remainingPool - tokenAmount);
      // price increases on buy
      token.priceSol = token.priceSol * (1 + (tokenAmount / token.initialPool) * 1.5);
    } else {
      // SELL
      token.remainingPool = Math.floor(token.remainingPool + tokenAmount);
      // price decreases on sell
      token.priceSol = Math.max(0.000001, token.priceSol * (1 - (tokenAmount / token.initialPool) * 1.0));
    }

    saveTokens();

    // Log this trade in mining history
    miningHistory.unshift({
      id: Math.random().toString(36).substring(2, 11),
      username: "AMM_KUPACZ",
      action: type === "BUY" ? "KUPNO" : "SPRZEDAŻ",
      amount: Number(tokenAmount.toFixed(4)),
      timestamp: new Date().toLocaleTimeString(),
      details: `${token.ticker} za ${amountSol.toFixed(2)} SOL`
    });

    if (miningHistory.length > 50) {
      miningHistory.pop();
    }

    res.json({ 
      success: true, 
      remainingPool: token.remainingPool, 
      newPriceSol: token.priceSol,
      tokenAmount
    });
  });

  app.post("/api/mining/heartbeat", (req, res) => {
    const { username, hashRate, balance } = req.body;
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }
    
    const now = Date.now();
    if (!activeMiners[username]) {
      activeMiners[username] = {
        username,
        hashRate: hashRate || 0,
        balance: balance || 0,
        lastSeen: now,
        isOnline: true,
        totalMined: balance || 0
      };
      
      miningHistory.unshift({
        id: Math.random().toString(36).substring(2, 11),
        username,
        action: "REJESTRACJA",
        amount: 0,
        timestamp: new Date().toLocaleTimeString()
      });
    } else {
      activeMiners[username].hashRate = hashRate || 0;
      activeMiners[username].balance = balance || 0;
      activeMiners[username].lastSeen = now;
      activeMiners[username].isOnline = true;
    }
    
    res.json({ success: true });
  });

  app.post("/api/mining/save", (req, res) => {
    const { username, amount } = req.body;
    if (!username || typeof amount !== "number") {
      return res.status(400).json({ error: "Invalid username or amount" });
    }

    if (!activeMiners[username]) {
      activeMiners[username] = {
        username,
        hashRate: 0,
        balance: amount,
        lastSeen: Date.now(),
        isOnline: true,
        totalMined: amount
      };
    } else {
      activeMiners[username].balance = Number((activeMiners[username].balance + amount).toFixed(6));
      activeMiners[username].totalMined = Number((activeMiners[username].totalMined + amount).toFixed(6));
      activeMiners[username].lastSeen = Date.now();
    }

    miningHistory.unshift({
      id: Math.random().toString(36).substring(2, 11),
      username,
      action: "ZAPIS_PLONU",
      amount,
      timestamp: new Date().toLocaleTimeString()
    });

    if (miningHistory.length > 50) {
      miningHistory.pop();
    }

    res.json({ success: true, newBalance: activeMiners[username].balance });
  });

  app.post("/api/mining/withdraw", (req, res) => {
    const { username, amount, wallet } = req.body;
    if (!username || typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ error: "Niepoprawne dane wypłaty." });
    }

    if (!activeMiners[username]) {
      return res.status(404).json({ error: "Użytkownik nie istnieje w bazie kopaczy." });
    }

    if (activeMiners[username].balance < amount) {
      return res.status(400).json({ error: "Niewystarczające saldo kopacza do wypłaty." });
    }

    // Deduct from balance
    activeMiners[username].balance = Number((activeMiners[username].balance - amount).toFixed(6));
    activeMiners[username].lastSeen = Date.now();

    const txId = "tx_" + Math.random().toString(36).substring(2, 8).toUpperCase();
    const maskedWallet = wallet ? (wallet.substring(0, 6) + "..." + wallet.substring(wallet.length - 4)) : "SolUser...77XX";

    withdrawalsHistory.unshift({
      id: txId,
      username,
      amount,
      timestamp: new Date().toLocaleTimeString(),
      wallet: maskedWallet,
      status: "ZAKOŃCZONE"
    });

    miningHistory.unshift({
      id: Math.random().toString(36).substring(2, 11),
      username,
      action: "WYPŁATA",
      amount,
      timestamp: new Date().toLocaleTimeString()
    });

    if (withdrawalsHistory.length > 50) {
      withdrawalsHistory.pop();
    }

    res.json({ success: true, newBalance: activeMiners[username].balance, txId });
  });

  // Vite middleware for development or serving built assets
  const isProd = process.env.NODE_ENV === "production";
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
